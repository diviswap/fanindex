"use client"

import { BookOpen, ArrowRight, Zap, TrendingUp, Lock, BarChart3 } from "lucide-react"

const gettingStartedItems = [
  {
    icon: Zap,
    title: "What Are Indices?",
    description: "Understand FanIndex's approach to diversified crypto investing. Learn how weighted indices work and why they're essential for portfolio management.",
  },
  {
    icon: Lock,
    title: "Understanding Composition",
    description: "Learn how index composition affects returns. Deep dive into rebalancing, weighting schemes, and liquidity constraints.",
  },
  {
    icon: BarChart3,
    title: "Portfolio Best Practices",
    description: "Tips for managing a successful portfolio. Risk management, diversification strategies, and performance optimization.",
  },
  {
    icon: TrendingUp,
    title: "Start Investing",
    description: "Invest in pre-built indices or browse available options. Begin your journey with FanIndex in just a few clicks.",
  },
]

export function GettingStartedSection() {
  return (
    <section id="getting-started" className="space-y-6 md:space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-success/10">
            <BookOpen className="h-6 w-6 text-success" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Getting Started</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Everything you need to know to begin your journey with FanIndex.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {gettingStartedItems.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className="group relative border border-border bg-card/50 backdrop-blur-sm p-6 rounded-2xl hover:border-success/30 hover:bg-card transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-success/5 group-hover:bg-success/10 transition-colors">
                  <Icon className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-success transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-success opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
