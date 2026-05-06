"use client"

import { Zap, GitBranch, Target, Rocket } from "lucide-react"
import { useTranslations } from "next-intl"

export function RoadmapSection() {
  const t = useTranslations("roadmap")

  const roadmapPhases = [
    {
      phaseKey: "phase1",
      statusKey: "complete",
      itemsKey: "items.phase1",
      icon: Target,
    },
    {
      phaseKey: "phase2",
      statusKey: "inProgress",
      itemsKey: "items.phase2",
      icon: Rocket,
    },
    {
      phaseKey: "phase3",
      statusKey: "planned",
      itemsKey: "items.phase3",
      icon: Zap,
    },
    {
      phaseKey: "phase4",
      statusKey: "planned",
      itemsKey: "items.phase4",
      icon: GitBranch,
    },
  ]

  return (
    <section id="roadmap" className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-success/10">
            <Rocket className="h-6 w-6 text-success" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t("title")}</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {t("description")}
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {roadmapPhases.map((phase, idx) => {
          const Icon = phase.icon
          const isCompleted = phase.statusKey === "complete"
          const isActive = phase.statusKey === "inProgress"
          const items = t(phase.itemsKey) as string[]

          return (
            <div key={phase.phaseKey} className="relative">
              {/* Timeline connector */}
              {idx < roadmapPhases.length - 1 && (
                <div className="absolute left-[19px] top-20 h-8 w-0.5 bg-gradient-to-b from-success/50 to-border" />
              )}

              <div
                className={`relative border rounded-2xl p-6 transition-all duration-300 ${
                  isCompleted
                    ? "border-success/30 bg-success/5"
                    : isActive
                      ? "border-success/50 bg-card/80 shadow-lg shadow-success/10"
                      : "border-border bg-card/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Status dot */}
                  <div
                    className={`flex-shrink-0 mt-1 h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                      isCompleted
                        ? "border-success bg-success/10"
                        : isActive
                          ? "border-success bg-success/5 animate-pulse"
                          : "border-border bg-card"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isCompleted || isActive ? "text-success" : "text-muted-foreground"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{t(phase.phaseKey)}</h3>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isCompleted
                            ? "bg-success/10 text-success"
                            : isActive
                              ? "bg-success/10 text-success"
                              : "bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        {t(phase.statusKey)}
                      </span>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      {items && Array.isArray(items) ? items.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-success/50" />
                          {item}
                        </div>
                      )) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
