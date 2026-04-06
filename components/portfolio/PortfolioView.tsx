"use client"

import { useAccount, useReadContracts } from "wagmi"
import { formatUnits } from "viem"
import { SimplePositionsNFTABI, EtfVaultABI, ETF_CONTRACTS } from "@/lib/contracts/abis"
import { Button } from "@/components/ui/button"
import { TrendingUp, ShoppingCart, PieChart, DollarSign, Activity, TrendingDown, Sparkles, Wallet } from 'lucide-react'
import { useState, useEffect, useMemo, useCallback } from "react"
import { RedeemDialog } from "./RedeemDialog"
import { BuyIndexDialog } from "@/components/indices/BuyIndexDialog"
import type { IndexData } from "@/components/indices/IndexCard"
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { TransactionHistory } from "./TransactionHistory"
import { useDemoMode } from "@/lib/demo/DemoModeContext"
import { INDICES } from "@/lib/data/indices"
import { useTokenPrices } from "@/lib/hooks/use-token-prices"
import { getTokenByAddress } from "@/lib/data/fan-tokens"
import { useCoinGeckoPrices } from "@/lib/hooks/use-coingecko-prices"
import { getTokenPrice } from "@/lib/data/indices"

const CHART_COLORS = {
  weighted: "#3b82f6",
  equal: "#a855f7",
  managed: "#10b981",
}

const DEPLOYED_INDICES = ["2", "3", "4"] // Premier League, Serie A, La Liga

export function PortfolioView() {
  const { address, isConnected } = useAccount()
  const [selectedPosition, setSelectedPosition] = useState<{
    nftId: string
    indexId: string
    indexName: string
    units: number
    price: number
  } | null>(null)
  const [selectedIndexToBuy, setSelectedIndexToBuy] = useState<IndexData | null>(null)
  const [performancePeriod, setPerformancePeriod] = useState<"24h" | "7d" | "30d" | "90d">("30d")

  const { isDemoMode, demoPositions, demoBalance } = useDemoMode()

  const { prices: liveTokenPrices } = useCoinGeckoPrices()

  const generatePortfolioPerformance = useCallback((days: number) => {
    const data = []
    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000
    const startValue = 1.2 * 0.85

    for (let i = days; i >= 0; i--) {
      const date = new Date(now - i * dayMs)
      const progress = (days - i) / days
      const volatility = Math.sin(progress * Math.PI * 4) * 0.05
      const trend = progress * 0.15
      const value = startValue * (1 + trend + volatility)

      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: Number(value.toFixed(2)),
      })
    }
    return data
  }, [])

  const periodDays = { "24h": 1, "7d": 7, "30d": 30, "90d": 90 }
  const performanceData = useMemo(
    () => generatePortfolioPerformance(periodDays[performancePeriod]),
    [generatePortfolioPerformance, performancePeriod],
  )

  const nftContracts = useMemo(() => {
    if (!address || isDemoMode || !isConnected) return []
    return DEPLOYED_INDICES.map((indexId) => {
      const contracts = ETF_CONTRACTS[indexId as keyof typeof ETF_CONTRACTS]
      return {
        address: contracts.nft,
        abi: SimplePositionsNFTABI.abi,
        functionName: "tokensOf",
        args: [address],
      }
    })
  }, [address, isDemoMode, isConnected])

  const { data: tokenIdsData, isLoading: isLoadingTokens } = useReadContracts({
    contracts: nftContracts,
    query: {
      enabled: nftContracts.length > 0,
    },
  })

  const indexTokenIds = useMemo(() => {
    if (!tokenIdsData) return []
    return DEPLOYED_INDICES.map((indexId, i) => {
      const result = tokenIdsData[i]
      const tokenIds = result?.status === "success" ? (result.result as bigint[]) : []
      return {
        indexId,
        tokenIds,
      }
    })
  }, [tokenIdsData])

  const holdingsContracts = useMemo(() => {
    if (indexTokenIds.length === 0) return []
    return indexTokenIds.flatMap(({ indexId, tokenIds }) => {
      const contracts = ETF_CONTRACTS[indexId as keyof typeof ETF_CONTRACTS]
      return tokenIds.map((tokenId) => ({
        address: contracts.vault,
        abi: EtfVaultABI.abi,
        functionName: "getAllHoldings",
        args: [tokenId],
      }))
    })
  }, [indexTokenIds])

  const { data: holdingsData, isLoading: isLoadingHoldings } = useReadContracts({
    contracts: holdingsContracts,
    query: {
      enabled: holdingsContracts.length > 0,
    },
  })

  const blockchainPositions = useMemo(() => {
    if (isDemoMode || !isConnected || !holdingsData || indexTokenIds.length === 0) return []

    return indexTokenIds.flatMap(({ indexId, tokenIds }, indexIdx) => {
      const index = INDICES.find((i) => i.id === indexId)
      if (!index || tokenIds.length === 0) return []

      const startIdx = indexTokenIds.slice(0, indexIdx).reduce((sum, { tokenIds }) => sum + tokenIds.length, 0)

      return tokenIds
        .map((tokenId, i) => {
          const holdingResult = holdingsData[startIdx + i]
          let totalValueWei = BigInt(0)
          let tokenAddresses: string[] = []

          if (holdingResult?.status === "success") {
            const holdings = holdingResult.result as [string[], bigint[]]
            const [tokens, amounts] = holdings
            tokenAddresses = tokens
            totalValueWei = amounts.reduce((sum, amt) => sum + amt, BigInt(0))
          }

          const totalValueCHZ = Number(formatUnits(totalValueWei, 18))

          return {
            ...index,
            balance: 1,
            actualValue: totalValueCHZ,
            tokenId: tokenId.toString(),
            tokenAddresses,
          }
        })
        .filter((position) => position.actualValue > 0)
    })
  }, [isDemoMode, isConnected, holdingsData, indexTokenIds])

  const allTokenAddresses = useMemo(() => {
    const addresses = new Set<`0x${string}`>()
    blockchainPositions.forEach(position => {
      position.tokenAddresses?.forEach(addr => {
        if (addr && addr !== "0x0000000000000000000000000000000000000000") {
          addresses.add(addr as `0x${string}`)
        }
      })
    })
    console.log("[v0] Extracted token addresses from positions:", Array.from(addresses))
    return Array.from(addresses)
  }, [blockchainPositions])

  const tokenPrices = useTokenPrices(allTokenAddresses)

  const priceMap = useMemo(() => {
    const map = new Map<string, number>()
    tokenPrices.forEach(tp => {
      map.set(tp.address.toLowerCase(), tp.priceInCHZ)
      console.log("[v0] Price map entry:", tp.address, "->", tp.priceInCHZ, "CHZ")
    })
    return map
  }, [tokenPrices])

  const userPositions = useMemo(() => {
    if (isDemoMode) {
      return INDICES.filter((index) => DEPLOYED_INDICES.includes(index.id)).map((index) => {
        const demoPos = demoPositions.find((p) => p.indexId === index.id)
        return {
          ...index,
          balance: demoPos ? demoPos.units : 0,
        }
      })
    }

    if (blockchainPositions.length > 0) {
      return blockchainPositions
    }

    return INDICES.filter((index) => DEPLOYED_INDICES.includes(index.id)).map((index) => ({
      ...index,
      balance: 0,
    }))
  }, [isDemoMode, demoPositions, blockchainPositions])

  const portfolioStats = useMemo(() => {
    const totalPositions = userPositions.filter((p) => p.balance > 0).length

    const totalValue = isDemoMode
      ? userPositions.reduce((sum, p) => sum + p.balance * Number.parseFloat(p.price), 0)
      : blockchainPositions.reduce((sum, p) => {
          let positionValue = 0
          if (p.tokenAddresses && Array.isArray(p.tokenAddresses)) {
            p.tokenAddresses.forEach((addr) => {
              const livePrice = liveTokenPrices?.find(tp => tp.address.toLowerCase() === addr.toLowerCase())
              const price = livePrice && !livePrice.error ? livePrice.priceInCHZ : (priceMap.get(addr.toLowerCase()) || 0)
              if (price > 0) {
                positionValue += price
              }
            })
          }
          console.log("[v0] Position value (live):", p.name, positionValue, "CHZ")
          return sum + positionValue
        }, 0)

    const avgAPY =
      totalPositions > 0
        ? userPositions.filter((p) => p.balance > 0).reduce((sum, p) => sum + Number.parseFloat(p.apy), 0) /
          totalPositions
        : 0

    const nftCount = userPositions.reduce((sum, p) => sum + p.balance, 0)

    console.log("[v0] Portfolio stats:", { totalPositions, totalValue, avgAPY, nftCount })

    return { totalPositions, totalValue, avgAPY, nftCount }
  }, [userPositions, isDemoMode, blockchainPositions, priceMap, liveTokenPrices])

  const { totalPositions, totalValue, avgAPY, nftCount } = portfolioStats

  const chartData = useMemo(
    () =>
      userPositions
        .filter((p) => p.balance > 0)
        .map((p) => ({
          name: p.name,
          value: isDemoMode ? p.balance * Number.parseFloat(p.price) : p.actualValue || 0,
          type: p.type,
        })),
    [userPositions, isDemoMode],
  )

  const spotlightColors = {
    weighted: "#1e40af",
    equal: "#7c3aed",
    managed: "#10b981",
  }

  const typeColors = {
    weighted: "text-blue-400",
    equal: "text-purple-400",
    managed: "text-success",
  }

  const typeLabels = {
    weighted: "Weighted",
    equal: "Equal-Weight",
    managed: "Managed",
  }

  const firstValue = performanceData[0]?.value || totalValue
  const lastValue = performanceData[performanceData.length - 1]?.value || totalValue
  const performanceChange = ((lastValue - firstValue) / firstValue) * 100
  const isPositivePerformance = performanceChange >= 0
  const performanceColor = isPositivePerformance ? "#22c55e" : "#ef4444"

  const refetchTokens = () => {
    // Placeholder for refetchTokens logic
  }

  const refetchHoldings = () => {
    // Placeholder for refetchHoldings logic
  }

  useEffect(() => {
    if (!isDemoMode && isConnected) {
      refetchTokens()
      refetchHoldings()
    }
  }, [isDemoMode, isConnected])

  const handleTransactionSuccess = () => {
    // Refetch logic can be added here if needed
  }

  if (!isConnected && !isDemoMode) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto text-center space-y-6 p-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 border-2 border-success/20 mb-4">
            <Wallet className="h-10 w-10 text-success" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Connect Your Wallet</h2>
          <p className="text-lg text-muted-foreground">
            Connect your wallet to view your portfolio, track your positions, and manage your fan token investments.
          </p>
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Don't have a wallet yet? Try our demo mode to explore the platform.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 md:space-y-12">
      {isDemoMode && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <div>
              <h4 className="font-semibold text-foreground">Demo Mode Active</h4>
              <p className="text-sm text-muted-foreground">
                You're viewing a simulated portfolio. Balance:{" "}
                <span className="font-bold">{demoBalance.toFixed(2)} CHZ</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="border border-border bg-card backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-2 font-medium">Total Value</div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{totalValue.toFixed(0)} CHZ</div>
              <div
                className={`text-sm font-semibold flex items-center gap-1.5 ${isPositivePerformance ? "text-success" : "text-destructive"}`}
              >
                {isPositivePerformance ? <TrendingUp className="h-4 w-4 md:h-4 md:w-4 mr-1.5 md:mr-2" /> : <TrendingDown className="h-4 w-4 md:h-4 md:w-4 mr-1.5 md:mr-2" />}
                {isPositivePerformance ? "+" : ""}
                {performanceChange.toFixed(2)}% ({performancePeriod})
              </div>
            </div>
            <div className="p-3 rounded-xl bg-success/10 border border-success/20">
              <DollarSign className="h-6 w-6 text-success" />
            </div>
          </div>
        </div>

        <div className="border border-border bg-card backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-2 font-medium">Active Positions</div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{totalPositions}</div>
              <div className="text-sm text-muted-foreground">{INDICES.length} indices available</div>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <PieChart className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="border border-border bg-card backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-2 font-medium">Weighted APY</div>
              <div className="flex items-center gap-2 text-3xl md:text-4xl font-bold text-success mb-2">
                {avgAPY > 0 ? `${avgAPY.toFixed(1)}%` : "--"}
              </div>
              <div className="text-sm text-muted-foreground">Annual yield estimate</div>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="border border-border bg-card backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-2 font-medium">Unrealized P&L</div>
              <div
                className={`flex items-center gap-2 text-3xl md:text-4xl font-bold mb-2 ${isPositivePerformance ? "text-success" : "text-destructive"}`}
              >
                {isPositivePerformance ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                {isPositivePerformance ? "+" : ""}
                {(lastValue - firstValue).toFixed(0)} CHZ
              </div>
              <div className="text-sm text-muted-foreground">
                Since {performancePeriod === "24h" ? "yesterday" : performancePeriod}
              </div>
            </div>
            <div
              className={`p-3 rounded-xl ${isPositivePerformance ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"}`}
            >
              <Activity className={`h-6 w-6 ${isPositivePerformance ? "text-success" : "text-destructive"}`} />
            </div>
          </div>
        </div>
      </div>

      {totalPositions > 0 && (
        <div className="border border-border bg-card backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm">
          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Your Holdings</h3>
            <p className="text-base text-muted-foreground">
              {totalPositions} active position{totalPositions !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart Section */}
            <div className="flex flex-col">
              <h4 className="text-lg font-semibold text-foreground mb-4">Allocation Chart</h4>
              <div className="h-[300px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[entry.type as keyof typeof CHART_COLORS]} />
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
                      formatter={(value) => <span className="text-foreground text-xs md:text-sm">{value}</span>}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table Section */}
            <div className="flex flex-col">
              <h4 className="text-lg font-semibold text-foreground mb-4">Position Details</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-xs md:text-sm font-semibold text-muted-foreground">
                        Index
                      </th>
                      <th className="text-right py-3 px-2 text-xs md:text-sm font-semibold text-muted-foreground">
                        Balance
                      </th>
                      <th className="text-right py-3 px-2 text-xs md:text-sm font-semibold text-muted-foreground">
                        Value
                      </th>
                      <th className="text-right py-3 px-2 text-xs md:text-sm font-semibold text-muted-foreground">
                        Allocation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userPositions
                      .filter((p) => p.balance > 0)
                      .map((position) => {
                        const positionValue = isDemoMode
                          ? position.balance * Number.parseFloat(position.price)
                          : position.actualValue || 0
                        const allocation = totalValue > 0 ? (positionValue / totalValue) * 100 : 0
                        return (
                          <tr
                            key={position.id}
                            className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                          >
                            <td className="py-4 px-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full flex-shrink-0 ${position.type === "weighted" ? "bg-blue-500" : position.type === "equal" ? "bg-purple-500" : "bg-success"}`}
                                />
                                <span className="text-xs md:text-sm font-medium text-foreground text-balance leading-tight">
                                  {position.name}
                                </span>
                              </div>
                            </td>
                            <td className="text-right py-4 px-2 text-xs md:text-sm text-foreground font-medium">
                              {position.balance}
                            </td>
                            <td className="text-right py-4 px-2 text-xs md:text-sm font-semibold text-foreground">
                              {positionValue.toFixed(2)} CHZ
                            </td>
                            <td className="text-right py-4 px-2 text-xs md:text-sm text-muted-foreground font-medium">
                              {allocation.toFixed(1)}%
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <TransactionHistory />

      <div>
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">All Indices</h2>
          <p className="text-lg text-muted-foreground">Explore and invest in available indices</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPositions.map((position) => (
            <div
              key={position.id}
              className="relative h-full min-h-[420px] md:min-h-[480px] border border-border bg-card backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-80 dark:opacity-30">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dec77d7d-abd9-4ebc-9a9c-3b387c3f1a98-card.MP4.MP4"
                />
                <div className="absolute inset-0 bg-background/50 dark:bg-background/30" />
              </div>

              <div className="relative z-10 h-full flex flex-col">
                <div className="flex-1 flex flex-col">
                  <div className="mb-4 md:mb-6">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <div className="inline-flex items-center gap-2 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full border border-border text-xs font-semibold">
                        <span className={typeColors[position.type]}>{typeLabels[position.type]}</span>
                      </div>
                      <div
                        className={`text-xs md:text-sm font-bold px-2.5 md:px-3 py-1 md:py-1.5 rounded-full ${
                          position.balance > 0 ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {position.balance} owned
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 text-balance">{position.name}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {position.description}
                    </p>
                  </div>

                  <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-muted-foreground">Price</span>
                      <span className="text-foreground font-semibold">{position.price} CHZ</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-muted-foreground">APY</span>
                      <span className="text-success font-semibold">{position.apy}</span>
                    </div>
                    {position.balance > 0 && (
                      <div className="flex justify-between text-xs md:text-sm pt-2 border-t border-border">
                        <span className="text-muted-foreground">Your Value</span>
                        <span className="text-foreground font-bold">
                          {isDemoMode
                            ? (position.balance * Number.parseFloat(position.price)).toFixed(2)
                            : (position.actualValue || 0).toFixed(2)}{" "}
                          CHZ
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-2 font-medium">
                      Tokens ({position.tokens.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {position.tokens.slice(0, 4).map((token) => (
                        <span
                          key={token}
                          className="px-2 md:px-2.5 py-1 md:py-1.5 rounded-md bg-muted text-xs font-medium text-muted-foreground border border-border"
                        >
                          {token}
                        </span>
                      ))}
                      {position.tokens.length > 4 && (
                        <span className="px-2 md:px-2.5 py-1 md:py-1.5 rounded-md bg-muted text-xs font-medium text-muted-foreground border border-border">
                          +{position.tokens.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 md:gap-3 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border">
                  <Button
                    onClick={() => setSelectedIndexToBuy(position)}
                    className="flex-1 bg-success hover:bg-success/90 text-success-foreground font-semibold h-9 md:h-11 text-sm md:text-base"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 md:mr-2" />
                    Buy
                  </Button>
                  {position.balance > 0 && (
                    <Button
                      onClick={() => {
                        if (isDemoMode) {
                          const demoPos = demoPositions.find((p) => p.indexId === position.id)
                          setSelectedPosition({
                            nftId: position.id,
                            indexId: position.id,
                            indexName: position.name,
                            units: demoPos?.units || 0,
                            price: Number.parseFloat(position.price),
                          })
                        } else {
                          const blockchainPos = blockchainPositions.find((p) => p.id === position.id)
                          if (blockchainPos && "tokenId" in blockchainPos) {
                            const units = position.balance
                            setSelectedPosition({
                              nftId: blockchainPos.tokenId,
                              indexId: position.id,
                              indexName: position.name,
                              units,
                              price: Number.parseFloat(position.price),
                            })
                          }
                        }
                      }}
                      variant="outline"
                      className="flex-1 border-destructive/50 bg-card text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive h-9 md:h-11 text-sm md:text-base font-semibold transition-colors"
                    >
                      Sell
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
