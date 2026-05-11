"use client"

import { useMemo, useCallback, useState, useEffect } from "react"
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  type TooltipProps,
} from "recharts"
import { Loader2, Activity } from "lucide-react"
import { useTranslations } from "next-intl"

// ── Resolve a CSS custom property at runtime so Recharts SVG gets real values.
// Re-resolves whenever the theme class on <html> changes (light ↔ dark).
function useCssVar(name: string, fallback: string): string {
  const [value, setValue] = useState(fallback)
  useEffect(() => {
    const update = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim()
      setValue(raw || fallback)
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [name, fallback])
  return value
}

interface DataPoint {
  timestamp: number
  date: string
  price: number
  volume: number
}

interface IndexPriceChartProps {
  data: DataPoint[]
  isLoading: boolean
  isPositive: boolean
  indexId: string
  timePeriod: string
  axisDecimals: number
  tooltipDecimals: number
}

// ── Custom Tooltip ──────────────────────────────────────────────────────────
function CustomTooltip({
  active,
  payload,
  label,
  isPositive,
  tooltipDecimals,
}: TooltipProps<number, string> & {
  isPositive: boolean
  tooltipDecimals: number
}) {
  if (!active || !payload || !payload.length) return null

  const pricePayload = payload.find((p) => p.dataKey === "price")
  const volPayload   = payload.find((p) => p.dataKey === "volume")
  const price        = pricePayload?.value as number | undefined
  const vol          = volPayload?.value as number | undefined

  const fmtVol = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
    if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`
    return `$${n.toFixed(0)}`
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-2xl overflow-hidden min-w-[160px]">
      <div className="px-3 py-2 bg-muted/60 border-b border-border">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="px-3 py-2 space-y-1.5">
        {price !== undefined && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              Price
            </span>
            <span
              className={`text-sm font-bold tabular-nums ${
                isPositive ? "text-success" : "text-destructive"
              }`}
            >
              {price.toFixed(tooltipDecimals)} CHZ
            </span>
          </div>
        )}
        {vol !== undefined && vol > 0 && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
              Vol
            </span>
            <span className="text-xs font-semibold text-foreground tabular-nums">
              {fmtVol(vol)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Period stats bar ─────────────────────────────────────────────────────────
function PeriodStats({
  data,
  isPositive,
  axisDecimals,
}: {
  data: DataPoint[]
  isPositive: boolean
  axisDecimals: number
}) {
  if (data.length < 2) return null

  const prices   = data.map((d) => d.price).filter((p) => p > 0)
  const high     = Math.max(...prices)
  const low      = Math.min(...prices)
  const totalVol = data.reduce((s, d) => s + (d.volume ?? 0), 0)

  const fmtP = (n: number) => n.toFixed(axisDecimals + 1)
  const fmtVol = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`
    return `$${n.toFixed(0)}`
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground font-mono select-none">
      <span className="flex items-center gap-1">
        <span className="uppercase tracking-wider font-sans font-semibold">H</span>
        <span className="font-semibold text-success">{fmtP(high)}</span>
      </span>
      <span className="flex items-center gap-1">
        <span className="uppercase tracking-wider font-sans font-semibold">L</span>
        <span className="font-semibold text-destructive">{fmtP(low)}</span>
      </span>
      {totalVol > 0 && (
        <span className="flex items-center gap-1">
          <span className="uppercase tracking-wider font-sans font-semibold">Vol</span>
          <span className="font-semibold text-foreground">{fmtVol(totalVol)}</span>
        </span>
      )}
    </div>
  )
}

// ── Volume bar — coloured by direction ───────────────────────────────────────
function VolumeBar(props: {
  x?: number
  y?: number
  width?: number
  height?: number
  isPositive: boolean
  chartColor: string
}) {
  const { x = 0, y = 0, width = 0, height = 0, chartColor } = props
  if (!height || height <= 0) return null
  return (
    <rect x={x} y={y} width={width} height={height} fill={chartColor} opacity={0.35} rx={1} />
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export function IndexPriceChart({
  data,
  isLoading,
  isPositive,
  indexId,
  timePeriod,
  axisDecimals,
  tooltipDecimals,
}: IndexPriceChartProps) {
  const t = useTranslations("indexDetail")

  // Resolve live CSS custom properties — re-reads on every light/dark toggle
  const rawBorder  = useCssVar("--border",           "oklch(0.8 0 0)")
  const rawMutedFg = useCssVar("--muted-foreground", "oklch(0.55 0 0)")
  const rawSuccess = useCssVar("--success",          "oklch(0.65 0.18 145)")
  const rawDestroy = useCssVar("--destructive",      "oklch(0.55 0.22 25)")
  const rawBg      = useCssVar("--background",       "oklch(0.99 0 0)")

  // getComputedStyle returns bare oklch(...) values — wrap them so SVG can paint
  const wrap = (v: string) =>
    v.startsWith("oklch(") ? v : v ? `oklch(${v})` : v

  const borderColor  = wrap(rawBorder)
  const mutedFgColor = wrap(rawMutedFg)
  const successColor = wrap(rawSuccess)
  const destroyColor = wrap(rawDestroy)
  const bgColor      = wrap(rawBg)

  const chartColor = isPositive ? successColor : destroyColor
  const gradientId = `grad-${indexId}-${isPositive ? "pos" : "neg"}`

  const baselinePrice = data[0]?.price ?? null

  const fmtAxis = useCallback(
    (v: number) => v.toFixed(axisDecimals),
    [axisDecimals]
  )

  const fmtVolAxis = useCallback((v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}M`
    if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}K`
    return `${v}`
  }, [])

  const xInterval = timePeriod === "24h" ? 0 : timePeriod === "7d" ? 1 : "preserveStartEnd"

  const hasVolume = useMemo(() => data.some((d) => (d.volume ?? 0) > 0), [data])

  if (isLoading && data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-sm font-medium">{t("loadingChart")}</span>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Activity className="h-8 w-8 opacity-50" />
          <span className="text-sm font-medium">{t("noDataAvailable")}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col gap-1">
      {/* Period stats bar */}
      <PeriodStats data={data} isPositive={isPositive} axisDecimals={axisDecimals} />

      {/* Price area chart */}
      <div className={`w-full ${hasVolume ? "flex-[3]" : "flex-1"} min-h-0`}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={chartColor} stopOpacity={0.2} />
                <stop offset="60%"  stopColor={chartColor} stopOpacity={0.07} />
                <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Grid — explicit resolved colour, higher opacity so dark mode shows it */}
            <CartesianGrid
              strokeDasharray="2 4"
              stroke={borderColor}
              opacity={1}
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tick={{ fill: mutedFgColor, fontSize: 9, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
              interval={xInterval}
              minTickGap={48}
              dy={4}
            />

            <YAxis
              dataKey="price"
              orientation="right"
              tick={{ fill: mutedFgColor, fontSize: 9, fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={fmtAxis}
              width={52}
              domain={["dataMin * 0.998", "dataMax * 1.002"]}
            />

            {/* Baseline — period start price */}
            {baselinePrice && (
              <ReferenceLine
                y={baselinePrice}
                stroke={mutedFgColor}
                strokeDasharray="3 4"
                strokeOpacity={0.55}
                strokeWidth={1}
              />
            )}

            <Tooltip
              content={
                <CustomTooltip
                  isPositive={isPositive}
                  tooltipDecimals={tooltipDecimals}
                />
              }
              cursor={{
                stroke: chartColor,
                strokeWidth: 1,
                strokeDasharray: "3 3",
                strokeOpacity: 0.8,
              }}
            />

            <Area
              type="monotoneX"
              dataKey="price"
              stroke={chartColor}
              strokeWidth={1.75}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{
                r: 4,
                fill: chartColor,
                stroke: bgColor,
                strokeWidth: 2,
              }}
              animationDuration={600}
              animationEasing="ease-out"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Volume bars */}
      {hasVolume && (
        <div className="w-full flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 0, right: 4, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="2 4"
                stroke={borderColor}
                opacity={0.5}
                vertical={false}
              />

              <XAxis dataKey="date" hide />

              <YAxis
                dataKey="volume"
                orientation="right"
                tick={{ fill: mutedFgColor, fontSize: 8, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={fmtVolAxis}
                width={52}
                tickCount={2}
              />

              <Tooltip content={<></>} cursor={false} />

              <Bar
                dataKey="volume"
                shape={(props: any) => (
                  <VolumeBar {...props} isPositive={isPositive} chartColor={chartColor} />
                )}
                maxBarSize={8}
                animationDuration={600}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Volume label */}
      {hasVolume && (
        <div className="flex items-center gap-1.5 mt-0.5">
          <div
            className="w-2.5 h-2.5 rounded-sm opacity-50"
            style={{ backgroundColor: chartColor }}
          />
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-medium">
            Volume
          </span>
        </div>
      )}
    </div>
  )
}
