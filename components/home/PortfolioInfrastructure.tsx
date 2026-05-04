"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Hash, Wallet, Activity, CheckCircle2 } from "lucide-react"
import { useMemo } from "react"
import { useCoinGeckoPrices } from "@/lib/hooks/use-coingecko-prices"
import { INDICES, calculateIndexPrice } from "@/lib/data/indices"
import { getTokenBySymbol } from "@/lib/data/fan-tokens"
import { useTranslations } from "next-intl"

const SHOWCASE_TICKERS = ["FTLX", "FELX", "FGMX"] as const

export function PortfolioInfrastructure() {
  const t = useTranslations("portfolio")
  const { prices: liveTokenPrices } = useCoinGeckoPrices()

  const positions = useMemo(() => {
    return SHOWCASE_TICKERS.map((ticker, i) => {
      const idx = INDICES.find((x) => x.symbol === ticker)
      if (!idx) return null
      const navNow = calculateIndexPrice(idx.tokens, liveTokenPrices, idx.weights)
      const entryNav = navNow * (1 - (i === 0 ? 0.087 : i === 1 ? 0.052 : 0.121))
      const units = i === 0 ? 1280 : i === 1 ? 540 : 920
      const value = navNow * units
      const cost = entryNav * units
      const pnl = value - cost
      const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0
      return {
        ticker,
        name: idx.name.split("—")[1]?.trim() ?? idx.name,
        units,
        navNow,
        entryNav,
        value,
        pnl,
        pnlPct,
        constituents: idx.tokens.length,
        tokens: idx.tokens,
        tokenId: 1024 + i * 137,
      }
    }).filter(Boolean) as Array<NonNullable<ReturnType<typeof Object>>>
  }, [liveTokenPrices])

  const portfolioValue = positions.reduce((s: number, p: any) => s + p.value, 0)
  const totalPnl = positions.reduce((s: number, p: any) => s + p.pnl, 0)
  const totalCost = positions.reduce((s: number, p: any) => s + (p.value - p.pnl), 0)
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0

  return (
    <section className="relative w-full border-b border-border/40 py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          {/* Left — copy */}
          <div className="lg:sticky lg:top-32">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-success">
              {t("label")}
            </span>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              {t("description")}
            </p>

            <ul className="mt-8 space-y-3.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-success" strokeWidth={1.75} />
                <span>{t("features.nft")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-success" strokeWidth={1.75} />
                <span>{t("features.nav")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-success" strokeWidth={1.75} />
                <span>{t("features.redeem")}</span>
              </li>
            </ul>

            <Link
              href="/portfolio"
              className="mt-10 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-success/40 hover:text-success"
            >
              {t("openPortfolio")}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Right — portfolio panel */}
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/30 backdrop-blur-sm">
            {/* Top metrics strip */}
            <div className="grid grid-cols-2 gap-px border-b border-border/60 bg-border/40 sm:grid-cols-4">
              <Metric icon={Wallet} label={t("metrics.value")} value={`${formatCompact(portfolioValue)} CHZ`} />
              <Metric
                icon={Activity}
                label={t("metrics.performance")}
                value={`${totalPnlPct >= 0 ? "+" : ""}${totalPnlPct.toFixed(2)}%`}
                tone={totalPnlPct >= 0 ? "positive" : "negative"}
              />
              <Metric icon={Hash} label={t("metrics.positions")} value={positions.length.toString()} />
              <Metric icon={ChainDot} label={t("metrics.chain")} value={t("metrics.mainnet")} tone="positive" />
            </div>

            {/* Position cards */}
            <div className="divide-y divide-border/50">
              {positions.map((p: any) => (
                <PositionRow key={p.ticker} position={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  tone?: "positive" | "negative"
}) {
  const toneClass =
    tone === "positive" ? "text-success" : tone === "negative" ? "text-destructive" : "text-foreground"
  return (
    <div className="bg-background/60 px-5 py-4">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-muted-foreground" />
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      </div>
      <div className={`mt-1.5 font-mono text-base font-semibold tracking-tight ${toneClass}`}>{value}</div>
    </div>
  )
}

function ChainDot({ className }: { className?: string }) {
  return (
    <span className={`relative inline-flex ${className}`}>
      <span className="h-2.5 w-2.5 rounded-full bg-success" />
      <span className="absolute inset-0 animate-ping rounded-full bg-success/60" />
    </span>
  )
}

function PositionRow({ position }: { position: any }) {
  const positive = position.pnl >= 0
  return (
    <div className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="flex items-center gap-4">
        <div className="flex shrink-0 -space-x-2">
          {position.tokens.slice(0, 3).map((sym: string) => {
            const t = getTokenBySymbol(sym)
            return (
              <div key={sym} className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card" title={sym}>
                {t?.icon ? (
                  <Image src={t.icon} alt={sym} width={28} height={28} className="rounded-full" />
                ) : (
                  <span className="text-[10px] font-semibold text-foreground">{sym}</span>
                )}
              </div>
            )
          })}
          {position.tokens.length > 3 && (
            <div className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-[10px] font-semibold text-muted-foreground">
              +{position.tokens.length - 3}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-foreground">{position.ticker}</span>
            <span className="rounded border border-border/70 bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              #{position.tokenId}
            </span>
          </div>
          <div className="mt-0.5 truncate text-xs text-muted-foreground">{position.name}</div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 font-mono text-[11px] text-muted-foreground">
            <span>{position.units.toLocaleString("en-US")} units</span>
            <span>·</span>
            <span>NAV {position.navNow.toFixed(2)} CHZ</span>
            <span>·</span>
            <span>{position.constituents} assets</span>
          </div>
        </div>
      </div>

      <div className="text-left sm:text-right">
        <div className="font-mono text-base font-semibold tracking-tight text-foreground">
          {formatCompact(position.value)} <span className="text-xs text-muted-foreground">CHZ</span>
        </div>
        <div className={`mt-1 font-mono text-xs ${positive ? "text-success" : "text-destructive"}`}>
          {positive ? "+" : ""}
          {position.pnl.toFixed(0)} CHZ ({positive ? "+" : ""}
          {position.pnlPct.toFixed(2)}%)
        </div>
      </div>
    </div>
  )
}

function formatCompact(n: number) {
  if (!isFinite(n) || n <= 0) return "0"
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`
  return n.toFixed(2)
}
