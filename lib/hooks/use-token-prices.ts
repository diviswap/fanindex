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

const FALLBACK_PRICES: Record<string, number> = {
  // AC Milan
  '0xF9C0F80a6c67b1B39bdDF00ecD57f2533ef5b688': 2.45,
  // Arsenal FC
  '0x1d4343d35f0E0e14C14115876D01dEAa4792550b': 3.45,
  // AS Roma
  '0xa6610b3361c4c0D206Aa3364cd985016c2d89386': 1.92,
  // Aston Villa
  '0x095726841DC9Bf395114Ac83f8fd42B176cFAd10': 1.23,
  // Atlético Madrid
  '0xe9506F70be469d2369803Ccf41823713BAFe8154': 1.85,
  // Atlético Mineiro
  '0xe5274Eb169E0e3A60B9dC343F02BA940958e8683': 1.42,
  // FC Barcelona
  '0xF3C00e2c9D57E5425Ec2eAFB04e14Db1Fd4f2aC6': 3.12,
  // Galatasaray
  '0xc50dc08BdF1e47C336e1DC370e4a0961F7F99A25': 2.78,
  // Inter Milan
  '0x1eE8a0bb23F6c6C67D77cd2e14068B0F68A1dA2f': 2.34,
  // Juventus
  '0xf1BB546Bc6a06eff5F2DfC1a6e7A07E0EDB0C4C1': 2.78,
  // Manchester City
  '0xE64Df98eAc68c6e05835ef5A992Ace4EEF47B082': 4.12,
  // SSC Napoli
  '0x8Bc9e59ED7dD9b7c5F8bcE6C3c40D5a48CD2DaD7': 1.65,
  // OG Esports
  '0x4dF29Be05e2F56B5bB4ceaFb77cC6e4Acd69a6E8': 3.25,
  // Paris Saint-Germain
  '0xA3093d4FCBC0843Cfe0ffbB3D16fF58c8c1C49fF': 5.45,
  // Tottenham Hotspur
  '0x44F6b9b539fDc5D10169Fd8059e45252F3a12D1E': 2.34,
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
    address: FANX_CONTRACTS.ROUTER as `0x${string}`,
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
      const price =
        (unwrapped ? FALLBACK_PRICES[unwrapped.toLowerCase()] : 0) ||
        (unwrapped ? FALLBACK_PRICES[unwrapped] : 0) ||
        0
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
