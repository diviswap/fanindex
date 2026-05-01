"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Trophy, Gamepad2, Swords, Flag, MapPin } from "lucide-react"
import { useMemo } from "react"
import { useCoinGeckoPrices } from "@/lib/hooks/use-coingecko-prices"
import { INDICES, calculateIndexPrice } from "@/lib/data/indices"
import { getTokenBySymbol } from "@/lib/data/fan-tokens"

const FAMILY = [
  {
    ticker: "FTLX",
    title: "Fan Token Leaders Index",
    tagline: "Benchmark",
    description:
      "The flagship benchmark tracking the largest and most liquid fan tokens.",
    icon: Trophy,
    accent: "text-success",
    accentBg: "bg-success/10 border-success/25",
  },
  {
    ticker: "FGMX",
    title: "Fan Gaming Index",
    tagline: "Esports",
    description: "Diversified exposure to leading esports organizations on Chiliz.",
    icon: Gamepad2,
    accent: "text-amber-400",
    accentBg: "bg-amber-400/10 border-amber-400/25",
  },
  {
    ticker: "FFLX",
    title: "Fan Fight Index",
    tagline: "Combat Sports",
    description: "Structured exposure to top combat sports organizations.",
    icon: Swords,
    accent: "text-rose-400",
    accentBg: "bg-rose-400/10 border-rose-400/25",
  },
  {
    ticker: "FELX",
    title: "Fan English League Index",
    tagline: "Premier League",
    description: "Weighted exposure to leading English football clubs.",
    icon: Flag,
    accent: "text-blue-400",
    accentBg: "bg-blue-400/10 border-blue-400/25",
  },
  {
    ticker: "FSLX",
    title: "Fan Spanish League Index",
    tagline: "La Liga",
    description: "Weighted exposure to top Spanish football clubs.",
    icon: MapPin,
    accent: "text-orange-400",
    accentBg: "bg-orange-400/10 border-orange-400/25",
  },
] as const

export function IndexFamily() {
  const { prices: liveTokenPrices } = useCoinGeckoPrices()

  const data = useMemo(() => {
    return FAMILY.map((f) => {
      const idx = INDICES.find((i) => i.symbol === f.ticker)
      const navNum = idx
        ? calculateIndexPrice(idx.tokens, liveTokenPrices, idx.weights)
        : 0
      return {
        ...f,
        nav: navNum > 0
          ? navNum.toFixed(2)
          : idx ? Number(idx.price).toFixed(2) : "—",
        tokens: idx?.tokens ?? [],
        weights: idx?.weights,
        constituents: idx?.tokens.length ?? 0,
        href: `/indices/${f.ticker}`,
      }
    })
  }, [liveTokenPrices])

  // Duplicate the list so the CSS marquee can wrap seamlessly.
  const loop = [...data, ...data]

  return (
    <section className="relative w-full border-b border-border/40 py-28 sm:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
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
      </div>

      {/* Marquee track — full bleed for cinematic effect, with edge fades */}
      <div className="relative mt-14 sm:mt-16">
        {/* Left fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent"
        />
        {/* Right fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent"
        />

        <div className="flex animate-scroll w-max gap-5 sm:gap-6">
          {loop.map((item, i) => (
            <IndexFactCard key={`${item.ticker}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface FamilyCardItem {
  ticker: string
  title: string
  tagline: string
  description: string
  icon: React.ComponentType<any>
  accent: string
  accentBg: string
  nav: string
  tokens: readonly string[] | string[]
  constituents: number
  href: string
}

function IndexFactCard({ item }: { item: FamilyCardItem }) {
  const Icon = item.icon

  // Show first 5 tokens as logo stack, rest as +N
  const visibleTokens = item.tokens.slice(0, 5)
  const remainder = item.tokens.length - visibleTokens.length

  return (
    <Link
      href={item.href}
      className="group relative w-[300px] sm:w-[360px] shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-card/40 p-6 sm:p-7 backdrop-blur-sm transition-all hover:border-success/40 hover:bg-card/70"
    >
      {/* Subtle accent glow in top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50 transition-opacity group-hover:opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 70% 80% at 100% 0%, color-mix(in oklch, var(--success) 8%, transparent), transparent 60%)",
        }}
      />

      <div className="relative flex h-full flex-col">
        {/* Header: icon + category badge */}
        <div className="flex items-center justify-between">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg border ${item.accentBg}`}
          >
            <Icon className={`h-4 w-4 ${item.accent}`} strokeWidth={1.75} />
          </div>
          <span className="rounded-full border border-border/70 bg-background/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {item.tagline}
          </span>
        </div>

        {/* Ticker + title */}
        <div className="mt-6">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-base font-semibold tracking-tight text-foreground">
              {item.ticker}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              · {item.constituents} assets
            </span>
          </div>
          <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {item.title}
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        </div>

        {/* Token logo stack */}
        <div className="mt-6">
          <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground mb-2.5">
            Constituents
          </div>
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {visibleTokens.map((sym) => {
                const t = getTokenBySymbol(sym)
                return (
                  <div
                    key={sym}
                    className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card ring-2 ring-background"
                    title={sym}
                  >
                    {t?.icon ? (
                      <Image
                        src={t.icon}
                        alt={sym}
                        width={26}
                        height={26}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="text-[9px] font-semibold text-foreground">
                        {sym.slice(0, 3)}
                      </span>
                    )}
                  </div>
                )
              })}
              {remainder > 0 && (
                <div className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-[10px] font-semibold text-muted-foreground ring-2 ring-background">
                  +{remainder}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer: NAV + view */}
        <div className="mt-7 flex items-end justify-between border-t border-border/60 pt-5">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              NAV
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-mono text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                {item.nav}
              </span>
              <span className="text-xs text-muted-foreground">CHZ</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/80 transition-colors group-hover:text-success">
            View
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </Link>
  )
}
