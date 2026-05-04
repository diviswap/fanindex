"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Activity, Hexagon, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCoinGeckoPrices } from "@/lib/hooks/use-coingecko-prices"
import { INDICES, calculateIndexPrice } from "@/lib/data/indices"
import { useMemo } from "react"
import { useTranslations } from "next-intl"

const INDEX_TICKERS = ["FTLX", "FGMX", "FFLX", "FELX", "FSLX"] as const

const TICKER_META: Record<
  (typeof INDEX_TICKERS)[number],
  { position: string; delay: string }
> = {
  FTLX: { position: "top-[10%] left-[0%] sm:left-[-4%]", delay: "0s" },
  FGMX: { position: "top-[10%] right-[0%] sm:right-[-6%]", delay: "0.6s" },
  FSLX: { position: "top-[46%] left-[0%] sm:left-[-12%]", delay: "2.4s" },
  FFLX: { position: "top-[-4%] left-1/2 -translate-x-1/2", delay: "1.2s" },
  FELX: { position: "bottom-[5%] right-[0%] sm:right-[-2%]", delay: "1.8s" },
}

export function HeroSection() {
  const t = useTranslations("hero")
  const tFamily = useTranslations("indexFamily")
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

      <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-12 sm:grid sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 sm:px-8 sm:pt-28 sm:pb-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-12 lg:pt-36 lg:pb-32">
        {/* Left — copy */}
        <div className="relative z-10 min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-success/25 bg-success/[0.06] px-3 py-1.5 backdrop-blur sm:gap-2.5 sm:px-3.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/90 sm:text-[11px] sm:tracking-[0.14em] whitespace-nowrap">
              {t("badge")}
            </span>
          </div>

          <h1 className="mt-4 text-balance text-[40px] font-semibold leading-[1.05] tracking-tight text-foreground sm:mt-7 sm:text-5xl sm:leading-[1.05] lg:text-[4.5rem]">
            {t("title")}{" "}
            <span className="whitespace-nowrap text-success">{t("titleHighlight")}</span>
          </h1>

          <p className="mt-4 max-w-xl text-pretty text-[16px] leading-relaxed text-muted-foreground sm:mt-6 sm:text-base sm:leading-relaxed lg:text-lg">
            {t("description")}
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-3">
            <Link href="/indices">
              <Button
                size="lg"
                className="h-13 w-full rounded-full bg-success px-6 text-base font-semibold text-success-foreground hover:bg-success/90 sm:h-12 sm:w-auto sm:px-7 sm:text-sm"
              >
                {t("exploreIndices")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/fan-tokens">
              <Button
                size="lg"
                variant="outline"
                className="h-13 w-full rounded-full border-border bg-card/40 px-6 text-base font-semibold text-foreground backdrop-blur hover:bg-card/70 sm:h-12 sm:w-auto sm:px-7 sm:text-sm"
              >
                {t("viewMarket")}
              </Button>
            </Link>
          </div>

          <div className="mt-12 hidden grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 sm:grid">
            <TrustItem icon={Hexagon} label={t("trust.onChain")} />
            <TrustItem icon={Activity} label={t("trust.nftPositions")} />
            <TrustItem icon={BarChart3} label={t("trust.analytics")} />
          </div>
        </div>

        {/* Right — globe + floating cards */}
        <div className="hidden sm:block sm:relative sm:w-auto sm:h-auto sm:max-w-[640px] sm:mx-0">
          <div className="relative w-full h-full sm:aspect-square sm:w-full sm:overflow-visible">
            <div
              aria-hidden
              className="absolute inset-[12%] rounded-full opacity-50 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, color-mix(in oklch, var(--success) 35%, transparent), transparent 70%)",
              }}
            />

            <Image
              src="/images/globe.png"
              alt="Global SportFi network visualization"
              fill
              priority
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 90vw, 640px"
              className="object-contain sm:object-contain"
              style={{
                mixBlendMode: "screen",
                maskImage:
                  "radial-gradient(ellipse 90% 80% at 50% 44%, black 30%, rgba(0,0,0,0.55) 55%, transparent 70%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 90% 80% at 50% 44%, black 30%, rgba(0,0,0,0.55) 55%, transparent 70%)",
              }}
            />

            {INDEX_TICKERS.map((ticker) => {
              const meta = TICKER_META[ticker]
              const price = indexPrices.get(ticker)
              const item = tFamily.raw(`items.${ticker}`) as { label: string; category: string }
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
                    label={tFamily(`items.${ticker}.title`)}
                    category={tFamily(`items.${ticker}.tagline`)}
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
    <div className="flex items-center gap-1.5 bg-background px-2 py-3 sm:gap-2.5 sm:px-4 sm:py-3.5">
      <Icon className="h-3 w-3 flex-shrink-0 text-success sm:h-3.5 sm:w-3.5" />
      <span className="text-[9px] font-medium uppercase leading-tight tracking-[0.06em] text-muted-foreground sm:text-[11px] sm:tracking-[0.08em]">
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
      className="group relative block w-[160px] rounded-xl border border-border/80 bg-card/70 p-3 backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6)] transition-all hover:border-success/40 hover:shadow-[0_8px_40px_-8px_color-mix(in_oklch,var(--success)_30%,transparent)] hover:-translate-y-0.5 sm:w-[180px] sm:p-3.5"
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
          <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {category}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-success/80" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5 sm:mt-2.5">
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground sm:text-base">
            {ticker}
          </span>
        </div>
        <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
          {label}
        </div>
        <div className="mt-2.5 flex items-baseline justify-between border-t border-border/60 pt-2 sm:mt-3 sm:pt-2.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">NAV</span>
          <span className="font-mono text-xs font-semibold text-foreground sm:text-sm">
            {price ?? "—"}
            <span className="ml-0.5 text-[10px] text-muted-foreground">CHZ</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
