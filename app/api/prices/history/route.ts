import { NextRequest, NextResponse } from "next/server"
import { FAN_TOKENS } from "@/lib/data/fan-tokens"

// CoinGecko market chart endpoint for historical data
const COINGECKO_API = "https://api.coingecko.com/api/v3"

interface MarketChartResponse {
  prices: [number, number][] // [timestamp, price]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

// Cache for historical data (5 minutes)
const historyCache = new Map<string, { data: MarketChartResponse; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function fetchTokenHistory(cgId: string, days: number): Promise<MarketChartResponse | null> {
  const cacheKey = `${cgId}-${days}`
  const cached = historyCache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/${cgId}/market_chart?vs_currency=usd&days=${days}&interval=${days <= 1 ? 'hourly' : 'daily'}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    )

    if (!response.ok) {
      console.log(`[v0] CoinGecko API error for ${cgId}: ${response.status}`)
      return null
    }

    const data: MarketChartResponse = await response.json()
    historyCache.set(cacheKey, { data, timestamp: Date.now() })
    return data
  } catch (error) {
    console.log(`[v0] Error fetching history for ${cgId}:`, error)
    return null
  }
}

// Get CHZ price history in USD for conversion
async function getChzHistory(days: number): Promise<Map<number, number>> {
  const chzData = await fetchTokenHistory("chiliz", days)
  const priceMap = new Map<number, number>()
  
  if (chzData?.prices) {
    for (const [timestamp, price] of chzData.prices) {
      // Round timestamp to nearest hour/day for matching
      const roundedTs = days <= 1 
        ? Math.round(timestamp / 3600000) * 3600000 // Round to hour
        : Math.round(timestamp / 86400000) * 86400000 // Round to day
      priceMap.set(roundedTs, price)
    }
  }
  
  return priceMap
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tokensParam = searchParams.get("tokens")
  const daysParam = searchParams.get("days")
  const weightsParam = searchParams.get("weights")

  if (!tokensParam) {
    return NextResponse.json({ error: "Missing tokens parameter" }, { status: 400 })
  }

  const tokenSymbols = tokensParam.split(",").map(t => t.trim().toUpperCase())

  // Optional explicit weights (percentages, parallel to tokenSymbols).
  // If absent or malformed, fall back to equal weighting.
  let weights: number[] | null = null
  if (weightsParam) {
    const parsed = weightsParam
      .split(",")
      .map(w => parseFloat(w.trim()))
      .filter(n => Number.isFinite(n) && n >= 0)
    if (parsed.length === tokenSymbols.length) {
      const total = parsed.reduce((s, w) => s + w, 0)
      // Normalise to 0..1 (supports inputs as % or as fractions)
      weights = total > 0 ? parsed.map(w => w / total) : null
    }
  }

  let days = Math.min(Math.max(parseInt(daysParam || "30"), 1), 365)
  
  // For 24h chart, fetch 2 days of data to ensure we have points from both ayer and hoy
  const fetchDays = days === 1 ? 2 : days

  // Get CoinGecko IDs for the requested tokens
  const tokensWithCgId = tokenSymbols
    .map(symbol => FAN_TOKENS.find(t => t.symbol.toUpperCase() === symbol))
    .filter(t => t?.cgId)

  if (tokensWithCgId.length === 0) {
    return NextResponse.json({ 
      error: "No valid tokens found with CoinGecko IDs",
      tokens: tokenSymbols,
      data: []
    }, { status: 200 })
  }

  try {
    // Fetch CHZ price history for conversion
    const chzHistory = await getChzHistory(days)
    
  // Fetch history for all tokens in parallel
  const tokenHistories = await Promise.all(
    tokensWithCgId.map(async (token) => {
      const data = await fetchTokenHistory(token!.cgId!, fetchDays)
      return { symbol: token!.symbol, data, staticPrice: parseFloat(token!.price) }
    })
  )

  // Check if we got any real data
  const hasRealData = tokenHistories.some(t => t.data?.prices && t.data.prices.length > 0)

    // If no real data, generate fallback based on static prices
    if (!hasRealData) {
      const fallbackData = generateFallbackData(tokenHistories, days)
      return NextResponse.json({
        tokens: tokenSymbols,
        days,
        data: fallbackData,
        source: "fallback"
      })
    }

    // Build combined price data per timestamp, tracking which symbol each
    // price came from so we can apply explicit weights when provided.
    const priceDataMap = new Map<
      number,
      { bySymbol: Map<string, number>; chzPrice: number }
    >()

    for (const { symbol, data } of tokenHistories) {
      if (!data?.prices) continue

      for (const [timestamp, usdPrice] of data.prices) {
        // Round timestamp for matching
        const roundedTs = days <= 1
          ? Math.round(timestamp / 3600000) * 3600000
          : Math.round(timestamp / 86400000) * 86400000

        const chzPrice = chzHistory.get(roundedTs) || 0.07 // Default CHZ price if not found

        if (!priceDataMap.has(roundedTs)) {
          priceDataMap.set(roundedTs, { bySymbol: new Map(), chzPrice })
        }

        const entry = priceDataMap.get(roundedTs)!
        // Convert USD price to CHZ
        const chzTokenPrice = chzPrice > 0 ? usdPrice / chzPrice : 0
        entry.bySymbol.set(symbol, chzTokenPrice)
      }
    }

    // Build a symbol → weight lookup (normalised to 0..1). If no explicit
    // weights were provided, use equal weighting across all input symbols.
    const weightBySymbol = new Map<string, number>()
    if (weights) {
      tokenSymbols.forEach((sym, i) => weightBySymbol.set(sym, weights![i]))
    } else {
      const equal = 1 / tokenSymbols.length
      tokenSymbols.forEach(sym => weightBySymbol.set(sym, equal))
    }

    // Calculate weighted index price for each timestamp. If a constituent
    // is missing for a given timestamp, its weight is redistributed across
    // the tokens that DO have data, so the series never has gaps.
    const chartData = Array.from(priceDataMap.entries())
      .filter(([_, d]) => d.bySymbol.size > 0)
      .map(([timestamp, d]) => {
        let weightedSum = 0
        let usedWeight = 0
        for (const [sym, price] of d.bySymbol) {
          const w = weightBySymbol.get(sym) ?? 0
          weightedSum += price * w
          usedWeight += w
        }
        const indexPrice = usedWeight > 0 ? weightedSum / usedWeight : 0
        return {
          timestamp,
          date: formatDate(timestamp, days),
          price: Number(indexPrice.toFixed(6)),
          volume: 0, // Volume data not aggregated
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp)

    // For 24h data, filter to last 24 hours from the 2 days of data fetched
    if (days === 1 && chartData.length > 0) {
      const now = Date.now()
      const oneDayAgo = now - 24 * 60 * 60 * 1000
      const recentData = chartData.filter(d => d.timestamp >= oneDayAgo)
      
      // Return only last 24h of data
      if (recentData.length > 0) {
        return NextResponse.json({
          tokens: tokenSymbols,
          days,
          data: recentData,
          source: "coingecko"
        })
      }
    }

    return NextResponse.json({
      tokens: tokenSymbols,
      days,
      data: chartData,
      source: "coingecko"
    })
  } catch (error) {
    console.log("[v0] Error processing history:", error)
    // Return fallback data on error
    const fallbackData = generateFallbackFromTokens(tokensWithCgId, days)
    return NextResponse.json({ 
      tokens: tokenSymbols,
      days,
      data: fallbackData,
      source: "fallback"
    }, { status: 200 })
  }
}

function formatDate(timestamp: number, days: number): string {
  const date = new Date(timestamp)
  if (days <= 1) {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  } else if (days <= 7) {
    return date.toLocaleDateString("en-US", { weekday: "short", hour: "2-digit" })
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }
}

// Generate fallback data based on token histories with static prices
function generateFallbackData(
  tokenHistories: { symbol: string; data: MarketChartResponse | null; staticPrice: number }[],
  days: number
) {
  // Calculate average price from static token data
  const avgPrice = tokenHistories.reduce((sum, t) => sum + (t.staticPrice || 0), 0) / tokenHistories.length
  return generateHistoricalPoints(avgPrice, days)
}

// Generate fallback from tokens directly
function generateFallbackFromTokens(
  tokens: (typeof FAN_TOKENS[0] | undefined)[],
  days: number
) {
  const validTokens = tokens.filter(t => t)
  const avgPrice = validTokens.reduce((sum, t) => sum + parseFloat(t!.price), 0) / validTokens.length
  return generateHistoricalPoints(avgPrice, days)
}

// Generate realistic historical price points with some variance
function generateHistoricalPoints(basePrice: number, days: number) {
  const points: { timestamp: number; date: string; price: number; volume: number }[] = []
  const now = Date.now()
  const interval = days <= 1 ? 3600000 : 86400000 // hourly or daily
  const numPoints = days <= 1 ? 24 : days
  
  // Use a seed based on the base price for consistent but different looking charts
  let seed = basePrice * 1000
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  
  // Generate a trend direction
  const trendDirection = (seededRandom() - 0.5) * 0.3 // -15% to +15% overall trend
  
  for (let i = numPoints; i >= 0; i--) {
    const timestamp = now - i * interval
    
    // Calculate price with trend and some random variance
    const progress = 1 - (i / numPoints)
    const trend = trendDirection * progress
    const noise = (seededRandom() - 0.5) * 0.08 // +/- 4% noise
    const multiplier = 1 + trend + noise
    
    const price = basePrice * multiplier
    
    points.push({
      timestamp,
      date: formatDate(timestamp, days),
      price: Number(price.toFixed(6)),
      volume: 0
    })
  }
  
  return points
}
