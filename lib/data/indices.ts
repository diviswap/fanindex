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
    name: "FanIndex Global ETF",
    description: "50% OG Esports + 50% Valencia CF — live on Chiliz Mainnet",
    type: "equal",
    tokens: ["OG", "VCF"],
    price: calculateIndexPrice(["OG", "VCF"]).toFixed(2),
    apy: "14.2%",
    totalValue: "2.8M",
    holders: 456,
  },
  {
    id: "2",
    name: "FanIndex ENGLAND ETF",
    description: "Equal exposure to English Premier League Fan Tokens",
    type: "weighted",
    tokens: ["CITY", "AFC", "SPURS"],
    price: calculateIndexPrice(["CITY", "AFC", "SPURS"]).toFixed(2),
    apy: "11.8%",
    totalValue: "1.2M",
    holders: 289,
  },
  {
    id: "3",
    name: "FanIndex ITALY ETF",
    description: "Italian football giants with strong performance and fan engagement",
    type: "managed",
    tokens: ["JUV", "ACM", "ASR", "INTER", "NAP"],
    price: calculateIndexPrice(["JUV", "ACM", "ASR", "INTER", "NAP"]).toFixed(2),
    apy: "16.5%",
    totalValue: "3.1M",
    holders: 512,
  },
  {
    id: "4",
    name: "FanIndex SPAIN ETF",
    description: "Spanish football powerhouses with global fan base",
    type: "equal",
    tokens: ["BAR", "ATM"],
    price: calculateIndexPrice(["BAR", "ATM"]).toFixed(2),
    apy: "13.9%",
    totalValue: "1.9M",
    holders: 378,
  },
  {
    id: "5",
    name: "National Teams Index",
    description: "Diversified exposure to international football federations",
    type: "equal",
    tokens: ["ARG", "POR", "ITA"],
    price: calculateIndexPrice(["ARG", "POR", "ITA"]).toFixed(2),
    apy: "9.5%",
    totalValue: "850K",
    holders: 234,
  },
  {
    id: "6",
    name: "Turkish Super League",
    description: "Leading Turkish football clubs with passionate fan communities",
    type: "weighted",
    tokens: ["GAL", "TRA"],
    price: calculateIndexPrice(["GAL", "TRA"]).toFixed(2),
    apy: "12.3%",
    totalValue: "680K",
    holders: 156,
  },
  {
    id: "7",
    name: "Esports Elite Index",
    description: "Top esports organizations with competitive gaming dominance",
    type: "managed",
    tokens: ["OG", "NAVI", "TH", "DOJO", "VIT"],
    price: calculateIndexPrice(["OG", "NAVI", "TH", "DOJO", "VIT"]).toFixed(2),
    apy: "18.7%",
    totalValue: "1.5M",
    holders: 423,
  },
  {
    id: "8",
    name: "Motorsport Index",
    description: "Formula 1 racing teams with global recognition",
    type: "equal",
    tokens: ["SAUBER", "AM"],
    price: calculateIndexPrice(["SAUBER", "AM"]).toFixed(2),
    apy: "8.9%",
    totalValue: "420K",
    holders: 167,
  },
  {
    id: "9",
    name: "Combat Sports Index",
    description: "Mixed martial arts and combat sports organizations",
    type: "weighted",
    tokens: ["UFC", "PFL"],
    price: calculateIndexPrice(["UFC", "PFL"]).toFixed(2),
    apy: "15.4%",
    totalValue: "290K",
    holders: 198,
  },
  {
    id: "10",
    name: "Global Sports Diversified",
    description: "Maximum diversification across all sports categories and regions",
    type: "managed",
    tokens: ["PSG", "BAR", "CITY", "OG", "UFC", "SAUBER"],
    price: calculateIndexPrice(["PSG", "BAR", "CITY", "OG", "UFC", "SAUBER"]).toFixed(2),
    apy: "17.2%",
    totalValue: "4.2M",
    holders: 678,
  },
]

// Helper function to get index by id
export function getIndexById(id: string): IndexData | undefined {
  return INDICES.find((index) => index.id === id)
}

// Helper function to get indices by type
export function getIndicesByType(type: "weighted" | "equal" | "managed"): IndexData[] {
  return INDICES.filter((index) => index.type === type)
}
