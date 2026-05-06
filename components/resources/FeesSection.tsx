"use client"

import { CreditCard, TrendingDown, Zap, AlertCircle } from "lucide-react"
import { useTranslations } from "next-intl"

export function FeesSection() {
  const t = useTranslations("fees")

  const feeItems = [
    {
      icon: CreditCard,
      titleKey: "entryFee.title",
      amountKey: "entryFee.amount",
      descriptionKey: "entryFee.description",
      detailsKey: "entryFee.details",
    },
    {
      icon: TrendingDown,
      titleKey: "exitFee.title",
      amountKey: "exitFee.amount",
      descriptionKey: "exitFee.description",
      detailsKey: "exitFee.details",
    },
    {
      icon: Zap,
      titleKey: "managementFee.title",
      amountKey: "managementFee.amount",
      descriptionKey: "managementFee.description",
      detailsKey: "managementFee.details",
    },
    {
      icon: AlertCircle,
      titleKey: "performanceFee.title",
      amountKey: "performanceFee.amount",
      descriptionKey: "performanceFee.description",
      detailsKey: "performanceFee.details",
    },
  ]

  return (
    <section id="fees" className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-success/10">
            <CreditCard className="h-6 w-6 text-success" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t("title")}</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {t("description")}
        </p>
      </div>

      {/* Fee Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {feeItems.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.titleKey}
              className="relative group border border-border bg-card/50 backdrop-blur-sm p-6 rounded-2xl hover:border-success/30 hover:bg-card transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-success/5 group-hover:bg-success/10 transition-colors">
                  <Icon className="h-5 w-5 text-success" />
                </div>
                <span className="text-2xl md:text-3xl font-bold text-success">{t(item.amountKey)}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t(item.titleKey)}</h3>
              <p className="text-sm text-muted-foreground mb-3">{t(item.descriptionKey)}</p>
              <div className="pt-3 border-t border-border/30">
                <p className="text-xs text-muted-foreground italic">{t(item.detailsKey)}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Fee Breakdown Info */}
      <div className="border border-success/20 bg-success/5 backdrop-blur-sm rounded-2xl p-6 md:p-8">
        <h3 className="font-semibold text-foreground mb-4">{t("feeCalculation")}</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <span className="font-mono text-success">1.</span>
            <span>{t("step1")}</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-success">2.</span>
            <span>{t("step2")}</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-success">3.</span>
            <span>{t("step3")}</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-success">4.</span>
            <span>{t("step4")}</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-mono text-success">5.</span>
            <span>{t("step5")}</span>
          </div>
          <div className="mt-4 pt-4 border-t border-border/30">
            <p className="text-xs text-muted-foreground italic">
              {t("note")}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
