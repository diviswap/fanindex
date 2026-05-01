"use client"

import { Button } from "@/components/ui/button"

import { TrendingUp, TrendingDown, Share2, ArrowUpRight } from "lucide-react"
import { useState, useMemo } from "react"
import { BuyIndexDialog } from "./BuyIndexDialog"
import { ShareCardModal } from "@/components/share/ShareCardModal"
import { Sparkline } from "@/components/ui/sparkline"
import Link from "next/link"
import { useReadContract } from "wagmi"
import { EtfVaultABI, getContractAddresses, hasDeployedContracts } from "@/lib/contracts/abis"
import { useIndexNav } from "@/lib/hooks/use-index-nav"
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

  // Canonical NAV — shared across the home portfolio panel, the cards on
  // /indices, and the /indices/{symbol} detail view. See `useIndexNav`.
  const { displayPrice } = useIndexNav(index)

  // Single 90d daily fetch — same dataset used by the detail view.
  // 24h and 7d returns are derived with sliceByDays, identical logic.
  const weightsQuery =
    index.weights && index.weights.length === index.tokens.length
      ? `&weights=${index.weights.join(",")}`
      : ""

  const { data: history90d } = useSWR(
    `/api/prices/history?tokens=${index.tokens.join(",")}&days=90${weightsQuery}`,
    fetcher,
    { refreshInterval: 300000, revalidateOnFocus: false, dedupingInterval: 60000 }
  )

  const returnFor = (daysBack: number): number | null => {
    const all: { price: number; timestamp: number }[] = history90d?.data ?? []
    if (all.length < 2) return null
    // Use array indexing instead of Date.now() filtering to avoid SSR/client hydration mismatch
    // daysBack is approximate: 2 for ~24h, 7 for ~7d, 90 for full 90d
    // Since data is daily granularity, use index-based slicing
    const pointsToSkip = Math.min(daysBack, all.length - 2)
    const startIdx = Math.max(0, all.length - pointsToSkip - 1)
    const slice = all.slice(startIdx)
    if (slice.length < 2) return null
    const first = slice[0].price
    const last = slice[slice.length - 1].price
    if (!first) return null
    return ((last - first) / first) * 100
  }

  const return24h = useMemo(() => returnFor(2), [history90d])
  const return7d  = useMemo(() => returnFor(7), [history90d])
  const return90d = useMemo(() => returnFor(90), [history90d])

  // 30-day sparkline data — use last ~30 points (daily granularity) instead of Date.now()
  // to avoid SSR/client hydration mismatch
  const sparkData = useMemo(() => {
    const all: { price: number; timestamp: number }[] = history90d?.data ?? []
    if (all.length < 2) return []
    return all.slice(-30)
  }, [history90d])

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
          <div className="h-full min-h-[560px] border border-border bg-card/80 backdrop-blur-sm p-5 sm:p-7 rounded-2xl cursor-pointer transition-all duration-300 hover:border-border/80 hover:shadow-xl hover:shadow-success/5 hover:-translate-y-1 flex flex-col">
            <div className="relative z-10 flex flex-col h-full gap-4">
              {/* Header — fixed height */}
              <div className="h-20">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {index.symbol && (
                        <span className="font-mono text-[11px] font-bold tracking-wider text-muted-foreground bg-muted/60 border border-border px-2 py-0.5 rounded">
                          {index.symbol}
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${typeBgColors[index.type]}`}
                      >
                        <span className={typeColors[index.type]}>{typeLabels[index.type]}</span>
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground text-balance group-hover:text-success transition-colors leading-tight">
                      {index.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* NAV section — fixed height */}
              <div className="h-16">
                <div className="text-[10px] text-muted-foreground mb-1 font-medium uppercase tracking-[0.14em]">
                  NAV
                </div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-foreground tabular-nums">
                    {displayPrice}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">CHZ</span>
                  {return24h !== null && (
                    <span
                      className={`ml-1 inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums ${
                        return24h >= 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      {return24h >= 0 ? (
                        <TrendingUp className="h-3.5 w-3.5" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5" />
                      )}
                      {return24h >= 0 ? "+" : ""}
                      {return24h.toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Sparkline — fixed height */}
              <div className="h-16 flex items-center">
                <Sparkline
                  data={sparkData}
                  color={
                    return90d !== null && return90d < 0
                      ? "var(--destructive)"
                      : "var(--success)"
                  }
                  height={56}
                  className="w-full"
                />
              </div>

              {/* Returns row — fixed height */}
              <div className="h-16 grid grid-cols-3 gap-2 rounded-xl border border-border/60 bg-muted/30 p-2">
                {[
                  { label: "24h", value: return24h },
                  { label: "7d", value: return7d },
                  { label: "90d", value: return90d },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center flex flex-col justify-center">
                    <div className="text-[9px] text-muted-foreground mb-0.5 font-medium uppercase tracking-[0.14em]">
                      {label}
                    </div>
                    {value === null ? (
                      <div className="text-sm font-bold text-muted-foreground">--</div>
                    ) : (
                      <div className={`text-sm font-bold tabular-nums ${value >= 0 ? "text-success" : "text-destructive"}`}>
                        {value >= 0 ? "+" : ""}{value.toFixed(2)}%
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Constituents — flex-grow to take remaining space */}
              <div className="flex-1 min-h-24 flex flex-col">
                <div className="text-[10px] text-muted-foreground mb-2 font-medium uppercase tracking-[0.14em]">
                  {index.tokens.length} Constituents
                </div>
                <div className="flex flex-wrap gap-1.5 content-start">
                  {index.tokens.slice(0, 5).map((symbol) => {
                    const tokenData = getTokenBySymbol(symbol)
                    return (
                      <span
                        key={symbol}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/60 text-xs font-semibold text-foreground border border-border"
                      >
                        {tokenData?.icon && (
                          <Image
                            src={tokenData.icon}
                            alt={symbol}
                            width={18}
                            height={18}
                            className="rounded-full"
                          />
                        )}
                        {symbol}
                      </span>
                    )
                  })}
                  {index.tokens.length > 5 && (
                    <span className="px-2 py-1 rounded-md bg-muted/60 text-xs font-semibold text-muted-foreground border border-border">
                      +{index.tokens.length - 5}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons — fixed height at bottom */}
              <div className="h-14 flex gap-2 pt-4 border-t border-border">
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowBuyDialog(true)
                  }}
                  className="flex-1 bg-success hover:bg-success/90 text-success-foreground font-semibold h-full text-sm rounded-xl group/btn"
                >
                  <span>Invest</span>
                  <ArrowUpRight className="h-3.5 w-3.5 ml-1.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  className="border-border bg-card/50 text-foreground hover:bg-muted h-full w-14 p-0 rounded-xl"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowShareModal(true)
                  }}
                  title="Share this index"
                >
                  <Share2 className="h-4 w-4" />
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
