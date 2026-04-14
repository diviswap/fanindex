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
