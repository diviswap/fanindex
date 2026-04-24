"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Users, BarChart3, ArrowLeft, PieChart, Activity, Loader2 } from 'lucide-react'
import { useState, useMemo } from "react"
import { BuyIndexDialog } from "./BuyIndexDialog"
import Link from "next/link"
import type { IndexData } from "./IndexCard"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { getTokenBySymbol } from "@/lib/data/fan-tokens"
import { useCoinGeckoPrices } from "@/lib/hooks/use-coingecko-prices"
import { calculateIndexPrice } from "@/lib/data/indices"
import useSWR from "swr"

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
// Returns the exact slice — no fallback to the full dataset.
function sliceByDays(data: HistoricalDataPoint[], daysBack: number): HistoricalDataPoint[] {
  if (!data || data.length === 0) return []
  const cutoff = Date.now() - daysBack * 24 * 60 * 60 * 1000
  return data.filter(d => d.timestamp >= cutoff)
}

function returnFromSlice(slice: HistoricalDataPoint[]): number | null {
  if (slice.length < 2) return null
  const first = slice[0].price
  const last = slice[slice.length - 1].price
  if (!first) return null
  return ((last - first) / first) * 100
}

export function IndexDetailView({ index }: IndexDetailViewProps) {
  const [showBuyDialog, setShowBuyDialog] = useState(false)
  const [timePeriod, setTimePeriod] = useState<"24h" | "7d" | "30d" | "90d">("30d")

  const { prices: liveTokenPrices } = useCoinGeckoPrices()

  // Two separate fetches:
  //  - 90d daily data (used for 7d/30d/90d slices)
  //  - 24h hourly data (API returns hourly points for days=1)
  // This is necessary because 90d data only has daily granularity — slicing it
  // to the last 24h would yield just 1 point and no chart line.
  const { data: history90dData, isLoading: history90dLoading } = useSWR<HistoryResponse>(
    `/api/prices/history?tokens=${index.tokens.join(",")}&days=90`,
    fetcher,
    {
      refreshInterval: 600000,
      revalidateOnFocus: false,
      dedupingInterval: 120000,
    }
  )

  const { data: history24hData, isLoading: history24hLoading } = useSWR<HistoryResponse>(
    `/api/prices/history?tokens=${index.tokens.join(",")}&days=1`,
    fetcher,
    {
      refreshInterval: 300000, // 5 min — more frequent for 24h view
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  // Show loader only when the currently-selected period is still loading
  const historyLoading =
    timePeriod === "24h" ? history24hLoading : history90dLoading

  // Price is derived from the chart dataset so it always matches the last point.
  // Prefer 24h (most recent hourly data) when available, fallback to 90d last daily,
  // then fallback to live token prices, then static index.price.
  const displayPrice = useMemo(() => {
    const data24h = history24hData?.data
    if (data24h && data24h.length > 0) {
      return data24h[data24h.length - 1].price.toFixed(4)
    }
    const data90d = history90dData?.data
    if (data90d && data90d.length > 0) {
      return data90d[data90d.length - 1].price.toFixed(4)
    }
    if (liveTokenPrices && liveTokenPrices.length > 0) {
      return calculateIndexPrice(index.tokens, liveTokenPrices).toFixed(4)
    }
    return Number.parseFloat(index.price).toFixed(4)
  }, [history24hData, history90dData, liveTokenPrices, index.tokens, index.price])

  // Pre-compute all four slices:
  //  - 24h uses its own hourly dataset
  //  - 7d/30d/90d are sliced from the 90d daily dataset
  //
  // IMPORTANT: 24h and 90d come from different CoinGecko endpoints with
  // different granularity, so their last points don't match. To keep a single
  // "current price" across all tabs, we replace the last daily point with the
  // most recent hourly point (which is the freshest price available).
  const slices = useMemo(() => {
    const daily = history90dData?.data ?? []
    const hourly = history24hData?.data ?? []

    // Most recent point from the 24h (hourly) dataset — this is the "now" price
    const latestHourly = hourly.length > 0 ? hourly[hourly.length - 1] : null

    // Replace the last point of the daily dataset with the latest hourly point
    // so 7d / 30d / 90d slices all end at the same price as 24h.
    const dailySynced =
      latestHourly && daily.length > 0
        ? [...daily.slice(0, -1), { ...daily[daily.length - 1], price: latestHourly.price }]
        : daily

    return {
      "24h": hourly,
      "7d":  sliceByDays(dailySynced, 7),
      "30d": sliceByDays(dailySynced, 30),
      "90d": sliceByDays(dailySynced, 90),
    }
  }, [history90dData, history24hData])

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

  const typeColors = {
    weighted: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    equal: "text-purple-400 bg-purple-400/10 border-purple-400/30",
    managed: "text-success bg-success/10 border-success/30",
  }

  const typeLabels = {
    weighted: "Weighted",
    equal: "Equal-Weight",
    managed: "Managed",
  }

  const tokensWithWeights = useMemo(() => {
    // ── 1. Explicit weights defined on the index take absolute priority ──
    // (e.g. FTLX has on-chain weights that should always be reflected in
    // the UI regardless of live prices).
    if (index.weights && index.weights.length === index.tokens.length) {
      return index.tokens
        .map((tokenSymbol, i) => {
          const priceData = liveTokenPrices?.find((p) => p.symbol === tokenSymbol)
          return {
            tokenSymbol,
            weight: index.weights![i],
            price: priceData?.priceInCHZ ?? null,
          }
        })
        .sort((a, b) => b.weight - a.weight)
    }

    // ── 2. No live prices yet: fall back to equal weighting ──
    if (!liveTokenPrices || liveTokenPrices.length === 0) {
      const equalWeight = 100 / index.tokens.length
      return index.tokens.map((tokenSymbol) => ({
        tokenSymbol,
        weight: equalWeight,
        price: null,
      }))
    }

    const tokensData = index.tokens
      .map((tokenSymbol) => {
        const priceData = liveTokenPrices.find((p) => p.symbol === tokenSymbol)
        return {
          tokenSymbol,
          price: priceData?.priceInCHZ || null,
        }
      })
      .filter((t) => t.price !== null)

    const totalPrice = tokensData.reduce((sum, t) => sum + (t.price || 0), 0)

    if (totalPrice === 0 || tokensData.length === 0) {
      const equalWeight = 100 / index.tokens.length
      return index.tokens.map((tokenSymbol) => ({
        tokenSymbol,
        weight: equalWeight,
        price: liveTokenPrices.find((p) => p.symbol === tokenSymbol)?.priceInCHZ || null,
      }))
    }

    if (index.type === "equal") {
      const equalWeight = 100 / tokensData.length
      return tokensData.map((t) => ({
        ...t,
        weight: equalWeight,
      }))
    }

    return tokensData
      .map((t) => ({
        ...t,
        weight: ((t.price || 0) / totalPrice) * 100,
      }))
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
            Back to Indices
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
            Invest in Index
          </Button>
        </div>
      </div>

      <Card className="border-border bg-card/60 backdrop-blur-sm p-3 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <h2 className="text-base sm:text-xl font-bold text-foreground">Price Performance</h2>
            {historyLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          <div className="flex gap-1 sm:gap-2">
            {(["24h", "7d", "30d", "90d"] as const).map((period) => (
              <Button
                key={period}
                variant={timePeriod === period ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimePeriod(period)}
                className={
                  timePeriod === period
                    ? "bg-success text-black hover:bg-success/90 text-xs px-2 sm:px-4 h-8"
                    : "text-muted-foreground hover:text-foreground text-xs px-2 sm:px-4 h-8"
                }
              >
                {period}
              </Button>
            ))}
          </div>
        </div>

        <div className="h-[200px] sm:h-[280px] md:h-[350px] lg:h-[400px] w-full -ml-2 sm:ml-0">
          {historyLoading && filteredData.length === 0 ? (
            <div className="h-full flex items-center justify-center ml-2 sm:ml-0">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm">Loading chart data...</span>
              </div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="h-full flex items-center justify-center ml-2 sm:ml-0">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Activity className="h-8 w-8" />
                <span className="text-sm">No data available</span>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={filteredData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={`colorPrice-${index.id}-${isPositive ? "pos" : "neg"}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={9} 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  interval="preserveStartEnd"
                  minTickGap={40}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => value.toFixed(1)}
                  width={40}
                  domain={['dataMin', 'dataMax']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600, marginBottom: '4px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number) => [`${value.toFixed(4)} CHZ`, 'Price']}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={chartColor}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#colorPrice-${index.id}-${isPositive ? "pos" : "neg"})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Data from CoinGecko</span>
          <span>Updated every 5 min</span>
        </div>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-12">
        <Card className="border-border bg-card/60 backdrop-blur-sm p-3 sm:p-4 md:p-6">
          <div className="text-xs text-muted-foreground mb-1 sm:mb-2 font-medium">Market Cap</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
            {liveStats ? fmtUSD(liveStats.totalMarketCap) : index.totalValue}
          </div>
          {liveStats && (
            <div className="text-xs text-muted-foreground mt-1">Combined tokens</div>
          )}
        </Card>
        <Card className="border-border bg-card/60 backdrop-blur-sm p-3 sm:p-4 md:p-6">
          <div className="text-xs text-muted-foreground mb-1 sm:mb-2 font-medium">90d Return</div>
          {returns["90d"] === null ? (
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-muted-foreground">--</div>
          ) : (
            <div className={`flex items-center gap-1 text-lg sm:text-xl md:text-2xl font-bold ${returns["90d"] >= 0 ? "text-success" : "text-destructive"}`}>
              {returns["90d"] >= 0
                ? <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                : <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              }
              {returns["90d"] >= 0 ? "+" : ""}{returns["90d"].toFixed(1)}%
            </div>
          )}
          <div className="text-xs text-muted-foreground mt-1">Last 90 days</div>
        </Card>
        <Card className="border-border bg-card/60 backdrop-blur-sm p-3 sm:p-4 md:p-6">
          <div className="text-xs text-muted-foreground mb-1 sm:mb-2 font-medium">24h Volume</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
            {liveStats ? fmtUSD(liveStats.totalVolume) : "--"}
          </div>
          {liveStats && (
            <div className="text-xs text-muted-foreground mt-1">Combined tokens</div>
          )}
        </Card>
        <Card className="border-border bg-card/60 backdrop-blur-sm p-3 sm:p-4 md:p-6">
          <div className="text-xs text-muted-foreground mb-1 sm:mb-2 font-medium">Investors</div>
          <div className="flex items-center gap-1 text-lg sm:text-xl md:text-2xl font-bold text-foreground">
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
            {index.holders}
          </div>
        </Card>
        <Card className="border-border bg-card/60 backdrop-blur-sm p-3 sm:p-4 md:p-6">
          <div className="text-xs text-muted-foreground mb-1 sm:mb-2 font-medium">Volatility</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
            {liveStats ? `${liveStats.annualisedVol.toFixed(1)}%` : "--"}
          </div>
          {liveStats && (
            <div className="text-xs text-muted-foreground mt-1">Annualised (7d σ)</div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 border-border bg-card/60 backdrop-blur-sm p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Asset Allocation</h2>
            <span className="ml-auto text-xs text-muted-foreground">
              Live from CoinGecko
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
                        <div className="text-xs text-muted-foreground">Loading...</div>
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
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Returns</h2>
              <span className="ml-auto text-xs text-muted-foreground">Live</span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {renderReturn(returns["24h"], "24h")}
              {renderReturn(returns["7d"], "7d")}
              {renderReturn(returns["30d"], "30d")}
              {renderReturn(returns["90d"], "90d")}
            </div>
          </Card>

          <Card className="border-border bg-card/60 backdrop-blur-sm p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Index Details</h2>
            </div>

            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground font-medium">Strategy</span>
                <span className="text-foreground font-semibold">{typeLabels[index.type]}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground font-medium">Assets</span>
                <span className="text-foreground font-semibold">{index.tokens.length} Tokens</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground font-medium">Entry Fee</span>
                <span className="text-foreground font-semibold">1%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground font-medium">Exit Fee</span>
                <span className="text-foreground font-semibold">0%</span>
              </div>
              {index.type === "managed" && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground font-medium">Management Fee</span>
                  <span className="text-foreground font-semibold">2% annually</span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground font-medium">Rebalancing</span>
                <span className="text-foreground font-semibold">Monthly</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

        <BuyIndexDialog index={index} open={showBuyDialog} onOpenChange={setShowBuyDialog} livePrice={displayPrice} />
    </>
  )
}
