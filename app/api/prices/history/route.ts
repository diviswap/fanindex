import { NextRequest, NextResponse } from "next/server"
import { FAN_TOKENS } from "@/lib/data/fan-tokens"

// CoinGecko market chart endpoint for historical data
const COINGECKO_API = "https://api.coingecko.com/api/v3"

interface MarketChartResponse {
  prices: [number, number][] // [timestamp, priceUSD]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

// Cache for historical data (5 minutes)
const historyCache = new Map<string, { data: MarketChartResponse; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Fetch a token's USD price history from CoinGecko.
 *
 * IMPORTANT — we intentionally do NOT pass the `interval` query param:
 *   - `interval=hourly` and `interval=daily` are Enterprise-only on the
 *     current CoinGecko API. Passing them on the free tier returns 401/
 *     "coin not found" style errors, which used to silently send every
 *     chart through the synthetic fallback generator (random noise).
 *   - When omitted, CoinGecko auto-selects granularity based on `days`:
 *       • days = 1        → ~5-minute candles
 *       • 2  ≤ days ≤ 90  → hourly candles
 *       • days > 90       → daily candles
 */
async function fetchTokenHistory(cgId: string, days: number): Promise<MarketChartResponse | null> {
  const cacheKey = `${cgId}-${days}`
  const cached = historyCache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/${cgId}/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 300 },
      },
    )

    if (!response.ok) {
      console.log(`[v0] CoinGecko error for ${cgId} (days=${days}): ${response.status}`)
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

/**
 * CHZ price history in USD, keyed by the same rounded timestamp we use
 * for fan-token prices, so we can convert token USD → CHZ per bucket.
 */
async function getChzHistory(days: number, bucketMs: number): Promise<Map<number, number>> {
  const chzData = await fetchTokenHistory("chiliz", days)
  const priceMap = new Map<number, number>()

  if (chzData?.prices) {
    for (const [timestamp, price] of chzData.prices) {
      const rounded = Math.round(timestamp / bucketMs) * bucketMs
      priceMap.set(rounded, price)
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

  const tokenSymbols = tokensParam.split(",").map((t) => t.trim().toUpperCase())

  // Optional explicit weights (percentages, parallel to tokenSymbols).
  // Fall back to equal weighting when absent / malformed.
  let weights: number[] | null = null
  if (weightsParam) {
    const parsed = weightsParam
      .split(",")
      .map((w) => parseFloat(w.trim()))
      .filter((n) => Number.isFinite(n) && n >= 0)
    if (parsed.length === tokenSymbols.length) {
      const total = parsed.reduce((s, w) => s + w, 0)
      weights = total > 0 ? parsed.map((w) => w / total) : null
    }
  }

  const days = Math.min(Math.max(parseInt(daysParam || "30"), 1), 365)

  // For the 24h view we still ask CoinGecko for 2 days so the dataset
  // reliably covers a full 24-hour window regardless of when the caller
  // hits the endpoint.
  const fetchDays = days === 1 ? 2 : days

  // Bucket size for time alignment. CoinGecko returns hourly data for
  // 2–90 days and daily data beyond that; rounding to the matching bucket
  // means every constituent token ends up on the same grid.
  const bucketMs = fetchDays <= 90 ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000

  // Resolve requested symbols → tokens with a CoinGecko id.
  const resolvedTokens = tokenSymbols
    .map((symbol) => ({
      symbol,
      token: FAN_TOKENS.find((t) => t.symbol.toUpperCase() === symbol),
    }))
    .filter((r) => r.token?.cgId)

  if (resolvedTokens.length === 0) {
    return NextResponse.json(
      { error: "No valid tokens found with CoinGecko IDs", tokens: tokenSymbols, data: [] },
      { status: 200 },
    )
  }

  try {
    const chzHistory = await getChzHistory(fetchDays, bucketMs)

    const tokenHistories = await Promise.all(
      resolvedTokens.map(async ({ symbol, token }) => ({
        symbol,
        data: await fetchTokenHistory(token!.cgId!, fetchDays),
        staticPrice: parseFloat(token!.price),
      })),
    )

    // If every request failed, serve a reasonable fallback so the chart
    // doesn't look completely broken.
    const hasRealData = tokenHistories.some(
      (t) => t.data?.prices && t.data.prices.length > 0,
    )
    if (!hasRealData) {
      const fallbackData = generateFallbackData(tokenHistories, days)
      return NextResponse.json({
        tokens: tokenSymbols,
        days,
        data: fallbackData,
        source: "fallback",
      })
    }

    // ── Build an aligned price grid: bucket → { symbol → priceCHZ } ──
    // We pre-collect every bucket timestamp across every token first so
    // the final series is continuous even when an individual token has
    // missing samples.
    const bucketSet = new Set<number>()
    const perTokenBuckets = new Map<string, Map<number, number>>()

    for (const { symbol, data } of tokenHistories) {
      if (!data?.prices || data.prices.length === 0) continue
      const byBucket = new Map<number, number>()
      for (const [timestamp, usdPrice] of data.prices) {
        const bucket = Math.round(timestamp / bucketMs) * bucketMs
        const chzPrice = chzHistory.get(bucket) ?? 0.07
        const chzTokenPrice = chzPrice > 0 ? usdPrice / chzPrice : 0
        // For buckets with multiple samples (5-min → hour), prefer the
        // latest sample (overwriting); this yields "last-of-bucket".
        byBucket.set(bucket, chzTokenPrice)
        bucketSet.add(bucket)
      }
      perTokenBuckets.set(symbol, byBucket)
    }

    // Build the weight map, keyed by uppercase symbol.
    const weightBySymbol = new Map<string, number>()
    if (weights) {
      tokenSymbols.forEach((sym, i) => weightBySymbol.set(sym, weights![i]))
    } else {
      const equal = 1 / tokenSymbols.length
      tokenSymbols.forEach((sym) => weightBySymbol.set(sym, equal))
    }

    // Total weight of the tokens we actually received data for. We use
    // this as the denominator when computing the index price so the
    // result is still a properly weighted average of the available data
    // but the relative weights never get distorted by missing tokens.
    const availableSymbols = Array.from(perTokenBuckets.keys())
    const totalAvailableWeight = availableSymbols.reduce(
      (sum, sym) => sum + (weightBySymbol.get(sym) ?? 0),
      0,
    )

    // Sort buckets chronologically and forward-fill each token's price
    // so missing samples don't cause discontinuities.
    const orderedBuckets = Array.from(bucketSet).sort((a, b) => a - b)
    const lastKnownPrice = new Map<string, number>()

    const chartData = orderedBuckets
      .map((bucket) => {
        let weightedSum = 0
        let effectiveWeight = 0

        for (const sym of availableSymbols) {
          const byBucket = perTokenBuckets.get(sym)!
          const fresh = byBucket.get(bucket)
          if (fresh !== undefined) lastKnownPrice.set(sym, fresh)
          const price = lastKnownPrice.get(sym)
          if (price === undefined) continue // no sample yet — skip
          const w = weightBySymbol.get(sym) ?? 0
          weightedSum += price * w
          effectiveWeight += w
        }

        // Require at least ~70% of the available weight to emit a point.
        // This discards leading buckets where only a minority of tokens
        // have reported and which would otherwise look like huge spikes.
        if (effectiveWeight < totalAvailableWeight * 0.7) return null

        const indexPrice = effectiveWeight > 0 ? weightedSum / effectiveWeight : 0
        return {
          timestamp: bucket,
          date: formatDate(bucket, days),
          price: Number(indexPrice.toFixed(6)),
          volume: 0,
        }
      })
      .filter((p): p is NonNullable<typeof p> => p !== null)

    // For the 24h view, trim the forward-filled 2-day dataset to exactly
    // the last 24 hours.
    if (days === 1 && chartData.length > 0) {
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
      const recent = chartData.filter((d) => d.timestamp >= oneDayAgo)
      if (recent.length > 0) {
        return NextResponse.json({
          tokens: tokenSymbols,
          days,
          data: recent,
          source: "coingecko",
        })
      }
    }

    return NextResponse.json({
      tokens: tokenSymbols,
      days,
      data: chartData,
      source: "coingecko",
    })
  } catch (error) {
    console.log("[v0] Error processing history:", error)
    const fallbackData = generateFallbackFromTokens(
      resolvedTokens.map((r) => r.token),
      days,
    )
    return NextResponse.json(
      { tokens: tokenSymbols, days, data: fallbackData, source: "fallback" },
      { status: 200 },
    )
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

// ── Fallbacks (only used if every CoinGecko request fails) ─────────────
function generateFallbackData(
  tokenHistories: { symbol: string; data: MarketChartResponse | null; staticPrice: number }[],
  days: number,
) {
  const avgPrice =
    tokenHistories.reduce((sum, t) => sum + (t.staticPrice || 0), 0) / tokenHistories.length
  return generateHistoricalPoints(avgPrice, days)
}

function generateFallbackFromTokens(tokens: (typeof FAN_TOKENS[0] | undefined)[], days: number) {
  const valid = tokens.filter((t) => t)
  const avgPrice = valid.reduce((sum, t) => sum + parseFloat(t!.price), 0) / valid.length
  return generateHistoricalPoints(avgPrice, days)
}

function generateHistoricalPoints(basePrice: number, days: number) {
  const points: { timestamp: number; date: string; price: number; volume: number }[] = []
  const now = Date.now()
  const interval = days <= 1 ? 3600000 : 86400000
  const numPoints = days <= 1 ? 24 : days

  let seed = basePrice * 1000
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  const trendDirection = (seededRandom() - 0.5) * 0.3
  for (let i = numPoints; i >= 0; i--) {
    const timestamp = now - i * interval
    const progress = 1 - i / numPoints
    const trend = trendDirection * progress
    const noise = (seededRandom() - 0.5) * 0.08
    const multiplier = 1 + trend + noise
    const price = basePrice * multiplier
    points.push({
      timestamp,
      date: formatDate(timestamp, days),
      price: Number(price.toFixed(6)),
      volume: 0,
    })
  }
  return points
}
