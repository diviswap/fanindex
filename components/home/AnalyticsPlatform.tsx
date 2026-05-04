"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, TrendingUp, TrendingDown, Activity } from "lucide-react"
import { useMemo } from "react"
import { useCoinGeckoPrices } from "@/lib/hooks/use-coingecko-prices"
import { useTranslations } from "next-intl"

function formatCompact(n: number) {
  if (!isFinite(n) || n <= 0) return "—"
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`
  return n.toFixed(2)
}

function formatPrice(n: number) {
  if (!isFinite(n) || n <= 0) return "—"
  if (n < 1) return n.toFixed(4)
  if (n < 100) return n.toFixed(2)
  return n.toFixed(2)
}

export function AnalyticsPlatform() {
  const t = useTranslations("analytics")
  const { tokens, chzPrice, isLoading } = useCoinGeckoPrices()

  const { rows, totals } = useMemo(() => {
    const top = [...tokens]
      .filter((t) => t.marketCap > 0)
      .sort((a, b) => b.marketCap - a.marketCap)
      .slice(0, 8)

    const totalMarketCapUSD = top.reduce((s, t) => s + t.marketCap, 0)
    const totalVol24hUSD = top.reduce((s, t) => s + t.volume24h, 0)

    const rows = top.map((t, i) => ({
      rank: i + 1,
      symbol: t.symbol,
      icon: t.icon,
      priceCHZ: t.priceInCHZ,
      change24h: t.change24h,
      marketCapUSD: t.marketCap,
      volume24hUSD: t.volume24h,
      shareOfTop: totalMarketCapUSD > 0 ? (t.marketCap / totalMarketCapUSD) * 100 : 0,
    }))

    return {
      rows,
      totals: {
        marketCap: totalMarketCapUSD,
        volume: totalVol24hUSD,
        chz: chzPrice ?? 0,
      },
    }
  }, [tokens, chzPrice])

  return (
    <section className="relative w-full border-b border-border/40 py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-success">
              {t("label")}
            </span>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
              {t("description")}
            </p>
          </div>
          <Link
            href="/fan-tokens"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-success/40 hover:text-success"
          >
            {t("openMarket")}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Terminal panel */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-border/70 bg-card/30 backdrop-blur-sm">
          {/* Header strip */}
          <div className="flex items-center justify-between border-b border-border/60 bg-background/40 px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {t("live")}
                </span>
              </div>
              <span className="hidden h-3 w-px bg-border sm:block" />
              <div className="hidden items-center gap-1.5 sm:flex">
                <Activity className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {t("feed")}
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {t("terminal")}
            </span>
          </div>

          {/* KPI band */}
          <div className="grid grid-cols-2 gap-px border-b border-border/60 bg-border/40 sm:grid-cols-4">
            <Kpi label={t("kpi.chzPrice")} value={totals.chz ? `$${totals.chz.toFixed(4)}` : "—"} />
            <Kpi label={t("kpi.marketCap")} value={totals.marketCap ? `$${formatCompact(totals.marketCap)}` : "—"} />
            <Kpi label={t("kpi.volume")} value={totals.volume ? `$${formatCompact(totals.volume)}` : "—"} />
            <Kpi label={t("kpi.tracked")} value={tokens.length ? String(tokens.length) : "—"} />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border/60 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  <th className="px-5 py-3 text-left font-medium">{t("table.rank")}</th>
                  <th className="px-5 py-3 text-left font-medium">{t("table.asset")}</th>
                  <th className="px-5 py-3 text-right font-medium">{t("table.price")}</th>
                  <th className="px-5 py-3 text-right font-medium">{t("table.change")}</th>
                  <th className="px-5 py-3 text-right font-medium">{t("table.marketCap")}</th>
                  <th className="px-5 py-3 text-right font-medium">{t("table.volume")}</th>
                  <th className="px-5 py-3 text-right font-medium">{t("table.share")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading || rows.length === 0
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="border-b border-border/40">
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-5 py-4">
                            <div className="h-3 w-16 animate-pulse rounded bg-muted/50 ml-auto" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : rows.map((row) => (
                      <tr
                        key={row.symbol}
                        className="border-b border-border/40 transition-colors hover:bg-card/40"
                      >
                        <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                          {row.rank.toString().padStart(2, "0")}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {row.icon ? (
                              <Image src={row.icon} alt={row.symbol} width={22} height={22} className="rounded-full" />
                            ) : (
                              <div className="h-[22px] w-[22px] rounded-full border border-border bg-muted" />
                            )}
                            <span className="font-mono text-sm font-semibold text-foreground">{row.symbol}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right font-mono text-sm text-foreground">
                          {formatPrice(row.priceCHZ)}
                        </td>
                        <td className={`px-5 py-4 text-right font-mono text-sm ${row.change24h >= 0 ? "text-success" : "text-destructive"}`}>
                          <span className="inline-flex items-center gap-1">
                            {row.change24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {row.change24h >= 0 ? "+" : ""}
                            {row.change24h.toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right font-mono text-sm text-foreground/90">
                          ${formatCompact(row.marketCapUSD)}
                        </td>
                        <td className="px-5 py-4 text-right font-mono text-sm text-foreground/70">
                          ${formatCompact(row.volume24hUSD)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <div className="h-1 w-16 overflow-hidden rounded-full bg-muted/40">
                              <div
                                className="h-full rounded-full bg-success/70"
                                style={{ width: `${Math.min(100, row.shareOfTop)}%` }}
                              />
                            </div>
                            <span className="w-10 text-right font-mono text-xs text-muted-foreground">
                              {row.shareOfTop.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background/60 px-5 py-4">
      <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-1.5 font-mono text-base font-semibold tracking-tight text-foreground">{value}</div>
    </div>
  )
}
