"use client"

import { useReadContracts } from "wagmi"
import { FanXRouterABI, FANX_CONTRACTS } from "@/lib/contracts/fanx-router-abi"
import { formatUnits, parseUnits } from "viem"
import { getTokenByAddress } from "@/lib/data/fan-tokens"

export interface TokenPrice {
  address: string
  priceInCHZ: number
  isLoading: boolean
  error: boolean
}

// Keys must be lowercase for reliable lookup
const FALLBACK_PRICES: Record<string, number> = {
  // AC Milan
  '0xf9c0f80a6c67b1b39bddf00ecd57f2533ef5b688': 2.45,
  // Arsenal FC
  '0x1d4343d35f0e0e14c14115876d01deaa4792550b': 3.45,
  // AS Roma
  '0xa6610b3361c4c0d206aa3364cd985016c2d89386': 1.92,
  // Aston Villa
  '0x095726841dc9bf395114ac83f8fd42b176cfad10': 1.23,
  // Atlético Madrid
  '0xe9506f70be469d2369803ccf41823713bafe8154': 1.85,
  // Atlético Mineiro
  '0xe5274eb169e0e3a60b9dc343f02ba940958e8683': 1.42,
  // FC Barcelona
  '0xf3c00e2c9d57e5425ec2eafb04e14db1fd4f2ac6': 3.12,
  // Galatasaray
  '0xc50dc08bdf1e47c336e1dc370e4a0961f7f99a25': 2.78,
  // Inter Milan
  '0x1ee8a0bb23f6c6c67d77cd2e14068b0f68a1da2f': 2.34,
  // Juventus
  '0xf1bb546bc6a06eff5f2dfc1a6e7a07e0edb0c4c1': 2.78,
  // Manchester City
  '0xe64df98eac68c6e05835ef5a992ace4eef47b082': 4.12,
  // SSC Napoli
  '0x8bc9e59ed7dd9b7c5f8bce6c3c40d5a48cd2dad7': 1.65,
  // OG Esports
  '0x4df29be05e2f56b5bb4ceafb77cc6e4acd69a6e8': 3.25,
  // Paris Saint-Germain
  '0xa3093d4fcbc0843cfe0ffbbb3d16ff58c8c1c49ff': 5.45,
  // Tottenham Hotspur
  '0x44f6b9b539fdc5d10169fd8059e45252f3a12d1e': 2.34,
}

export function useTokenPrices(tokenAddresses: `0x${string}`[]): TokenPrice[] {
  const addressMap = tokenAddresses
    .filter((addr): addr is `0x${string}` =>
      !!addr &&
      typeof addr === "string" &&
      addr !== "0x0000000000000000000000000000000000000000" &&
      addr.toLowerCase() !== FANX_CONTRACTS.WCHZ.toLowerCase()
    )
    .map(wrappedAddress => {
      const token = getTokenByAddress(wrappedAddress)
      const unwrappedAddress = token?.unwrapped || wrappedAddress
      return {
        original: wrappedAddress,
        unwrapped: unwrappedAddress as `0x${string}`,
      }
    })

  const contracts = addressMap.map(({ unwrapped }) => ({
    // Use MASTER_ROUTER_V2 — this is the router the batchBuyer uses internally
    // for all swaps. Using the original ROUTER would query a different liquidity
    // source and produce prices that don't match actual swap outputs.
    address: FANX_CONTRACTS.MASTER_ROUTER_V2 as `0x${string}`,
    abi: FanXRouterABI as readonly unknown[],
    functionName: "getAmountsOut" as const,
    args: [parseUnits("100", 18), [unwrapped, FANX_CONTRACTS.WCHZ]] as const,
  }))

  // Always pass the contracts array (even if empty) — never conditionally change
  // the number of hooks called. Use the `enabled` query flag instead.
  const { data } = useReadContracts({
    contracts: (contracts.length > 0 ? contracts : []) as any,
    query: {
      enabled: contracts.length > 0,
      refetchInterval: 30000,
    },
  })

  const prices = addressMap.map(({ original, unwrapped }, index) => {
    const result = data?.[index]
    
    if (!result || result.status === "failure") {
      const price = (unwrapped ? FALLBACK_PRICES[unwrapped.toLowerCase()] : 0) ?? 0
      return {
        address: original,
        priceInCHZ: price,
        isLoading: false,
        error: price === 0,
      }
    }

    const amounts = result.result as bigint[]
    const priceInCHZ = amounts && amounts.length > 1 ? Number(formatUnits(amounts[1], 18)) / 100 : 0

    return {
      address: original,
      priceInCHZ,
      isLoading: false,
      error: false,
    }
  })
  
  return prices
}
