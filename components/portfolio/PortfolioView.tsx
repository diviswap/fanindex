"use client"

import { useTranslations } from "next-intl"
import { useAccount, useBalance, useReadContracts } from "wagmi"
import { formatUnits, erc20Abi } from "viem"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Wallet,
  Layers,
  Hash,
  Coins,
  Share2,
} from "lucide-react"
import { ShareCardModal } from "@/components/share/ShareCardModal"
import { useState, useMemo } from "react"
import { RedeemDialog } from "./RedeemDialog"
import { BuyIndexDialog } from "@/components/indices/BuyIndexDialog"
import type { IndexData } from "@/components/indices/IndexCard"
import { TransactionHistory } from "./TransactionHistory"
import { INDICES, calculateIndexPrice } from "@/lib/data/indices"
import { getTokenByAddress, getTokenBySymbol, FAN_TOKENS } from "@/lib/data/fan-tokens"
import { useTokenPrices } from "@/lib/hooks/use-token-prices"
import { useCoinGeckoPrices } from "@/lib/hooks/use-coingecko-prices"
import { usePortfolioOnchain, type NFTHolding } from "@/lib/hooks/use-portfolio-onchain"
import { NFTPositionCard } from "./NFTPositionCard"
import { Sparkline } from "@/components/ui/sparkline"
import { PortfolioAllocation, type AllocationItem } from "./PortfolioAllocation"
import Image from "next/image"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

// Indices that have contracts deployed on Chiliz Mainnet.
// Keep this list in sync with ETF_CONTRACTS (lib/contracts/abis.ts) and
// DEPLOYED_INDICES in lib/hooks/use-portfolio-onchain.ts.
const DEPLOYED_INDICES = ["FTLX", "FGMX", "FFLX", "FELX", "FSLX"]

const typeColors: Record<string, string> = {
  weighted: "text-blue-400",
  equal: "text-purple-400",
  managed: "text-success",
}

const typeLabels: Record<string, string> = {
  weighted: "Weighted",
  equal: "Equal-Weight",
  managed: "Managed",
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function NFTCardSkeleton() {
  return (
    <div className="border border-border bg-card rounded-2xl p-5 space-y-4 animate-pulse">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-5 w-40 bg-muted rounded" />
        </div>
        <div className="space-y-1 text-right">
          <div className="h-3 w-16 bg-muted rounded ml-auto" />
          <div className="h-6 w-24 bg-muted rounded ml-auto" />
        </div>
      </div>
      <div className="rounded-xl bg-muted/40 h-28" />
      <div className="h-9 bg-muted rounded-lg" />
    </div>
  )
}

function FanTokenCardSkeleton() {
  return (
    <div className="border border-border bg-card rounded-xl p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-muted rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-20 bg-muted rounded" />
          <div className="h-3 w-16 bg-muted rounded" />
        </div>
        <div className="h-5 w-16 bg-muted rounded" />
      </div>
    </div>
  )
}

// ─── Available index card (needs its own SWR hook for live price/24h) ────────

function AvailableIndexCard({
  index,
  onBuy,
}: {
  index: IndexData
  onBuy: () => void
}) {
  const { prices: liveTokenPrices } = useCoinGeckoPrices()

  // Same weights query and 90d fetch as IndexCard
  const weightsQuery =
    index.weights && index.weights.length === index.tokens.length
      ? `&weights=${index.weights.join(",")}`
      : ""

  const { data: history90d } = useSWR(
    `/api/prices/history?tokens=${index.tokens.join(",")}&days=90${weightsQuery}`,
    fetcher,
    { refreshInterval: 300000, revalidateOnFocus: false, dedupingInterval: 60000 }
  )

  const displayPrice = useMemo(() => {
    if (liveTokenPrices && liveTokenPrices.length > 0) {
      return calculateIndexPrice(index.tokens, liveTokenPrices, index.weights).toFixed(2)
    }
    const data = history90d?.data
    if (data && data.length > 0) {
      return data[data.length - 1].price.toFixed(2)
    }
    return Number.parseFloat(index.price).toFixed(2)
  }, [history90d, liveTokenPrices, index.tokens, index.price])

  // Same 24h logic as IndexCard: slice 90d data to 2 days back
  const return24h = useMemo(() => {
    const all: { price: number; timestamp: number }[] = history90d?.data ?? []
    if (all.length < 2) return null
    // Filter to last 2 days by index position (last 2 points), not by Date.now()
    // to avoid SSR/client hydration mismatch
    const last2 = all.slice(-2)
    if (last2.length < 2) return null
    const first = last2[0].price
    const last = last2[1].price
    if (!first) return null
    return ((last - first) / first) * 100
  }, [history90d])

  const return90d = useMemo(() => {
    const all: { price: number; timestamp: number }[] = history90d?.data ?? []
    if (all.length < 2) return null
    const first = all[0].price
    const last = all[all.length - 1].price
    if (!first) return null
    return ((last - first) / first) * 100
  }, [history90d])

  // 30-day sparkline data — use array slice instead of Date.now() to avoid SSR mismatch
  const sparkData = useMemo(() => {
    const all: { price: number; timestamp: number }[] = history90d?.data ?? []
    if (all.length < 2) return []
    // For 30d data, approximately 30 points at daily granularity
    // Safe to take last 30 points regardless of actual dates
    return all.slice(-30)
  }, [history90d])

  return (
    <div className="relative border border-border bg-card backdrop-blur-sm p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-success/30 transition-all duration-300 overflow-hidden min-h-[520px] flex flex-col">
      {/* Subtle video bg */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-60 dark:opacity-15 pointer-events-none">
        <video
          autoPlay loop muted playsInline
          className="w-full h-full object-cover"
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dec77d7d-abd9-4ebc-9a9c-3b387c3f1a98-card.MP4.MP4"
        />
        <div className="absolute inset-0 bg-background/60 dark:bg-background/40" />
      </div>

      <div className="relative z-10 h-full flex flex-col gap-3">
        {/* Header — fixed height */}
        <div className="h-20">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                {index.symbol && (
                  <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground bg-muted/80 border border-border px-1.5 py-0.5 rounded">
                    {index.symbol}
                  </span>
                )}
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 rounded border border-border text-[10px] font-semibold uppercase tracking-wider ${typeColors[index.type]}`}
                >
                  {typeLabels[index.type]}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground text-balance leading-tight">
                {index.name}
              </h3>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/20 text-success border border-success/30">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              {t("live")}
            </span>
          </div>
        </div>

        {/* Price + 24h delta — fixed height */}
        <div className="h-10 flex items-baseline gap-2 flex-wrap">
          <span className="font-mono text-2xl sm:text-3xl font-bold text-foreground tabular-nums">
            {displayPrice}
          </span>
          <span className="text-xs font-medium text-muted-foreground">CHZ</span>
          {return24h !== null && (
            <span
              className={`ml-auto inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums ${
                return24h >= 0 ? "text-success" : "text-destructive"
              }`}
            >
              {return24h >= 0
                ? <TrendingUp className="h-3 w-3" />
                : <TrendingDown className="h-3 w-3" />}
              {return24h >= 0 ? "+" : ""}{return24h.toFixed(2)}%
            </span>
          )}
        </div>

        {/* Sparkline — fixed height */}
        <div className="h-14 flex items-center">
          <Sparkline
            data={sparkData}
            color={
              return90d !== null && return90d < 0
                ? "var(--destructive)"
                : "var(--success)"
            }
            height={44}
            className="w-full"
          />
        </div>

        {/* Returns row — fixed height */}
        <div className="h-14 grid grid-cols-2 gap-2 rounded-lg border border-border/60 bg-muted/30 p-2">
          {[
            { label: "24h", value: return24h },
            { label: "90d", value: return90d },
          ].map(({ label, value }) => (
            <div key={label} className="text-center flex flex-col justify-center">
              <div className="text-[9px] text-muted-foreground mb-0.5 font-medium uppercase tracking-[0.14em]">
                {label}
              </div>
              {value === null ? (
                <div className="text-xs font-bold text-muted-foreground">--</div>
              ) : (
                <div className={`text-xs sm:text-sm font-bold tabular-nums ${value >= 0 ? "text-success" : "text-destructive"}`}>
                  {value >= 0 ? "+" : ""}{value.toFixed(2)}%
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tokens — flex-grow to take remaining space */}
        <div className="flex-1 min-h-12 flex flex-col">
          <div className="flex flex-wrap gap-1 content-start">
            {index.tokens.slice(0, 6).map((symbol) => {
              const tokenData = getTokenBySymbol(symbol)
              return (
                <span
                  key={symbol}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/80 text-[10px] font-mono font-semibold text-muted-foreground border border-border"
                >
                  {tokenData?.icon && (
                    <Image
                      src={tokenData.icon}
                      alt={symbol}
                      width={14}
                      height={14}
                      className="rounded-full"
                    />
                  )}
                  {symbol}
                </span>
              )
            })}
            {index.tokens.length > 6 && (
              <span className="px-1.5 py-0.5 rounded bg-muted/80 text-[10px] font-mono font-semibold text-muted-foreground border border-border">
                +{index.tokens.length - 6}
              </span>
            )}
          </div>
        </div>

        {/* Button — fixed height at bottom */}
        <Button
          onClick={onBuy}
          className="w-full bg-success hover:bg-success/90 text-success-foreground font-semibold h-9 text-sm"
        >
          <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
          {t("buy")}
        </Button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PortfolioView() {
  const t = useTranslations("portfolioView")
  const { address, isConnected } = useAccount()

  // Get native CHZ balance
  const { data: chzBalance, isLoading: isLoadingBalance } = useBalance({
    address,
    query: { enabled: isConnected },
  })

  const [selectedPosition, setSelectedPosition] = useState<{
    nftId: string
    indexId: string
    indexName: string
    tokenRows: {
      symbol: string
      name: string
      icon?: string
      amount: number
      priceInCHZ: number
      valueInCHZ: number
    }[]
    totalValueCHZ: number
  } | null>(null)
  const [selectedIndexToBuy, setSelectedIndexToBuy] = useState<IndexData | null>(null)
  const [showSharePortfolio, setShowSharePortfolio] = useState(false)
  const [recentTxs, setRecentTxs] = useState<{
    id: string
    type: "buy" | "sell" | "withdraw"
    tokenId: string
    amountCHZ: number
    txHash: `0x${string}` | null
    blockNumber: bigint | null
    user: string
  }[]>([])

  // ── On-chain reads ────────────────────────────────────────────────────────
  const { holdings, isLoading: isLoadingOnChain, refetch } = usePortfolioOnchain(
    address,
    isConnected
  )

  // ── Token prices ──────────────────────────────────────────────────────────
  const allTokenAddresses = useMemo(() => {
    const addrs = new Set<`0x${string}`>()
    holdings.forEach((h) =>
      h.tokenAddresses.forEach((a) => {
        if (a && typeof a === "string" && a !== "0x0000000000000000000000000000000000000000")
          addrs.add(a)
      })
    )
    return Array.from(addrs)
  }, [holdings])

  const tokenPrices = useTokenPrices(allTokenAddresses)
  const { prices: liveTokenPrices } = useCoinGeckoPrices()

  // Build a lookup map: address → best available price
  const priceMap = useMemo(() => {
    const map = new Map<string, number>()
    tokenPrices.forEach((tp) => {
      if (tp.address && typeof tp.address === "string")
        map.set(tp.address.toLowerCase(), tp.priceInCHZ)
    })
    liveTokenPrices?.forEach((lp) => {
      if (!lp.error && lp.priceInCHZ > 0 && lp.address && typeof lp.address === "string")
        map.set(lp.address.toLowerCase(), lp.priceInCHZ)
    })
    return map
  }, [tokenPrices, liveTokenPrices])

  // ── Fan Token balances (read on-chain ERC20 balances) ────────────────────────
  // Get tokens with valid contract addresses
  const tokensWithAddresses = useMemo(() => {
    return FAN_TOKENS.filter((t) => !!t.unwrapped)
  }, [])

  // Read all fan token balances in a single multicall
  const { data: fanTokenBalances, isLoading: isLoadingFanTokens } = useReadContracts({
    contracts: tokensWithAddresses.map((token) => ({
      address: token.unwrapped as `0x${string}`,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address as `0x${string}`],
    })),
    query: {
      enabled: isConnected && !!address && tokensWithAddresses.length > 0,
    },
  })

  // Build user fan tokens list - only those with balance > 0
  const userFanTokens = useMemo(() => {
    if (!fanTokenBalances) return []

    const tokensWithBalance: {
      symbol: string
      name: string
      icon?: string
      address: string
      balance: number
      priceInCHZ: number
      valueInCHZ: number
    }[] = []

    tokensWithAddresses.forEach((token, i) => {
      const result = fanTokenBalances[i]
      if (result?.status === "success" && result.result) {
        const balance = Number(formatUnits(result.result as bigint, 18))
        if (balance > 0) {
          const livePrice = liveTokenPrices?.find(
            (lp) => lp.symbol.toLowerCase() === token.symbol.toLowerCase()
          )
          const priceInCHZ = livePrice?.priceInCHZ ?? parseFloat(token.price) / 0.07
          tokensWithBalance.push({
            symbol: token.symbol,
            name: token.name,
            icon: token.icon,
            address: token.unwrapped!,
            balance,
            priceInCHZ,
            valueInCHZ: balance * priceInCHZ,
          })
        }
      }
    })

    return tokensWithBalance
  }, [fanTokenBalances, tokensWithAddresses, liveTokenPrices])

  // ── Stats ─────────────────────────────────────────────────────────────────
  const portfolioStats = useMemo(() => {
    // NFT positions value
    const nftValue = holdings.reduce((sum, h) => {
      const posVal = h.tokenAddresses.reduce((s, addr, i) => {
        if (!addr || typeof addr !== "string") return s
        const amt = h.tokenAmounts[i] ? Number(formatUnits(h.tokenAmounts[i], 18)) : 0
        const price = priceMap.get(addr.toLowerCase()) ?? 0
        return s + amt * price
      }, 0)
      return sum + posVal
    }, 0)

    // CHZ balance value (1 CHZ = 1 CHZ)
    const chzValue = chzBalance ? Number(formatUnits(chzBalance.value, chzBalance.decimals)) : 0

    // Fan token value (sum of balances * prices)
    const fanTokenValue = userFanTokens.reduce((sum, t) => sum + t.valueInCHZ, 0)

    return {
      totalValue: nftValue + chzValue + fanTokenValue,
      nftValue,
      chzValue,
      fanTokenValue,
      activeNFTs: holdings.length,
      totalPositions: holdings.length,
    }
  }, [holdings, priceMap, chzBalance, userFanTokens])

  // ── Allocation items ──────────────────────────────────────────────────────
  // Includes every value-bearing bucket: NFT positions, raw CHZ balance,
  // and individual fan tokens — sorted in the chart by value descending.
  const allocationItems = useMemo<AllocationItem[]>(() => {
    const items: AllocationItem[] = []

    // CHZ balance
    if (portfolioStats.chzValue > 0) {
      items.push({
        id: "chz",
        name: "CHZ",
        sublabel: t("native"),
        value: portfolioStats.chzValue,
        category: "chz",
      })
    }

    // NFT positions, one slice per index position
    holdings.forEach((h) => {
      const val = h.tokenAddresses.reduce((s, addr, i) => {
        if (!addr || typeof addr !== "string") return s
        const amt = h.tokenAmounts[i] ? Number(formatUnits(h.tokenAmounts[i], 18)) : 0
        const price = priceMap.get(addr.toLowerCase()) ?? 0
        return s + amt * price
      }, 0)
      if (val > 0) {
        items.push({
          id: `nft-${h.tokenId.toString()}`,
          name: h.indexName,
          sublabel: `${t("position")} #${h.tokenId.toString()}`,
          value: val,
          category: "nft",
        })
      }
    })

    // Fan tokens held directly in the wallet
    userFanTokens.forEach((t) => {
      if (t.valueInCHZ > 0) {
        items.push({
          id: `token-${t.address}`,
          name: t.symbol,
          sublabel: t.name,
          value: t.valueInCHZ,
          category: "token",
          icon: t.icon,
        })
      }
    })

    return items
  }, [holdings, priceMap, portfolioStats.chzValue, userFanTokens])

  // ── Handlers ──────────────────────────────────���───────────────────────────
  const handleSell = (holding: NFTHolding) => {
    const tokenRows = holding.tokenAddresses.map((addr, i) => {
      const token = getTokenByAddress(addr)
      const amount = holding.tokenAmounts[i] ? Number(formatUnits(holding.tokenAmounts[i], 18)) : 0
      const priceInCHZ = priceMap.get(addr.toLowerCase()) ?? 0
      return {
        symbol: token?.symbol ?? addr.slice(0, 6) + "...",
        name: token?.name ?? "Unknown Token",
        icon: token?.icon,
        amount,
        priceInCHZ,
        valueInCHZ: amount * priceInCHZ,
      }
    })
    const totalValueCHZ = tokenRows.reduce((s, r) => s + r.valueInCHZ, 0)
    setSelectedPosition({
      nftId: holding.tokenId.toString(),
      indexId: holding.indexId,
      indexName: holding.indexName,
      tokenRows,
      totalValueCHZ,
    })
  }

  const handleBuyMore = (holding: NFTHolding) => {
    const index = INDICES.find((i) => i.id === holding.indexId)
    if (index) {
      setSelectedIndexToBuy(index)
    }
  }

  const handleTransactionSuccess = (type: "buy" | "sell" = "buy", tokenId?: string, amountCHZ?: number) => {
    refetch()
    setRecentTxs((prev) => [
      {
        id: `${Date.now()}-${type}`,
        type,
        tokenId: tokenId ?? "?",
        amountCHZ: amountCHZ ?? 0,
        txHash: null,
        blockNumber: null,
        user: address ?? "",
      },
      ...prev,
    ])
  }

  // ── Not connected ─────────────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto text-center space-y-6 p-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 border-2 border-success/20 mb-4">
            <Wallet className="h-10 w-10 text-success" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Connect Your Wallet</h2>
          <p className="text-lg text-muted-foreground">
            Connect your wallet to view your portfolio, track your positions, and manage your fan
            token investments.
          </p>
        </div>
      </div>
    )
  }

  const { totalValue, chzValue, activeNFTs } = portfolioStats
  const hasPositions = holdings.length > 0

  return (
    <div className="space-y-6 md:space-y-10">
      {/* Hero stats — total value as primary, others secondary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Total Value — spans 2 cols on desktop for emphasis */}
        <div className="lg:col-span-2 border border-border bg-card backdrop-blur-sm p-5 sm:p-7 rounded-2xl shadow-sm hover:shadow-md hover:border-success/30 transition-all relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 100% 0%, color-mix(in oklch, var(--success) 15%, transparent), transparent 70%)",
            }}
          />
          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] sm:text-xs text-muted-foreground mb-2 font-medium uppercase tracking-[0.12em]">
                Total Portfolio Value
              </div>
              {isLoadingOnChain || isLoadingBalance || isLoadingFanTokens ? (
                <div className="h-10 sm:h-12 w-40 bg-muted rounded animate-pulse mb-2" />
              ) : (
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-mono text-3xl sm:text-5xl font-bold text-foreground tabular-nums leading-none">
                    {totalValue > 0 ? totalValue.toFixed(2) : "0.00"}
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-muted-foreground">CHZ</span>
                </div>
              )}
              <div className="mt-2 sm:mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] sm:text-xs text-muted-foreground font-medium">
                <span><span className="text-foreground font-semibold tabular-nums">{portfolioStats.nftValue.toFixed(2)}</span> NFTs</span>
                <span className="text-border">·</span>
                <span><span className="text-foreground font-semibold tabular-nums">{chzValue.toFixed(2)}</span> CHZ</span>
                <span className="text-border">·</span>
                <span><span className="text-foreground font-semibold tabular-nums">{portfolioStats.fanTokenValue.toFixed(2)}</span> Tokens</span>
              </div>
            </div>
            <button
              onClick={() => setShowSharePortfolio(true)}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 hover:bg-muted px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
              title="Share portfolio"
            >
              <Share2 className="h-3 w-3" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Mobile: 2-col secondary stats / desktop: 2 separate cards */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:gap-4 lg:col-span-1">
          {/* CHZ Balance */}
          <div className="border border-border bg-card backdrop-blur-sm p-4 rounded-2xl hover:border-amber-500/20 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="text-[10px] sm:text-[11px] text-muted-foreground font-medium uppercase tracking-[0.12em]">
                CHZ Balance
              </div>
              <Coins className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            </div>
            {isLoadingBalance ? (
              <div className="h-7 w-16 bg-muted rounded animate-pulse" />
            ) : (
              <div className="text-xl sm:text-2xl font-bold text-foreground tabular-nums leading-tight">
                {chzValue > 0 ? chzValue.toFixed(2) : "0"}
              </div>
            )}
            <div className="text-[10px] text-muted-foreground mt-0.5">Native</div>
          </div>

          {/* Active NFTs */}
          <div className="border border-border bg-card backdrop-blur-sm p-4 rounded-2xl hover:border-blue-500/20 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="text-[10px] sm:text-[11px] text-muted-foreground font-medium uppercase tracking-[0.12em]">
                Active NFTs
              </div>
              <Layers className="h-3.5 w-3.5 text-blue-400 shrink-0" />
            </div>
            {isLoadingOnChain ? (
              <div className="h-7 w-10 bg-muted rounded animate-pulse" />
            ) : (
              <div className="text-xl sm:text-2xl font-bold text-foreground tabular-nums leading-tight">
                {activeNFTs}
              </div>
            )}
            <div className="text-[10px] text-muted-foreground mt-0.5">Positions</div>
          </div>
        </div>

        {/* Chain Status — full width on mobile spanning both cols */}
        <div className="border border-border bg-card backdrop-blur-sm p-4 rounded-2xl hover:border-success/20 transition-all">
          <div className="flex items-start justify-between mb-2">
            <div className="text-[10px] sm:text-[11px] text-muted-foreground font-medium uppercase tracking-[0.12em]">
              Chain Status
            </div>
            <Hash className="h-3.5 w-3.5 text-success shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-success leading-tight">Chiliz</div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
            </span>
            Chain ID 88888
          </div>
        </div>
      </div>

      {/* NFT Positions Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">My NFT Positions</h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">
              {isLoadingOnChain
                ? "Reading from Chiliz Mainnet..."
                : `${holdings.length} position${holdings.length !== 1 ? "s" : ""} on-chain`}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            className="border-border bg-card text-muted-foreground hover:text-foreground shrink-0"
          >
            Refresh
          </Button>
        </div>

        {/* Loading skeletons */}
        {isLoadingOnChain && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NFTCardSkeleton />
            <NFTCardSkeleton />
          </div>
        )}

        {/* Real holdings */}
        {!isLoadingOnChain && holdings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {holdings.map((h) => (
              <NFTPositionCard
                key={h.tokenId.toString()}
                holding={h}
                tokenPrices={tokenPrices}
                onSell={handleSell}
                onBuy={handleBuyMore}
                walletAddress={address}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoadingOnChain && !hasPositions && (
          <div className="border border-border border-dashed bg-card/50 rounded-2xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted border border-border mb-4">
              <Layers className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No positions yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Buy your first FanIndex NFT below to start tracking your on-chain portfolio.
            </p>
          </div>
        )}
      </div>

      {/* Fan Tokens Section */}
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Fan Tokens</h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">
              {isLoadingFanTokens
                ? "Reading balances from Chiliz..."
                : `${userFanTokens.length} token${userFanTokens.length !== 1 ? "s" : ""} in wallet`}
            </p>
          </div>
        </div>

        {/* Loading skeletons */}
        {isLoadingFanTokens && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FanTokenCardSkeleton />
            <FanTokenCardSkeleton />
            <FanTokenCardSkeleton />
          </div>
        )}

        {/* Fan tokens with balance */}
        {!isLoadingFanTokens && userFanTokens.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userFanTokens.map((token) => (
              <div
                key={token.symbol}
                className="border border-border bg-card rounded-xl p-4 hover:border-pink-500/30 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  {token.icon ? (
                    <img
                      src={token.icon}
                      alt={token.symbol}
                      className="w-10 h-10 rounded-full object-contain"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                      <Coins className="h-5 w-5 text-pink-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{token.symbol}</span>
                      <span className="text-xs text-muted-foreground truncate">{token.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {token.priceInCHZ.toFixed(4)} CHZ
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-foreground tabular-nums">
                      {token.balance.toFixed(2)}
                    </div>
                    <div className="text-xs text-success tabular-nums">
                      {token.valueInCHZ.toFixed(2)} CHZ
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoadingFanTokens && userFanTokens.length === 0 && (
          <div className="border border-border border-dashed bg-card/50 rounded-2xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted border border-border mb-4">
              <Coins className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No fan tokens yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              You don&apos;t have any fan tokens in your wallet. Visit the Fan Tokens page to explore available tokens.
            </p>
          </div>
        )}
      </div>

      {/* Allocation chart (only when positions exist) */}
      {allocationItems.length > 0 && (
        <PortfolioAllocation
          items={allocationItems}
          totalValue={portfolioStats.totalValue}
        />
      )}

      {/* Transaction History */}
      <TransactionHistory refetchPortfolio={refetch} onChainTxs={recentTxs} />

      {/* Available Indices */}
      <div>
        <div className="mb-5 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 sm:mb-2">Available Indices</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Invest in live on-chain indices on the Chiliz network
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {INDICES.filter((i) => DEPLOYED_INDICES.includes(i.id)).map((index) => (
            <AvailableIndexCard
              key={index.id}
              index={index}
              onBuy={() => setSelectedIndexToBuy(index)}
            />
          ))}
        </div>
      </div>

      {/* Dialogs */}
      {selectedIndexToBuy && (
        <BuyIndexDialog
          index={selectedIndexToBuy}
          open={!!selectedIndexToBuy}
          onOpenChange={() => setSelectedIndexToBuy(null)}
          onSuccess={() => handleTransactionSuccess("buy")}
        />
      )}

      {selectedPosition && (
        <RedeemDialog
          nftId={selectedPosition.nftId}
          indexId={selectedPosition.indexId}
          indexName={selectedPosition.indexName}
          tokenRows={selectedPosition.tokenRows}
          totalValueCHZ={selectedPosition.totalValueCHZ}
          open={!!selectedPosition}
          onOpenChange={() => setSelectedPosition(null)}
          onSuccess={() => handleTransactionSuccess("sell", selectedPosition?.nftId)}
        />
      )}

      <ShareCardModal
        open={showSharePortfolio}
        onOpenChange={setShowSharePortfolio}
        walletAddress={address}
        data={{
          type: "portfolio",
          totalValue: portfolioStats.totalValue,
          nftValue: portfolioStats.totalValue - portfolioStats.chzValue - (userFanTokens.reduce((s, t) => s + t.valueInCHZ, 0)),
          chzBalance: portfolioStats.chzValue,
          fanTokensValue: userFanTokens.reduce((s, t) => s + t.valueInCHZ, 0),
          positionsCount: holdings.length,
        }}
      />
    </div>
  )
}
