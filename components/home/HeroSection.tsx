"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Activity, Hexagon, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCoinGeckoPrices } from "@/lib/hooks/use-coingecko-prices"
import { INDICES, calculateIndexPrice } from "@/lib/data/indices"
import { useMemo } from "react"

const INDEX_TICKERS = ["FTLX", "FGMX", "FFLX", "FELX", "FSLX"] as const

/**
 * Floating cards orbit around a much larger globe.
 * Each card has a unique vertical band — no overlaps at any breakpoint.
 *
 *  FTLX  — top-left,  band 1  (top ~4%)
 *  FGMX  — top-right, band 2  (top ~18%)
 *  FSLX  — mid-left,  band 3  (top ~46%)
 *  FFLX  — bottom-left, band 4 (bottom ~18%)
 *  FELX  — bottom-right, band 5 (bottom ~4%)
 */
const TICKER_META: Record<
  (typeof INDEX_TICKERS)[number],
  { label: string; category: string; position: string; delay: string }
> = {
  FTLX: {
    label: "Fan Token Leaders",
    category: "Benchmark",
    position: "top-[4%] left-[-2%] sm:left-[-6%] lg:left-[-10%]",
    delay: "0s",
  },
  FGMX: {
    label: "Fan Gaming",
    category: "Esports",
    position: "top-[18%] right-[-2%] sm:right-[-8%] lg:right-[-12%]",
    delay: "0.6s",
  },
  FSLX: {
    label: "Spanish League",
    category: "Football",
    position: "top-[46%] left-[-4%] sm:left-[-14%] lg:left-[-18%]",
    delay: "2.4s",
  },
  FFLX: {
    label: "Fan Fight",
    category: "Combat",
    position: "bottom-[18%] left-[0%] sm:left-[-6%] lg:left-[-8%]",
    delay: "1.2s",
  },
  FELX: {
    label: "English League",
    category: "Football",
    position: "bottom-[4%] right-[-2%] sm:right-[-4%] lg:right-[-6%]",
    delay: "1.8s",
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
      {/* Radial backdrop glow — anchored where the globe sits */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 75% 45%, color-mix(in oklch, var(--success) 14%, transparent), transparent 60%)",
        }}
      />
      {/* Soft ambient grid wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-success/40 to-transparent"
      />

      {/*
        Layout strategy:
        Mobile  → grid 55/45 — copy left, globe right (bleeds ~30% off-screen).
        Tablet  → grid 1fr / auto with globe ~480px.
        Desktop → grid 1fr / 1.15fr giving the globe up to 820px of canvas.
        Min height ensures the hero always feels cinematic.
      */}
      <div
        className="
          relative mx-auto grid max-w-[1400px] items-center
          grid-cols-[1.1fr_minmax(0,42%)] gap-4
          px-5 pt-24 pb-16
          sm:grid-cols-[1fr_auto] sm:gap-10 sm:px-8 sm:pt-32 sm:pb-24
          lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:px-14 lg:pt-40 lg:pb-32
          min-h-[88vh] lg:min-h-[92vh]
        "
      >
        {/* Left — copy */}
        <div className="relative z-10 min-w-0">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-success/25 bg-success/[0.06] px-2.5 py-1 backdrop-blur sm:gap-2.5 sm:px-3.5 sm:py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-foreground/90 sm:text-[11px] sm:tracking-[0.16em] whitespace-nowrap">
              Live on Chiliz Chain
            </span>
          </div>

          <h1
            className="
              mt-4 text-balance font-semibold tracking-tight text-foreground
              text-[26px] leading-[1.08]
              sm:mt-8 sm:text-[3.75rem] sm:leading-[1.02]
              lg:text-[5.25rem] lg:leading-[0.98]
              xl:text-[6rem]
            "
          >
            The Index Layer for{" "}
            <span className="whitespace-nowrap text-success">Fan Tokens</span>
          </h1>

          <p className="mt-3 max-w-xl text-pretty text-[12.5px] leading-snug text-muted-foreground sm:mt-7 sm:text-lg sm:leading-relaxed lg:mt-9 lg:max-w-[34rem] lg:text-xl">
            <span className="hidden sm:inline">
              Tokenized sports indices, real-time analytics, and portfolio
              infrastructure built for the modern SportFi investor.
            </span>
            <span className="sm:hidden">
              Tokenized sports indices &amp; portfolio infrastructure for SportFi.
            </span>
          </p>

          <div className="mt-5 flex flex-col items-stretch gap-2 sm:mt-10 sm:flex-row sm:items-center sm:gap-3 lg:mt-12">
            <Link href="/indices">
              <Button
                size="lg"
                className="
                  h-10 w-full rounded-full bg-success px-5 text-[12.5px] font-semibold text-success-foreground hover:bg-success/90
                  sm:h-12 sm:w-auto sm:px-8 sm:text-sm
                  lg:h-14 lg:px-9 lg:text-base
                "
              >
                Explore Indices
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 sm:ml-2 sm:h-4 sm:w-4" />
              </Button>
            </Link>
            <Link href="/fan-tokens">
              <Button
                size="lg"
                variant="outline"
                className="
                  h-10 w-full rounded-full border-border bg-card/40 px-5 text-[12.5px] font-semibold text-foreground backdrop-blur hover:bg-card/70
                  sm:h-12 sm:w-auto sm:px-8 sm:text-sm
                  lg:h-14 lg:px-9 lg:text-base
                "
              >
                View Market
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-14 hidden grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 sm:grid lg:mt-20">
            <TrustItem icon={Hexagon} label="On-Chain Infrastructure" />
            <TrustItem icon={Activity} label="NFT-Based Positions" />
            <TrustItem icon={BarChart3} label="Real-Time Analytics" />
          </div>
        </div>

        {/* Right — globe + floating cards */}
        {/*
          Sizing: mobile bleeds ~30% off-screen for cinematic crop.
          Tablet/desktop scales up dramatically (max 820px).
          The container itself is overflow-visible so cards orbit beyond the globe edge.
        */}
        <div
          className="
            relative w-full flex-shrink-0
            -mr-[18%] sm:mr-0
            sm:max-w-[520px] sm:mx-auto
            lg:max-w-[820px] lg:mx-0 lg:justify-self-end
          "
        >
          <div className="relative aspect-square w-full overflow-visible">
            {/* Outer ambient glow */}
            <div
              aria-hidden
              className="absolute inset-[8%] rounded-full opacity-60 blur-[80px]"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklch, var(--success) 40%, transparent), transparent 70%)",
              }}
            />
            {/* Inner concentric ring (subtle, only sm+) */}
            <div
              aria-hidden
              className="absolute inset-[10%] hidden rounded-full border border-success/10 sm:block"
            />
            <div
              aria-hidden
              className="absolute inset-[2%] hidden rounded-full border border-success/[0.06] sm:block"
            />

            <Image
              src="/images/globe.png"
              alt="Global SportFi network visualization"
              fill
              priority
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 520px, 820px"
              className="object-contain"
              style={{
                mixBlendMode: "screen",
                maskImage:
                  "radial-gradient(ellipse 92% 88% at 50% 46%, black 32%, rgba(0,0,0,0.6) 58%, transparent 72%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 92% 88% at 50% 46%, black 32%, rgba(0,0,0,0.6) 58%, transparent 72%)",
              }}
            />

            {/* Floating ETF-style cards — desktop/tablet only */}
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
    <div className="flex items-center gap-2 bg-background px-3 py-3.5 sm:gap-2.5 sm:px-5 sm:py-4">
      <Icon className="h-3.5 w-3.5 flex-shrink-0 text-success" />
      <span className="text-[10px] font-medium uppercase leading-tight tracking-[0.08em] text-muted-foreground sm:text-[11px] sm:tracking-[0.1em]">
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
    <Link
      href={`/indices/${ticker.toLowerCase()}`}
      className="
        group relative block rounded-xl border border-border/80 bg-card/70 backdrop-blur-xl
        shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6)]
        transition-all hover:border-success/40 hover:-translate-y-0.5
        hover:shadow-[0_12px_44px_-8px_color-mix(in_oklch,var(--success)_30%,transparent)]
        w-[170px] p-3
        sm:w-[190px] sm:p-3.5
        lg:w-[210px] lg:p-4
      "
    >
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
          <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-[10px]">
            {category}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-success/80" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5 sm:mt-2.5">
          <span className="font-mono text-base font-semibold tracking-tight text-foreground sm:text-lg">
            {ticker}
          </span>
        </div>
        <div className="mt-0.5 truncate text-[11px] text-muted-foreground sm:text-xs">
          {label}
        </div>
        <div className="mt-2.5 flex items-baseline justify-between border-t border-border/60 pt-2 sm:mt-3 sm:pt-2.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">NAV</span>
          <span className="font-mono text-sm font-semibold text-foreground sm:text-base">
            {price ?? "—"}
            <span className="ml-0.5 text-[10px] text-muted-foreground">CHZ</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
