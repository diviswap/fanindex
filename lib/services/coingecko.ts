// CoinGecko API service for fetching real-time crypto prices
const COINGECKO_API_KEY = "CG-rPnKVHM9g8W2UFy5k4iJvWc5"
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3"

export interface CoinGeckoPrice {
  usd: number
  usd_24h_change?: number
  usd_7d_change?: number
  usd_market_cap?: number
  usd_24h_vol?: number
}

export interface TokenPriceData {
  symbol: string
  priceUSD: number
  priceInCHZ: number
  change24h: number
  change7d: number
  marketCap: number
  volume24h: number
}

/**
 * Fetch CHZ price from CoinGecko (server-side only)
 */
export async function fetchCHZPrice(): Promise<number> {
  try {
    const url = `${COINGECKO_API_URL}/simple/price`
    const params = new URLSearchParams({
      ids: "chiliz",
      vs_currencies: "usd",
    })

    const response = await fetch(`${url}?${params}`, {
      headers: {
        "x-cg-demo-api-key": COINGECKO_API_KEY,
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      console.error("[v0] CoinGecko API error:", response.status, response.statusText)
      return 0.02984 // Fallback price
    }

    const data = await response.json()
    return data.chiliz?.usd || 0.02984
  } catch (error) {
    console.error("[v0] Error fetching CHZ price from CoinGecko:", error)
    return 0.02984 // Fallback price
  }
}

/**
 * Fetch token prices from CoinGecko by contract addresses (server-side only)
 */
export async function fetchTokenPrices(
  contractAddresses: string[],
  vsCurrency = "usd",
): Promise<Record<string, CoinGeckoPrice>> {
  try {
    const addresses = contractAddresses.join(",")
    const url = `${COINGECKO_API_URL}/simple/token_price/chiliz`
    const params = new URLSearchParams({
      contract_addresses: addresses,
      vs_currencies: vsCurrency,
      include_24hr_change: "true",
      include_7d_change: "true",
      include_market_cap: "true",
      include_24h_vol: "true",
    })

    const response = await fetch(`${url}?${params}`, {
      headers: {
        "x-cg-demo-api-key": COINGECKO_API_KEY,
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      console.error("[v0] CoinGecko API error:", response.status, response.statusText)
      return {}
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[v0] Error fetching prices from CoinGecko:", error)
    return {}
  }
}

/**
 * Fetch token prices from CoinGecko by IDs (server-side only)
 */
export async function fetchPricesByIds(ids: string[], vsCurrency = "usd"): Promise<Record<string, CoinGeckoPrice>> {
  try {
    const idsParam = ids.join(",")
    const url = `${COINGECKO_API_URL}/simple/price`
    const params = new URLSearchParams({
      ids: idsParam,
      vs_currencies: vsCurrency,
      include_24hr_change: "true",
      include_7d_change: "true",
      include_market_cap: "true",
      include_24h_vol: "true",
    })

    const response = await fetch(`${url}?${params}`, {
      headers: {
        "x-cg-demo-api-key": COINGECKO_API_KEY,
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    })

    if (!response.ok) {
      console.error("[v0] CoinGecko API error:", response.status, response.statusText)
      return {}
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[v0] Error fetching prices from CoinGecko by IDs:", error)
    return {}
  }
}
