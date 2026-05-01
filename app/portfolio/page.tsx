"use client"

import { useEffect, Component, type ReactNode } from "react"
import { WebGLShader } from "@/components/ui/web-gl-shader"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Footer } from "@/components/ui/footer-section"
import { PortfolioView } from "@/components/portfolio/PortfolioView"
import { Activity, PieChart, RefreshCw } from "lucide-react"

class PortfolioErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6 text-center px-4">
          <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20">
            <svg className="h-10 w-10 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Portfolio failed to load</h2>
            <p className="text-muted-foreground text-sm max-w-sm">
              There was a problem loading the portfolio. Please refresh the page.
            </p>
            {this.state.error && (
              <p className="text-xs text-muted-foreground/60 mt-2 font-mono max-w-sm truncate">
                {this.state.error.message}
              </p>
            )}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-full bg-success text-success-foreground font-semibold text-sm hover:bg-success/90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function PortfolioPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-background min-h-screen">
      <WebGLShader />
      <NavBar />

      <main className="relative z-10 w-full">
        {/* Hero header */}
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

          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 pt-36 pb-20 sm:pt-44 sm:pb-28">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-success/25 bg-success/[0.06] px-3.5 py-1.5 backdrop-blur mb-7">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-foreground/90">
                Live Portfolio Tracking
              </span>
            </div>

            <h1 className="text-balance text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-foreground mb-6">
              My{" "}
              <span className="text-success">Portfolio</span>
            </h1>
            <p className="text-pretty text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-14">
              Track and manage your Fan Token index positions with real-time on-chain performance analytics.
            </p>

            {/* Trust bar */}
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 max-w-2xl">
              {[
                { icon: Activity, label: "Real-Time Prices" },
                { icon: PieChart, label: "NFT Positions" },
                { icon: RefreshCw, label: "Auto-Updated" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 bg-background px-4 py-3.5">
                  <Icon className="h-3.5 w-3.5 text-success" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio content */}
        <section className="relative w-full py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PortfolioErrorBoundary>
              <PortfolioView />
            </PortfolioErrorBoundary>
          </div>
        </section>

        {/* How it works — matching section style */}
        <section className="relative w-full border-t border-border/40 py-28 sm:py-36">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <div className="max-w-2xl mb-16">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-success">
                How It Works
              </span>
              <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                NFT-Based Position Infrastructure
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 md:grid-cols-2">
              {[
                {
                  step: "01",
                  title: "Deposit CHZ",
                  description:
                    "Select an index and deposit CHZ. Smart contracts execute proportional purchases of all underlying Fan Tokens automatically.",
                },
                {
                  step: "02",
                  title: "Receive NFT",
                  description:
                    "A unique NFT is minted to your wallet. It certifies your position — index type, deposited value, allocation data, and timestamp.",
                },
                {
                  step: "03",
                  title: "Track Performance",
                  description:
                    "Monitor your positions, allocations, and real-time exposure directly on-chain with full transparency.",
                },
                {
                  step: "04",
                  title: "Redeem Anytime",
                  description:
                    "Burn your NFT to redeem. The protocol sells the underlying portfolio and returns CHZ to your wallet — zero exit fee.",
                },
              ].map(({ step, title, description }) => (
                <div
                  key={step}
                  className="group relative bg-background p-8 transition-colors hover:bg-card/60 sm:p-10"
                >
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-success mb-5">
                    {step}
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground mb-3">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-success/0 to-transparent transition-colors group-hover:via-success/40"
                  />
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
