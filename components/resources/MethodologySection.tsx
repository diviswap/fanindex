"use client"

import { PieChart, TrendingUp, DollarSign, Gauge } from "lucide-react"
import { useTranslations } from "next-intl"

export function MethodologySection() {
  const t = useTranslations("methodology")

  const methodologyItems = [
    {
      titleKey: "items.weightAllocation.title",
      descriptionKey: "items.weightAllocation.description",
      icon: PieChart,
    },
    {
      titleKey: "items.monthlyRebalance.title",
      descriptionKey: "items.monthlyRebalance.description",
      icon: TrendingUp,
    },
    {
      titleKey: "items.liquidityMethodology.title",
      descriptionKey: "items.liquidityMethodology.description",
      icon: DollarSign,
    },
  ]

  return (
    <section id="methodology" className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-success/10">
            <Gauge className="h-6 w-6 text-success" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t("title")}</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {t("description")}
        </p>
      </div>

      {/* Formula Highlight */}
      <div className="relative border border-success/20 bg-success/5 backdrop-blur-sm rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-success/5 via-transparent to-transparent opacity-50" />
        <div className="relative z-10 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{t("pricingFormula")}</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {t("pricingDescription")}
            </p>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
            <div className="font-mono text-center text-2xl md:text-3xl font-bold text-success tracking-wide">
              {t("formula")}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4">
              {t("formulaExplain")}
            </p>
          </div>
          <div className="grid gap-3 text-sm text-muted-foreground">
            <p>
              {t("example")}
            </p>
          </div>
        </div>
      </div>

      {/* Methodology Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {methodologyItems.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.titleKey}
              className="border border-border bg-card/50 backdrop-blur-sm p-6 rounded-2xl hover:border-success/30 hover:bg-card transition-all duration-300"
            >
              {Icon && (
                <div className="mb-4">
                  <div className="inline-flex p-3 rounded-lg bg-success/5">
                    <Icon className="h-5 w-5 text-success" />
                  </div>
                </div>
              )}
              <h3 className="text-lg font-semibold text-foreground mb-2">{t(item.titleKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(item.descriptionKey)}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
