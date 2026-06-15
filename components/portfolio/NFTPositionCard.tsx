"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { formatUnits } from "viem"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { TrendingDown, TrendingUp, Coins, ExternalLink, Share2 } from "lucide-react"
import { OnChainBadge } from "./OnChainBadge"
import { Sparkline } from "@/components/ui/sparkline"
import { getTokenByAddress, getTokenBySymbol } from "@/lib/data/fan-tokens"
import type { NFTHolding } from "@/lib/hooks/use-portfolio-onchain"
import type { TokenPrice } from "@/lib/hooks/use-token-prices"
import { ShareCardModal } from "@/components/share/ShareCardModal"
import { ETF_CONTRACTS } from "@/lib/contracts/abis"

interface NFTPositionCardProps {
  holding: NFTHolding
  tokenPrices: TokenPrice[]
  onSell: (holding: NFTHolding) => void
  onBuy?: (holding: NFTHolding) => void
  walletAddress?: string
}

const VIDEO_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dec77d7d-abd9-4ebc-9a9c-3b387c3f1a98-card.MP4.MP4"

export function NFTPositionCard({ holding, tokenPrices, onSell, onBuy, walletAddress }: NFTPositionCardProps) {
  const t = useTranslations("nftPositionCard")
  const { tokenId, indexName, tokenAddresses, tokenAmounts } = holding
  const [showShareModal, setShowShareModal] = useState(false)

  // Build per-token rows with live CHZ prices
  const tokenRows = tokenAddresses.map((addr, i) => {
    const token = getTokenByAddress(addr)
    const amount = tokenAmounts[i] ? Number(formatUnits(tokenAmounts[i], 18)) : 0
    const priceData = tokenPrices.find(
      (tp) => tp.address.toLowerCase() === addr.toLowerCase()
    )
    const priceInCHZ = priceData?.priceInCHZ ?? 0
    const valueInCHZ = amount * priceInCHZ

    return {
      addr,
      symbol: token?.symbol ?? addr.slice(0, 6) + "...",
      name: token?.name ?? "Unknown Token",
      icon: token?.icon,
      amount,
      priceInCHZ,
      valueInCHZ,
    }
  })

  const totalValueCHZ = tokenRows.reduce((sum, r) => sum + r.valueInCHZ, 0)
  const hasLivePrices = tokenRows.some((r) => r.priceInCHZ > 0)

  // Derive token symbols from addresses for history API
  const tokenSymbols = useMemo(
    () => tokenAddresses.map(addr => getTokenByAddress(addr)?.symbol).filter(Boolean).join(","),
    [tokenAddresses]
  )

  const { data: history90d } = useSWR(
    tokenSymbols ? `/api/prices/history?tokens=${tokenSymbols}&days=90` : null,
    (url: string) => fetch(url).then(r => r.json()),
    { refreshInterval: 600000, revalidateOnFocus: false, dedupingInterval: 120000 }
  )

  // Current price from chart (matches detail view) and 90d return
  const chartPrice = useMemo(() => {
    const data = history90d?.data
    if (!data || data.length === 0) return null
    return data[data.length - 1].price
  }, [history90d])

  const return90d = useMemo(() => {
    const data = history90d?.data
    if (!data || data.length < 2) return null
    const first = data[0].price
    const last = data[data.length - 1].price
    if (!first) return null
    return ((last - first) / first) * 100
  }, [history90d])

  // 30-day sparkline data — use array slice instead of Date.now() to avoid SSR mismatch
  const sparkData = useMemo(() => {
    const all: { price: number; timestamp: number }[] = history90d?.data ?? []
    if (all.length < 2) return []
    return all.slice(-30)
  }, [history90d])

  const nftAddress =
    ETF_CONTRACTS[holding.indexId as keyof typeof ETF_CONTRACTS]?.nft ??
    "0x1cd2309fFdbc9A3a8819ED8b9E7979d1D725B9d9"
  const chiliscanUrl = `https://chiliscan.com/token/${nftAddress}?a=${tokenId.toString()}`

  return (
    <>
    <div className="relative border border-border bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-success/30 transition-all duration-300 group">
      {/* Video background */}
      <div className="absolute inset-0 opacity-20 dark:opacity-15 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src={VIDEO_URL}
        />
        <div className="absolute inset-0 bg-background/60 dark:bg-background/40" />
      </div>

      {/* Inner glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: "inset 0 0 40px 0 rgba(34,197,94,0.06)" }}
      />

      <div className="relative z-10 p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border">
                #{tokenId.toString()}
              </span>
              <OnChainBadge tokenId={tokenId} />
            </div>
            <h3 className="text-base font-bold text-foreground leading-tight text-balance">
              {indexName}
            </h3>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="text-xs text-muted-foreground font-medium">{t("positionValue")}</div>
            <div className="text-xl font-bold text-foreground tabular-nums">
              {chartPrice !== null ? chartPrice.toFixed(4) : hasLivePrices ? totalValueCHZ.toFixed(2) : "--"} CHZ
            </div>
            {return90d !== null && (
              <div className={`flex items-center gap-1 text-xs font-semibold ${return90d >= 0 ? "text-success" : "text-destructive"}`}>
                {return90d >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {return90d >= 0 ? "+" : ""}{return90d.toFixed(1)}% 90d
              </div>
            )}
          </div>
        </div>

        {/* Live 30-day price sparkline */}
        {sparkData.length >= 2 && (
          <div className="rounded-xl border border-border/60 bg-muted/30 p-2">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("priceChart")}
              </span>
              {return90d !== null && (
                <span className={`text-[10px] font-bold tabular-nums ${return90d >= 0 ? "text-success" : "text-destructive"}`}>
                  {return90d >= 0 ? "+" : ""}{return90d.toFixed(2)}%
                </span>
              )}
            </div>
            <Sparkline
              data={sparkData}
              color={
                return90d !== null && return90d < 0
                  ? "var(--destructive)"
                  : "var(--success)"
              }
              height={36}
            />
          </div>
        )}

        {/* Token breakdown - Composition */}
        <div className="rounded-xl bg-muted/40 border border-border/60 overflow-hidden">
          <div className="px-3 py-2 border-b border-border/60 bg-muted/30">
            <span className="text-xs font-semibold text-muted-foreground">{t("composition")}</span>
          </div>
          <div className="divide-y divide-border/30">
            {tokenRows.map((row) => (
              <div
                key={row.addr}
                className="px-3 py-2.5 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  {row.icon ? (
                    <img
                      src={row.icon}
                      alt={row.symbol}
                      className="w-5 h-5 rounded-full object-contain shrink-0"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-success/20 border border-success/30 flex items-center justify-center shrink-0">
                      <Coins className="h-3 w-3 text-success" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-bold text-foreground">
                        {row.symbol}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {row.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pl-7 text-xs">
                  <span className="text-muted-foreground font-mono">
                    {row.addr.slice(0, 6)}...{row.addr.slice(-4)}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-foreground tabular-nums">
                      {row.amount > 0
                        ? row.amount < 0.001
                          ? row.amount.toExponential(2)
                          : row.amount.toFixed(4)
                        : "--"}
                    </span>
                    <span className={`font-mono tabular-nums ${row.valueInCHZ > 0 ? "text-success" : "text-muted-foreground"}`}>
                      {row.valueInCHZ > 0 ? `${row.valueInCHZ.toFixed(3)} CHZ` : "--"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-2 pt-1">
          {onBuy && (
            <Button
              onClick={() => onBuy(holding)}
              variant="outline"
              size="sm"
              className="flex-1 border-success/40 bg-card text-success hover:bg-success/10 hover:text-success hover:border-success font-semibold transition-colors h-9"
            >
              <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
              {t("buyMore")}
            </Button>
          )}
          <Button
            onClick={() => onSell(holding)}
            variant="outline"
            size="sm"
            className="flex-1 border-destructive/40 bg-card text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive font-semibold transition-colors h-9"
          >
            <TrendingDown className="h-3.5 w-3.5 mr-1.5" />
            {t("sell")}
          </Button>
          <Button
            onClick={() => setShowShareModal(true)}
            variant="outline"
            size="sm"
            className="border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted font-semibold transition-colors h-9 w-9 p-0"
            title={t("share")}
          >
            <Share2 className="h-3.5 w-3.5" />
          </Button>
          <a
            href={chiliscanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-md border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border/80 transition-all"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("view")}</span>
          </a>
        </div>
      </div>
    </div>
      <ShareCardModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        walletAddress={walletAddress}
        data={{
          type: "position",
          holding: {
            tokenId: holding.tokenId,
            indexName: holding.indexName,
          },
          totalValueCHZ,
          tokenRows,
        }}
      />
    </>
  )
}
