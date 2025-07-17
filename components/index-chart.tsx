"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { Index } from "@/lib/types"

interface IndexChartProps {
  data: Index["chartData"]
  change: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-white/10 bg-black/50 p-2 text-sm backdrop-blur-sm">
        <p className="font-bold">{label}</p>
        <p className="text-white">{`Value: $${payload[0].value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}</p>
      </div>
    )
  }
  return null
}

export function IndexChart({ data, change }: IndexChartProps) {
  const strokeColor = change >= 0 ? "#4ade80" : "#f87171" // green-400 or red-400
  const gradientId = change >= 0 ? "colorUv" : "colorPv"

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis dataKey="name" stroke="#9ca3af" />
        <YAxis
          stroke="#9ca3af"
          domain={["dataMin - dataMin * 0.05", "dataMax + dataMax * 0.05"]}
          tickFormatter={(value) => `$${Number(value).toFixed(2)}`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255, 255, 255, 0.2)", strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={strokeColor}
          strokeWidth={2}
          fillOpacity={1}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
