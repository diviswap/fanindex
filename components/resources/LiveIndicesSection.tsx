"use client"

import { TrendingUp, BarChart3, Lock } from "lucide-react"
import Link from "next/link"

const liveIndices = [
  {
    name: "Football Elites",
    ticker: "ELITE",
    nav: "2.45",
    change24h: "+5.2",
    type: "Weighted",
    constituents: 12,
  },
  {
    name: "Sports Top 10",
    ticker: "TOP10",
    nav: "3.15",
    change24h: "+3.8",
    type: "Equal-Weight",
    constituents: 10,
  },
  {
    name: "Fan Token Index",
    ticker: "FAN",
    nav: "1.82",
    change24h: "+2.1",
    type: "Weighted",
    constituents: 15,
  },
  {
    name: "Emerging Clubs",
    ticker: "EMRG",
    nav: "0.95",
    change24h: "-1.3",
    type: "Equal-Weight",
    constituents: 8,
  },
]

export function LiveIndicesSection() {
  return (
    <section id="live-indices" className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-success/10">
            <TrendingUp className="h-6 w-6 text-success" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Live Indices</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Real-time market data for all available indices. Start investing today.
        </p>
      </div>

      {/* Indices Table */}
      <div className="overflow-hidden border border-border rounded-2xl bg-card/50 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30">
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Index</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Type</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-muted-foreground">NAV</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-muted-foreground">24h Change</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-muted-foreground">Assets</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {liveIndices.map((index) => {
                const isPositive = parseFloat(index.change24h) >= 0
                return (
                  <tr
                    key={index.ticker}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                          <BarChart3 className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{index.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{index.ticker}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">
                        {index.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-mono text-lg font-semibold text-foreground">
                        {index.nav}
                      </p>
                      <p className="text-xs text-muted-foreground">CHZ</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`flex items-center justify-end gap-1 text-sm font-semibold ${
                        isPositive ? "text-success" : "text-destructive"
                      }`}>
                        <TrendingUp className={`h-4 w-4 ${!isPositive ? "rotate-180" : ""}`} />
                        {index.change24h}%
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Lock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-semibold text-foreground">
                          {index.constituents}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/indices/${index.ticker.toLowerCase()}`}
                        className="inline-flex px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs font-semibold hover:bg-success/20 transition-colors"
                      >
                        Invest
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View All CTA */}
      <div className="text-center">
        <Link
          href="/indices"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-success/10 text-success font-semibold hover:bg-success/20 transition-colors"
        >
          View All Indices
          <TrendingUp className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
