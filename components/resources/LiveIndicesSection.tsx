"use client"

import { TrendingUp, BarChart3 } from "lucide-react"
import Link from "next/link"
import { INDICES, calculateIndexPrice } from "@/lib/data/indices"
import { useMemo } from "react"

export function LiveIndicesSection() {
  // Get the first 5 indices to display
  const displayIndices = useMemo(() => {
    return INDICES.slice(0, 5).map((index) => {
      const nav = calculateIndexPrice(index.tokens, undefined, index.weights)
      return {
        name: index.name,
        ticker: index.symbol,
        nav: nav.toFixed(3),
        type: index.type.charAt(0).toUpperCase() + index.type.slice(1),
        constituents: index.tokens.length,
      }
    })
  }, [])

  return (
    <section id="live-indices" className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-success/10">
            <TrendingUp className="h-6 w-6 text-success" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Available Indices</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Pre-built indices available for investment. Select an index and start diversifying your portfolio today.
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
                <th className="px-6 py-4 text-center text-sm font-semibold text-muted-foreground">Assets</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {displayIndices.map((index) => (
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
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-semibold text-foreground">
                      {index.constituents}
                    </span>
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
              ))}
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
          Browse All Indices
          <TrendingUp className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
