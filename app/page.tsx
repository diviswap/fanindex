"use client"

import { useEffect } from "react"
import { Footer } from "@/components/ui/footer-section"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { HeroSection } from "@/components/home/HeroSection"
import { WhyFanIndex } from "@/components/home/WhyFanIndex"
import { IndexFamily } from "@/components/home/IndexFamily"
import { AnalyticsPlatform } from "@/components/home/AnalyticsPlatform"
import { PortfolioInfrastructure } from "@/components/home/PortfolioInfrastructure"
import { RebalanceEngine } from "@/components/home/RebalanceEngine"
import { FinalCTA } from "@/components/home/FinalCTA"

export default function FanIndexLanding() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      <NavBar />

      <main className="relative z-10 w-full">
        <HeroSection />
        <WhyFanIndex />
        <IndexFamily />
        <AnalyticsPlatform />
        <PortfolioInfrastructure />
        <RebalanceEngine />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  )
}
