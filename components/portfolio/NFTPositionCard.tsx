"use client"

import { formatUnits } from "viem"
import { Button } from "@/components/ui/button"
import { TrendingDown, Coins, ExternalLink } from "lucide-react"
import { OnChainBadge } from "./OnChainBadge"
import { getTokenByAddress } from "@/lib/data/fan-tokens"
import type { NFTHolding } from "@/lib/hooks/use-portfolio-onchain"

interface TokenPrice {
  address: string
  priceInCHZ: number
  isLoading: boolean
  error: boolean
}

interface NFTPositionCardProps {
  holding: NFTHolding
  tokenPrices: TokenPrice[]
  onSell: (holding: NFTHolding) => void
}

const VIDEO_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dec77d7d-abd9-4ebc-9a9c-3b387c3f1a98-card.MP4.MP4"

export function NFTPositionCard({ holding, tokenPrices, onSell }: NFTPositionCardProps) {
  const { tokenId, indexName, tokenAddresses, tokenAmounts } = holding

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

  const chiliscanUrl = `https://chiliscan.com/token/0x1cd2309fFdbc9A3a8819ED8b9E7979d1D725B9d9?a=${tokenId.toString()}`

  return (
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
            <div className="text-xs text-muted-foreground font-medium">Total Value</div>
            <div className="text-xl font-bold text-success tabular-nums">
              {hasLivePrices ? totalValueCHZ.toFixed(2) : "--"} CHZ
            </div>
          </div>
        </div>

        {/* Token breakdown */}
        <div className="rounded-xl bg-muted/40 border border-border/60 overflow-hidden">
          <div className="grid grid-cols-3 px-3 py-2 border-b border-border/60">
            <span className="text-xs font-semibold text-muted-foreground">Token</span>
            <span className="text-xs font-semibold text-muted-foreground text-right">Amount</span>
            <span className="text-xs font-semibold text-muted-foreground text-right">Value (CHZ)</span>
          </div>
          {tokenRows.map((row) => (
            <div
              key={row.addr}
              className="grid grid-cols-3 px-3 py-2.5 border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
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
                <span className="text-xs font-bold text-foreground font-mono truncate">
                  {row.symbol}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-foreground tabular-nums">
                  {row.amount > 0
                    ? row.amount < 0.001
                      ? row.amount.toExponential(2)
                      : row.amount.toFixed(4)
                    : "--"}
                </span>
              </div>
              <div className="text-right">
                <span className={`text-xs font-mono tabular-nums ${row.valueInCHZ > 0 ? "text-success" : "text-muted-foreground"}`}>
                  {row.valueInCHZ > 0 ? row.valueInCHZ.toFixed(3) : "--"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            onClick={() => onSell(holding)}
            variant="outline"
            size="sm"
            className="flex-1 border-destructive/40 bg-card text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive font-semibold transition-colors h-9"
          >
            <TrendingDown className="h-3.5 w-3.5 mr-1.5" />
            Sell Position
          </Button>
          <a
            href={chiliscanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-md border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border/80 transition-all"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Chiliscan</span>
          </a>
        </div>
      </div>
    </div>
  )
}
