"use client"

import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { useId } from "react"

interface SparklineProps {
  /** Array of price points; the line is drawn as-is, in order. */
  data: { price: number; timestamp?: number }[]
  /** When omitted, color is derived from first vs last point. */
  color?: string
  /** Height in pixels (default 48). */
  height?: number
  /** Class for the wrapping div. */
  className?: string
  /** Show a subtle area fill below the line (default true). */
  fill?: boolean
}

/**
 * A compact, axis-less price trend chart used inside cards and rows.
 * Mirrors the visual language of trading apps (Robinhood / Coinbase / TradingView).
 */
export function Sparkline({
  data,
  color,
  height = 48,
  className = "",
  fill = true,
}: SparklineProps) {
  const id = useId().replace(/:/g, "")

  if (!data || data.length < 2) {
    return (
      <div
        className={`w-full ${className}`}
        style={{ height }}
        aria-hidden
      />
    )
  }

  const first = data[0].price
  const last = data[data.length - 1].price
  const trend = last >= first ? "up" : "down"
  // Default to design-token success/destructive colors for trend
  const stroke =
    color ?? (trend === "up" ? "var(--success, #22c55e)" : "var(--destructive, #ef4444)")

  // Recharts needs raw numbers; we feed price as-is.
  return (
    <div className={`w-full ${className}`} style={{ height }} aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
          <defs>
            <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="price"
            stroke={stroke}
            strokeWidth={1.75}
            fill={fill ? `url(#spark-${id})` : "none"}
            fillOpacity={1}
            isAnimationActive={false}
            dot={false}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
