"use client"

import { useAccount } from "wagmi"
import { formatUnits } from "viem"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  ShoppingCart,
  PieChart,
  Wallet,
  Sparkles,
  Layers,
  Hash,
} from "lucide-react"
import { useState, useMemo } from "react"
import { RedeemDialog } from "./RedeemDialog"
import { BuyIndexDialog } from "@/components/indices/BuyIndexDialog"
import type { IndexData } from "@/components/indices/IndexCard"
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { TransactionHistory } from "./TransactionHistory"
import { useDemoMode } from "@/lib/demo/DemoModeContext"
import { INDICES } from "@/lib/data/indices"
import { useTokenPrices } from "@/lib/hooks/use-token-prices"
import { useCoinGeckoPrices } from "@/lib/hooks/use-coingecko-prices"
import { usePortfolioOnchain, type NFTHolding } from "@/lib/hooks/use-portfolio-onchain"
import { NFTPositionCard } from "./NFTPositionCard"

// Only index "1" is deployed on Chiliz Mainnet
const DEPLOYED_INDICES = ["1"]

const CHART_COLORS = {
  weighted: "#3b82f6",
  equal: "#a855f7",
  managed: "#10b981",
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

// ─── Main component ───────────────────────────────────────────────────────────

export function PortfolioView() {
  const { address, isConnected } = useAccount()
  const { isDemoMode, demoPositions, demoBalance } = useDemoMode()

  const [selectedPosition, setSelectedPosition] = useState<{
    nftId: string
    indexId: string
    indexName: string
    units: number
    price: number
  } | null>(null)
  const [selectedIndexToBuy, setSelectedIndexToBuy] = useState<IndexData | null>(null)

  // ── On-chain reads (real mode only) ──────────────────────────────────────
  const { holdings, isLoading: isLoadingOnChain, refetch } = usePortfolioOnchain(
    address,
    isConnected && !isDemoMode
  )

  // ── Token prices for real holdings ───────────────────────────────────────
  const allTokenAddresses = useMemo(() => {
    const addrs = new Set<`0x${string}`>()
    holdings.forEach((h) =>
      h.tokenAddresses.forEach((a) => {
        if (a && a !== "0x0000000000000000000000000000000000000000")
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
    tokenPrices.forEach((tp) => map.set(tp.address.toLowerCase(), tp.priceInCHZ))
    // Prefer live CoinGecko prices where available
    liveTokenPrices?.forEach((lp) => {
      if (!lp.error && lp.priceInCHZ > 0)
        map.set(lp.address.toLowerCase(), lp.priceInCHZ)
    })
    return map
  }, [tokenPrices, liveTokenPrices])

  // ── Stats ────────────────────────────────────────────────────────────────
  const portfolioStats = useMemo(() => {
    if (isDemoMode) {
      const deployedPositions = INDICES.filter((i) => DEPLOYED_INDICES.includes(i.id)).map((i) => {
        const pos = demoPositions.find((p) => p.indexId === i.id)
        return { ...i, balance: pos ? pos.units : 0 }
      })
      const activePositions = deployedPositions.filter((p) => p.balance > 0)
      const totalValue = activePositions.reduce(
        (sum, p) => sum + p.balance * Number.parseFloat(p.price),
        0
      )
      const avgAPY =
        activePositions.length > 0
          ? activePositions.reduce((s, p) => s + Number.parseFloat(p.apy), 0) /
            activePositions.length
          : 0
      return { totalValue, activeNFTs: activePositions.length, avgAPY, totalPositions: activePositions.length }
    }

    const totalValue = holdings.reduce((sum, h) => {
      const posVal = h.tokenAddresses.reduce((s, addr, i) => {
        const amt = h.tokenAmounts[i] ? Number(formatUnits(h.tokenAmounts[i], 18)) : 0
        const price = priceMap.get(addr.toLowerCase()) ?? 0
        return s + amt * price
      }, 0)
      return sum + posVal
    }, 0)

    return {
      totalValue,
      activeNFTs: holdings.length,
      avgAPY: 0,
      totalPositions: holdings.length,
    }
  }, [isDemoMode, demoPositions, holdings, priceMap])

  // ── Chart data ───────────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    if (isDemoMode) {
      return INDICES.filter((i) => DEPLOYED_INDICES.includes(i.id))
        .map((i) => {
          const pos = demoPositions.find((p) => p.indexId === i.id)
          return {
            name: i.name,
            value: pos ? pos.units * Number.parseFloat(i.price) : 0,
            type: i.type,
          }
        })
        .filter((d) => d.value > 0)
    }
    return holdings.map((h) => {
      const val = h.tokenAddresses.reduce((s, addr, i) => {
        const amt = h.tokenAmounts[i] ? Number(formatUnits(h.tokenAmounts[i], 18)) : 0
        const price = priceMap.get(addr.toLowerCase()) ?? 0
        return s + amt * price
      }, 0)
      const idx = INDICES.find((idx) => idx.id === h.indexId)
      return { name: h.indexName, value: val, type: idx?.type ?? "equal" }
    })
  }, [isDemoMode, demoPositions, holdings, priceMap])

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSell = (holding: NFTHolding) => {
    const idx = INDICES.find((i) => i.id === holding.indexId)
    setSelectedPosition({
      nftId: holding.tokenId.toString(),
      indexId: holding.indexId,
      indexName: holding.indexName,
      units: 1,
      price: Number.parseFloat(idx?.price ?? "0"),
    })
  }

  const handleTransactionSuccess = () => {
    refetch()
  }

  // ── Not connected ────────────────────────────────────────────────────────
  if (!isConnected && !isDemoMode) {
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
          <p className="text-sm text-muted-foreground">
            {"Don't have a wallet yet? Try demo mode to explore the platform."}
          </p>
        </div>
      </div>
    )
  }

  const { totalValue, activeNFTs, avgAPY } = portfolioStats
  const hasPositions = isDemoMode
    ? demoPositions.some((p) => p.units > 0)
    : holdings.length > 0

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Demo mode banner */}
      {isDemoMode && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-purple-400 shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground">Demo Mode Active</h4>
              <p className="text-sm text-muted-foreground">
                {"You're viewing a simulated portfolio. Balance: "}
                <span className="font-bold text-foreground">{demoBalance.toFixed(2)} CHZ</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Value */}
        <div className="border border-border bg-card backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-success/20 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-2 font-medium">Total Value</div>
              {isLoadingOnChain && !isDemoMode ? (
                <div className="h-9 w-28 bg-muted rounded animate-pulse mb-2" />
              ) : (
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1 tabular-nums">
                  {totalValue > 0 ? totalValue.toFixed(0) : "0"} CHZ
                </div>
              )}
              <div className="text-xs text-muted-foreground font-medium">Live on-chain value</div>
            </div>
            <div className="p-3 rounded-xl bg-success/10 border border-success/20">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
          </div>
        </div>

        {/* Active NFTs */}
        <div className="border border-border bg-card backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/20 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-2 font-medium">Active NFTs</div>
              {isLoadingOnChain && !isDemoMode ? (
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

        {/* Indices */}
        <div className="border border-border bg-card backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-500/20 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-2 font-medium">Total Indices</div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1 tabular-nums">
                {INDICES.length}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                {DEPLOYED_INDICES.length} live on-chain
              </div>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <PieChart className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>

        {/* On-Chain Status */}
        <div className="border border-border bg-card backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-success/20 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-2 font-medium">Chain Status</div>
              <div className="text-2xl font-bold text-success mb-1">
                {isDemoMode ? "Demo" : "Chiliz"}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
                </span>
                {isDemoMode ? "Simulation" : "Chain ID 88888"}
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
              {isDemoMode
                ? "Demo positions — simulated on-chain state"
                : isLoadingOnChain
                ? "Reading from Chiliz Mainnet..."
                : `${holdings.length} position${holdings.length !== 1 ? "s" : ""} found on-chain`}
            </p>
          </div>
          {/* Refresh button (live mode only) */}
          {!isDemoMode && isConnected && (
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              className="border-border bg-card text-muted-foreground hover:text-foreground"
            >
              Refresh
            </Button>
          )}
        </div>

        {/* Loading skeletons */}
        {isLoadingOnChain && !isDemoMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NFTCardSkeleton />
            <NFTCardSkeleton />
          </div>
        )}

        {/* Real holdings (live mode) */}
        {!isDemoMode && !isLoadingOnChain && holdings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {holdings.map((h) => (
              <NFTPositionCard
                key={h.tokenId.toString()}
                holding={h}
                tokenPrices={tokenPrices}
                onSell={handleSell}
              />
            ))}
          </div>
        )}

        {/* Demo positions */}
        {isDemoMode && hasPositions && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INDICES.filter((i) => DEPLOYED_INDICES.includes(i.id)).map((idx) => {
              const pos = demoPositions.find((p) => p.indexId === idx.id)
              if (!pos || pos.units <= 0) return null
              return (
                <div
                  key={idx.id}
                  className="relative border border-border bg-card rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="absolute inset-0 opacity-20 dark:opacity-15 pointer-events-none">
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover"
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dec77d7d-abd9-4ebc-9a9c-3b387c3f1a98-card.MP4.MP4"
                    />
                    <div className="absolute inset-0 bg-background/60" />
                  </div>
                  <div className="relative z-10 p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border">
                            Demo
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-400">
                            <Sparkles className="h-3 w-3" />
                            Simulated
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-foreground">{idx.name}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Value</div>
                        <div className="text-xl font-bold text-success tabular-nums">
                          {(pos.units * Number.parseFloat(idx.price)).toFixed(2)} CHZ
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                      <span>{pos.units.toFixed(4)} units</span>
                      <span>{idx.price} CHZ/unit</span>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedPosition({
                          nftId: idx.id,
                          indexId: idx.id,
                          indexName: idx.name,
                          units: pos.units,
                          price: Number.parseFloat(idx.price),
                        })
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive font-semibold h-9"
                    >
                      Sell Position
                    </Button>
                  </div>
                </div>
              )
            })}
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
              {isDemoMode
                ? "Use demo balance below to buy your first index position."
                : "Buy your first FanIndex NFT below to start tracking your on-chain portfolio."}
            </p>
          </div>
        )}
      </div>

      {/* Allocation chart (only when positions exist) */}
      {hasPositions && chartData.length > 0 && (
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
      <TransactionHistory refetchPortfolio={refetch} />

      {/* Available Indices — only deployed ones */}
      <div>
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Available Indices</h2>
          <p className="text-lg text-muted-foreground">
            Invest in live on-chain indices on the Chiliz network
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDICES.filter((i) => DEPLOYED_INDICES.includes(i.id)).map((index) => (
            <div
              key={index.id}
              className="relative min-h-[380px] border border-border bg-card backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-success/20 transition-all duration-300 overflow-hidden"
            >
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
                      <span className="font-semibold text-foreground">{index.price} CHZ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. APY</span>
                      <span className="font-semibold text-success">{index.apy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Holders</span>
                      <span className="font-semibold text-foreground">{index.holders}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {index.tokens.map((token) => (
                      <span
                        key={token}
                        className="px-2 py-1 rounded-md bg-muted text-xs font-mono font-medium text-muted-foreground border border-border"
                      >
                        {token}
                      </span>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setSelectedIndexToBuy(index)}
                  className="w-full bg-success hover:bg-success/90 text-success-foreground font-semibold h-10"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buy Index
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialogs */}
      {selectedIndexToBuy && (
        <BuyIndexDialog
          index={selectedIndexToBuy}
          open={!!selectedIndexToBuy}
          onOpenChange={() => setSelectedIndexToBuy(null)}
          onSuccess={handleTransactionSuccess}
        />
      )}

      {selectedPosition && (
        <RedeemDialog
          nftId={selectedPosition.nftId}
          indexId={selectedPosition.indexId}
          indexName={selectedPosition.indexName}
          open={!!selectedPosition}
          onOpenChange={() => setSelectedPosition(null)}
          demoUnits={selectedPosition.units}
          demoPrice={selectedPosition.price}
          onSuccess={handleTransactionSuccess}
        />
      )}
    </div>
  )
}
