"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Activity, Hexagon, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCoinGeckoPrices } from "@/lib/hooks/use-coingecko-prices"
import { INDICES, calculateIndexPrice } from "@/lib/data/indices"
import { useMemo } from "react"

const INDEX_TICKERS = ["FTLX", "FGMX", "FFLX", "FELX", "FSLX"] as const

const TICKER_META: Record<
  (typeof INDEX_TICKERS)[number],
  { label: string; category: string; position: string; delay: string }
> = {
  FTLX: {
    label: "Fan Token Leaders",
    category: "Benchmark",
    position: "top-[6%] left-[2%] sm:left-[-4%]",
    delay: "0s",
  },
  FGMX: {
    label: "Fan Gaming",
    category: "Esports",
    position: "top-[18%] right-[2%] sm:right-[-6%]",
    delay: "0.6s",
  },
  FFLX: {
    label: "Fan Fight",
    category: "Combat",
    position: "bottom-[42%] left-[-2%] sm:left-[-8%]",
    delay: "1.2s",
  },
  FELX: {
    label: "English League",
    category: "Football",
    position: "bottom-[10%] right-[6%] sm:right-[-2%]",
    delay: "1.8s",
  },
  FSLX: {
    label: "Spanish League",
    category: "Football",
    position: "top-[44%] left-[-4%] sm:left-[-12%]",
    delay: "2.4s",
  },
}

export function HeroSection() {
  const { prices: liveTokenPrices } = useCoinGeckoPrices()

  const indexPrices = useMemo(() => {
    const map = new Map<string, string>()
    INDICES.filter((i) => INDEX_TICKERS.includes(i.symbol as any)).forEach((idx) => {
      const p = calculateIndexPrice(idx.tokens, liveTokenPrices, idx.weights)
      map.set(idx.symbol!, p > 0 ? p.toFixed(2) : Number(idx.price).toFixed(2))
    })
    return map
  }, [liveTokenPrices])

  return (
    <section className="relative w-full overflow-x-hidden border-b border-border/40">
      {/* Subtle radial gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 30%, color-mix(in oklch, var(--success) 8%, transparent), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-success/40 to-transparent"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-0 px-6 pt-28 pb-0 sm:gap-10 sm:pb-20 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-12 lg:pt-36 lg:pb-32">
        {/* Left — copy */}
        <div className="relative z-10 pb-6 sm:pb-0">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-success/25 bg-success/[0.06] px-3.5 py-1.5 backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-foreground/90">
              Now Live on Chiliz Chain
            </span>
          </div>

          <h1 className="mt-7 text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-[4.5rem]">
            The Index Layer for{" "}
            <span className="relative whitespace-nowrap text-success">
              Fan Tokens
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tokenized sports indices, analytics, and portfolio infrastructure for the modern SportFi investor.
          </p>

          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Link href="/indices">
              <Button
                size="lg"
                className="h-12 w-full rounded-full bg-success px-7 text-sm font-semibold text-success-foreground hover:bg-success/90 sm:w-auto"
              >
                Explore Indices
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/fan-tokens">
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full rounded-full border-border bg-card/40 px-7 text-sm font-semibold text-foreground backdrop-blur hover:bg-card/70 sm:w-auto"
              >
                View Market
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40">
            <TrustItem icon={Hexagon} label="On-Chain Infrastructure" />
            <TrustItem icon={Activity} label="NFT-Based Positions" />
            <TrustItem icon={BarChart3} label="Real-Time Analytics" />
          </div>
        </div>

        {/* Right — globe + floating cards */}
        <div className="relative w-full mx-auto lg:mx-0 aspect-square max-w-[480px] sm:max-w-[640px] overflow-visible -mb-16 sm:mb-0">
          {/* Soft green glow behind globe */}
          <div
            aria-hidden
            className="absolute inset-[12%] rounded-full opacity-50 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklch, var(--success) 35%, transparent), transparent 70%)",
            }}
          />

          <div className="relative h-full w-full">
            <Image
              src="/images/globe.png"
              alt="Global SportFi network visualization"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 640px"
              className="object-contain"
              style={{
                mixBlendMode: "screen",
                maskImage:
                  "radial-gradient(ellipse 90% 80% at 50% 44%, black 30%, rgba(0,0,0,0.55) 55%, transparent 70%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 90% 80% at 50% 44%, black 30%, rgba(0,0,0,0.55) 55%, transparent 70%)",
              }}
            />
          </div>

          {/* Floating ETF-style cards */}
          {INDEX_TICKERS.map((ticker) => {
            const meta = TICKER_META[ticker]
            const price = indexPrices.get(ticker)
            return (
              <div
                key={ticker}
                className={`absolute ${meta.position} hidden sm:block`}
                style={{
                  animation: `float-y 7s ease-in-out infinite`,
                  animationDelay: meta.delay,
                }}
              >
                <FloatingTickerCard
                  ticker={ticker}
                  label={meta.label}
                  category={meta.category}
                  price={price}
                />
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes float-y {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  )
}

function TrustItem({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <div className="flex items-center gap-2.5 bg-background px-4 py-3.5">
      <Icon className="h-3.5 w-3.5 text-success" />
      <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

function FloatingTickerCard({
  ticker,
  label,
  category,
  price,
}: {
  ticker: string
  label: string
  category: string
  price?: string
}) {
  return (
    <div className="group relative w-[180px] rounded-xl border border-border/80 bg-card/70 p-3.5 backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6)] transition-all hover:border-success/40 hover:shadow-[0_8px_40px_-8px_color-mix(in_oklch,var(--success)_30%,transparent)]">
      {/* Edge highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-30"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklch, var(--success) 25%, transparent), transparent 40%)",
        }}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {category}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-success/80" />
        </div>
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="font-mono text-base font-semibold tracking-tight text-foreground">
            {ticker}
          </span>
        </div>
        <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
          {label}
        </div>
        <div className="mt-3 flex items-baseline justify-between border-t border-border/60 pt-2.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">NAV</span>
          <span className="font-mono text-sm font-semibold text-foreground">
            {price ? `${price}` : "—"}
            <span className="ml-1 text-[10px] text-muted-foreground">CHZ</span>
          </span>
        </div>
      </div>
    </div>
  )
}
