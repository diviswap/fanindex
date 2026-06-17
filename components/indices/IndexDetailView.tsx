"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Users, BarChart3, ArrowLeft, PieChart, Activity, Loader2, Clock } from 'lucide-react'
import { useState, useMemo } from "react"
import { BuyIndexDialog } from "./BuyIndexDialog"
import Link from "next/link"
import type { IndexData } from "./IndexCard"
import { IndexPriceChart } from "./IndexPriceChart"
import { getTokenBySymbol } from "@/lib/data/fan-tokens"
import { useIndexNav } from "@/lib/hooks/use-index-nav"
import { EtfVaultABI, getContractAddresses, hasDeployedContracts } from "@/lib/contracts/abis"
import { useActivePositionsForIndex } from "@/lib/hooks/use-active-positions"
import { useReadContract } from "wagmi"
import useSWR from "swr"
import { useTranslations } from "next-intl"
import { REBALANCE_HISTORY } from "@/lib/data/rebalance-history"

interface IndexDetailViewProps {
  index: IndexData
}

interface HistoricalDataPoint {
  timestamp: number
  date: string
  price: number
  volume: number
}

interface HistoryResponse {
  tokens: string[]
  days: number
  data: HistoricalDataPoint[]
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

// Slice the daily 90d dataset down to the requested period.
// Uses array slicing by index instead of Date.now() to avoid SSR/client hydration mismatch.
function sliceByDays(data: HistoricalDataPoint[], daysBack: number): HistoricalDataPoint[] {
  if (!data || data.length === 0) return []
  // daysBack is approximate: 2 for ~24h, 7 for ~7d, 30 for ~30d, 90 for full
  // Since data is daily granularity, use index-based slicing instead of Date.now()
  const pointsToTake = Math.min(daysBack + 1, data.length)
  return data.slice(-pointsToTake)
}

function returnFromSlice(slice: HistoricalDataPoint[]): number | null {
  if (slice.length < 2) return null
  const first = slice[0].price
  const last = slice[slice.length - 1].price
  if (!first) return null
  return ((last - first) / first) * 100
}

export function IndexDetailView({ index }: IndexDetailViewProps) {
  const t = useTranslations("indexDetail")
  const [showBuyDialog, setShowBuyDialog] = useState(false)
  const [timePeriod, setTimePeriod] = useState<"24h" | "7d" | "30d" | "90d">("30d")

  // Canonical NAV (shared with the cards on /indices and the home portfolio
  // panel) — this is the single source of truth for the displayed price.
  const { navPrice, displayPrice, livePrices: liveTokenPrices } = useIndexNav(index)

  // ── On-chain investors (activePositions) ──────────────────────────────
  const activePositions = useActivePositionsForIndex(index.id)

  // ── Dynamic fee from the on-chain vault ────────────────────────────────
  const contracts = getContractAddresses(index.id)
  const { data: feeBpsRaw } = useReadContract({
    address: contracts?.vault,
    abi: EtfVaultABI.abi,
    functionName: "buyFeeBps",
    query: {
      enabled: hasDeployedContracts(index.id),
      refetchInterval: 60000,
    },
  })
  const feeBps = typeof feeBpsRaw === "number"
    ? feeBpsRaw
    : typeof feeBpsRaw === "bigint"
      ? Number(feeBpsRaw)
      : 100
  const feePctLabel = `${(feeBps / 100).toFixed(feeBps % 10 === 0 ? 1 : 2)}%`

  // Pass per-token target weights (when defined) so the API returns a
  // properly weighted aggregate price — the same NAV formula used elsewhere.
  const weightsQuery =
    index.weights && index.weights.length === index.tokens.length
      ? `&weights=${index.weights.join(",")}`
      : ""

  // Single fetch for the full 90d daily dataset. All four time periods
  // (including "24h" which shows the last 2 days) are derived from this same
  // dataset using sliceByDays — identical logic, identical aggregation.
  const { data: history90dData, isLoading: historyLoading } = useSWR<HistoryResponse>(
    `/api/prices/history?tokens=${index.tokens.join(",")}&days=90${weightsQuery}`,
    fetcher,
    {
      refreshInterval: 300000,
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  // All four slices from the same dataset — same logic, same aggregation.
  // "24h" shows 2 days of daily points so there is always more than 1 point.
  const slices = useMemo(() => {
    const daily = history90dData?.data ?? []

    const anchorToNav = (arr: HistoricalDataPoint[]): HistoricalDataPoint[] => {
      if (arr.length === 0 || navPrice <= 0) return arr
      const last = arr[arr.length - 1].price
      if (!last || last <= 0) return arr
      const scale = navPrice / last
      if (Math.abs(scale - 1) < 1e-6) return arr
      return arr.map(p => ({ ...p, price: p.price * scale }))
    }

    const anchored = anchorToNav(daily)

    return {
      "24h": sliceByDays(anchored, 2),
      "7d":  sliceByDays(anchored, 7),
      "30d": sliceByDays(anchored, 30),
      "90d": sliceByDays(anchored, 90),
    }
  }, [history90dData, navPrice])

  // Chart uses the slice for the selected period
  const filteredData = slices[timePeriod]

  // Returns are derived from the exact same slices the chart uses
  const returns = useMemo(() => ({
    "24h": returnFromSlice(slices["24h"]),
    "7d":  returnFromSlice(slices["7d"]),
    "30d": returnFromSlice(slices["30d"]),
    "90d": returnFromSlice(slices["90d"]),
  }), [slices])

  // ── Live aggregate stats from CoinGecko prices ──────────────────────────
  const liveStats = useMemo(() => {
    if (!liveTokenPrices || liveTokenPrices.length === 0) return null

    const tokens = index.tokens
      .map(sym => liveTokenPrices.find(p => p.symbol === sym))
      .filter((t): t is NonNullable<typeof t> => !!t)

    if (tokens.length === 0) return null

    // Sum of constituent token market caps (proxy for index market cap)
    const totalMarketCap = tokens.reduce((s, t) => s + (t.marketCap ?? 0), 0)
    // Sum of 24h volumes
    const totalVolume = tokens.reduce((s, t) => s + (t.volume24h ?? 0), 0)

    // Volatility: std-dev of 7-day returns across tokens (annualised ≈ * √52)
    const weekly = tokens.map(t => t.change7d ?? 0)
    const mean = weekly.reduce((a, b) => a + b, 0) / weekly.length
    const variance = weekly.reduce((s, r) => s + Math.pow(r - mean, 2), 0) / weekly.length
    const weeklyStdDev = Math.sqrt(variance)
    const annualisedVol = weeklyStdDev * Math.sqrt(52) // annualise weekly vol

    return { totalMarketCap, totalVolume, annualisedVol }
  }, [liveTokenPrices, index.tokens])

  // Format dollar amounts compactly
  function fmtUSD(n: number): string {
    if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
    return `$${n.toFixed(0)}`
  }

  const firstPrice = filteredData[0]?.price || 0
  const lastPrice = filteredData[filteredData.length - 1]?.price || 0
  const priceChange = firstPrice > 0 ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0
  const isPositive = priceChange >= 0 || Number.isNaN(priceChange)
  const chartColor = isPositive ? "#22c55e" : "#ef4444" 
  const TrendIcon = isPositive ? TrendingUp : TrendingDown
  const trendColorClass = isPositive ? "text-success" : "text-destructive"

  // Adapt axis/tooltip precision to the price magnitude so small CHZ values
  // (e.g. 0.42) don't collapse to a single tick.
  const axisDecimals = lastPrice >= 100 ? 0 : lastPrice >= 10 ? 1 : lastPrice >= 1 ? 2 : 3
  const tooltipDecimals = Math.max(axisDecimals + 1, 2)

  const typeColors = {
    weighted: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    equal: "text-purple-400 bg-purple-400/10 border-purple-400/30",
    managed: "text-success bg-success/10 border-success/30",
  }

  const tIndex = useTranslations("indexCard")
  const typeLabels = {
    weighted: tIndex("weighted"),
    equal: tIndex("equalWeight"),
    managed: tIndex("managed"),
  }

  const tokensWithWeights = useMemo(() => {
    // Normalize target weights (if any) so they always sum to 100.
    const weightSum = (index.weights ?? []).reduce((s, w) => s + w, 0)
    const hasTargetWeights = !!index.weights && index.weights.length === index.tokens.length && weightSum > 0

    const priceOf = (symbol: string) =>
      liveTokenPrices?.find((p) => p.symbol === symbol)?.priceInCHZ ?? null

    // If the index has explicit target weights (e.g. FTLX), always use them —
    // these are the authoritative on-chain allocations, not a price-derived
    // estimate.
    if (hasTargetWeights) {
      return index.tokens
        .map((tokenSymbol, i) => ({
          tokenSymbol,
          weight: (index.weights![i] / weightSum) * 100,
          price: priceOf(tokenSymbol),
        }))
        .sort((a, b) => b.weight - a.weight)
    }

    if (!liveTokenPrices || liveTokenPrices.length === 0) {
      const equalWeight = 100 / index.tokens.length
      return index.tokens.map((tokenSymbol) => ({
        tokenSymbol,
        weight: equalWeight,
        price: null,
      }))
    }

    const tokensData = index.tokens
      .map((tokenSymbol) => ({ tokenSymbol, price: priceOf(tokenSymbol) }))
      .filter((t) => t.price !== null)

    const totalPrice = tokensData.reduce((sum, t) => sum + (t.price || 0), 0)

    if (totalPrice === 0 || tokensData.length === 0) {
      const equalWeight = 100 / index.tokens.length
      return index.tokens.map((tokenSymbol) => ({
        tokenSymbol,
        weight: equalWeight,
        price: priceOf(tokenSymbol),
      }))
    }

    if (index.type === "equal") {
      const equalWeight = 100 / tokensData.length
      return tokensData.map((t) => ({ ...t, weight: equalWeight }))
    }

    return tokensData
      .map((t) => ({ ...t, weight: ((t.price || 0) / totalPrice) * 100 }))
      .sort((a, b) => b.weight - a.weight)
  }, [liveTokenPrices, index.tokens, index.type, index.weights])

  // Helper to render return value
  const renderReturn = (value: number | null, label: string) => {
    if (value === null) {
      return (
        <div className="flex justify-between items-center">
          <div className="text-xs sm:text-sm text-muted-foreground font-medium">{label}</div>
          <div className="text-xs text-muted-foreground">--</div>
        </div>
      )
    }
    const isPos = value >= 0
    const Icon = isPos ? TrendingUp : TrendingDown
    const colorClass = isPos ? "text-success" : "text-destructive"
    
    return (
      <div className="flex justify-between items-center">
        <div className="text-xs sm:text-sm text-muted-foreground font-medium">{label}</div>
        <div className={`flex items-center gap-1 text-sm sm:text-base font-bold ${colorClass}`}>
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          {isPos ? "+" : ""}{value.toFixed(1)}%
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-4 sm:mb-6 md:mb-8">
        <Link href="/indices">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground hover:bg-accent mb-3 sm:mb-4 text-xs sm:text-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
            {t("backToIndices")}
          </Button>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
          <div className="flex-1">
            <div className="mb-2 sm:mb-3 inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full border border-border text-xs font-semibold">
              <span className={typeColors[index.type]}>{typeLabels[index.type]}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">
              {index.name}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {index.description}
            </p>

            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">{displayPrice} CHZ</div>
              <div className={`flex items-center gap-1 ${trendColorClass} text-base sm:text-lg font-semibold`}>
                <TrendIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>
                  {isPositive ? "+" : ""}
                  {Number.isNaN(priceChange) ? "0.0" : priceChange.toFixed(1)}%
                </span>
                <span className="text-muted-foreground text-xs sm:text-sm font-normal">{timePeriod}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setShowBuyDialog(true)}
            size="lg"
            className="w-full lg:w-auto bg-success hover:bg-success/90 text-black font-semibold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg"
          >
            {t("investInIndex")}
          </Button>
        </div>
      </div>

      {/* ── Institutional chart card ─────────────────────────────────────────── */}
      <Card className="border-border bg-card/60 backdrop-blur-sm mb-6 sm:mb-8 overflow-hidden">
        {/* Top toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">{t("pricePerformance")}</h2>
            {historyLoading && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            )}
            {/* Live badge */}
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-success/10 text-success border border-success/20">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Live
            </span>
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-0.5 bg-muted/40 rounded-lg p-1">
            {(["24h", "7d", "30d", "90d"] as const).map((period) => {
              const periodKey = `period${period}` as "period24h" | "period7d" | "period30d" | "period90d"
              const isActive = timePeriod === period
              return (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-card text-foreground shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(periodKey)}
                </button>
              )
            })}
          </div>
        </div>

        {/* Chart area */}
        <div className="h-[260px] sm:h-[360px] md:h-[420px] px-2 sm:px-3 pt-3 pb-2">
          <IndexPriceChart
            data={filteredData}
            isLoading={historyLoading}
            isPositive={isPositive}
            indexId={index.id}
            timePeriod={timePeriod}
            axisDecimals={axisDecimals}
            tooltipDecimals={tooltipDecimals}
          />
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-2.5 border-t border-border flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground font-medium">{t("dataFrom")}</span>
          <span className="text-[10px] text-muted-foreground">{t("updatedEvery")}</span>
        </div>
      </Card>

      {/* ── KPI metrics row (Token Terminal style) ───���──────────────────────── */}
      <Card className="border-border bg-card/60 backdrop-blur-sm mb-6 sm:mb-8 md:mb-12 overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-y sm:divide-y-0 divide-border">
          {/* Market Cap */}
          <div className="p-4 sm:p-5">
            <div className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-2">{t("marketCap")}</div>
            <div className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">
              {liveStats ? fmtUSD(liveStats.totalMarketCap) : index.totalValue}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">{t("combinedTokens")}</div>
          </div>

          {/* 90d Return */}
          <div className="p-4 sm:p-5">
            <div className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-2">{t("return90d")}</div>
            {returns["90d"] === null ? (
              <div className="text-xl sm:text-2xl font-bold text-muted-foreground">--</div>
            ) : (
              <div className={`flex items-center gap-1 text-xl sm:text-2xl font-bold tabular-nums ${returns["90d"] >= 0 ? "text-success" : "text-destructive"}`}>
                {returns["90d"] >= 0
                  ? <TrendingUp className="h-4 w-4 shrink-0" />
                  : <TrendingDown className="h-4 w-4 shrink-0" />
                }
                {returns["90d"] >= 0 ? "+" : ""}{returns["90d"].toFixed(1)}%
              </div>
            )}
            <div className="text-[10px] text-muted-foreground mt-1">{t("last90days")}</div>
          </div>

          {/* 24h Volume */}
          <div className="p-4 sm:p-5">
            <div className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-2">{t("volume24h")}</div>
            <div className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">
              {liveStats ? fmtUSD(liveStats.totalVolume) : "--"}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">{t("combinedTokens")}</div>
          </div>

          {/* Holders */}
          <div className="p-4 sm:p-5">
            <div className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-2">{t("investors")}</div>
            <div className="flex items-center gap-1.5 text-xl sm:text-2xl font-bold text-foreground tabular-nums">
              <Users className="h-4 w-4 text-muted-foreground shrink-0" />
              {activePositions !== null ? activePositions : "--"}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">{t("nftPositions")}</div>
          </div>

          {/* Volatility */}
          <div className="p-4 sm:p-5">
            <div className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mb-2">{t("volatility")}</div>
            <div className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">
              {liveStats ? `${liveStats.annualisedVol.toFixed(1)}%` : "--"}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">{t("annualized")}</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 border-border bg-card/60 backdrop-blur-sm p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t("assetAllocation")}</h2>
            <span className="ml-auto text-xs text-muted-foreground">
              {t("liveFromCoinGecko")}
            </span>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {tokensWithWeights.map(({ tokenSymbol, weight, price }, idx) => {
              const tokenData = getTokenBySymbol(tokenSymbol)

              return (
                <div key={`${tokenSymbol}-${idx}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {tokenData?.icon ? (
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden bg-card border border-border flex items-center justify-center">
                          <img
                            src={tokenData.icon || "/placeholder.svg"}
                            alt={tokenData.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-success/20 flex items-center justify-center">
                          <span className="text-success font-bold text-xs sm:text-sm">{tokenSymbol.slice(0, 3)}</span>
                        </div>
                      )}
                      <div>
                        <div className="text-foreground font-semibold text-sm sm:text-base">
                          {tokenData?.name || `${tokenSymbol} Fan Token`}
                        </div>
                        <div className="text-xs text-muted-foreground">{tokenSymbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-foreground font-semibold text-sm sm:text-base">{weight.toFixed(2)}%</div>
                      {price ? (
                        <div className="text-xs text-success font-medium">
                          {price.toFixed(2)} CHZ
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">{t("loading")}</div>
                      )}
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full transition-all" style={{ width: `${weight}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <div className="space-y-4 sm:space-y-6">
          <Card className="border-border bg-card/60 backdrop-blur-sm p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
              <h2 className="text-lg sm:text-xl font-bold text-foreground">{t("returns")}</h2>
              <span className="ml-auto text-xs text-muted-foreground">{t("live")}</span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {renderReturn(returns["24h"], t("return24h"))}
              {renderReturn(returns["7d"], t("return7d"))}
              {renderReturn(returns["30d"], t("return30d"))}
              {renderReturn(returns["90d"], t("return90d"))}
            </div>
          </Card>

          <Card className="border-border bg-card/60 backdrop-blur-sm p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
              <h2 className="text-lg sm:text-xl font-bold text-foreground">{t("indexDetails")}</h2>
            </div>

            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground font-medium">{t("strategy")}</span>
                <span className="text-foreground font-semibold">{typeLabels[index.type]}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground font-medium">{t("assets")}</span>
                <span className="text-foreground font-semibold">{index.tokens.length} {t("tokensLabel")}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground font-medium">{t("entryFee")}</span>
                <span className="text-foreground font-semibold">{feePctLabel}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground font-medium">{t("exitFee")}</span>
                <span className="text-foreground font-semibold">0%</span>
              </div>
              {index.type === "managed" && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground font-medium">{t("managementFee")}</span>
                  <span className="text-foreground font-semibold">2% {t("annually")}</span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground font-medium">{t("rebalancing")}</span>
                <span className="text-foreground font-semibold">{t("monthly")}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Rebalance History ────────────────────────────────────────────────── */}
      {(() => {
        const rebalanceEvents = REBALANCE_HISTORY.filter(event => event.index === index.id)
        if (rebalanceEvents.length === 0) return null

        return (
          <Card className="border-border bg-card/60 backdrop-blur-sm mb-6 sm:mb-8 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
              <h2 className="text-lg sm:text-xl font-bold text-foreground">{t("rebalanceHistory")}</h2>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {rebalanceEvents.map((event, idx) => (
                <div key={idx} className="pb-4 sm:pb-5 border-b border-border last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between mb-2 sm:mb-3 gap-3">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <p className="text-sm text-foreground">{event.change}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {event.tokens.map((token) => (
                      <div
                        key={token.symbol}
                        className="flex flex-col items-center p-2 rounded-lg bg-muted/20 border border-border/50"
                      >
                        <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                          {token.symbol}
                        </span>
                        <span className="text-sm font-bold text-foreground">{token.weight.toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )
      })()}

        <BuyIndexDialog index={index} open={showBuyDialog} onOpenChange={setShowBuyDialog} livePrice={displayPrice} />
    </>
  )
}
