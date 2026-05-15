import { useTranslations } from "next-intl"
import { ChevronRight } from "lucide-react"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Footer } from "@/components/ui/footer-section"
import { Link } from "@/i18n/navigation"

export const metadata = {
  title: "Whitepaper v2 | FanIndex",
  description:
    "FanIndex Whitepaper v2 — The Index Layer for Fan Tokens. Decentralized SportFi infrastructure built on the Chiliz Chain.",
}

// Component to render content from translation strings
function ContentRenderer({ content }: { content: any }) {
  if (typeof content === "string") {
    return <p>{content}</p>
  }

  if (Array.isArray(content)) {
    return (
      <ul className="list-disc space-y-2 pl-5">
        {content.map((item: string, idx: number) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    )
  }

  if (typeof content === "object") {
    return (
      <div className="space-y-4">
        {Object.entries(content).map(([key, value]: [string, any]) => (
          <div key={key}>
            {key.startsWith("p") && typeof value === "string" && <p>{value}</p>}
            {key.startsWith("h") && typeof value === "string" && (
              <h3 className="mt-6 mb-3 text-base font-semibold text-foreground">{value}</h3>
            )}
            {key.startsWith("ul") && Array.isArray(value) && (
              <ul className="list-disc space-y-2 pl-5">
                {value.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    )
  }

  return null
}

export default function WhitepaperPage() {
  const t = useTranslations("whitepaperPage")
  const content = useTranslations("whitepaperContent")
  
  // Define section structure based on English whitepaper structure
  const SECTION_IDS = [
    "executiveSummary",
    "vision",
    "marketContext",
    "platform",
    "indexArchitecture",
    "indexSuite",
    "futureExpansion",
    "pricingMethodology",
    "nftInfrastructure",
    "buyRedeem",
    "rebalancing",
    "technicalArchitecture",
    "feeStructure",
    "revenue",
    "governance",
    "roadmap",
    "risks",
    "conclusion",
  ]

  const SECTION_TITLES = [
    "1. Executive Summary",
    "2. Vision",
    "3. Market Context",
    "4. The FanIndex Platform",
    "5. Index Architecture",
    "6. Current Index Suite",
    "7. Future Index Expansion",
    "8. Pricing Methodology",
    "9. NFT Position Infrastructure",
    "10. Buy & Redeem Flow",
    "11. Rebalancing",
    "12. Technical Architecture",
    "13. Fee Structure",
    "14. Revenue Allocation",
    "15. Governance",
    "16. Roadmap",
    "17. Risks",
    "18. Conclusion",
  ]

  return (
    <div className="relative flex w-full flex-col min-h-screen bg-background">
      <NavBar />

      <main className="relative z-10 w-full flex-1">
        {/* Hero */}
        <section className="relative w-full border-b border-border/40 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 0%, color-mix(in oklch, var(--success) 8%, transparent), transparent 70%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-success/40 to-transparent"
          />

          <div className="mx-auto max-w-4xl px-6 sm:px-8 pt-36 pb-16 sm:pt-44 sm:pb-20">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              {t("back")}
            </Link>

            <h1 className="text-balance text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] text-foreground mb-4">
              {t("title")}{" "}
              <span className="text-success">{t("titleHighlight")}</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mt-3 max-w-2xl leading-relaxed">
              {t("description")}
            </p>
          </div>
        </section>

        {/* Table of contents + body */}
        <section className="relative w-full py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-6 sm:px-8">

            {/* Table of contents */}
            <nav
              aria-label="Table of contents"
              className="mb-16 rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8 backdrop-blur"
            >
              <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-success mb-5">
                {t("tableOfContents")}
              </div>
              <ol className="space-y-2">
                {SECTION_IDS.map((id, idx) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {SECTION_TITLES[idx]}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Sections */}
            <div className="space-y-16">
              {SECTION_IDS.map((sectionId, idx) => {
                const sectionContent = content(sectionId)
                return (
                  <article
                    key={sectionId}
                    id={sectionId}
                    className="scroll-mt-28 border-b border-border/40 pb-16 last:border-0 last:pb-0"
                  >
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-6">
                      {SECTION_TITLES[idx]}
                    </h2>
                    <div className="space-y-4 text-sm leading-relaxed text-muted-foreground [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_p]:text-muted-foreground [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:list-disc [&_ol]:mt-3 [&_ol]:space-y-2 [&_ol]:pl-5 [&_ol]:list-decimal [&_strong]:text-foreground [&_strong]:font-semibold [&_a]:text-success [&_a:hover]:underline">
                      <ContentRenderer content={sectionContent} />
                    </div>
                  </article>
                )
              })}
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
