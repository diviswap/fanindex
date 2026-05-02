"use client"

import { Gem, Sparkles, Shield, TrendingUp } from "lucide-react"
import Image from "next/image"

const nftFeatures = [
  {
    icon: Gem,
    title: "Ownership Certificate",
    description: "Each position is backed by an NFT that represents verifiable on-chain ownership.",
  },
  {
    icon: Shield,
    title: "On-Chain Transparency",
    description: "All metadata, rebalancing events, and holdings are permanently recorded on blockchain.",
  },
  {
    icon: TrendingUp,
    title: "Redeemability",
    description: "Positions can be redeemed directly for underlying assets, ensuring real value backing.",
  },
  {
    icon: Sparkles,
    title: "Premium Features",
    description: "NFT holders unlock exclusive analytics, governance rights, and market insights.",
  },
]

export function NFTPositionsSection() {
  return (
    <section id="nft-positions" className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-success/10">
            <Gem className="h-6 w-6 text-success" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">NFT Positions</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Index positions are backed by NFTs representing verifiable, redeemable ownership of underlying assets.
        </p>
      </div>

      {/* Large NFT Card */}
      <div className="relative overflow-hidden rounded-3xl border border-success/20 bg-gradient-to-br from-success/10 via-card to-card p-8 md:p-12">
        <div className="absolute inset-0 bg-gradient-to-tr from-success/5 via-transparent to-transparent opacity-50" />
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-success/10 rounded-full blur-3xl opacity-30"
          aria-hidden
        />

        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          {/* Visual Placeholder */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-xs">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NFT-Docs-G66a0Ti7CsGjpvtj8A1XACOUOohPin.png"
                alt="FanIndex NFT Position"
                width={400}
                height={500}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Premium Index Ownership</h3>
              <p className="text-muted-foreground">
                Every FanIndex position is represented by an NFT that certifies your ownership and provides access to exclusive benefits.
              </p>
            </div>

            <div className="space-y-3">
              {nftFeatures.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                        <Icon className="h-5 w-5 text-success" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
