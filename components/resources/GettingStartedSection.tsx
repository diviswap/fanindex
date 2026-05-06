"use client"

import { BookOpen, ArrowRight, Zap, TrendingUp, Lock, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"

export function GettingStartedSection() {
  const t = useTranslations("gettingStarted")

  const gettingStartedItems = [
    {
      icon: Zap,
      titleKey: "items.whatAreIndices.title",
      descriptionKey: "items.whatAreIndices.description",
      href: "#methodology",
    },
    {
      icon: Lock,
      titleKey: "items.understanding.title",
      descriptionKey: "items.understanding.description",
      href: "#live-indices",
    },
    {
      icon: BarChart3,
      titleKey: "items.bestPractices.title",
      descriptionKey: "items.bestPractices.description",
      href: "#portfolio-analytics",
    },
    {
      icon: TrendingUp,
      titleKey: "items.startInvesting.title",
      descriptionKey: "items.startInvesting.description",
      href: "/indices",
    },
  ]

  return (
    <section id="getting-started" className="space-y-6 md:space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-success/10">
            <BookOpen className="h-6 w-6 text-success" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t("title")}</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {t("description")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {gettingStartedItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.titleKey}
              href={item.href}
              className="group relative border border-border bg-card/50 backdrop-blur-sm p-6 rounded-2xl hover:border-success/30 hover:bg-card transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-success/5 group-hover:bg-success/10 transition-colors">
                  <Icon className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-success transition-colors mb-2">
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(item.descriptionKey)}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-success opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
