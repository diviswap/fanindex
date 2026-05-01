"use client"

import { Button } from "@/components/ui/button"

import { TrendingUp, TrendingDown, Users, Share2, ArrowUpRight } from "lucide-react"
import { useState, useMemo } from "react"
import { BuyIndexDialog } from "./BuyIndexDialog"
import { ShareCardModal } from "@/components/share/ShareCardModal"
import Link from "next/link"
import { useReadContract } from "wagmi"
import { EtfVaultABI, getContractAddresses, hasDeployedContracts } from "@/lib/contracts/abis"
import { useCoinGeckoPrices } from "@/lib/hooks/use-coingecko-prices"
import { calculateIndexPrice } from "@/lib/data/indices"
import { getTokenBySymbol } from "@/lib/data/fan-tokens"
import Image from "next/image"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export interface IndexData {
  id: string
  name: string
  description: string
  type: "weighted" | "equal" | "managed"
  tokens: string[]
  /**
   * Optional target weights for each token (percentages, summing to 100).
   * Must be the same length as `tokens`. If omitted, the UI falls back to
   * equal-weight for display (live on-chain weights may still override).
   */
  weights?: number[]
  price: string
  apy: string
  totalValue: string
  holders: number
  /** Optional short ticker (e.g. "FTLX") rendered alongside the name */
  symbol?: string
}

interface IndexCardProps {
  index: IndexData
}

export function IndexCard({ index }: IndexCardProps) {
  const [showBuyDialog, setShowBuyDialog] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const { prices: liveTokenPrices } = useCoinGeckoPrices()

  // Build query string with weights so the history endpoint returns
  // a properly-weighted aggregate matching the canonical NAV formula.
  const weightsQuery =
    index.weights && index.weights.length === index.tokens.length
      ? `&weights=${index.weights.join(",")}`
      : ""

  // Dedicated 24h fetch (hourly granularity) — CoinGecko returns daily points
  // for days=90, so we can't slice that to 24h and get a real return.
  const { data: history24h } = useSWR(
    `/api/prices/history?tokens=${index.tokens.join(",")}&days=1${weightsQuery}`,
    fetcher,
    { refreshInterval: 300000, revalidateOnFocus: false, dedupingInterval: 60000 }
  )

  // 7d weighted history (daily granularity)
  const { data: history7d } = useSWR(
    `/api/prices/history?tokens=${index.tokens.join(",")}&days=7${weightsQuery}`,
    fetcher,
    { refreshInterval: 600000, revalidateOnFocus: false, dedupingInterval: 120000 }
  )

  // NAV: same calculation used on the home page — weighted average of the
  // current live token prices. This is the canonical "spot" NAV. We only
  // fall back to historical or static price when live prices haven't loaded.
  const navPrice = useMemo(() => {
    if (liveTokenPrices && liveTokenPrices.length > 0) {
      const nav = calculateIndexPrice(index.tokens, liveTokenPrices, index.weights)
      if (nav > 0) return nav
    }
    const data24h = history24h?.data
    if (data24h && data24h.length > 0) {
      return data24h[data24h.length - 1].price
    }
    return Number.parseFloat(index.price)
  }, [liveTokenPrices, history24h, index.tokens, index.weights, index.price])

  // 2 decimals to match the NAV format used on the home page
  const displayPrice = navPrice.toFixed(2)

  const return24h = useMemo(() => {
    const data = history24h?.data
    if (!data || data.length < 2) return null
    const first = data[0].price
    const last = data[data.length - 1].price
    if (!first || first === 0) return null
    return ((last - first) / first) * 100
  }, [history24h])

  const return7d = useMemo(() => {
    const data = history7d?.data
    if (!data || data.length < 2) return null
    const first = data[0].price
    const last = data[data.length - 1].price
    if (!first || first === 0) return null
    return ((last - first) / first) * 100
  }, [history7d])

  const contracts = getContractAddresses(index.id)
  const hasContracts = hasDeployedContracts(index.id)

  const { data: etfInfo } = useReadContract({
    address: contracts?.vault,
    abi: EtfVaultABI.abi,
    functionName: "getEtfInfo",
    query: {
      enabled: hasContracts && !!contracts,
      refetchInterval: 30000,
    },
  })

  const typeColors = {
    weighted: "text-blue-500",
    equal: "text-purple-500",
    managed: "text-success",
  }

  const typeBgColors = {
    weighted: "bg-blue-500/10 border-blue-500/20",
    equal: "bg-purple-500/10 border-purple-500/20",
    managed: "bg-success/10 border-success/20",
  }

  const typeLabels = {
    weighted: "Weighted",
    equal: "Equal-Weight",
    managed: "Managed",
  }

  return (
    <>
      <Link href={`/indices/${index.symbol ?? index.id}`} className="block h-full group">
          <div className="h-full min-h-[500px] border border-border bg-card/80 backdrop-blur-sm p-8 rounded-2xl cursor-pointer transition-all duration-300 hover:border-border/80 hover:shadow-xl hover:shadow-success/5 hover:-translate-y-1">
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex-1 flex flex-col">
                <div className="mb-8">
                  <div
                    className={`mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${typeBgColors[index.type]}`}
                  >
                    <span className={typeColors[index.type]}>{typeLabels[index.type]}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 text-balance group-hover:text-success transition-colors">
                    {index.name}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">{index.description}</p>
                </div>

                {/* NAV — large, primary metric (matches home) */}
                <div className="mb-6 pb-6 border-b border-border/60">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1.5 font-medium uppercase tracking-[0.14em]">
                        NAV
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-foreground tabular-nums">
                          {displayPrice}
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">CHZ</span>
                      </div>
                    </div>
                    {return24h !== null && (
                      <div
                        className={`flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                          return24h >= 0
                            ? "border-success/30 bg-success/10 text-success"
                            : "border-destructive/30 bg-destructive/10 text-destructive"
                        }`}
                      >
                        {return24h >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {return24h >= 0 ? "+" : ""}
                        {return24h.toFixed(2)}%
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-8 grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-1.5 font-medium uppercase tracking-[0.14em]">
                      24h
                    </div>
                    {return24h === null ? (
                      <div className="text-base font-bold text-muted-foreground">--</div>
                    ) : (
                      <div className={`text-base font-bold tabular-nums ${return24h >= 0 ? "text-success" : "text-destructive"}`}>
                        {return24h >= 0 ? "+" : ""}{return24h.toFixed(2)}%
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-1.5 font-medium uppercase tracking-[0.14em]">
                      7d
                    </div>
                    {return7d === null ? (
                      <div className="text-base font-bold text-muted-foreground">--</div>
                    ) : (
                      <div className={`text-base font-bold tabular-nums ${return7d >= 0 ? "text-success" : "text-destructive"}`}>
                        {return7d >= 0 ? "+" : ""}{return7d.toFixed(2)}%
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-1.5 font-medium uppercase tracking-[0.14em]">
                      Holders
                    </div>
                    <div className="flex items-center gap-1 text-base font-bold text-foreground tabular-nums">
                      <Users className="h-3.5 w-3.5" />
                      {index.holders}
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-[10px] text-muted-foreground mb-3 font-medium uppercase tracking-[0.14em]">
                    Asset Allocation ({index.tokens.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {index.tokens.slice(0, 5).map((symbol) => {
                      const tokenData = getTokenBySymbol(symbol)
                      return (
                        <span
                          key={symbol}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 text-sm font-semibold text-foreground border border-border"
                        >
                          {tokenData?.icon && (
                            <Image
                              src={tokenData.icon}
                              alt={symbol}
                              width={20}
                              height={20}
                              className="rounded-full"
                            />
                          )}
                          {symbol}
                        </span>
                      )
                    })}
                    {index.tokens.length > 5 && (
                      <span className="px-3 py-2 rounded-lg bg-muted/50 text-sm font-semibold text-muted-foreground border border-border">
                        +{index.tokens.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-8 border-t border-border">
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowBuyDialog(true)
                  }}
                  className="flex-1 bg-success hover:bg-success/90 text-success-foreground font-semibold h-12 text-base rounded-xl group/btn"
                >
                  <span>Invest Now</span>
                  <ArrowUpRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  className="border-border bg-card/50 text-foreground hover:bg-muted h-12 w-12 p-0 rounded-xl"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowShareModal(true)
                  }}
                  title="Share this index"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </Link>
      <BuyIndexDialog index={index} open={showBuyDialog} onOpenChange={setShowBuyDialog} livePrice={displayPrice} />
      <ShareCardModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        data={{ type: "index", index, livePrice: displayPrice }}
      />
    </>
  )
}
