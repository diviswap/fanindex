import type { IndexData } from "@/components/indices/IndexCard"
import { FAN_TOKENS, getTokenBySymbol } from "@/lib/data/fan-tokens"

export function getTokenPrice(symbol: string, livePrices?: Array<{ symbol: string; priceInCHZ: number }>): number {
  const token = getTokenBySymbol(symbol)
  if (!token) return 0

  // Try to get live price from CoinGecko
  if (livePrices) {
    const livePrice = livePrices.find(p => p.symbol === symbol)
    if (livePrice && livePrice.priceInCHZ > 0) {
      return livePrice.priceInCHZ
    }
  }

  // Fallback to static price
  const CHZ_PRICE_USD = 0.02984
  return parseFloat(token.price) / CHZ_PRICE_USD
}

export function calculateIndexPrice(
  tokenSymbols: string[],
  livePrices?: Array<{ symbol: string; priceInCHZ: number }>
): number {
  if (tokenSymbols.length === 0) return 0

  const totalPrice = tokenSymbols.reduce((sum, symbol) => {
    return sum + getTokenPrice(symbol, livePrices)
  }, 0)

  const avgPrice = totalPrice / tokenSymbols.length
  // Never return 0 — live prices will override this in the UI,
  // but a non-zero static fallback avoids "Minimum: 0 CHZ" flash.
  return avgPrice > 0 ? avgPrice : 1
}

/**
 * Calculate estimated historical APY for an index.
 *
 * Methodology — "what would you have earned buying 365 days ago?":
 *   1. Use each token's 7-day percentage change as the best available
 *      recent weekly return proxy.
 *   2. Compound that weekly return over 52 weeks:
 *        annualReturn = (1 + weeklyReturn) ^ 52  – 1
 *      This is the same formula used by savings-rate APY calculations.
 *   3. Aggregate per index strategy:
 *        Equal    – simple average of all tokens' annualised returns
 *        Weighted – market-cap weighted average
 *        Managed  – market-cap weighted, then discounted by a volatility
 *                   penalty (std-dev of the weekly returns) to reflect
 *                   active-management smoothing of drawdowns
 *   4. Result is clamped to [-30%, +80%] — crypto-realistic bounds.
 *
 * All numbers are percentages (e.g. 14.2, not 0.142).
 */
export function calculateIndexAPY(
  tokenSymbols: string[],
  indexType: "weighted" | "equal" | "managed",
  livePrices?: Array<{ symbol: string; priceInCHZ: number; marketCap?: number; change7d?: number }>
): number {
  if (tokenSymbols.length === 0) return 0

  const tokenData = tokenSymbols
    .map(symbol => {
      const token = getTokenBySymbol(symbol)
      if (!token) return null

      const liveData = livePrices?.find(p => p.symbol === symbol)
      // change7d is in %; convert to decimal for compounding
      const change7dPct = liveData?.change7d ?? parseFloat(token.change7d) ?? 0
      const weeklyReturn = change7dPct / 100

      // Compound weekly return over 52 weeks → annualised return (decimal)
      const annualisedReturn = Math.pow(1 + weeklyReturn, 52) - 1

      // Market cap for weighting (live first, then static)
      const marketCap = liveData?.marketCap ?? parseFloat(token.marketCap) ?? 1

      return { symbol, weeklyReturn, annualisedReturn, marketCap }
    })
    .filter((t): t is NonNullable<typeof t> => t !== null)

  if (tokenData.length === 0) return 0

  const totalMarketCap = tokenData.reduce((s, t) => s + t.marketCap, 0) || 1

  let annualisedPct: number

  if (indexType === "equal") {
    // Simple average of each token's annualised return
    const sum = tokenData.reduce((s, t) => s + t.annualisedReturn, 0)
    annualisedPct = (sum / tokenData.length) * 100

  } else if (indexType === "weighted") {
    // Market-cap weighted annualised return
    annualisedPct = tokenData.reduce((s, t) => {
      const weight = t.marketCap / totalMarketCap
      return s + t.annualisedReturn * weight
    }, 0) * 100

  } else {
    // Managed: market-cap weighted, discounted by weekly-return std-dev
    const mcWeightedReturn = tokenData.reduce((s, t) => {
      const weight = t.marketCap / totalMarketCap
      return s + t.weeklyReturn * weight
    }, 0)

    // Std-dev of weekly returns across tokens
    const weeklyReturns = tokenData.map(t => t.weeklyReturn)
    const mean = weeklyReturns.reduce((a, b) => a + b, 0) / weeklyReturns.length
    const variance = weeklyReturns.reduce((s, r) => s + Math.pow(r - mean, 2), 0) / weeklyReturns.length
    const stdDev = Math.sqrt(variance)

    // Discount by volatility (higher std-dev → lower effective weekly gain)
    const discountedWeekly = mcWeightedReturn * (1 - Math.min(stdDev * 2, 0.5))
    annualisedPct = (Math.pow(1 + discountedWeekly, 52) - 1) * 100
  }

  // Clamp to realistic crypto range: –30% to +80%
  return Math.max(-30, Math.min(80, annualisedPct))
}

/**
 * Get formatted APY string for display
 */
export function getIndexAPY(
  tokenSymbols: string[],
  indexType: "weighted" | "equal" | "managed",
  livePrices?: Array<{ symbol: string; priceInCHZ: number; marketCap?: number; change7d?: number }>
): string {
  const apy = calculateIndexAPY(tokenSymbols, indexType, livePrices)
  const sign = apy >= 0 ? "+" : ""
  return `${sign}${apy.toFixed(1)}%`
}

export const INDICES: IndexData[] = [
  {
    id: "1",
    ticker: "FTLX",
    name: "FTLX — Fan Token Leaders Index",
    description:
      "The benchmark index of the fan token market. Tracks the 10 largest and most liquid fan tokens, representing the overall performance of the ecosystem.",
    type: "weighted",
    tokens: ["GAL", "ARG", "OG", "PSG", "BAR", "ASR", "CITY", "ATM", "POR", "JUV"],
    weights: [16.42, 12.73, 11.94, 10.45, 9.83, 9.13, 8.25, 7.55, 7.11, 6.49],
    price: calculateIndexPrice([
      "GAL",
      "ARG",
      "OG",
      "PSG",
      "BAR",
      "ASR",
      "CITY",
      "ATM",
      "POR",
      "JUV",
    ]).toFixed(2),
    apy: "14.2%",
    totalValue: "2.8M",
    holders: 0,
  },
  {
    id: "2",
    ticker: "FGMX",
    name: "FGMX — Fan Gaming Index",
    description:
      "A thematic index providing exposure to the esports segment of the fan token ecosystem, with equal weighting across all included teams.",
    type: "equal",
    tokens: ["OG", "NAVI", "ALL", "MIBR"],
    weights: [25, 25, 25, 25],
    price: calculateIndexPrice(["OG", "NAVI", "ALL", "MIBR"]).toFixed(2),
    apy: "0.0%",
    totalValue: "—",
    holders: 0,
  },
  {
    id: "3",
    ticker: "FFLX",
    name: "FFLX — Fan Fight Index",
    description:
      "An index focused on combat sports, tracking the performance of leading organizations with fan tokens in this category.",
    type: "equal",
    tokens: ["UFC", "PFL"],
    weights: [50, 50],
    price: calculateIndexPrice(["UFC", "PFL"]).toFixed(2),
    apy: "0.0%",
    totalValue: "—",
    holders: 0,
  },
  {
    id: "4",
    ticker: "FELX",
    name: "FELX — Fan English League Index",
    description:
      "Tracks the performance of leading English football clubs with fan tokens, weighted by their market relevance.",
    type: "weighted",
    tokens: ["CITY", "AFC", "SPURS", "AVL", "EFC"],
    weights: [46, 36, 9, 6, 3],
    price: calculateIndexPrice(["CITY", "AFC", "SPURS", "AVL", "EFC"]).toFixed(2),
    apy: "0.0%",
    totalValue: "—",
    holders: 0,
  },
  {
    id: "5",
    ticker: "FSLX",
    name: "FSLX — Fan Spanish League Index",
    description:
      "Measures the performance of leading Spanish football clubs with fan tokens, reflecting the structure of the local market.",
    type: "weighted",
    tokens: ["BAR", "ATM", "SEVILLA", "VCF"],
    weights: [53, 41, 3, 3],
    price: calculateIndexPrice(["BAR", "ATM", "SEVILLA", "VCF"]).toFixed(2),
    apy: "0.0%",
    totalValue: "—",
    holders: 0,
  },
]

// Helper function to get index by id
export function getIndexById(id: string): IndexData | undefined {
  return INDICES.find((index) => index.id === id)
}

// Helper function to get index by ticker code (e.g. "FTLX", "FGMX").
// Lookup is case-insensitive so URLs like /indices/ftlx also resolve.
export function getIndexByTicker(ticker: string): IndexData | undefined {
  const normalised = ticker.toUpperCase()
  return INDICES.find((index) => index.ticker?.toUpperCase() === normalised)
}

// Flexible resolver used by the dynamic route: tries ticker first and
// falls back to the numeric id for backwards compatibility.
export function getIndexByTickerOrId(slug: string): IndexData | undefined {
  return getIndexByTicker(slug) ?? getIndexById(slug)
}

// Helper function to get indices by type
export function getIndicesByType(type: "weighted" | "equal" | "managed"): IndexData[] {
  return INDICES.filter((index) => index.type === type)
}
