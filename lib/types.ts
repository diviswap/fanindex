export interface Token {
  symbol: string
  name: string
  logo: string
  price: number
  change24h: number
  marketCap: number
  volume24h: number
  wrappedAddress?: `0x${string}`
}

export interface Index {
  id: string
  name: string
  description: string
  icon: string // Changed from ComponentType to string
  iconColor?: string
  value: number
  change: number
  totalMarketCap: number
  totalVolume24h: number
  tokens: Token[]
  chartData: { name: string; value: number }[]
  backgroundImageUrl?: string
  vaultAddress?: `0x${string}`
  nftAddress?: `0x${string}`
}

export interface Transaction {
  id: string
  date: string
  type: "Buy" | "Sell"
  status: "Completed" | "Pending" | "Failed"
  indexName: string
  indexId: string
  amountCHZ: number
  txHash: string
}
