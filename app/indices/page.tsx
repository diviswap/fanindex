"use client"

import { WebGLShader } from "@/components/ui/web-gl-shader"
import { Footer } from "@/components/ui/footer-section"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { IndexCard } from "@/components/indices/IndexCard"
import { MarketOverview } from "@/components/indices/MarketOverview"
import { useEffect } from "react"
import { Shield, Zap, BarChart3 } from "lucide-react"
import { INDICES } from "@/lib/data/indices"

export default function IndicesPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const deployedIndices = INDICES.filter((index) =>
    ["FTLX", "FGMX", "FFLX", "FELX", "FSLX"].includes(index.id),
  )

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-background min-h-screen">
      <WebGLShader />
      <NavBar />

      <main className="relative z-10 w-full">
        {/* Hero header — same style as home sections */}
        <section className="relative w-full border-b border-border/40 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 0%, color-mix(in oklch, var(--success) 8%, transparent), transparent 70%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-success/40 to-transparent"
          />

          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pt-28 sm:pt-36 pb-12 sm:pb-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-success/25 bg-success/[0.06] px-3 py-1.5 backdrop-blur mb-5 sm:mb-7">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.14em] text-foreground/90">
                Live Sports Token Indices
              </span>
            </div>

            <h1 className="text-balance text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-foreground mb-4 sm:mb-6">
              Fan Token{" "}
              <span className="text-success">Indices</span>
            </h1>
            <p className="text-pretty text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Diversified exposure to the sports token economy. Live, on-chain, and rebalanced.
            </p>
          </div>
        </section>

        {/* Index cards + market overview */}
        <section className="relative w-full border-b border-border/40 py-12 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
            <MarketOverview indices={deployedIndices} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-stretch">
              {deployedIndices.map((index) => (
                <IndexCard key={index.id} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Strategy types — same panel grid style as WhyFanIndex */}
        <section className="relative w-full border-b border-border/40 py-16 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="max-w-2xl mb-10 sm:mb-16">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-success">
                Index Strategies
              </span>
              <h2 className="mt-3 text-balance text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
                Three Approaches to SportFi Exposure
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 md:grid-cols-3">
              {[
                {
                  icon: BarChart3,
                  color: "text-blue-500",
                  bg: "bg-blue-500/10",
                  title: "Weighted",
                  description:
                    "Tokens allocated proportionally based on market capitalization and liquidity for optimized, benchmark-grade exposure.",
                },
                {
                  icon: Shield,
                  color: "text-success",
                  bg: "bg-success/10",
                  title: "Equal-Weight",
                  description:
                    "Equal allocation across all constituents for democratized exposure, balanced risk distribution, and maximum diversification.",
                },
                {
                  icon: Zap,
                  color: "text-amber-400",
                  bg: "bg-amber-400/10",
                  title: "Managed",
                  description:
                    "Actively managed by the FanIndex team with dynamic adjustments, tactical rotation, and strategic allocation based on market conditions.",
                },
              ].map(({ icon: Icon, color, bg, title, description }) => (
                <div
                  key={title}
                  className="group relative bg-background p-8 transition-colors hover:bg-card/60 sm:p-10"
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-lg border border-border/80 ${bg}`}>
                    <Icon className={`h-4 w-4 ${color}`} strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-7 text-xl font-semibold tracking-tight text-foreground">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-success/0 to-transparent transition-colors group-hover:via-success/40"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Index methodology stats */}
        <section className="relative w-full border-b border-border/40 py-16 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="max-w-2xl mb-10 sm:mb-16">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-success">
                Methodology
              </span>
              <h2 className="mt-3 text-balance text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
                How Index Prices Are Calculated
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
                Every FanIndex product uses a transparent, on-chain weighted pricing formula. Market prices are sourced in real time from CoinGecko and updated continuously.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40">
              {[
                {
                  label: "Rebalance Frequency",
                  value: "Periodic",
                  sub: "Manually executed by the FanIndex team with future automation planned",
                },
                {
                  label: "Price Source",
                  value: "CoinGecko",
                  sub: "Live market prices fetched from the CoinGecko API in real time",
                },
                {
                  label: "Entry Fee",
                  value: "1%",
                  sub: "Protocol fee applied on each purchase — zero exit fee",
                },
                {
                  label: "Position Type",
                  value: "NFT",
                  sub: "Each position is represented by a unique NFT certifying ownership",
                },
              ].map(({ label, value, sub }) => (
                <div key={label} className="bg-background p-8 sm:p-10 hover:bg-card/60 transition-colors">
                  <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground mb-3">
                    {label}
                  </div>
                  <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-2">
                    {value}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Future expansion */}
        <section className="relative w-full py-16 sm:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 100%, color-mix(in oklch, var(--success) 6%, transparent), transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 text-center">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-success">
              Roadmap
            </span>
            <h2 className="mt-3 text-balance text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4 sm:mb-6">
              Future Index Expansion
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10 sm:mb-16">
              The FanIndex suite will grow to cover every major segment of the global sports token economy.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 max-w-4xl mx-auto">
              {[
                "Italian League",
                "Turkish League",
                "National Teams",
                "Brazil League",
                "Asia Sports",
                "Motorsports",
                "Basketball",
                "UFC / MMA",
                "Global Tournaments",
                "User-Created",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-border/60 bg-card/40 px-4 py-3.5 text-sm font-medium text-muted-foreground backdrop-blur hover:border-success/30 hover:text-foreground transition-colors"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
