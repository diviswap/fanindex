"use client"

import { useReadContracts } from "wagmi"
import { EtfVaultABI, ETF_CONTRACTS } from "@/lib/contracts/abis"

/**
 * Reads `activePositions()` from every deployed vault in a single multicall.
 * Returns a map of indexId → number of active positions (investors).
 */
export function useActivePositions(): Map<string, number> {
  const entries = Object.entries(ETF_CONTRACTS)

  const { data } = useReadContracts({
    contracts: entries.map(([, cfg]) => ({
      address: cfg.vault,
      abi: EtfVaultABI.abi as readonly unknown[],
      functionName: "activePositions" as const,
    })) as any,
    query: {
      refetchInterval: 30000,
    },
  })

  const result = new Map<string, number>()
  entries.forEach(([id], i) => {
    const raw = data?.[i]
    if (raw?.status === "success") {
      result.set(id, Number(raw.result as bigint))
    }
  })
  return result
}

/**
 * Reads `activePositions()` for a single vault.
 */
export function useActivePositionsForIndex(indexId: string): number | null {
  const contracts = ETF_CONTRACTS[indexId as keyof typeof ETF_CONTRACTS]

  const { data } = useReadContracts({
    contracts: (contracts
      ? [
          {
            address: contracts.vault,
            abi: EtfVaultABI.abi as readonly unknown[],
            functionName: "activePositions" as const,
          },
        ]
      : []) as any,
    query: {
      enabled: !!contracts,
      refetchInterval: 30000,
    },
  })

  const raw = data?.[0]
  if (raw?.status === "success") return Number(raw.result as bigint)
  return null
}
