/**
 * Fetch token supply data from fan-token-hub API
 * Falls back to static data if API fails
 */
export async function fetchTokenSupply(symbol: string) {
  try {
    const response = await fetch(
      `https://fan-token-hub.fantokens.com/api/token/supply/circulating/${symbol}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )
    
    if (!response.ok) {
      console.error(`[v0] Failed to fetch supply for ${symbol}:`, response.status)
      return null
    }

    const data = await response.json()
    return {
      circulating: data.circulating || data.circulatingSupply || 0,
      total: data.total || data.totalSupply || 0,
    }
  } catch (error) {
    console.error(`[v0] Error fetching supply for ${symbol}:`, error)
    return null
  }
}

export interface TokenSupply {
  circulating: number
  total: number
}
