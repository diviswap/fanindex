"use client"

import { Layers, Shield, Cpu } from "lucide-react"
import { useTranslations } from "next-intl"

export function WhyFanIndex() {
  const t = useTranslations("why")

  const ITEMS = [
    {
      icon: Layers,
      titleKey: "items.diversified.title",
      descKey: "items.diversified.description",
    },
    {
      icon: Shield,
      titleKey: "items.transparent.title",
      descKey: "items.transparent.description",
    },
    {
      icon: Cpu,
      titleKey: "items.professional.title",
      descKey: "items.professional.description",
    },
  ] as const

  return (
    <section className="relative w-full border-b border-border/40 py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-success">
            {t("label")}
          </span>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t("title")}
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 md:grid-cols-3">
          {ITEMS.map(({ icon: Icon, titleKey, descKey }) => (
            <div
              key={titleKey}
              className="group relative bg-background p-8 transition-colors hover:bg-card/60 sm:p-10"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border/80 bg-card/60">
                <Icon className="h-4 w-4 text-success" strokeWidth={1.75} />
              </div>
              <h3 className="mt-7 text-xl font-semibold tracking-tight text-foreground">
                {t(titleKey)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(descKey)}
              </p>
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
