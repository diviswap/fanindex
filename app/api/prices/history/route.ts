import { NextRequest, NextResponse } from "next/server"
import { FAN_TOKENS } from "@/lib/data/fan-tokens"

const COINGECKO_API = "https://api.coingecko.com/api/v3"

interface MarketChartResponse {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

// 5-minute in-process cache
const historyCache = new Map<string, { data: MarketChartResponse; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000

async function fetchTokenHistory(cgId: string, fetchDays: number): Promise<MarketChartResponse | null> {
  const cacheKey = `${cgId}-${fetchDays}`
  const cached = historyCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) return cached.data

  try {
    const interval = fetchDays <= 2 ? "hourly" : "daily"
    const res = await fetch(
      `${COINGECKO_API}/coins/${cgId}/market_chart?vs_currency=usd&days=${fetchDays}&interval=${interval}`,
      { headers: { Accept: "application/json" }, next: { revalidate: 300 } }
    )
    if (!res.ok) return null
    const data: MarketChartResponse = await res.json()
    historyCache.set(cacheKey, { data, timestamp: Date.now() })
    return data
  } catch {
    return null
  }
}

async function getChzHistory(fetchDays: number): Promise<Map<number, number>> {
  const chzData = await fetchTokenHistory("chiliz", fetchDays)
  const map = new Map<number, number>()
  if (!chzData?.prices) return map
  const bucket = fetchDays <= 2 ? 3_600_000 : 86_400_000
  for (const [ts, price] of chzData.prices) {
    map.set(Math.round(ts / bucket) * bucket, price)
  }
  return map
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const tokensParam = searchParams.get("tokens")
  const daysParam = searchParams.get("days")
  // weights=16.42,12.73,… in the same order as tokens. Omit for equal-weight.
  const weightsParam = searchParams.get("weights")

  if (!tokensParam) {
    return NextResponse.json({ error: "Missing tokens parameter" }, { status: 400 })
  }

  const tokenSymbols = tokensParam.split(",").map((t) => t.trim().toUpperCase())
  const days = Math.min(Math.max(parseInt(daysParam || "30"), 1), 365)
  const fetchDays = days === 1 ? 2 : days
  const bucket = days <= 1 ? 3_600_000 : 86_400_000

  // Parse optional weights (percentages, e.g. 16.42 → decimal 0.1642)
  let weights: number[] | null = null
  if (weightsParam) {
    const parsed = weightsParam.split(",").map(Number)
    if (parsed.length === tokenSymbols.length && parsed.every((w) => !isNaN(w))) {
      const weightSum = parsed.reduce((s, w) => s + w, 0)
      // Normalise to decimal fractions summing to 1 (handles both raw % and already-normalised)
      weights = parsed.map((w) => w / weightSum)
    }
  }

  // Map symbols → token definitions (only those with a CoinGecko ID)
  const tokenDefs = tokenSymbols.map((sym) =>
    FAN_TOKENS.find((t) => t.symbol.toUpperCase() === sym)
  )
  const validTokenDefs = tokenDefs.filter((t): t is (typeof FAN_TOKENS)[0] => !!t?.cgId)

  if (validTokenDefs.length === 0) {
    return NextResponse.json({ tokens: tokenSymbols, days, data: [], source: "empty" }, { status: 200 })
  }

  try {
    const chzHistory = await getChzHistory(fetchDays)

    // Fetch each token's price history in parallel
    const tokenHistories = await Promise.all(
      validTokenDefs.map(async (token, idx) => {
        const data = await fetchTokenHistory(token.cgId!, fetchDays)
        // Figure out this token's weight.
        // weights array is indexed against the ORIGINAL tokenSymbols list.
        const originalIdx = tokenSymbols.indexOf(token.symbol.toUpperCase())
        const w = weights ? weights[originalIdx] : 1 / tokenSymbols.length
        return { symbol: token.symbol, data, weight: w ?? 1 / validTokenDefs.length, staticPrice: parseFloat(token.price) }
      })
    )

    const hasRealData = tokenHistories.some((t) => t.data?.prices?.length)

    if (!hasRealData) {
      return NextResponse.json({
        tokens: tokenSymbols,
        days,
        data: buildFallback(tokenHistories, days, weights, tokenSymbols),
        source: "fallback",
      })
    }

    // Build a map: roundedTimestamp → { tokenSymbol → chzPrice }
    const tsMap = new Map<number, Map<string, number>>()

    for (const { symbol, data } of tokenHistories) {
      if (!data?.prices) continue
      for (const [ts, usdPrice] of data.prices) {
        const roundedTs = Math.round(ts / bucket) * bucket
        const chzPrice = chzHistory.get(roundedTs) || 0.07
        const tokenPriceInCHZ = chzPrice > 0 ? usdPrice / chzPrice : 0

        if (!tsMap.has(roundedTs)) tsMap.set(roundedTs, new Map())
        tsMap.get(roundedTs)!.set(symbol, tokenPriceInCHZ)
      }
    }

    // Build chart points applying  Price = Σ (w_i × P_i)
    const validSymbols = tokenHistories.map((t) => t.symbol)
    const chartData = Array.from(tsMap.entries())
      .filter(([, priceBySymbol]) =>
        // Only include points where at least half the tokens have data
        priceBySymbol.size >= Math.ceil(validSymbols.length / 2)
      )
      .map(([timestamp, priceBySymbol]) => {
        let indexPrice = 0
        let coveredWeight = 0

        for (const { symbol, weight } of tokenHistories) {
          const p = priceBySymbol.get(symbol)
          if (p !== undefined && p > 0) {
            indexPrice += weight * p
            coveredWeight += weight
          }
        }

        // If we only have partial data, rescale so the result isn't deflated
        const adjustedPrice = coveredWeight > 0 && coveredWeight < 1
          ? indexPrice / coveredWeight
          : indexPrice

        return {
          timestamp,
          date: formatDate(timestamp, days),
          price: Number(adjustedPrice.toFixed(6)),
          volume: 0,
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp)

    // For days=1, trim to strict last 24h
    let finalData = chartData
    if (days === 1 && chartData.length > 0) {
      const cutoff = Date.now() - 24 * 60 * 60 * 1000
      const recent = chartData.filter((d) => d.timestamp >= cutoff)
      if (recent.length > 0) finalData = recent
    }

    return NextResponse.json({ tokens: tokenSymbols, days, data: finalData, source: "coingecko" })
  } catch {
    const tokenDefs2 = tokenSymbols.map((sym) => FAN_TOKENS.find((t) => t.symbol.toUpperCase() === sym))
    const fallback = buildFallbackFromDefs(tokenDefs2, tokenSymbols, weights, days)
    return NextResponse.json({ tokens: tokenSymbols, days, data: fallback, source: "fallback" }, { status: 200 })
  }
}

// ── Fallback generators ──────────────────────────────────────────────────────

function buildFallback(
  tokenHistories: { symbol: string; weight: number; staticPrice: number }[],
  days: number,
  weights: number[] | null,
  tokenSymbols: string[]
): ReturnType<typeof generateHistoricalPoints> {
  // Weighted-sum base price from static data
  let basePrice = 0
  for (const { weight, staticPrice } of tokenHistories) {
    basePrice += weight * staticPrice
  }
  return generateHistoricalPoints(basePrice || 1, days)
}

function buildFallbackFromDefs(
  defs: ((typeof FAN_TOKENS)[0] | undefined)[],
  tokenSymbols: string[],
  weights: number[] | null,
  days: number
): ReturnType<typeof generateHistoricalPoints> {
  let basePrice = 0
  const n = defs.length
  for (let i = 0; i < n; i++) {
    const p = defs[i] ? parseFloat(defs[i]!.price) : 0
    const w = weights ? weights[i] : 1 / n
    basePrice += (w ?? 1 / n) * p
  }
  return generateHistoricalPoints(basePrice || 1, days)
}

function generateHistoricalPoints(basePrice: number, days: number) {
  const points: { timestamp: number; date: string; price: number; volume: number }[] = []
  const now = Date.now()
  const interval = days <= 1 ? 3_600_000 : 86_400_000
  const numPoints = days <= 1 ? 24 : days

  let seed = basePrice * 1000
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  const trend = (rand() - 0.5) * 0.3

  for (let i = numPoints; i >= 0; i--) {
    const timestamp = now - i * interval
    const progress = 1 - i / numPoints
    const price = basePrice * (1 + trend * progress + (rand() - 0.5) * 0.08)
    points.push({ timestamp, date: formatDate(timestamp, days), price: Number(price.toFixed(6)), volume: 0 })
  }

  return points
}

function formatDate(timestamp: number, days: number): string {
  const d = new Date(timestamp)
  if (days <= 1) return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  if (days <= 7) return d.toLocaleDateString("en-US", { weekday: "short", hour: "2-digit" })
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
