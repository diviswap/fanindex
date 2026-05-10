"use client"

import { useMemo, useCallback, useState } from "react"
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
import { Loader2, Activity, TrendingUp, TrendingDown } from "lucide-react"
import { useTranslations } from "next-intl"

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
function CustomTooltip({ active, payload, label, isPositive, tooltipDecimals }: TooltipProps<number, string> & { isPositive: boolean; tooltipDecimals: number }) {
  if (!active || !payload || !payload.length) return null

  const pricePayload = payload.find(p => p.dataKey === "price")
  const volPayload = payload.find(p => p.dataKey === "volume")
  const price = pricePayload?.value as number | undefined
  const vol = volPayload?.value as number | undefined

  const fmtVol = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
    return `$${n.toFixed(0)}`
  }

  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg shadow-2xl overflow-hidden min-w-[160px]">
      {/* Header */}
      <div className="px-3 py-2 bg-[hsl(var(--muted)/0.5)] border-b border-[hsl(var(--border))]">
        <span className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-widest">{label}</span>
      </div>
      {/* Body */}
      <div className="px-3 py-2 space-y-1.5">
        {price !== undefined && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-medium">Price</span>
            <span className={`text-sm font-bold tabular-nums ${isPositive ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]"}`}>
              {price.toFixed(tooltipDecimals)} CHZ
            </span>
          </div>
        )}
        {vol !== undefined && vol > 0 && (
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-medium">Vol</span>
            <span className="text-xs font-semibold text-[hsl(var(--foreground))] tabular-nums">{fmtVol(vol)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Period stats bar above the chart ────────────────────────────────────────
function PeriodStats({ data, isPositive, axisDecimals }: { data: DataPoint[]; isPositive: boolean; axisDecimals: number }) {
  if (data.length < 2) return null

  const prices = data.map(d => d.price).filter(p => p > 0)
  const high = Math.max(...prices)
  const low = Math.min(...prices)
  const totalVol = data.reduce((s, d) => s + (d.volume ?? 0), 0)

  const fmtP = (n: number) => n.toFixed(axisDecimals + 1)
  const fmtVol = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
    return `$${n.toFixed(0)}`
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[hsl(var(--muted-foreground))] font-mono select-none">
      <span className="flex items-center gap-1">
        <span className="uppercase tracking-wider font-sans font-medium">H</span>
        <span className={`font-semibold ${isPositive ? "text-[hsl(var(--success))]" : "text-[hsl(var(--foreground))]"}`}>{fmtP(high)}</span>
      </span>
      <span className="flex items-center gap-1">
        <span className="uppercase tracking-wider font-sans font-medium">L</span>
        <span className={`font-semibold ${!isPositive ? "text-[hsl(var(--destructive))]" : "text-[hsl(var(--foreground))]"}`}>{fmtP(low)}</span>
      </span>
      {totalVol > 0 && (
        <span className="flex items-center gap-1">
          <span className="uppercase tracking-wider font-sans font-medium">Vol</span>
          <span className="font-semibold text-[hsl(var(--foreground))]">{fmtVol(totalVol)}</span>
        </span>
      )}
    </div>
  )
}

// ── Volume bar custom shape — coloured per candle direction ──────────────────
function VolumeBar(props: {
  x?: number; y?: number; width?: number; height?: number;
  payload?: DataPoint; isPositive: boolean;
}) {
  const { x = 0, y = 0, width = 0, height = 0, isPositive } = props
  if (!height || height <= 0) return null
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
      opacity={0.35}
      rx={1}
    />
  )
}

// ── Main chart ───────────────────────────────────────────────────────────────
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
  const [hovered, setHovered] = useState(false)

  const chartColor = isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"
  const gradientId = `grad-${indexId}-${isPositive ? "pos" : "neg"}`
  const volGradId = `vgrad-${indexId}`

  // Baseline price (first point) for the ReferenceLine
  const baselinePrice = data[0]?.price ?? null

  // Tick formatter — shorten axis labels
  const fmtAxis = useCallback(
    (v: number) => v.toFixed(axisDecimals),
    [axisDecimals]
  )

  // Volume axis formatter
  const fmtVolAxis = useCallback((v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}M`
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`
    return `${v}`
  }, [])

  // X-axis tick count based on period
  const xInterval = timePeriod === "24h" ? 0 : timePeriod === "7d" ? 1 : "preserveStartEnd"

  // Determine if volume data is meaningful
  const hasVolume = useMemo(() => data.some(d => (d.volume ?? 0) > 0), [data])

  if (isLoading && data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[hsl(var(--muted-foreground))]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-sm font-medium">{t("loadingChart")}</span>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[hsl(var(--muted-foreground))]">
          <Activity className="h-8 w-8 opacity-50" />
          <span className="text-sm font-medium">{t("noDataAvailable")}</span>
        </div>
      </div>
    )
  }

  // Split chart: 75% price area, 25% volume bars (only if has volume)
  const PRICE_RATIO = hasVolume ? "75%" : "100%"
  const VOL_RATIO = "25%"

  return (
    <div className="w-full h-full flex flex-col gap-1">
      {/* Stats bar */}
      <PeriodStats data={data} isPositive={isPositive} axisDecimals={axisDecimals} />

      {/* Price chart */}
      <div className={`w-full ${hasVolume ? "flex-[3]" : "flex-1"} min-h-0`}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.18} />
                <stop offset="60%" stopColor={chartColor} stopOpacity={0.06} />
                <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="2 4"
              stroke="hsl(var(--border))"
              opacity={0.4}
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={false}
              interval={xInterval}
              minTickGap={48}
              dy={4}
            />

            <YAxis
              dataKey="price"
              orientation="right"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={fmtAxis}
              width={52}
              domain={["dataMin * 0.998", "dataMax * 1.002"]}
            />

            {/* Baseline reference */}
            {baselinePrice && (
              <ReferenceLine
                y={baselinePrice}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 4"
                strokeOpacity={0.4}
                strokeWidth={1}
              />
            )}

            <Tooltip
              content={<CustomTooltip isPositive={isPositive} tooltipDecimals={tooltipDecimals} />}
              cursor={{
                stroke: "hsl(var(--muted-foreground))",
                strokeWidth: 1,
                strokeDasharray: "3 3",
                strokeOpacity: 0.6,
              }}
            />

            <Area
              type="monotoneX"
              dataKey="price"
              stroke={chartColor}
              strokeWidth={1.5}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{
                r: 4,
                fill: chartColor,
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
              }}
              animationDuration={600}
              animationEasing="ease-out"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Volume chart */}
      {hasVolume && (
        <div className="w-full flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 0, right: 4, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="2 4"
                stroke="hsl(var(--border))"
                opacity={0.2}
                vertical={false}
              />

              <XAxis dataKey="date" hide />

              <YAxis
                dataKey="volume"
                orientation="right"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 8, fontFamily: "var(--font-mono)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={fmtVolAxis}
                width={52}
                tickCount={2}
              />

              <Tooltip content={<></>} cursor={false} />

              <Bar
                dataKey="volume"
                shape={(props: any) => <VolumeBar {...props} isPositive={isPositive} />}
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
          <span className="text-[9px] text-[hsl(var(--muted-foreground))] uppercase tracking-widest font-medium">
            Volume
          </span>
        </div>
      )}
    </div>
  )
}
