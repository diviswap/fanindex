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
 * Calculate estimated APY for an index based on historical token performance.
 * 
 * Formula explanation:
 * - We use the 7-day change (change7d) as a proxy for short-term momentum
 * - Annualize the weekly return: weeklyReturn * 52 weeks = annualized
 * - Apply different weighting strategies based on index type:
 *   - Equal: Simple average of all tokens' annualized returns
 *   - Weighted: Market-cap weighted average (larger tokens have more influence)
 *   - Managed: Uses a volatility-adjusted return with diversification bonus
 * 
 * This is an ESTIMATE based on historical performance, not a guaranteed return.
 */
export function calculateIndexAPY(
  tokenSymbols: string[],
  indexType: "weighted" | "equal" | "managed",
  livePrices?: Array<{ symbol: string; priceInCHZ: number; change7d?: number }>
): number {
  if (tokenSymbols.length === 0) return 0

  // Get token data with 7-day changes
  const tokenData = tokenSymbols
    .map(symbol => {
      const token = getTokenBySymbol(symbol)
      if (!token) return null
      
      // Try live 7d change first, fallback to static
      const liveData = livePrices?.find(p => p.symbol === symbol)
      const change7d = liveData?.change7d ?? parseFloat(token.change7d) ?? 0
      const marketCap = parseFloat(token.marketCap) || 1
      
      return { symbol, change7d, marketCap }
    })
    .filter((t): t is NonNullable<typeof t> => t !== null)

  if (tokenData.length === 0) return 0

  let weightedReturn: number

  if (indexType === "equal") {
    // Equal-Weight: Simple average of all tokens' returns
    const totalReturn = tokenData.reduce((sum, t) => sum + t.change7d, 0)
    weightedReturn = totalReturn / tokenData.length
    
  } else if (indexType === "weighted") {
    // Market-Cap Weighted: Larger tokens contribute more to the return
    const totalMarketCap = tokenData.reduce((sum, t) => sum + t.marketCap, 0)
    weightedReturn = tokenData.reduce((sum, t) => {
      const weight = t.marketCap / totalMarketCap
      return sum + (t.change7d * weight)
    }, 0)
    
  } else {
    // Managed: Volatility-adjusted with diversification bonus
    // Uses the Sharpe-like approach: reward consistent performers, penalize high variance
    const returns = tokenData.map(t => t.change7d)
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    const stdDev = Math.sqrt(variance)
    
    // Risk-adjusted return (penalize volatility)
    const riskAdjustedReturn = stdDev > 0 ? avgReturn / (1 + stdDev * 0.1) : avgReturn
    
    // Diversification bonus: more tokens = lower risk = slight APY boost
    const diversificationBonus = Math.min(tokenData.length * 0.5, 3) // Max 3% bonus
    
    weightedReturn = riskAdjustedReturn + diversificationBonus
  }

  // Annualize the weekly return: weeklyReturn * 52 = annualized percentage
  // Add a small base yield (2%) to represent platform/staking rewards
  const baseYield = 2
  const annualizedReturn = (weightedReturn * 52) / 100 // Convert to decimal then back
  
  // Cap APY between 0% and 50% for realistic display
  const estimatedAPY = Math.max(0, Math.min(50, baseYield + (annualizedReturn * 100)))
  
  return estimatedAPY
}

/**
 * Get formatted APY string for display
 */
export function getIndexAPY(
  tokenSymbols: string[],
  indexType: "weighted" | "equal" | "managed",
  livePrices?: Array<{ symbol: string; priceInCHZ: number; change7d?: number }>
): string {
  const apy = calculateIndexAPY(tokenSymbols, indexType, livePrices)
  return `${apy.toFixed(1)}%`
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
