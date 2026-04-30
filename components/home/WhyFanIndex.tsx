"use client"

import { Layers, Shield, Cpu } from "lucide-react"

const ITEMS = [
  {
    icon: Layers,
    title: "Diversified Exposure",
    description: "Reduce concentration risk across teams and leagues.",
  },
  {
    icon: Shield,
    title: "On-Chain Transparency",
    description: "All index positions are verifiable on-chain.",
  },
  {
    icon: Cpu,
    title: "Professional Infrastructure",
    description: "Built for long-term SportFi participation.",
  },
] as const

export function WhyFanIndex() {
  return (
    <section className="relative w-full border-b border-border/40 py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-success">
            Why FanIndex
          </span>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Structured Exposure for SportFi
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 md:grid-cols-3">
          {ITEMS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative bg-background p-8 transition-colors hover:bg-card/60 sm:p-10"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border/80 bg-card/60">
                <Icon className="h-4 w-4 text-success" strokeWidth={1.75} />
              </div>
              <h3 className="mt-7 text-xl font-semibold tracking-tight text-foreground">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
              {/* Subtle bottom hairline accent on hover */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-success/0 to-transparent transition-colors group-hover:via-success/40"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
