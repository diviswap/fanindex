"use client"

import { AlertTriangle, TrendingDown, Zap, DollarSign } from "lucide-react"

const riskItems = [
  {
    icon: TrendingDown,
    title: "Market Risk",
    description:
      "Index values fluctuate with underlying asset prices. Past performance does not guarantee future results. Crypto markets are volatile and can move significantly in short periods.",
  },
  {
    icon: Zap,
    title: "Liquidity Risk",
    description:
      "While we prioritize liquid assets, liquidity can vary. During market stress, redemptions may be processed with delays or at suboptimal prices.",
  },
  {
    icon: DollarSign,
    title: "Operational Risk",
    description:
      "Smart contract vulnerabilities, oracle failures, or exchange outages could impact your positions. We maintain insurance and security audits.",
  },
  {
    icon: AlertTriangle,
    title: "Regulatory Risk",
    description:
      "Cryptocurrency regulations are evolving. Changes in regulation could affect index operations, fees, or asset eligibility.",
  },
]

export function RiskDisclosureSection() {
  return (
    <section id="risk-disclosure" className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Risk Disclosure</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Important information about investment risks. Please read carefully before investing.
        </p>
      </div>

      {/* Risk Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {riskItems.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className="border border-border bg-card/50 backdrop-blur-sm p-6 rounded-2xl hover:border-destructive/30 hover:bg-card/80 transition-all duration-300"
            >
              <div className="mb-4">
                <div className="p-3 rounded-lg bg-destructive/5 inline-flex">
                  <Icon className="h-5 w-5 text-destructive" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          )
        })}
      </div>

      {/* Important Disclaimer */}
      <div className="relative border border-destructive/20 bg-destructive/5 backdrop-blur-sm rounded-2xl p-8">
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            <span className="text-foreground font-semibold">Disclaimer:</span> FanIndex is a decentralized platform for
            creating and managing crypto asset indices. Crypto assets are highly volatile and speculative. Investment in
            crypto indices carries substantial risk of loss. Only invest amounts you can afford to lose completely.
          </p>
          <p>
            Past performance is not indicative of future results. We are not investment advisors. This is not investment
            advice. Please conduct your own research and consult with a financial advisor before investing.
          </p>
          <p>
            By using FanIndex, you acknowledge that you have read and understood these risks and agree to the terms of
            service.
          </p>
        </div>
      </div>
    </section>
  )
}
