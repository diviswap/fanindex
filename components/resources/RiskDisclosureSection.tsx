"use client"

import { AlertTriangle, TrendingDown, Zap, DollarSign } from "lucide-react"
import { useTranslations } from "next-intl"

export function RiskDisclosureSection() {
  const t = useTranslations("riskDisclosure")

  const riskItems = [
    {
      icon: TrendingDown,
      titleKey: "marketRisk.title",
      descriptionKey: "marketRisk.description",
    },
    {
      icon: Zap,
      titleKey: "liquidityRisk.title",
      descriptionKey: "liquidityRisk.description",
    },
    {
      icon: DollarSign,
      titleKey: "operationalRisk.title",
      descriptionKey: "operationalRisk.description",
    },
    {
      icon: AlertTriangle,
      titleKey: "regulatoryRisk.title",
      descriptionKey: "regulatoryRisk.description",
    },
  ]

  return (
    <section id="risk-disclosure" className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t("title")}</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {t("description")}
        </p>
      </div>

      {/* Risk Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {riskItems.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.titleKey}
              className="border border-border bg-card/50 backdrop-blur-sm p-6 rounded-2xl hover:border-destructive/30 hover:bg-card/80 transition-all duration-300"
            >
              <div className="mb-4">
                <div className="p-3 rounded-lg bg-destructive/5 inline-flex">
                  <Icon className="h-5 w-5 text-destructive" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t(item.titleKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(item.descriptionKey)}</p>
            </div>
          )
        })}
      </div>

      {/* Important Disclaimer */}
      <div className="relative border border-destructive/20 bg-destructive/5 backdrop-blur-sm rounded-2xl p-8">
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            <span className="text-foreground font-semibold">{t("disclaimer")}:</span> {t("disclaimerText")}
          </p>
          <p>
            {t("pastPerformance")}
          </p>
          <p>
            {t("acknowledgement")}
          </p>
        </div>
      </div>
    </section>
  )
}
