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
  price: string
  apy: string
  totalValue: string
  holders: number
}

interface IndexCardProps {
  index: IndexData
}

export function IndexCard({ index }: IndexCardProps) {
  const [showBuyDialog, setShowBuyDialog] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const { prices: liveTokenPrices } = useCoinGeckoPrices()

  // 90d fetch — same as detail view, then slice client-side for 24h
  // This ensures 24h return matches the detail chart exactly
  const { data: history90d } = useSWR(
    `/api/prices/history?tokens=${index.tokens.join(",")}&days=90`,
    fetcher,
    { refreshInterval: 600000, revalidateOnFocus: false, dedupingInterval: 120000 }
  )

  const displayPrice = useMemo(() => {
    if (liveTokenPrices && liveTokenPrices.length > 0) {
      return calculateIndexPrice(index.tokens, liveTokenPrices).toFixed(4)
    }
    const data = history90d?.data
    if (data && data.length > 0) {
      return data[data.length - 1].price.toFixed(4)
    }
    return Number.parseFloat(index.price).toFixed(4)
  }, [history90d, liveTokenPrices, index.tokens, index.price])

  // Slice to last 24h (same logic as IndexDetailView)
  const slice24h = useMemo(() => {
    const data = history90d?.data
    if (!data || data.length === 0) return []
    const cutoff = Date.now() - 1 * 24 * 60 * 60 * 1000
    const sliced = data.filter((d: { timestamp: number; date: string; price: number; volume: number }) => d.timestamp >= cutoff)
    return sliced.length > 1 ? sliced : data
  }, [history90d])

  const return24h = useMemo(() => {
    if (slice24h.length < 2) return null
    const first = slice24h[0].price
    const last = slice24h[slice24h.length - 1].price
    if (!first || first === 0) return null
    return ((last - first) / first) * 100
  }, [slice24h])

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
      <Link href={`/indices/${index.id}`} className="block h-full group">
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

                <div className="mb-8 grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Price</div>
                    <div className="text-xl font-bold text-foreground">{displayPrice} CHZ</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                      24h Return
                    </div>
                    {return24h === null ? (
                      <div className="text-xl font-bold text-muted-foreground">--</div>
                    ) : (
                      <div className={`flex items-center gap-1.5 text-xl font-bold ${return24h >= 0 ? "text-success" : "text-destructive"}`}>
                        {return24h >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                        {return24h >= 0 ? "+" : ""}{return24h.toFixed(2)}%
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                      Holders
                    </div>
                    <div className="flex items-center gap-1.5 text-xl font-bold text-foreground">
                      <Users className="h-5 w-5" />
                      {index.holders}
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
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
