import type { IndexData } from "@/components/indices/IndexCard"
import { FAN_TOKENS, getTokenBySymbol } from "@/lib/data/fan-tokens"

export function getTokenPrice(symbol: string, livePrices?: Array<{ symbol: string; priceInChz: number }>): number {
  const token = getTokenBySymbol(symbol)
  if (!token) return 0
  
  // Try to get live price from CoinGecko
  if (livePrices) {
    const livePrice = livePrices.find(p => p.symbol === symbol)
    if (livePrice && livePrice.priceInChz > 0) {
      return livePrice.priceInChz
    }
  }
  
  // Fallback to static price
  const CHZ_PRICE_USD = 0.02984
  return parseFloat(token.price) / CHZ_PRICE_USD
}

export function calculateIndexPrice(
  tokenSymbols: string[], 
  livePrices?: Array<{ symbol: string; priceInChz: number }>
): number {
  if (tokenSymbols.length === 0) return 0
  
  const totalPrice = tokenSymbols.reduce((sum, symbol) => {
    return sum + getTokenPrice(symbol, livePrices)
  }, 0)
  
  const avgPrice = totalPrice / tokenSymbols.length
  return avgPrice
}

export const INDICES: IndexData[] = [
  {
    id: "2",
    name: "FanIndex ETF",
    description: "Diversified exposure to top football Fan Tokens across Europe's biggest leagues, deployed on Chiliz mainnet",
    type: "managed",
    tokens: ["PSG", "BAR", "JUV", "CITY", "ATM", "GAL", "ACM", "AFC", "SPURS", "INTER", "NAP", "ASR"],
    price: calculateIndexPrice(["PSG", "BAR", "JUV", "CITY", "ATM", "GAL", "ACM", "AFC", "SPURS", "INTER", "NAP", "ASR"]).toFixed(2),
    apy: "14.2%",
    totalValue: "0",
    holders: 0,
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
