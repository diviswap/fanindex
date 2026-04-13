"use client"

import { useMemo, useCallback } from "react"
import { useReadContracts } from "wagmi"
import { formatUnits } from "viem"
import { SimplePositionsNFTABI, EtfVaultABI, ETF_CONTRACTS } from "@/lib/contracts/abis"
import { INDICES } from "@/lib/data/indices"

// Only the indices that have deployed contracts on Chiliz Mainnet
const DEPLOYED_INDICES = ["1"] as const

export interface NFTHolding {
  /** The raw NFT token ID from the blockchain */
  tokenId: bigint
  /** Which index this NFT belongs to ("1" = Global ETF) */
  indexId: string
  /** Human-readable index name */
  indexName: string
  /** Per-token addresses returned by getAllHoldings */
  tokenAddresses: `0x${string}`[]
  /** Per-token amounts (wei, 18 decimals) returned by getAllHoldings */
  tokenAmounts: bigint[]
  /** Sum of all amounts in CHZ-equivalent (raw, not price-adjusted) */
  rawTotalWei: bigint
}

export interface PortfolioOnchainResult {
  /** All NFT positions owned by the address */
  holdings: NFTHolding[]
  /** True while any on-chain read is in flight */
  isLoading: boolean
  /** Re-reads all data from the chain */
  refetch: () => void
}

/**
 * Single source of truth for all on-chain portfolio reads.
 * Returns real wagmi refetch handles so callers can trigger re-reads
 * after buy / sell transactions complete.
 */
export function usePortfolioOnchain(
  address: `0x${string}` | undefined,
  enabled: boolean
): PortfolioOnchainResult {
  // ── Step 1: read tokenIds for every deployed index ────────────────────
  const nftContracts = useMemo(() => {
    if (!address || !enabled) return []
    return DEPLOYED_INDICES.map((indexId) => {
      const c = ETF_CONTRACTS[indexId as keyof typeof ETF_CONTRACTS]
      return {
        address: c.nft,
        abi: SimplePositionsNFTABI.abi,
        functionName: "tokensOf",
        args: [address],
      } as const
    })
  }, [address, enabled])

  const {
    data: tokenIdsData,
    isLoading: isLoadingTokens,
    refetch: refetchTokens,
  } = useReadContracts({
    contracts: nftContracts,
    query: { enabled: nftContracts.length > 0 },
  })

  // ── Step 2: build per-index tokenId lists ────────────────────────────
  const indexTokenIds = useMemo(() => {
    if (!tokenIdsData) return []
    return DEPLOYED_INDICES.map((indexId, i) => {
      const result = tokenIdsData[i]
      const tokenIds =
        result?.status === "success" ? (result.result as bigint[]) : []
      return { indexId, tokenIds }
    })
  }, [tokenIdsData])

  // ── Step 3: read getAllHoldings for each tokenId ──────────────────────
  const holdingsContracts = useMemo(() => {
    if (indexTokenIds.length === 0) return []
    return indexTokenIds.flatMap(({ indexId, tokenIds }) => {
      const c = ETF_CONTRACTS[indexId as keyof typeof ETF_CONTRACTS]
      return tokenIds.map((tokenId) => ({
        address: c.vault,
        abi: EtfVaultABI.abi,
        functionName: "getAllHoldings",
        args: [tokenId],
      }))
    })
  }, [indexTokenIds])

  const {
    data: holdingsData,
    isLoading: isLoadingHoldings,
    refetch: refetchHoldings,
  } = useReadContracts({
    contracts: holdingsContracts as any,
    query: { enabled: holdingsContracts.length > 0 },
  })

  // ── Step 4: merge into typed NFTHolding objects ───────────────────────
  const holdings = useMemo<NFTHolding[]>(() => {
    if (!holdingsData || indexTokenIds.length === 0) return []

    const result: NFTHolding[] = []
    let holdingsOffset = 0

    for (const { indexId, tokenIds } of indexTokenIds) {
      const index = INDICES.find((i) => i.id === indexId)

      for (const tokenId of tokenIds) {
        const holdingResult = holdingsData[holdingsOffset]
        holdingsOffset++

        let tokenAddresses: `0x${string}`[] = []
        let tokenAmounts: bigint[] = []
        let rawTotalWei = BigInt(0)

        if (holdingResult?.status === "success") {
          const [addrs, amounts] = holdingResult.result as [string[], bigint[]]
          tokenAddresses = addrs as `0x${string}`[]
          tokenAmounts = amounts
          rawTotalWei = amounts.reduce((sum, a) => sum + a, BigInt(0))
        }

        // Skip empty / burned positions
        if (rawTotalWei === BigInt(0)) continue

        result.push({
          tokenId,
          indexId,
          indexName: index?.name ?? `Index ${indexId}`,
          tokenAddresses,
          tokenAmounts,
          rawTotalWei,
        })
      }
    }

    return result
  }, [holdingsData, indexTokenIds])

  // ── Unified refetch ───────────────────────────────────────────────────
  const refetch = useCallback(() => {
    refetchTokens()
    refetchHoldings()
  }, [refetchTokens, refetchHoldings])

  return {
    holdings,
    isLoading: isLoadingTokens || isLoadingHoldings,
    refetch,
  }
}
