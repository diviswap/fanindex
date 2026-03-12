"use client"

import { Footer } from "@/components/ui/footer-section"
import { NavBar } from "@/components/ui/tubelight-navbar"
import {
  Scale,
  Equal,
  TrendingUp,
  BarChart3,
  Award,
  Droplets,
  Shield,
  DollarSign,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import { ConnectWallet } from "@/components/web3/ConnectWallet"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { DemoModeBanner } from "@/components/demo/DemoModeBanner"
import Image from "next/image"

export default function FanIndexLanding() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-background min-h-screen">
      <DemoModeBanner />

      <NavBar />

      <main className="relative z-10 w-full pt-16 md:pt-16">
        {/* Hero Section - Inspired by Alpaca/Moment */}
        <section className="relative w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 pb-12 sm:pb-20 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Column - Text Content */}
            <div>
              {/* Announcement Badge */}
              <div className="flex justify-center lg:justify-start mb-4 sm:mb-6 md:mb-8">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-success/10 border border-success/20">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs sm:text-sm font-medium text-foreground">Now Live on Chiliz Chain</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>

              {/* Main Headline */}
              <div className="text-center lg:text-left mb-6 sm:mb-8 md:mb-10">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground mb-3 sm:mb-4 md:mb-6 text-balance leading-[1.1]">
                  Tokenized Sports Indices for the <span className="text-success">Modern Investor</span>
                </h1>

                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed text-pretty">
                  Gain diversified exposure to Fan Tokens through professionally structured index products. Built on
                  Chiliz Chain, powered by DeFi.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <ConnectWallet />
                <Link href="/indices" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 h-11 sm:h-12 group bg-transparent"
                  >
                    Explore Indices
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column - Video */}
            <div className="hidden sm:block relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto lg:mx-0">
              <video autoPlay loop muted playsInline className="w-full h-auto">
                <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/MULTI_TOKEN_2025-WzOZc5j6pyWOdUiuIEpVyDhX5csMYs.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </section>

        {/* Professional-Grade Investment Tools */}
        <section className="relative w-full bg-muted/30 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">
                Professional-Grade Investment Tools
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2 sm:px-4">
                Everything you need to invest in the Fan Token economy with confidence
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="group relative p-6 sm:p-8 md:p-10 rounded-2xl bg-card border border-border hover:border-success/30 transition-all hover:shadow-lg">
                <div className="mb-4 sm:mb-6 h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">Diversified Exposure</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Reduce risk with basket investments. Access multiple teams and leagues through thematic indices in a
                  single transaction.
                </p>
              </div>

              <div className="group relative p-6 sm:p-8 md:p-10 rounded-2xl bg-card border border-border hover:border-success/30 transition-all hover:shadow-lg">
                <div className="mb-4 sm:mb-6 h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">NFT Certificates</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Each investment is tokenized as an NFT that certifies ownership and can be transferred or redeemed
                  anytime.
                </p>
              </div>

              <div className="group relative p-6 sm:p-8 md:p-10 rounded-2xl bg-card border border-border hover:border-success/30 transition-all hover:shadow-lg">
                <div className="mb-4 sm:mb-6 h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">Audited & Secure</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  All smart contracts are audited and deployed on Chiliz Chain with complete on-chain transparency.
                </p>
              </div>

              <div className="group relative p-6 sm:p-8 md:p-10 rounded-2xl bg-card border border-border hover:border-success/30 transition-all hover:shadow-lg">
                <div className="mb-4 sm:mb-6 h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                  <Droplets className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">Liquidity Generation</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Every purchase distributes trades across official pools, generating organic volume and market depth.
                </p>
              </div>

              <div className="group relative p-6 sm:p-8 md:p-10 rounded-2xl bg-card border border-border hover:border-success/30 transition-all hover:shadow-lg">
                <div className="mb-4 sm:mb-6 h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">Transparent Fees</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  1% entry fee, 0% exit fee. Managed indices include 1-2% annual management fee for active strategy.
                </p>
              </div>

              <div className="group relative p-6 sm:p-8 md:p-10 rounded-2xl bg-card border border-border hover:border-success/30 transition-all hover:shadow-lg">
                <div className="mb-4 sm:mb-6 h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">Instant Settlement</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Buy and redeem indices instantly with automated smart contract execution on Chiliz Chain.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Three Index Strategies */}
        <section className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4">
                Three Index Strategies
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2 sm:px-4">
                Choose the investment approach that matches your goals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="relative p-6 sm:p-8 md:p-10 rounded-3xl bg-card border-2 border-border hover:border-success/40 transition-all">
                <div className="mb-4 sm:mb-6">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-success/10 flex items-center justify-center mb-3 sm:mb-4">
                    <Scale className="h-6 w-6 sm:h-7 sm:w-7 text-success" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Weighted Index</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Tokens allocated proportionally based on liquidity or market capitalization
                  </p>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground">Market-cap weighted allocation</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground">Automatic rebalancing</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground">Passive strategy</span>
                  </li>
                </ul>
              </div>

              <div className="relative p-6 sm:p-8 md:p-10 rounded-3xl bg-card border-2 border-border hover:border-success/40 transition-all">
                <div className="mb-4 sm:mb-6">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-success/10 flex items-center justify-center mb-3 sm:mb-4">
                    <Equal className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">Equal-Weight Index</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Equal allocation across all tokens for democratized exposure
                  </p>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground">Equal weight per token</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground">Balanced diversification</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground">Simple structure</span>
                  </li>
                </ul>
              </div>

              <div className="relative p-6 sm:p-8 md:p-10 rounded-3xl bg-card border-2 border-success/40 transition-all">
                <div className="absolute -top-3 right-4 sm:right-6">
                  <span className="inline-block px-2.5 sm:px-3 py-1 rounded-full bg-success text-success-foreground text-xs font-semibold">
                    PREMIUM
                  </span>
                </div>
                <div className="mb-4 sm:mb-6">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-success/10 flex items-center justify-center mb-3 sm:mb-4">
                    <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 text-success" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Managed Index</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Actively managed by experts with dynamic adjustments
                  </p>
                </div>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground">Professional management</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground">Active rebalancing</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-muted-foreground">Performance optimized</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative w-full bg-foreground py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-12 text-center">
            <div className="mb-6 sm:mb-8 md:mb-12 flex justify-center">
              <div className="relative w-full max-w-2xl sm:max-w-3xl">
                <Image
                  src="/images/new-order-of-logos-1.png"
                  alt="Fan Token Logos - Barcelona, PSG, Manchester City, Juventus, AC Milan, Atletico Madrid, Aston Villa, AS Roma, Tottenham"
                  width={1200}
                  height={200}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-background mb-3 sm:mb-4 md:mb-6 px-2 sm:px-4">
              Start Investing in Fan Tokens Today
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-background/70 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-2 sm:px-4">
              Join hundreds of investors building diversified portfolios in the sports token economy
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-2 sm:px-4">
              <Link href="/indices" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-success hover:bg-success/90 text-success-foreground text-sm sm:text-base px-6 sm:px-8 h-12 sm:h-14"
                >
                  Browse Indices
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="/whitepaper" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-background/20 text-background hover:bg-background/10 text-sm sm:text-base px-6 sm:px-8 h-12 sm:h-14"
                >
                  Read Whitepaper
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
