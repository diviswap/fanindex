import { ResourcesHero } from "@/components/resources/ResourcesHero"
import { GettingStartedSection } from "@/components/resources/GettingStartedSection"
import { MethodologySection } from "@/components/resources/MethodologySection"
import { LiveIndicesSection } from "@/components/resources/LiveIndicesSection"
import { NFTPositionsSection } from "@/components/resources/NFTPositionsSection"
import { PortfolioAnalyticsSection } from "@/components/resources/PortfolioAnalyticsSection"
import { FeesSection } from "@/components/resources/FeesSection"
import { SmartContractsSection } from "@/components/resources/SmartContractsSection"
import { FAQSection } from "@/components/resources/FAQSection"
import { RiskDisclosureSection } from "@/components/resources/RiskDisclosureSection"
import { RoadmapSection } from "@/components/resources/RoadmapSection"
import { ResourcesFooter } from "@/components/resources/ResourcesFooter"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEs = locale === "es"
  return {
    title: isEs
      ? "Recursos y Documentación | FanIndex"
      : "Resources & Documentation | FanIndex",
    description: isEs
      ? "Guía completa de FanIndex. Aprende sobre metodología de índices, posiciones NFT, contratos inteligentes, comisiones, analítica y más."
      : "Complete guide to FanIndex. Learn about index methodology, NFT positions, smart contracts, fees, analytics, and more.",
  }
}

export default async function ResourcesPage() {
  const t = await getTranslations("resources")

  const sections = [
    t("sections.gettingStarted"),
    t("sections.methodology"),
    t("sections.liveIndices"),
    t("sections.nftPositions"),
    t("sections.analytics"),
    t("sections.fees"),
    t("sections.smartContracts"),
    t("sections.faq"),
    t("sections.riskDisclosure"),
    t("sections.roadmap"),
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="space-y-20">
          <ResourcesHero sections={sections} />
          <GettingStartedSection />
          <MethodologySection />
          <LiveIndicesSection />
          <NFTPositionsSection />
          <PortfolioAnalyticsSection />
          <FeesSection />
          <SmartContractsSection />
          <FAQSection />
          <RiskDisclosureSection />
          <RoadmapSection />
          <ResourcesFooter />
        </div>
      </main>
    </div>
  )
}
