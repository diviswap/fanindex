"use client"

import { useMemo, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts"
import Image from "next/image"
import { Coins, Layers, Wallet } from "lucide-react"
import { useTranslations } from "next-intl"

export interface AllocationItem {
  /** Stable id used for keys */
  id: string
  /** Display name e.g. "FTLX", "CHZ Balance", "PSG" */
  name: string
  /** Optional small label shown under the name */
  sublabel?: string
  /** Value in CHZ */
  value: number
  /** Logical bucket — drives the color */
  category: "nft" | "chz" | "token"
  /** Optional token logo */
  icon?: string
}

interface PortfolioAllocationProps {
  items: AllocationItem[]
  totalValue: number
}

// Theme-aware palettes per category. Each category gets its own hue family,
// and constituents within the category get progressively lighter shades so
// adjacent slices are visually distinct without breaking the design system.
const CATEGORY_COLORS = {
  nft:   { icon: Layers, base: "#22c55e", shades: ["#22c55e", "#16a34a", "#15803d", "#166534", "#14532d"] },
  chz:   { icon: Coins,  base: "#f59e0b", shades: ["#f59e0b"] },
  token: { icon: Wallet, base: "#3b82f6", shades: ["#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a"] },
} as const

function formatCHZ(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`
  if (v >= 10_000) return `${(v / 1_000).toFixed(1)}k`
  return v.toFixed(2)
}

// Custom active sector — slightly enlarged on hover for emphasis
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="var(--background)"
        strokeWidth={2}
      />
    </g>
  )
}

export function PortfolioAllocation({ items, totalValue }: PortfolioAllocationProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const t = useTranslations("portfolioAllocationComponent")

  const CATEGORY_META = {
    nft:   { label: t("nftPositions"), icon: CATEGORY_COLORS.nft.icon, base: CATEGORY_COLORS.nft.base, shades: CATEGORY_COLORS.nft.shades },
    chz:   { label: t("chzBalance"),   icon: CATEGORY_COLORS.chz.icon, base: CATEGORY_COLORS.chz.base, shades: CATEGORY_COLORS.chz.shades },
    token: { label: t("fanTokens"),    icon: CATEGORY_COLORS.token.icon, base: CATEGORY_COLORS.token.base, shades: CATEGORY_COLORS.token.shades },
  }

  // Assign stable colors per item by giving each category its own shade scale.
  const enriched = useMemo(() => {
    // Track how many items per category we've seen so we can pick shades.
    const counters: Record<string, number> = { nft: 0, chz: 0, token: 0 }
    return items
      .filter((i) => i.value > 0)
      .sort((a, b) => b.value - a.value) // largest first
      .map((item) => {
        const meta = CATEGORY_COLORS[item.category]
        const idx = counters[item.category]++
        const color = meta.shades[idx % meta.shades.length]
        return { ...item, color }
      })
  }, [items])

  // Aggregate per category for the breakdown row
  const byCategory = useMemo(() => {
    const acc: Record<string, { value: number; count: number }> = {
      nft: { value: 0, count: 0 },
      chz: { value: 0, count: 0 },
      token: { value: 0, count: 0 },
    }
    enriched.forEach((i) => {
      acc[i.category].value += i.value
      acc[i.category].count += 1
    })
    return acc
  }, [enriched])

  if (enriched.length === 0 || totalValue <= 0) return null

  // What's shown in the donut center: hovered slice or total
  const centered =
    activeIdx !== null && enriched[activeIdx]
      ? {
          label: enriched[activeIdx].name,
          value: enriched[activeIdx].value,
          percent: (enriched[activeIdx].value / totalValue) * 100,
          color: enriched[activeIdx].color,
        }
      : {
          label: t("totalValue"),
          value: totalValue,
          percent: 100,
          color: "var(--success)",
        }

  return (
    <div className="border border-border bg-card backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-5 sm:p-7 border-b border-border/60">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground">{t("title")}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {enriched.length !== 1 ? t("assets_other", { count: enriched.length }) : t("assets_one", { count: enriched.length })} {" "}
            {Object.values(byCategory).filter(c => c.count > 0).length !== 1 
              ? t("categories_other", { count: Object.values(byCategory).filter(c => c.count > 0).length })
              : t("categories_one", { count: Object.values(byCategory).filter(c => c.count > 0).length })}
          </p>
        </div>
      </div>

      {/* Category summary bar */}
      <div className="grid grid-cols-3 border-b border-border/60">
        {(Object.keys(CATEGORY_META) as Array<keyof typeof CATEGORY_META>).map((cat, i) => {
          const meta = CATEGORY_META[cat]
          const Icon = meta.icon
          const data = byCategory[cat]
          const pct = totalValue > 0 ? (data.value / totalValue) * 100 : 0
          return (
            <div
              key={cat}
              className={`px-3 py-3 sm:px-5 sm:py-4 ${i < 2 ? "border-r border-border/60" : ""}`}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: meta.base }}
                  aria-hidden
                />
                <Icon className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground truncate">
                  {meta.label}
                </span>
              </div>
              <div className="font-mono text-base sm:text-lg font-bold text-foreground tabular-nums leading-tight">
                {formatCHZ(data.value)}
              </div>
              <div className="flex items-center justify-between gap-1 mt-0.5">
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {pct.toFixed(1)}%
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {data.count} {data.count === 1 ? t("asset") : t("assets")}
                </span>
              </div>
              {/* Mini progress bar */}
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted/60">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: meta.base,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Chart + Legend */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,260px)_1fr] gap-4 sm:gap-6 p-5 sm:p-7">
        {/* Donut */}
        <div className="relative mx-auto h-[220px] w-[220px] sm:h-[240px] sm:w-[240px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={enriched}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius="64%"
                outerRadius="92%"
                paddingAngle={enriched.length > 1 ? 1.5 : 0}
                stroke="var(--background)"
                strokeWidth={2}
                activeIndex={activeIdx ?? -1}
                activeShape={renderActiveShape}
                onMouseEnter={(_, idx) => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
                isAnimationActive={false}
              >
                {enriched.map((entry, i) => (
                  <Cell
                    key={entry.id}
                    fill={entry.color}
                    style={{
                      cursor: "pointer",
                      transition: "opacity 200ms ease",
                      opacity: activeIdx === null || activeIdx === i ? 1 : 0.4,
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center stat overlay */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors">
              {centered.label}
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-bold tabular-nums leading-none mt-1.5 text-foreground">
              {formatCHZ(centered.value)}
            </div>
            <div className="text-[10px] font-medium text-muted-foreground mt-0.5">
              CHZ
            </div>
            {activeIdx !== null && (
              <div
                className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums"
                style={{
                  backgroundColor: `color-mix(in oklch, ${centered.color} 15%, transparent)`,
                  color: centered.color,
                }}
              >
                {centered.percent.toFixed(1)}%
              </div>
            )}
          </div>
        </div>

        {/* Legend / detailed breakdown */}
        <div className="flex flex-col gap-1.5 max-h-[280px] overflow-y-auto pr-1">
          {enriched.map((item, i) => {
            const pct = (item.value / totalValue) * 100
            const isActive = activeIdx === i
            return (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
                onFocus={() => setActiveIdx(i)}
                onBlur={() => setActiveIdx(null)}
                className={`group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
                  isActive
                    ? "border-border bg-muted/60"
                    : "border-transparent hover:border-border hover:bg-muted/30"
                }`}
              >
                {/* Color/icon column */}
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60"
                  style={{
                    backgroundColor: `color-mix(in oklch, ${item.color} 15%, transparent)`,
                  }}
                >
                  {item.icon ? (
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  ) : (
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                      aria-hidden
                    />
                  )}
                </div>

                {/* Name + sublabel + bar */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {item.name}
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-foreground tabular-nums shrink-0">
                      {formatCHZ(item.value)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 overflow-hidden rounded-full bg-muted/60">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground tabular-nums w-10 text-right">
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                  {item.sublabel && (
                    <div className="mt-0.5 text-[10px] text-muted-foreground truncate">
                      {item.sublabel}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
