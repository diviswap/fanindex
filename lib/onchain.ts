import { createPublicClient, http, formatUnits, parseUnits } from "viem"
import { chilizMainnet } from "@/lib/chains"
import { fanxRouterABI } from "@/lib/abis"
import type { Index } from "./types"
import { indexes as staticIndexes } from "./data"

const publicClient = createPublicClient({
  chain: chilizMainnet,
  transport: http(),
})

const FANX_ROUTER_ADDRESS = "0x1918EbB39492C8b98865c5E53219c3f1AE79e76F"
const WCHZ_ADDRESS = "0x677f7e16c7dd57be1d4c8ad1244883214953dc47"

// Fetches the price for a single token in terms of WCHZ
async function fetchTokenPrice(wrappedTokenAddress: `0x${string}`): Promise<number> {
  try {
    const amountIn = parseUnits("1", 18) // Price for 1 token
    const path = [wrappedTokenAddress, WCHZ_ADDRESS]

    const amounts = await publicClient.readContract({
      address: FANX_ROUTER_ADDRESS,
      abi: fanxRouterABI,
      functionName: "getAmountsOut",
      args: [amountIn, path],
    })

    // The second value in the array is the output amount in WCHZ
    const priceInWCHZ = Number.parseFloat(formatUnits(amounts[1], 18))
    return priceInWCHZ
  } catch (error) {
    console.error(`Failed to fetch price for ${wrappedTokenAddress}:`, error)
    return 0 // Return 0 if fetching fails
  }
}

// Fetches prices for all unique tokens used in the indexes
async function fetchAllTokenPrices(indexes: Index[]): Promise<Map<string, number>> {
  const uniqueTokenAddresses = new Set<`0x${string}`>()
  indexes.forEach((index) => {
    index.tokens.forEach((token) => {
      if (token.wrappedAddress) {
        uniqueTokenAddresses.add(token.wrappedAddress)
      }
    })
  })

  const pricePromises = Array.from(uniqueTokenAddresses).map(async (address) => {
    const price = await fetchTokenPrice(address)
    return [address, price]
  })

  const prices = await Promise.all(pricePromises)
  return new Map(prices as [string, number][])
}

// Recalculates index metrics based on fresh on-chain prices
function hydrateIndexWithPrices(index: Index, prices: Map<string, number>): Index {
  // Update token prices
  const tokensWithPrices = index.tokens.map((token) => ({
    ...token,
    price: token.wrappedAddress ? prices.get(token.wrappedAddress) || 0 : 0,
  }))

  // Recalculate index metrics
  const totalMarketCap = tokensWithPrices.reduce((acc, token) => acc + token.marketCap, 0)
  const weightedPriceSum = tokensWithPrices.reduce((acc, token) => acc + token.price * token.marketCap, 0)
  const value = totalMarketCap > 0 ? weightedPriceSum / totalMarketCap : 0

  // For this example, we keep 24h change static, but in a real app, you'd compare against historical prices.
  const weightedChangeSum = tokensWithPrices.reduce((acc, token) => acc + token.change24h * token.marketCap, 0)
  const change = totalMarketCap > 0 ? weightedChangeSum / totalMarketCap : 0

  // Update last point in chart data
  const updatedChartData = [...index.chartData]
  if (updatedChartData.length > 0) {
    updatedChartData[updatedChartData.length - 1].value = value
  }

  return {
    ...index,
    tokens: tokensWithPrices,
    value,
    change,
    totalMarketCap,
    chartData: updatedChartData,
  }
}

// --- Server-Side Data Fetching Functions ---

export async function getIndexesWithOnChainPrices(): Promise<Index[]> {
  const prices = await fetchAllTokenPrices(staticIndexes)
  const hydratedIndexes = staticIndexes.map((index) => hydrateIndexWithPrices(index, prices))
  return hydratedIndexes
}

export async function getIndexByIdWithOnChainPrices(id: string): Promise<Index | undefined> {
  const index = staticIndexes.find((i) => i.id === id)
  if (!index) return undefined

  const prices = await fetchAllTokenPrices([index])
  const hydratedIndex = hydrateIndexWithPrices(index, prices)
  return hydratedIndex
}
