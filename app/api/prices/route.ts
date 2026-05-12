import { NextResponse } from "next/server"
import { fetchCHZData, fetchTokenPrices, fetchPricesByIds } from "@/lib/services/coingecko"
import { FAN_TOKENS } from "@/lib/data/fan-tokens"

export const dynamic = "force-dynamic"
export const revalidate = 60 // Revalidate every 60 seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tokensParam = searchParams.get("tokens")

    // Fetch live CHZ data (price + market cap + circulating supply)
    const chzData = await fetchCHZData()
    const chzPrice = chzData.price

    // Prepare lists for fetching
    let tokensToFetch = FAN_TOKENS
    if (tokensParam) {
      const tokenSymbols = tokensParam.split(",")
      tokensToFetch = FAN_TOKENS.filter((t) => tokenSymbols.includes(t.symbol))
    }

    // Separate tokens with cgId and those with only wrapped address
    const tokensWithId = tokensToFetch.filter((t) => t.cgId)
    const tokensWithAddressOnly = tokensToFetch.filter((t) => !t.cgId && t.wrapped)

    type PriceMap = Record<string, { usd?: number; usd_24h_change?: number; usd_7d_change?: number; usd_market_cap?: number; usd_24h_vol?: number }>

    // Fetch data in parallel
    const [pricesById, pricesByAddress] = await Promise.all([
      tokensWithId.length > 0 ? fetchPricesByIds(tokensWithId.map((t) => t.cgId!)) : Promise.resolve({} as PriceMap),
      tokensWithAddressOnly.length > 0
        ? fetchTokenPrices(tokensWithAddressOnly.map((t) => t.wrapped!.toLowerCase()))
        : Promise.resolve({} as PriceMap),
    ])

    // Map results back to tokens
    const tokenPrices = tokensToFetch.map((token) => {
      let priceData = null

      // Try to get data from ID first (official data)
      if (token.cgId && pricesById[token.cgId]) {
        priceData = pricesById[token.cgId]
      }
      // Fallback to address if available
      else if (token.wrapped && pricesByAddress[token.wrapped.toLowerCase()]) {
        priceData = pricesByAddress[token.wrapped.toLowerCase()]
      }

      return {
        symbol: token.symbol,
        address: token.wrapped,
        cgId: token.cgId,
        icon: token.icon ?? null,
        priceUSD: priceData?.usd || Number.parseFloat(token.price),
        priceInCHZ: priceData?.usd ? priceData.usd / chzPrice : Number.parseFloat(token.price) / chzPrice,
        change24h: priceData?.usd_24h_change || Number.parseFloat(token.change24h),
        change7d: priceData?.usd_7d_change || Number.parseFloat(token.change7d),
        marketCap: priceData?.usd_market_cap || Number.parseFloat(token.marketCap.replace(/,/g, "")),
        volume24h: priceData?.usd_24h_vol || Number.parseFloat(token.volume.replace(/,/g, "")),
      }
    })

    return NextResponse.json({
      chzPrice,
      chzMarketCap: chzData.marketCap,
      chzCirculatingSupply: chzData.circulatingSupply,
      tokens: tokenPrices,
    })
  } catch (error) {
    console.error("[v0] Error in prices API route:", error)
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 })
  }
}
