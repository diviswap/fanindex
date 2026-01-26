"use client"

import { useEffect } from "react"
import { WebGLShader } from "@/components/ui/web-gl-shader"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Footer } from "@/components/ui/footer-section"
import { PortfolioView } from "@/components/portfolio/PortfolioView"
import { DemoModeBanner } from "@/components/demo/DemoModeBanner"

export default function PortfolioPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-background min-h-screen">
      <DemoModeBanner />
      <WebGLShader />
      <NavBar />

      <main className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-semibold text-success">Live Portfolio Tracking</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight">
            My Portfolio
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
            Track and manage your Fan Token index positions with real-time performance analytics
          </p>
        </div>

        <PortfolioView />
      </main>

      <Footer />
    </div>
  )
}
