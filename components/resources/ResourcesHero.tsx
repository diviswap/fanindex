"use client"

import { ChevronRight, ArrowDown } from "lucide-react"
import Link from "next/link"

interface ResourcesHeroProps {
  sections: string[]
}

export function ResourcesHero({ sections }: ResourcesHeroProps) {
  return (
    <div className="space-y-8 mb-16">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight className="h-4 w-4 rotate-180" />
        Back to home
      </Link>

      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance leading-tight">
          Resources & Documentation
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
          Everything you need to understand FanIndex. From getting started to advanced analytics, smart contracts, and institutional-grade portfolio management.
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="flex flex-wrap gap-2 pt-4">
        {sections.map((section) => (
          <a
            key={section}
            href={`#${section.toLowerCase().replace(/\s+/g, "-")}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted/30 border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-success/30 hover:bg-success/5 transition-all"
          >
            {section}
            <ArrowDown className="h-3 w-3" />
          </a>
        ))}
      </div>
    </div>
  )
}
