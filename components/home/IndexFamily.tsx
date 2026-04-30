"use client"

import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight, Trophy, Gamepad2, Swords, Flag, MapPin } from "lucide-react"
import { useMemo, useRef } from "react"
import { useCoinGeckoPrices } from "@/lib/hooks/use-coingecko-prices"
import { INDICES, calculateIndexPrice } from "@/lib/data/indices"

const FAMILY = [
  {
    ticker: "FTLX",
    title: "Fan Token Leaders Index",
    tagline: "The Benchmark Index for Fan Tokens",
    description:
      "The flagship benchmark tracking the largest and most liquid fan tokens across the global SportFi market.",
    icon: Trophy,
    featured: true,
  },
  {
    ticker: "FGMX",
    title: "Fan Gaming Index",
    tagline: "Esports & Competitive Gaming",
    description: "Diversified exposure to the leading esports organizations on Chiliz.",
    icon: Gamepad2,
    featured: false,
  },
  {
    ticker: "FFLX",
    title: "Fan Fight Index",
    tagline: "Combat Sports",
    description: "Structured exposure to top combat sports organizations.",
    icon: Swords,
    featured: false,
  },
  {
    ticker: "FELX",
    title: "Fan English League Index",
    tagline: "Premier League Football",
    description: "Weighted exposure to leading English football clubs.",
    icon: Flag,
    featured: false,
  },
  {
    ticker: "FSLX",
    title: "Fan Spanish League Index",
    tagline: "La Liga Football",
    description: "Weighted exposure to top Spanish football clubs.",
    icon: MapPin,
    featured: false,
  },
] as const

export function IndexFamily() {
  const { prices: liveTokenPrices } = useCoinGeckoPrices()
  const scrollerRef = useRef<HTMLDivElement>(null)

  const data = useMemo(() => {
    return FAMILY.map((f) => {
      const idx = INDICES.find((i) => i.symbol === f.ticker)
      const price = idx
        ? calculateIndexPrice(idx.tokens, liveTokenPrices, idx.weights)
        : 0
      return {
        ...f,
        price: price > 0 ? price.toFixed(2) : idx ? Number(idx.price).toFixed(2) : "—",
        constituents: idx?.tokens.length ?? 0,
        href: `/indices/${f.ticker}`,
      }
    })
  }, [liveTokenPrices])

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" })
  }

  return (
    <section className="relative w-full border-b border-border/40 py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-success">
              Index Family
            </span>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              The FanIndex Ecosystem
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
              A family of professionally structured indices providing transparent, diversified exposure to the SportFi market.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-360)}
              aria-label="Scroll previous"
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card/60 text-foreground transition-colors hover:border-success/40 hover:text-success"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(360)}
              aria-label="Scroll next"
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card/60 text-foreground transition-colors hover:border-success/40 hover:text-success"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
          style={{ scrollPaddingLeft: "0.5rem" }}
        >
          {data.map((item) => (
            <IndexFactCard key={item.ticker} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

function IndexFactCard({
  item,
}: {
  item: ReturnType<typeof Object> & {
    ticker: string
    title: string
    tagline: string
    description: string
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
    featured: boolean
    price: string
    constituents: number
    href: string
  }
}) {
  const Icon = item.icon
  const widthClass = item.featured
    ? "min-w-[320px] sm:min-w-[440px] lg:min-w-[520px]"
    : "min-w-[280px] sm:min-w-[340px]"

  return (
    <Link
      href={item.href}
      className={`group relative ${widthClass} snap-start overflow-hidden rounded-2xl border border-border/70 bg-card/40 p-7 backdrop-blur-sm transition-all hover:border-success/40 hover:bg-card/70`}
    >
      {item.featured && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 100% 0%, color-mix(in oklch, var(--success) 12%, transparent), transparent 60%)",
          }}
        />
      )}

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/80 bg-background/40">
            <Icon className="h-4 w-4 text-success" strokeWidth={1.75} />
          </div>
          {item.featured && (
            <span className="rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-success">
              Benchmark
            </span>
          )}
        </div>

        <div className="mt-7">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xl font-semibold tracking-tight text-foreground">
              {item.ticker}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              · {item.constituents} constituents
            </span>
          </div>
          <h3
            className={`mt-2 font-semibold tracking-tight text-foreground ${
              item.featured ? "text-2xl sm:text-[1.6rem]" : "text-lg"
            }`}
          >
            {item.tagline}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        </div>

        <div className="mt-auto pt-8">
          <div className="flex items-end justify-between border-t border-border/60 pt-4">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                NAV
              </div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-mono text-2xl font-semibold tracking-tight text-foreground">
                  {item.price}
                </span>
                <span className="text-xs text-muted-foreground">CHZ</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/80 transition-colors group-hover:text-success">
              View
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
