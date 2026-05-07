"use client"

import { useMemo } from "react"
import useSWR from "swr"
import { useTranslations } from "next-intl"
import { TrendingUp, TrendingDown, Layers, Activity } from "lucide-react"
import type { IndexData } from "./IndexCard"

const fetcher = (url: string) => fetch(url).then(r => r.json())

interface MarketOverviewProps {
  indices: IndexData[]
}

interface PerIndexStats {
  id: string
  symbol: string
  return24h: number | null
}

/**
 * Aggregated market snapshot bar shown above the index grid.
 * Pulls 90d daily history for each deployed index in parallel and
 * derives 24h change from the last 2 days. Mirrors the per-card calc
 * exactly so totals are coherent with what the user sees below.
 */
export function MarketOverview({ indices }: MarketOverviewProps) {
  const t = useTranslations("marketOverview")
  // Build per-index stats by reading the same SWR cache the cards use.
  // Each index has its own SWR call here — when the cards mount they will
  // share the same cache key, so this is essentially free network-wise.
  const stats = indices.map((idx) => useIndex24h(idx))

  const aggregate = useMemo(() => {
    const valid = stats.filter((s): s is PerIndexStats & { return24h: number } => s.return24h !== null)
    if (valid.length === 0) {
      return { avg: null, top: null, bottom: null, gainers: 0, losers: 0 }
    }
    const sum = valid.reduce((s, v) => s + v.return24h, 0)
    const avg = sum / valid.length
    const sorted = [...valid].sort((a, b) => b.return24h - a.return24h)
    const top = sorted[0]
    const bottom = sorted[sorted.length - 1]
    const gainers = valid.filter(v => v.return24h >= 0).length
    const losers = valid.length - gainers
    return { avg, top, bottom, gainers, losers }
  }, [stats])

  const items: {
    label: string
    value: string
    sub?: string
    tone?: "success" | "destructive" | "neutral"
    icon: React.ComponentType<{ className?: string }>
  }[] = [
    {
      label: t("indicesLive"),
      value: indices.length.toString(),
      sub: t("indicesLiveSub", { up: aggregate.gainers ?? 0, down: aggregate.losers ?? 0 }),
      tone: "neutral",
      icon: Layers,
    },
    {
      label: t("avg24h"),
      value:
        aggregate.avg === null
          ? "—"
          : `${aggregate.avg >= 0 ? "+" : ""}${aggregate.avg.toFixed(2)}%`,
      sub: t("avg24hSub"),
      tone:
        aggregate.avg === null
          ? "neutral"
          : aggregate.avg >= 0
          ? "success"
          : "destructive",
      icon: Activity,
    },
    {
      label: t("top24h"),
      value: aggregate.top
        ? `+${aggregate.top.return24h.toFixed(2)}%`
        : "—",
      sub: aggregate.top?.symbol,
      tone: "success",
      icon: TrendingUp,
    },
    {
      label: t("worst24h"),
      value: aggregate.bottom
        ? `${aggregate.bottom.return24h >= 0 ? "+" : ""}${aggregate.bottom.return24h.toFixed(2)}%`
        : "—",
      sub: aggregate.bottom?.symbol,
      tone: aggregate.bottom && aggregate.bottom.return24h < 0 ? "destructive" : "neutral",
      icon: TrendingDown,
    },
  ]

  const toneClass = (t: typeof items[0]["tone"]) =>
    t === "success"
      ? "text-success"
      : t === "destructive"
      ? "text-destructive"
      : "text-foreground"

  return (
    <div className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40">
      {items.map(({ label, value, sub, tone, icon: Icon }) => (
        <div
          key={label}
          className="bg-card/60 backdrop-blur-sm p-4 sm:p-5 flex items-start justify-between gap-3"
        >
          <div className="min-w-0 flex-1">
            <div className="text-[10px] text-muted-foreground mb-1.5 font-medium uppercase tracking-[0.14em]">
              {label}
            </div>
            <div className={`text-xl sm:text-2xl font-bold tabular-nums leading-tight ${toneClass(tone)}`}>
              {value}
            </div>
            {sub && (
              <div className="mt-1 text-[11px] text-muted-foreground truncate">
                {sub}
              </div>
            )}
          </div>
          <div className="shrink-0 p-2 rounded-lg border border-border/60 bg-background/50">
            <Icon className={`h-3.5 w-3.5 ${toneClass(tone)}`} />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Hook used per-index. Reuses the same SWR cache key as IndexCard so no
 * extra network requests are made when both render.
 */
function useIndex24h(index: IndexData): PerIndexStats {
  const weightsQuery =
    index.weights && index.weights.length === index.tokens.length
      ? `&weights=${index.weights.join(",")}`
      : ""

  const { data } = useSWR(
    `/api/prices/history?tokens=${index.tokens.join(",")}&days=90${weightsQuery}`,
    fetcher,
    { refreshInterval: 300000, revalidateOnFocus: false, dedupingInterval: 60000 }
  )

  const return24h = useMemo(() => {
    const all: { price: number; timestamp: number }[] = data?.data ?? []
    if (all.length < 2) return null
    const cutoff = Date.now() - 2 * 24 * 60 * 60 * 1000
    const slice = all.filter(d => d.timestamp >= cutoff)
    if (slice.length < 2) return null
    const first = slice[0].price
    const last = slice[slice.length - 1].price
    if (!first) return null
    return ((last - first) / first) * 100
  }, [data])

  return { id: index.id, symbol: index.symbol ?? index.id, return24h }
}
