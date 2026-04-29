"use client"

import { Footer } from "@/components/ui/footer-section"
import { NavBar } from "@/components/ui/tubelight-navbar"
import {
  ArrowRight,
  BarChart3,
  Shield,
  Globe2,
  Layers,
  RefreshCw,
  Wallet,
  ChevronRight,
  TrendingUp,
  Activity,
  Lock,
} from "lucide-react"
import { ConnectWallet } from "@/components/web3/ConnectWallet"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react"
import Image from "next/image"

// ─── Index family data ──────────────────────────────────────────────────────

const INDEX_FAMILY = [
  {
    ticker: "FTLX",
    name: "Fan Token Leaders Index",
    description: "The benchmark. Tracks the largest and most liquid fan tokens across global football.",
    tokens: "GAL · ARG · OG · PSG · BAR · ASR · CITY · ATM · POR · JUV",
    type: "Weighted",
    featured: true,
    category: "Football",
  },
  {
    ticker: "FGMX",
    name: "Fan Gaming Index",
    description: "Equal-weight exposure to the esports segment of the fan token ecosystem.",
    tokens: "OG · TH · ALL · MIBR · DOJO",
    type: "Equal Weight",
    featured: false,
    category: "Esports",
  },
  {
    ticker: "FFLX",
    name: "Fan Fight Index",
    description: "Focused exposure to combat sports organisations with on-chain fan tokens.",
    tokens: "UFC · PFL",
    type: "Equal Weight",
    featured: false,
    category: "Combat Sports",
  },
  {
    ticker: "FELX",
    name: "Fan English League Index",
    description: "Weighted exposure to Premier League and English football fan tokens.",
    tokens: "CITY · AFC · SPURS · AVL · EFC",
    type: "Weighted",
    featured: false,
    category: "Football",
  },
  {
    ticker: "FSLX",
    name: "Fan Spanish League Index",
    description: "Weighted exposure to LaLiga fan tokens reflecting the structure of the Spanish market.",
    tokens: "BAR · ATM · SEVILLA · VCF",
    type: "Weighted",
    featured: false,
    category: "Football",
  },
]

// ─── Why FanIndex cards ──────────────────────────────────────────────────────

const WHY_CARDS = [
  {
    icon: Layers,
    title: "Diversified Exposure",
    body: "Reduce concentration risk across teams and leagues with a single on-chain transaction.",
  },
  {
    icon: Shield,
    title: "On-Chain Transparency",
    body: "All index positions are verifiable on-chain. No black boxes, no custodial risk.",
  },
  {
    icon: Globe2,
    title: "Professional Infrastructure",
    body: "Built for long-term SportFi participation. Institutional-grade design from day one.",
  },
]

// ─── Methodology stats ───────────────────────────────────────────────────────

const METHODOLOGY = [
  { label: "Rebalancing", value: "Monthly" },
  { label: "Weighting", value: "Market-Cap" },
  { label: "Entry Fee", value: "1%" },
  { label: "Exit Fee", value: "0%" },
  { label: "Settlement", value: "Instant" },
  { label: "Position Format", value: "NFT" },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function FanIndexLanding() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-x-hidden bg-background min-h-screen">
      <NavBar />

      <main className="relative z-10 w-full">

        {/* ── SECTION 1: HERO ─────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="relative w-full min-h-[90vh] flex flex-col justify-center pt-24 pb-10"
        >
          {/* Subtle grid texture */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, oklch(0.98 0 0 / 0.03) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.98 0 0 / 0.03) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          {/* Radial glow — top center */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,oklch(0.7_0.19_145/0.08),transparent)]" />

          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

              {/* Left */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                {/* Badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-3.5 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-xs font-medium tracking-wide text-success">Now Live on Chiliz Chain</span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-foreground leading-[1.05] text-balance mb-6">
                  The Index Layer<br />
                  <span className="text-success">for Fan Tokens</span>
                </h1>

                {/* Subheadline */}
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mb-8 text-pretty">
                  Tokenized sports indices, analytics, and portfolio infrastructure
                  for the modern SportFi investor.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-10">
                  <Link href="/indices" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto h-12 px-8 bg-success text-success-foreground hover:bg-success/90 font-semibold gap-2"
                    >
                      Explore Indices
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/fan-tokens" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto h-12 px-8 bg-transparent font-medium"
                    >
                      View Market
                    </Button>
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2">
                  {[
                    "On-Chain Infrastructure",
                    "NFT-Based Positions",
                    "Real-Time Analytics",
                    "Built on Chiliz Chain",
                  ].map((item) => (
                    <span key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="h-1 w-1 rounded-full bg-success" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — floating cards + globe (desktop only) */}
              <div className="hidden lg:flex items-center justify-center relative h-[540px]">

                {/* Globe — behind cards */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] pointer-events-none select-none z-0">
                  {/* Dark overlay so globe blends into background */}
                  <div className="absolute inset-0 rounded-full z-10"
                    style={{ background: "radial-gradient(circle at 50% 50%, transparent 50%, var(--background) 75%)" }}
                  />
                  <Image
                    src="/globe.jpg"
                    alt="Global network"
                    fill
                    className="object-contain opacity-70 mix-blend-luminosity"
                    priority
                  />
                </div>

                {/* Soft ambient glow above globe */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
                  <div className="h-80 w-80 rounded-full bg-success/8 blur-3xl" />
                </div>

                {/* Connecting lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-[2]" aria-hidden>
                  <line x1="50%" y1="46%" x2="21%" y2="14%" stroke="oklch(0.7 0.19 145 / 0.15)" strokeWidth="1" strokeDasharray="5 5" />
                  <line x1="50%" y1="46%" x2="79%" y2="14%" stroke="oklch(0.7 0.19 145 / 0.15)" strokeWidth="1" strokeDasharray="5 5" />
                  <line x1="50%" y1="46%" x2="14%" y2="80%" stroke="oklch(0.7 0.19 145 / 0.15)" strokeWidth="1" strokeDasharray="5 5" />
                  <line x1="50%" y1="46%" x2="86%" y2="80%" stroke="oklch(0.7 0.19 145 / 0.15)" strokeWidth="1" strokeDasharray="5 5" />
                  {/* Dot at center */}
                  <circle cx="50%" cy="46%" r="3" fill="oklch(0.7 0.19 145 / 0.4)" />
                  <circle cx="50%" cy="46%" r="6" fill="none" stroke="oklch(0.7 0.19 145 / 0.15)" strokeWidth="1" />
                </svg>

                {/* FTLX — center large */}
                <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 z-20">
                  <IndexHeroCard ticker="FTLX" name="Fan Token Leaders" type="Weighted · 10 tokens" large />
                </div>

                {/* Surrounding cards */}
                <div className="absolute top-[5%] left-[8%] z-10">
                  <IndexHeroCard ticker="FELX" name="English League" type="Weighted · 5 tokens" />
                </div>
                <div className="absolute top-[5%] right-[8%] z-10">
                  <IndexHeroCard ticker="FSLX" name="Spanish League" type="Weighted · 4 tokens" />
                </div>
                <div className="absolute bottom-[10%] left-[4%] z-10">
                  <IndexHeroCard ticker="FGMX" name="Fan Gaming" type="Equal · 5 tokens" />
                </div>
                <div className="absolute bottom-[10%] right-[4%] z-10">
                  <IndexHeroCard ticker="FFLX" name="Fan Fight" type="Equal · 2 tokens" />
                </div>
              </div>

              {/* Mobile — horizontal scroll strip of cards */}
              <div className="lg:hidden w-full -mx-4 px-4 overflow-x-auto flex gap-3 pb-2 scrollbar-hide">
                {[
                  { ticker: "FTLX", name: "Fan Token Leaders", type: "Weighted · 10", featured: true },
                  { ticker: "FELX", name: "English League",    type: "Weighted · 5",  featured: false },
                  { ticker: "FSLX", name: "Spanish League",    type: "Weighted · 4",  featured: false },
                  { ticker: "FGMX", name: "Fan Gaming",        type: "Equal · 5",     featured: false },
                  { ticker: "FFLX", name: "Fan Fight",         type: "Equal · 2",     featured: false },
                ].map((c) => (
                  <IndexHeroCard key={c.ticker} ticker={c.ticker} name={c.name} type={c.type} featured={c.featured} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: WHY FANINDEX ─────────────────────────────────────── */}
        <section className="relative w-full py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <p className="text-xs font-semibold tracking-widest text-success uppercase mb-4">Infrastructure</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
                Structured Exposure for SportFi
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {WHY_CARDS.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="group relative p-8 rounded-2xl bg-card border border-border hover:border-success/25 transition-all duration-300"
                >
                  <div className="mb-6 h-11 w-11 rounded-xl bg-success/8 flex items-center justify-center group-hover:bg-success/12 transition-colors">
                    <Icon className="h-5 w-5 text-success" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 3: INDEX FAMILY ──────────────────────────────────────── */}
        <section className="relative w-full py-24 lg:py-32 bg-muted/20">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, oklch(0.98 0 0 / 0.02) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.98 0 0 / 0.02) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <p className="text-xs font-semibold tracking-widest text-success uppercase mb-4">Products</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
                The FanIndex Ecosystem
              </h2>
            </div>

            {/* Featured — FTLX */}
            <div className="mb-6">
              <Link href="/indices/FTLX">
                <div className="group relative p-8 sm:p-10 rounded-2xl bg-card border border-success/20 hover:border-success/40 transition-all duration-300 overflow-hidden">
                  <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 bg-[radial-gradient(ellipse_at_top_right,oklch(0.7_0.19_145/0.07),transparent)]" />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="font-mono text-2xl font-bold text-success">FTLX</span>
                        <span className="rounded-full border border-success/20 bg-success/8 px-2.5 py-0.5 text-xs font-medium text-success">Benchmark</span>
                        <span className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs text-muted-foreground">Weighted</span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">Fan Token Leaders Index</h3>
                      <p className="text-sm text-muted-foreground max-w-xl leading-relaxed mb-4">
                        The benchmark index of the fan token market. Tracks the largest and most liquid fan tokens, representing the overall performance of the ecosystem.
                      </p>
                      <p className="text-xs text-muted-foreground font-mono tracking-wide">
                        GAL · ARG · OG · PSG · BAR · ASR · CITY · ATM · POR · JUV
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-success transition-colors shrink-0">
                      <span>View Index</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Grid — remaining 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {INDEX_FAMILY.filter((i) => !i.featured).map((idx) => (
                <Link key={idx.ticker} href={`/indices/${idx.ticker}`}>
                  <div className="group relative h-full p-6 rounded-2xl bg-card border border-border hover:border-success/25 transition-all duration-300 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-lg font-bold text-foreground">{idx.ticker}</span>
                      <span className="text-[10px] rounded-full border border-border px-2 py-0.5 text-muted-foreground">{idx.type}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">{idx.name}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">{idx.description}</p>
                    <p className="text-[10px] text-muted-foreground/70 font-mono truncate">{idx.tokens}</p>
                    <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-success transition-colors">
                      <span>View</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 4: ANALYTICS PLATFORM ───────────────────────────────── */}
        <section className="relative w-full py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs font-semibold tracking-widest text-success uppercase mb-4">Analytics</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance mb-6">
                  Real-Time Fan Token Market Intelligence
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-lg">
                  Track market caps, volumes, CHZ supply percentages, and token rankings across the entire fan token ecosystem. Bloomberg-grade data for SportFi.
                </p>
                <Link href="/fan-tokens">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    Open Market Data
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Terminal-style preview */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                  <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                  <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
                  <span className="ml-2 text-xs text-muted-foreground font-mono">FanIndex Market — Chiliz Chain</span>
                </div>
                {/* Header row */}
                <div className="grid grid-cols-4 gap-2 px-4 pt-4 pb-2 border-b border-border/50">
                  {["Token", "Price (CHZ)", "Market Cap", "24h"].map((h) => (
                    <span key={h} className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</span>
                  ))}
                </div>
                {/* Mock rows */}
                {[
                  { symbol: "BAR", price: "1.842", cap: "$8.2M", change: "+3.14%", pos: true },
                  { symbol: "GAL", price: "0.741", cap: "$6.1M", change: "+1.87%", pos: true },
                  { symbol: "PSG", price: "0.614", cap: "$4.7M", change: "-0.52%", pos: false },
                  { symbol: "CITY", price: "0.537", cap: "$3.9M", change: "+2.31%", pos: true },
                  { symbol: "JUV", price: "0.312", cap: "$2.4M", change: "-1.08%", pos: false },
                  { symbol: "ATM", price: "0.289", cap: "$2.1M", change: "+0.94%", pos: true },
                ].map((row) => (
                  <div key={row.symbol} className="grid grid-cols-4 gap-2 px-4 py-2.5 hover:bg-muted/20 transition-colors">
                    <span className="text-xs font-mono font-semibold text-foreground">{row.symbol}</span>
                    <span className="text-xs font-mono text-muted-foreground">{row.price}</span>
                    <span className="text-xs font-mono text-muted-foreground">{row.cap}</span>
                    <span className={`text-xs font-mono font-medium ${row.pos ? "text-success" : "text-destructive"}`}>{row.change}</span>
                  </div>
                ))}
                <div className="px-4 py-3 border-t border-border/50 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground/60 font-mono">Live · Updated every 60s</span>
                  <Activity className="h-3.5 w-3.5 text-success animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: PORTFOLIO INFRASTRUCTURE ─────────────────────────── */}
        <section className="relative w-full py-24 lg:py-32 bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Portfolio card preview */}
              <div className="order-2 lg:order-1 space-y-3">
                {/* Position card */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Portfolio Value</p>
                      <p className="text-2xl font-bold text-foreground font-mono">1,240.00 CHZ</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-success font-medium">
                      <TrendingUp className="h-4 w-4" />
                      +12.4%
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
                    {[
                      { label: "Active Positions", value: "3" },
                      { label: "Chain Status", value: "Chiliz" },
                      { label: "Position Type", value: "NFT" },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
                        <p className="text-sm font-semibold text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active positions */}
                {[
                  { ticker: "FTLX", amount: "500 CHZ", gain: "+8.2%" },
                  { ticker: "FGMX", amount: "440 CHZ", gain: "+18.7%" },
                  { ticker: "FELX", amount: "300 CHZ", gain: "+10.1%" },
                ].map((pos) => (
                  <div key={pos.ticker} className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-success font-mono">{pos.ticker.slice(0, 2)}</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground font-mono">{pos.ticker}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{pos.amount}</span>
                    <span className="text-xs font-medium text-success">{pos.gain}</span>
                  </div>
                ))}
              </div>

              <div className="order-1 lg:order-2">
                <p className="text-xs font-semibold tracking-widest text-success uppercase mb-4">Portfolio</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance mb-6">
                  Track Your Indexed Positions
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-lg">
                  Every investment is minted as an NFT representing your on-chain indexed position. Track performance, view composition, and redeem at any time.
                </p>
                <div className="flex items-center gap-3">
                  <ConnectWallet />
                  <Link href="/portfolio">
                    <Button variant="outline" className="bg-transparent gap-2">
                      View Portfolio
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: REBALANCE ENGINE ─────────────────────────────────── */}
        <section className="relative w-full py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <p className="text-xs font-semibold tracking-widest text-success uppercase mb-4">Methodology</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
                Monthly Rebalanced Infrastructure
              </h2>
              <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
                Transparent, rules-based index methodology. Every weight, every token, every rebalancing event — verifiable on-chain.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
              {METHODOLOGY.map(({ label, value }) => (
                <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
                  <p className="text-lg font-bold text-foreground mb-1">{value}</p>
                  <p className="text-[11px] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            {/* Process steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: BarChart3, step: "01", title: "Token Selection", body: "Tokens are selected based on on-chain liquidity, market cap, and trading activity on Chiliz Chain." },
                { icon: RefreshCw, step: "02", title: "Monthly Rebalancing", body: "Weights are reviewed and adjusted monthly. Rebalancing events are executed transparently on-chain." },
                { icon: Lock, step: "03", title: "Position Minting", body: "After each investment, an NFT is minted representing the exact composition and value of the position." },
              ].map(({ icon: Icon, step, title, body }) => (
                <div key={step} className="relative p-6 rounded-2xl border border-border bg-card">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <div className="h-10 w-10 rounded-xl bg-success/8 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-success" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-muted-foreground/60 mb-1">{step}</p>
                      <h4 className="text-sm font-semibold text-foreground mb-2">{title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 7: FINAL CTA ────────────────────────────────────────── */}
        <section className="relative w-full py-32 overflow-hidden">
          {/* Background */}
          <div className="pointer-events-none absolute inset-0 bg-foreground" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-success/30 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,oklch(0.7_0.19_145/0.05),transparent)]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-12 text-center">
            {/* Logo strip */}
            <div className="mb-12 flex justify-center">
              <div className="relative w-full max-w-2xl">
                <Image
                  src="/images/new-order-of-logos-1.png"
                  alt="Fan Token Logos — Barcelona, PSG, Manchester City, Juventus, Atletico, Aston Villa"
                  width={1200}
                  height={200}
                  className="w-full h-auto opacity-80"
                  priority
                />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-background text-balance mb-5 leading-tight">
              Built for the Future<br />of SportFi
            </h2>
            <p className="text-base sm:text-lg text-background/60 max-w-xl mx-auto mb-10 leading-relaxed">
              Fan Tokens created a new asset class. FanIndex is building the infrastructure around it.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/indices">
                <Button
                  size="lg"
                  className="h-13 px-10 bg-success text-success-foreground hover:bg-success/90 font-semibold gap-2 text-base"
                >
                  Launch App
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/whitepaper">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 px-10 bg-transparent border-background/20 text-background hover:bg-background/8 font-medium text-base"
                >
                  Read Whitepaper
                </Button>
              </Link>
            </div>

            {/* Bottom built on Chiliz */}
            <div className="mt-16 flex items-center justify-center gap-2 text-background/30">
              <Wallet className="h-4 w-4" />
              <span className="text-sm">Built on Chiliz Chain</span>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}

// ─── Hero index card component ───────────────────────────────────────────────

function IndexHeroCard({
  ticker,
  name,
  type,
  large = false,
  featured = false,
}: {
  ticker: string
  name: string
  type: string
  large?: boolean
  featured?: boolean
}) {
  return (
    <Link href={`/indices/${ticker}`} className="block flex-shrink-0">
      <div
        className={[
          "group relative rounded-2xl cursor-pointer transition-all duration-300",
          // Glassmorphism base
          "border backdrop-blur-md",
          featured || large
            ? "border-success/30 bg-white/[0.04] shadow-[0_0_0_1px_oklch(0.7_0.19_145/0.15),0_8px_32px_rgba(0,0,0,0.35),0_0_24px_oklch(0.7_0.19_145/0.08)] hover:shadow-[0_0_0_1px_oklch(0.7_0.19_145/0.30),0_12px_40px_rgba(0,0,0,0.4),0_0_36px_oklch(0.7_0.19_145/0.14)]"
            : "border-white/8 bg-white/[0.03] shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:border-success/20 hover:bg-white/[0.055]",
          large ? "px-6 py-5 min-w-[190px]" : "px-4 py-4 min-w-[148px]",
        ].join(" ")}
      >
        {/* Top accent line for featured */}
        {(featured || large) && (
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-success/50 to-transparent" />
        )}

        {/* Ticker */}
        <div className={`font-mono font-bold tracking-tight text-success ${large ? "text-2xl mb-1.5" : "text-base mb-1"}`}>
          {ticker}
        </div>

        {/* Name */}
        <div className={`font-medium text-foreground/90 ${large ? "text-sm leading-snug" : "text-xs leading-snug"}`}>
          {name}
        </div>

        {/* Type */}
        <div className={`text-muted-foreground/70 ${large ? "text-xs mt-1.5" : "text-[10px] mt-1"}`}>
          {type}
        </div>

        {/* Live pill — only on center card */}
        {large && (
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-success/10 border border-success/20 px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-semibold tracking-wide text-success uppercase">Live</span>
          </div>
        )}
      </div>
    </Link>
  )
}
