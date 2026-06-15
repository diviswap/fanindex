"use client"

import { useReadContracts } from "wagmi"
import { FanXRouterABI, FANX_CONTRACTS } from "@/lib/contracts/fanx-router-abi"
import { formatUnits, parseUnits } from "viem"

export interface TokenPrice {
  address: string
  priceInCHZ: number
  isLoading: boolean
  error: boolean
}

export function useTokenPrices(tokenAddresses: `0x${string}`[]): TokenPrice[] {
  // Filter out zero / WCHZ addresses — those don't need a price query
  const validAddresses = tokenAddresses.filter(
    (addr): addr is `0x${string}` =>
      !!addr &&
      typeof addr === "string" &&
      addr !== "0x0000000000000000000000000000000000000000" &&
      addr.toLowerCase() !== FANX_CONTRACTS.WCHZ.toLowerCase()
  )

  // Query price for each token directly using its current (18-decimal) address.
  // Path: [tokenAddr, WCHZ] → amounts[1] gives how many WCHZ you get for
  // 100 tokens, so priceInCHZ = amounts[1] / 100 (both 18-decimal).
  const contracts = validAddresses.map((addr) => ({
    address: FANX_CONTRACTS.MASTER_ROUTER_V2 as `0x${string}`,
    abi: FanXRouterABI as readonly unknown[],
    functionName: "getAmountsOut" as const,
    args: [parseUnits("100", 18), [addr, FANX_CONTRACTS.WCHZ]] as const,
  }))

  const { data } = useReadContracts({
    contracts: contracts as any,
    query: {
      enabled: contracts.length > 0,
      refetchInterval: 30000,
    },
  })

  return validAddresses.map((addr, i) => {
    const result = data?.[i]

    if (!result || result.status === "failure") {
      return {
        address: addr,
        priceInCHZ: 0,
        isLoading: false,
        error: true,
      }
    }

    const amounts = result.result as bigint[]
    // amounts[0] = 100 tokens in, amounts[1] = CHZ out
    const priceInCHZ =
      amounts && amounts.length > 1
        ? Number(formatUnits(amounts[1], 18)) / 100
        : 0

    return {
      address: addr,
      priceInCHZ,
      isLoading: false,
      error: priceInCHZ === 0,
    }
  })
}
