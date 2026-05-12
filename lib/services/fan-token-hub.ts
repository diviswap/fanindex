/**
 * Fetch token supply data from fan-token-hub API
 * Falls back to static data if API fails
 */
export async function fetchTokenSupply(symbol: string) {
  try {
    // Fetch from both endpoints as they provide different data
    const [circulatingRes, totalRes] = await Promise.all([
      fetch(
        `https://fan-token-hub.fantokens.com/api/token/supply/circulating/${symbol}`,
        { next: { revalidate: 3600 } }
      ),
      fetch(
        `https://fan-token-hub.fantokens.com/api/token/supply/total/${symbol}`,
        { next: { revalidate: 3600 } }
      ),
    ])

    let circulating = 0
    let total = 0

    // Parse circulating supply
    if (circulatingRes.ok) {
      try {
        const circulatingData = await circulatingRes.json()
        circulating = circulatingData.circulating || circulatingData.circulatingSupply || 0
      } catch {
        console.warn(`[v0] Failed to parse circulating supply for ${symbol}`)
      }
    }

    // Parse total supply
    if (totalRes.ok) {
      try {
        const totalData = await totalRes.json()
        total = totalData.total || totalData.totalSupply || 0
      } catch {
        console.warn(`[v0] Failed to parse total supply for ${symbol}`)
      }
    }

    // Return null if both requests failed
    if (!circulatingRes.ok && !totalRes.ok) {
      console.error(`[v0] Failed to fetch supply for ${symbol}: both endpoints failed`)
      return null
    }

    return { circulating, total }
  } catch (error) {
    console.error(`[v0] Error fetching supply for ${symbol}:`, error)
    return null
  }
}

export interface TokenSupply {
  circulating: number
  total: number
}
