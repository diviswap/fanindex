"use client"

import { PieChart, TrendingUp, DollarSign, Gauge } from "lucide-react"

const methodologyItems = [
  {
    title: "Pricing Formula",
    description: "Dynamic pricing model that reflects real-time market conditions and index composition.",
    formula: "NAV = Σ(wᵢ × Pᵢ)",
    details: "Where wᵢ is the weight of asset i and Pᵢ is its price in CHZ",
  },
  {
    title: "Weight Allocation",
    description: "Flexible weighting schemes supporting market-cap, equal-weight, and custom strategies.",
    icon: PieChart,
  },
  {
    title: "Monthly Rebalance",
    description: "Automated rebalancing ensures indices stay true to their target allocations.",
    icon: TrendingUp,
  },
  {
    title: "Liquidity Methodology",
    description: "Inclusion criteria prioritize liquid, tradeable assets with institutional-grade counterparties.",
    icon: DollarSign,
  },
]

export function MethodologySection() {
  return (
    <section id="methodology" className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-success/10">
            <Gauge className="h-6 w-6 text-success" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Index Methodology</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Professional-grade index construction inspired by traditional asset management.
        </p>
      </div>

      {/* Formula Highlight */}
      <div className="relative border border-success/20 bg-success/5 backdrop-blur-sm rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-success/5 via-transparent to-transparent opacity-50" />
        <div className="relative z-10 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Pricing Formula</h3>
            <p className="text-muted-foreground text-sm mb-4">
              The Net Asset Value (NAV) of each index is calculated as the sum of weighted asset prices:
            </p>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
            <div className="font-mono text-center text-2xl md:text-3xl font-bold text-success tracking-wide">
              NAV = Σ(wᵢ × Pᵢ)
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Where <span className="text-foreground font-semibold">wᵢ</span> is the weight of asset i and{" "}
              <span className="text-foreground font-semibold">Pᵢ</span> is its price in CHZ
            </p>
          </div>
          <div className="grid gap-3 text-sm text-muted-foreground">
            <p>
              <span className="text-foreground font-semibold">Example:</span> An index with 60% CHZ (price 0.50 CHZ) and
              40% FAN (price 0.75 CHZ) would have NAV = (0.6 × 0.50) + (0.4 × 0.75) = 0.60 CHZ
            </p>
          </div>
        </div>
      </div>

      {/* Methodology Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {methodologyItems.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className="border border-border bg-card/50 backdrop-blur-sm p-6 rounded-2xl hover:border-success/30 hover:bg-card transition-all duration-300"
            >
              {Icon && (
                <div className="mb-4">
                  <div className="inline-flex p-3 rounded-lg bg-success/5">
                    <Icon className="h-5 w-5 text-success" />
                  </div>
                </div>
              )}
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              {item.formula && (
                <div className="mt-4 p-3 bg-success/5 rounded-lg border border-success/10">
                  <code className="text-xs font-mono text-success">{item.formula}</code>
                </div>
              )}
              {item.details && (
                <p className="text-xs text-muted-foreground mt-2 italic">{item.details}</p>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
