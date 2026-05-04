"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FinalCTA() {
  const t = useTranslations("cta")

  return (
    <section className="relative w-full overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, color-mix(in oklch, var(--success) 10%, transparent), transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-success/40 to-transparent"
      />

      <div className="relative mx-auto max-w-5xl px-6 py-32 text-center sm:px-8 sm:py-40 lg:px-12">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-success">
          {t("label")}
        </span>
        <h2 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t("description")}
        </p>

        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link href="/indices">
            <Button
              size="lg"
              className="h-12 w-full rounded-full bg-success px-8 text-sm font-semibold text-success-foreground hover:bg-success/90 sm:w-auto"
            >
              {t("launchApp")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/whitepaper">
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-full border-border bg-card/40 px-8 text-sm font-semibold text-foreground backdrop-blur hover:bg-card/70 sm:w-auto"
            >
              {t("readWhitepaper")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
