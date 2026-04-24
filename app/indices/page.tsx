"use client"

import { WebGLShader } from "@/components/ui/web-gl-shader"
import { Footer } from "@/components/ui/footer-section"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { IndexCard } from "@/components/indices/IndexCard"
import { useEffect } from "react"
import { TrendingUp, Shield, Zap } from "lucide-react"
import { BarChart3 } from "lucide-react"
import { INDICES } from "@/lib/data/indices"
import { DEPLOYED_INDEX_IDS } from "@/lib/contracts/abis"

export default function IndicesPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Single source of truth: whatever lives in ETF_CONTRACTS is considered
  // deployed. Adding a new vault automatically lists it here.
  const deployedIndices = INDICES.filter((index) =>
    (DEPLOYED_INDEX_IDS as string[]).includes(index.id),
  )

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-background min-h-screen">
      <WebGLShader />

      <NavBar />

      <main className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-24 sm:py-32 md:py-40 lg:py-48 mt-16 md:mt-0">
        <div className="text-center mb-16 sm:mb-20 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-success/10 border border-success/20 text-success text-xs sm:text-sm font-medium mb-6 sm:mb-8">
            <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Diversified Sports Investment Products</span>
          </div>
          <h1 className="mb-4 sm:mb-6 text-foreground text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-none text-balance px-4">
            Fan Token Indices
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto text-pretty leading-relaxed px-4">
            Gain diversified exposure to the sports token economy through professionally structured index products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-stretch mb-16 sm:mb-20 md:mb-24">
          {deployedIndices.map((index) => (
            <IndexCard key={index.id} index={index} />
          ))}
        </div>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-8 sm:mb-10 md:mb-12 px-4">
            Index Strategies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 sm:mb-6">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">Weighted</div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Tokens allocated proportionally based on liquidity or market capitalization for optimized exposure
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 sm:mb-6">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">Equal-Weight</div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Equal allocation across all tokens for democratized exposure and balanced risk distribution
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-success/10 flex items-center justify-center mb-4 sm:mb-6">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">Managed</div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Actively managed by the FanIndex team with dynamic adjustments based on market conditions
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
