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

export const metadata = {
  title: "Resources & Documentation | FanIndex",
  description:
    "Complete guide to FanIndex. Learn about index methodology, NFT positions, smart contracts, fees, analytics, and more.",
}

export default function ResourcesPage() {
  const sections = [
    "Getting Started",
    "Methodology",
    "Live Indices",
    "NFT Positions",
    "Analytics",
    "Fees",
    "Smart Contracts",
    "FAQ",
    "Risk Disclosure",
    "Roadmap",
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="space-y-20">
          {/* Hero */}
          <ResourcesHero sections={sections} />

          {/* Getting Started */}
          <GettingStartedSection />

          {/* Methodology */}
          <MethodologySection />

          {/* Live Indices */}
          <LiveIndicesSection />

          {/* NFT Positions */}
          <NFTPositionsSection />

          {/* Portfolio Analytics */}
          <PortfolioAnalyticsSection />

          {/* Fees */}
          <FeesSection />

          {/* Smart Contracts */}
          <SmartContractsSection />

          {/* FAQ */}
          <FAQSection />

          {/* Risk Disclosure */}
          <RiskDisclosureSection />

          {/* Roadmap */}
          <RoadmapSection />

          {/* Footer */}
          <ResourcesFooter />
        </div>
      </main>
    </div>
  )
}

