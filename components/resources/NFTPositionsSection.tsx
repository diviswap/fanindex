"use client"

import { Gem, Sparkles, Shield, TrendingUp } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

export function NFTPositionsSection() {
  const t = useTranslations("nftPositions")

  const nftFeatures = [
    {
      icon: Gem,
      titleKey: "ownershipCertificate.title",
      descriptionKey: "ownershipCertificate.description",
    },
    {
      icon: Shield,
      titleKey: "onChainTransparency.title",
      descriptionKey: "onChainTransparency.description",
    },
    {
      icon: TrendingUp,
      titleKey: "redeemability.title",
      descriptionKey: "redeemability.description",
    },
    {
      icon: Sparkles,
      titleKey: "premiumFeatures.title",
      descriptionKey: "premiumFeatures.description",
    },
  ]

  return (
    <section id="nft-positions" className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-success/10">
            <Gem className="h-6 w-6 text-success" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t("title")}</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {t("description")}
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
          {/* Visual NFT Image */}
          <div className="flex items-center justify-center md:order-2">
            <div className="relative w-full">
              <Image
                src="/images/NFT-Resources.png"
                alt="FanIndex NFT Position"
                width={600}
                height={750}
                className="w-full h-auto drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6 md:order-1">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">{t("premiumOwnership")}</h3>
              <p className="text-muted-foreground">
                {t("premiumDescription")}
              </p>
            </div>

            <div className="space-y-3">
              {nftFeatures.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.titleKey} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                        <Icon className="h-5 w-5 text-success" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{t(feature.titleKey)}</h4>
                      <p className="text-xs text-muted-foreground">{t(feature.descriptionKey)}</p>
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
