"use client"

import { BarChart3, TrendingUp, PieChart, Zap } from "lucide-react"
import { useTranslations } from "next-intl"

export function PortfolioAnalyticsSection() {
  const t = useTranslations("portfolioAnalytics")

  const analyticsFeatures = [
    {
      icon: TrendingUp,
      titleKey: "pnlTracking.title",
      descriptionKey: "pnlTracking.description",
      metricKey: "pnlTracking.metric",
    },
    {
      icon: PieChart,
      titleKey: "portfolioAllocation.title",
      descriptionKey: "portfolioAllocation.description",
      metricKey: "portfolioAllocation.metric",
    },
    {
      icon: Zap,
      titleKey: "marketExposure.title",
      descriptionKey: "marketExposure.description",
      metricKey: "marketExposure.metric",
    },
    {
      icon: BarChart3,
      titleKey: "fanTokenAnalytics.title",
      descriptionKey: "fanTokenAnalytics.description",
      metricKey: "fanTokenAnalytics.metric",
    },
  ]

  return (
    <section id="portfolio-analytics" className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-success/10">
            <BarChart3 className="h-6 w-6 text-success" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t("title")}</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {t("description")}
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {analyticsFeatures.map((feature) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.titleKey}
              className="group relative border border-border bg-card/50 backdrop-blur-sm p-6 rounded-2xl hover:border-success/30 hover:bg-card transition-all duration-300 overflow-hidden"
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-success/0 via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-success/5 group-hover:bg-success/10 transition-colors">
                    <Icon className="h-5 w-5 text-success" />
                  </div>
                  <span className="text-xs font-semibold text-success bg-success/10 px-2.5 py-1 rounded-full">
                    {t(feature.metricKey)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{t(feature.titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(feature.descriptionKey)}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Dashboard Preview Placeholder */}
      <div className="relative border border-border/50 bg-card/30 backdrop-blur-sm rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative z-10">
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 rounded-lg bg-success/5 border border-success/10">
              <BarChart3 className="h-8 w-8 text-success" />
            </div>
            <p className="text-muted-foreground">
              {t("dashboardComing")}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
