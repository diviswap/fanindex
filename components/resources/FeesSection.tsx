"use client"

import { CreditCard, TrendingDown, Zap, AlertCircle } from "lucide-react"

const feeItems = [
  {
    icon: CreditCard,
    title: "Entry Fee",
    amount: "1%",
    description: "One-time fee when creating or buying into an index position.",
    details: "Covers smart contract interactions and liquidity provision.",
  },
  {
    icon: TrendingDown,
    title: "Exit Fee",
    amount: "0%",
    description: "No fee when exiting or selling your position.",
    details: "We want your redemptions to be seamless and cost-effective.",
  },
  {
    icon: Zap,
    title: "Management Fee",
    amount: "Varies",
    description: "Annual management fee varies by index type and complexity.",
    details: "Weighted indices: 0.5% · Equal-weight: 0.25% · Managed: 1%",
  },
  {
    icon: AlertCircle,
    title: "Performance Fee",
    amount: "Varies",
    description: "Optional performance-based fees for managed indices.",
    details: "20% of gains above benchmark (when applicable).",
  },
]

export function FeesSection() {
  return (
    <section id="fees" className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-success/10">
            <CreditCard className="h-6 w-6 text-success" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Fees & Pricing</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Transparent, competitive fee structure designed to maximize your returns.
        </p>
      </div>

      {/* Fee Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {feeItems.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className="relative group border border-border bg-card/50 backdrop-blur-sm p-6 rounded-2xl hover:border-success/30 hover:bg-card transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-success/5 group-hover:bg-success/10 transition-colors">
                  <Icon className="h-5 w-5 text-success" />
                </div>
                <span className="text-2xl md:text-3xl font-bold text-success">{item.amount}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
              <div className="pt-3 border-t border-border/30">
                <p className="text-xs text-muted-foreground italic">{item.details}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Fee Breakdown Info */}
      <div className="border border-success/20 bg-success/5 backdrop-blur-sm rounded-2xl p-6 md:p-8">
        <h3 className="font-semibold text-foreground mb-4">Fee Calculation Example</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <span className="font-mono text-success">1.</span>
            <span>
              Invest <span className="text-foreground font-semibold">1000 CHZ</span> into a weighted index
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-success">2.</span>
            <span>
              Entry fee applied: <span className="text-foreground font-semibold">1% = 10 CHZ</span>
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-success">3.</span>
            <span>
              You receive <span className="text-foreground font-semibold">990 CHZ</span> in index tokens
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-success">4.</span>
            <span>
              Annual management fee: <span className="text-foreground font-semibold">0.5% ≈ 5 CHZ/year</span>
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-success">5.</span>
            <span>
              Exit anytime with <span className="text-foreground font-semibold">zero exit fee</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
