"use client"

import { Zap, GitBranch, Target, Rocket } from "lucide-react"

const roadmapPhases = [
  {
    phase: "Phase 1: Foundation",
    status: "Complete",
    items: ["Core index creation", "NFT position system", "Smart contract deployment", "Portfolio tracking"],
    icon: Target,
  },
  {
    phase: "Phase 2: Growth",
    status: "In Progress",
    items: ["Advanced analytics dashboard", "Mobile app launch", "DAO governance setup", "API for developers"],
    icon: Rocket,
  },
  {
    phase: "Phase 3: Scale",
    status: "Planned",
    items: [
      "Margin trading for indices",
      "Cross-chain index support",
      "Institutional partnerships",
      "Treasury expansion",
    ],
    icon: Zap,
  },
  {
    phase: "Phase 4: Evolution",
    status: "Planned",
    items: [
      "AI-powered index recommendations",
      "Derivatives market",
      "Global expansion",
      "Enterprise solutions",
    ],
    icon: GitBranch,
  },
]

export function RoadmapSection() {
  return (
    <section id="roadmap" className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-success/10">
            <Rocket className="h-6 w-6 text-success" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Roadmap</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Our vision for the future of FanIndex. Delivering innovation quarterly.
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {roadmapPhases.map((phase, idx) => {
          const Icon = phase.icon
          const isCompleted = phase.status === "Complete"
          const isActive = phase.status === "In Progress"

          return (
            <div key={phase.phase} className="relative">
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
                      <h3 className="text-lg font-semibold text-foreground">{phase.phase}</h3>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isCompleted
                            ? "bg-success/10 text-success"
                            : isActive
                              ? "bg-success/10 text-success"
                              : "bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        {phase.status}
                      </span>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      {phase.items.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-success/50" />
                          {item}
                        </div>
                      ))}
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
