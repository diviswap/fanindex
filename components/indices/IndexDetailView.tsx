"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Users, BarChart3, ArrowLeft, PieChart, Activity } from 'lucide-react'
import { useState, useMemo, useEffect } from "react"
import { BuyIndexDialog } from "./BuyIndexDialog"
import Link from "next/link"
import type { IndexData } from "./IndexCard"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getTokenBySymbol, getTokenByAddress } from "@/lib/data/fan-tokens"
import { useReadContract } from "wagmi"
import { EtfVaultABI, getContractAddresses, hasDeployedContracts } from "@/lib/contracts/abis"
import { formatUnits } from "viem"
import { useTokenPrices } from "@/lib/hooks/use-token-prices"
import { FANX_CONTRACTS } from "@/lib/contracts/fanx-router-abi"
import { useCoinGeckoPrices } from "@/lib/hooks/use-coingecko-prices"
import { calculateIndexPrice } from "@/lib/data/indices"

interface IndexDetailViewProps {
  index: IndexData
}

const generateHistoricalData = (basePrice: string) => {
  const price = Number.parseFloat(basePrice)
  const data = []
  const days = 90

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const variance = (Math.random() - 0.5) * 0.1
    const dayPrice = price * (1 + variance - (i / days) * 0.2)

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      price: Number.parseFloat(dayPrice.toFixed(2)),
      volume: Math.floor(Math.random() * 50000 + 10000),
    })
  }

  return data
}

export function IndexDetailView({ index }: IndexDetailViewProps) {
  const [showBuyDialog, setShowBuyDialog] = useState(false)
  const [timePeriod, setTimePeriod] = useState<"24h" | "7d" | "30d" | "90d">("90d")

  const { prices: liveTokenPrices } = useCoinGeckoPrices()

  const displayPrice = useMemo(() => {
    if (liveTokenPrices && liveTokenPrices.length > 0) {
      const price = calculateIndexPrice(index.tokens, liveTokenPrices)
      return price.toFixed(6)
    }
    return index.price
  }, [liveTokenPrices, index.tokens, index.price])

  const historicalData = useMemo(() => {
    return generateHistoricalData(displayPrice)
  }, [displayPrice])

  const getFilteredData = () => {
    const periodDays = {
      "24h": 1,
      "7d": 7,
      "30d": 30,
      "90d": 90,
    }
    const days = periodDays[timePeriod]
    return historicalData.slice(-days - 1) // +1 to include current day
  }

  const filteredData = getFilteredData()

  const firstPrice = filteredData[0]?.price || 0
  const lastPrice = filteredData[filteredData.length - 1]?.price || 0
  const priceChange = ((lastPrice - firstPrice) / firstPrice) * 100
  const isPositive = priceChange >= 0
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
    if (!liveTokenPrices || liveTokenPrices.length === 0) {
      // Fallback to equal weight
      const equalWeight = 100 / index.tokens.length
      return index.tokens.map((tokenSymbol) => ({
        tokenSymbol,
        weight: equalWeight,
        price: null,
      }))
    }

    // Calculate weights based on actual token prices from CoinGecko
    const tokensData = index.tokens
      .map((tokenSymbol) => {
        const priceData = liveTokenPrices.find((p) => p.symbol === tokenSymbol)
        return {
          tokenSymbol,
          price: priceData?.priceInChz || null,
        }
      })
      .filter((t) => t.price !== null)

    const totalPrice = tokensData.reduce((sum, t) => sum + (t.price || 0), 0)

    if (totalPrice === 0 || tokensData.length === 0) {
      const equalWeight = 100 / index.tokens.length
      return index.tokens.map((tokenSymbol) => ({
        tokenSymbol,
        weight: equalWeight,
        price: liveTokenPrices.find((p) => p.symbol === tokenSymbol)?.priceInChz || null,
      }))
    }

    // For equal weight indices, distribute equally
    if (index.type === "equal") {
      const equalWeight = 100 / tokensData.length
      return tokensData.map((t) => ({
        ...t,
        weight: equalWeight,
      }))
    }

    // For weighted indices, weight by market cap/price
    return tokensData
      .map((t) => ({
        ...t,
        weight: ((t.price || 0) / totalPrice) * 100,
      }))
      .sort((a, b) => b.weight - a.weight)
  }, [liveTokenPrices, index.tokens, index.type])

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
                  {priceChange.toFixed(1)}%
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

      <Card className="border-border bg-card/60 backdrop-blur-sm p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Price Performance</h2>
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-0">
            {(["24h", "7d", "30d", "90d"] as const).map((period) => (
              <Button
                key={period}
                variant={timePeriod === period ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimePeriod(period)}
                className={
                  timePeriod === period
                    ? "bg-success text-black hover:bg-success/90 text-xs sm:text-sm px-3 sm:px-4"
                    : "text-muted-foreground hover:text-foreground text-xs sm:text-sm px-3 sm:px-4"
                }
              >
                {period}
              </Button>
            ))}
          </div>
        </div>

        <ChartContainer
          config={{
            price: {
              label: "Price (CHZ)",
              color: chartColor,
            },
          }}
          className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id={`colorPrice-${isPositive ? "positive" : "negative"}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#colorPrice-${isPositive ? "positive" : "negative"})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-12">
        <Card className="border-border bg-card/60 backdrop-blur-sm p-3 sm:p-4 md:p-6">
          <div className="text-xs text-muted-foreground mb-1 sm:mb-2 font-medium">Market Cap</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{index.totalValue}</div>
        </Card>
        <Card className="border-border bg-card/60 backdrop-blur-sm p-3 sm:p-4 md:p-6">
          <div className="text-xs text-muted-foreground mb-1 sm:mb-2 font-medium">Annual Yield</div>
          <div className="flex items-center gap-1 text-lg sm:text-xl md:text-2xl font-bold text-success">
            <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
            {index.apy}
          </div>
        </Card>
        <Card className="border-border bg-card/60 backdrop-blur-sm p-3 sm:p-4 md:p-6">
          <div className="text-xs text-muted-foreground mb-1 sm:mb-2 font-medium">24h Volume</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">$2.4M</div>
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
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">12.4%</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Token Composition */}
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

        {/* Performance & Info */}
        <div className="space-y-4 sm:space-y-6">
          <Card className="border-border bg-card/60 backdrop-blur-sm p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
              <h2 className="text-lg sm:text-xl font-bold text-foreground">Returns</h2>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">24h</div>
                <div className="flex items-center gap-1 text-base sm:text-lg font-bold text-success">
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  +5.2%
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">7d</div>
                <div className="flex items-center gap-1 text-base sm:text-lg font-bold text-success">
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  +12.8%
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">30d</div>
                <div className="flex items-center gap-1 text-base sm:text-lg font-bold text-success">
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  +28.4%
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">YTD</div>
                <div className="flex items-center gap-1 text-base sm:text-lg font-bold text-success">
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  +142.7%
                </div>
              </div>
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

      <BuyIndexDialog index={index} open={showBuyDialog} onOpenChange={setShowBuyDialog} />
    </>
  )
}
