"use client"

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
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { TransactionHistory } from "./TransactionHistory"
import { INDICES, calculateIndexPrice } from "@/lib/data/indices"
import { getTokenByAddress, getTokenBySymbol, FAN_TOKENS } from "@/lib/data/fan-tokens"
import { useTokenPrices } from "@/lib/hooks/use-token-prices"
import { useCoinGeckoPrices } from "@/lib/hooks/use-coingecko-prices"
import { usePortfolioOnchain, type NFTHolding } from "@/lib/hooks/use-portfolio-onchain"
import { NFTPositionCard } from "./NFTPositionCard"
import Image from "next/image"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

// Only index "1" is deployed on Chiliz Mainnet
const DEPLOYED_INDICES = ["1"]

const CHART_COLORS = {
  weighted: "#3b82f6",
  equal: "#a855f7",
  managed: "#10b981",
  chz: "#f59e0b",
  fanTokens: "#ec4899",
}

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

  const { data: history24h } = useSWR(
    `/api/prices/history?tokens=${index.tokens.join(",")}&days=1`,
    fetcher,
    { refreshInterval: 300000, revalidateOnFocus: false, dedupingInterval: 60000 }
  )

  const displayPrice = useMemo(() => {
    if (liveTokenPrices && liveTokenPrices.length > 0) {
      return calculateIndexPrice(index.tokens, liveTokenPrices).toFixed(4)
    }
    const data = history24h?.data
    if (data && data.length > 0) {
      return data[data.length - 1].price.toFixed(4)
    }
    return Number.parseFloat(index.price).toFixed(4)
  }, [history24h, liveTokenPrices, index.tokens, index.price])

  const return24h = useMemo(() => {
    const data = history24h?.data
    if (!data || data.length < 2) return null
    const first = data[0].price
    const last = data[data.length - 1].price
    if (!first) return null
    return ((last - first) / first) * 100
  }, [history24h])

  return (
    <div className="relative min-h-[380px] border border-border bg-card backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-success/20 transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-80 dark:opacity-25">
        <video
          autoPlay loop muted playsInline
          className="w-full h-full object-cover"
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dec77d7d-abd9-4ebc-9a9c-3b387c3f1a98-card.MP4.MP4"
        />
        <div className="absolute inset-0 bg-background/50 dark:bg-background/30" />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border text-xs font-semibold ${typeColors[index.type]}`}
            >
              {typeLabels[index.type]}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-success/20 text-success border border-success/30">
              Live
            </span>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2 text-balance">
            {index.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {index.description}
          </p>
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price</span>
              <span className="font-semibold text-foreground">{displayPrice} CHZ</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">24h Return</span>
              {return24h === null ? (
                <span className="font-semibold text-muted-foreground">--</span>
              ) : (
                <span className={`flex items-center gap-1 font-semibold ${return24h >= 0 ? "text-success" : "text-destructive"}`}>
                  {return24h >= 0
                    ? <TrendingUp className="h-3.5 w-3.5" />
                    : <TrendingDown className="h-3.5 w-3.5" />}
                  {return24h >= 0 ? "+" : ""}{return24h.toFixed(2)}%
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Holders</span>
              <span className="font-semibold text-foreground">{index.holders}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {index.tokens.map((symbol) => {
              const tokenData = getTokenBySymbol(symbol)
              return (
                <span
                  key={symbol}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted text-xs font-mono font-medium text-muted-foreground border border-border"
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
          </div>
        </div>

        <Button
          onClick={onBuy}
          className="w-full bg-success hover:bg-success/90 text-success-foreground font-semibold h-10"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Buy Index
        </Button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PortfolioView() {
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

  // ── Chart data ────────────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    const data: { name: string; value: number; type: string }[] = []

    // Add CHZ balance
    if (portfolioStats.chzValue > 0) {
      data.push({ name: "CHZ Balance", value: portfolioStats.chzValue, type: "chz" })
    }

    // Add NFT positions
    holdings.forEach((h) => {
      const val = h.tokenAddresses.reduce((s, addr, i) => {
        if (!addr || typeof addr !== "string") return s
        const amt = h.tokenAmounts[i] ? Number(formatUnits(h.tokenAmounts[i], 18)) : 0
        const price = priceMap.get(addr.toLowerCase()) ?? 0
        return s + amt * price
      }, 0)
      if (val > 0) {
        const idx = INDICES.find((idx) => idx.id === h.indexId)
        data.push({ name: h.indexName, value: val, type: idx?.type ?? "equal" })
      }
    })

    return data
  }, [holdings, priceMap, portfolioStats.chzValue])

  // ── Handlers ──────────────────────────────────────────────────────────────
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
    <div className="space-y-8 md:space-y-12">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Value */}
        <div className="border border-border bg-card backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-success/20 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-2 font-medium">Total Value</div>
              {isLoadingOnChain || isLoadingBalance || isLoadingFanTokens ? (
                <div className="h-9 w-28 bg-muted rounded animate-pulse mb-2" />
              ) : (
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1 tabular-nums">
                  {totalValue > 0 ? totalValue.toFixed(2) : "0"} CHZ
                </div>
              )}
              <div className="text-xs text-muted-foreground font-medium">NFTs + CHZ + Tokens</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="p-3 rounded-xl bg-success/10 border border-success/20">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <button
                onClick={() => setShowSharePortfolio(true)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-success transition-colors font-medium"
                title="Share portfolio"
              >
                <Share2 className="h-3 w-3" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* CHZ Balance */}
        <div className="border border-border bg-card backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-500/20 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-2 font-medium">CHZ Balance</div>
              {isLoadingBalance ? (
                <div className="h-9 w-20 bg-muted rounded animate-pulse mb-2" />
              ) : (
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1 tabular-nums">
                  {chzValue > 0 ? chzValue.toFixed(2) : "0"}
                </div>
              )}
              <div className="text-xs text-muted-foreground font-medium">Native Chiliz</div>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Coins className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Active NFTs */}
        <div className="border border-border bg-card backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/20 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-2 font-medium">Active NFTs</div>
              {isLoadingOnChain ? (
                <div className="h-9 w-16 bg-muted rounded animate-pulse mb-2" />
              ) : (
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1 tabular-nums">
                  {activeNFTs}
                </div>
              )}
              <div className="text-xs text-muted-foreground font-medium">Position NFTs owned</div>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Layers className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        {/* On-Chain Status */}
        <div className="border border-border bg-card backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-success/20 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-2 font-medium">Chain Status</div>
              <div className="text-2xl font-bold text-success mb-1">Chiliz</div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
                </span>
                Chain ID 88888
              </div>
            </div>
            <div className="p-3 rounded-xl bg-success/10 border border-success/20">
              <Hash className="h-6 w-6 text-success" />
            </div>
          </div>
        </div>
      </div>

      {/* NFT Positions Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">My NFT Positions</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {isLoadingOnChain
                ? "Reading from Chiliz Mainnet..."
                : `${holdings.length} position${holdings.length !== 1 ? "s" : ""} found on-chain`}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            className="border-border bg-card text-muted-foreground hover:text-foreground"
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Fan Tokens</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {isLoadingFanTokens
                ? "Reading balances from Chiliz..."
                : `${userFanTokens.length} token${userFanTokens.length !== 1 ? "s" : ""} in your wallet`}
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
      {chartData.length > 0 && (
        <div className="border border-border bg-card backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm">
          <h3 className="text-xl font-bold text-foreground mb-6">Portfolio Allocation</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                  outerRadius={90}
                  dataKey="value"
                >
                  {chartData.map((entry, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={CHART_COLORS[entry.type as keyof typeof CHART_COLORS] ?? "#6b7280"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)} CHZ`, "Value"]}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px" }}
                  formatter={(value) => (
                    <span className="text-foreground text-xs">{value}</span>
                  )}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <TransactionHistory refetchPortfolio={refetch} onChainTxs={recentTxs} />

      {/* Available Indices */}
      <div>
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Available Indices</h2>
          <p className="text-lg text-muted-foreground">
            Invest in live on-chain indices on the Chiliz network
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
