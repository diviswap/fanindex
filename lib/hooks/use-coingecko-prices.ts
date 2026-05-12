"use client"

import useSWR from 'swr'

export interface TokenPrice {
  symbol: string
  address: string
  cgId?: string
  icon?: string | null
  priceUSD: number
  priceInCHZ: number
  change24h: number
  change7d: number
  marketCap: number
  volume24h: number
  error?: boolean
}

export interface PricesData {
  chzPrice: number
  chzMarketCap: number
  chzCirculatingSupply: number
  tokens: TokenPrice[]
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

/**
 * Hook to fetch token prices from CoinGecko via our API route
 * This keeps the API key secure on the server side
 */
export function useCoinGeckoPrices(tokenSymbols?: string[]) {
  const url = tokenSymbols 
    ? `/api/prices?tokens=${tokenSymbols.join(',')}` 
    : '/api/prices'

  const { data, error, isLoading, mutate } = useSWR<PricesData>(
    url,
    fetcher,
    {
      refreshInterval: 60000, // Refresh every 60 seconds
      revalidateOnFocus: true,
      dedupingInterval: 30000, // Dedupe requests within 30 seconds
    }
  )

  return {
    data,
    chzPrice: data?.chzPrice,
    tokens: data?.tokens || [],
    prices: data?.tokens || [],
    isLoading,
    error,
    refetch: mutate,
  }
}
