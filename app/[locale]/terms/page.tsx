"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { ChevronRight } from "lucide-react"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Footer } from "@/components/ui/footer-section"

const SECTION_IDS = [
  "agreement",
  "platform",
  "investmentProcess",
  "indexMethodology",
  "risks",
  "eligibility",
  "nftPositions",
  "intellectualProperty",
  "disclaimers",
  "limitation",
  "governance",
  "modifications",
  "contact",
] as const

type SectionId = typeof SECTION_IDS[number]

// Map section ID to the anchor href used in the page
const SECTION_ANCHORS: Record<SectionId, string> = {
  agreement: "agreement",
  platform: "platform",
  investmentProcess: "investment-process",
  indexMethodology: "index-methodology",
  risks: "risks",
  eligibility: "eligibility",
  nftPositions: "nft-positions",
  intellectualProperty: "intellectual-property",
  disclaimers: "disclaimers",
  limitation: "limitation",
  governance: "governance",
  modifications: "modifications",
  contact: "contact",
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TermsSection({ sectionId, t }: { sectionId: SectionId; t: any }) {
  const section = t.raw(`sections.${sectionId}`) as Record<string, unknown>

  // Render keys in order, skipping "title" and "email"
  const orderedKeys = Object.keys(section).filter((k) => k !== "title" && k !== "email")

  return (
    <article
      id={SECTION_ANCHORS[sectionId]}
      className="scroll-mt-28 border-b border-border/40 pb-16 last:border-0 last:pb-0"
    >
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-6">
        {section.title as string}
      </h2>
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground [&_ul]:mt-3 [&_ul]:space-y-2.5 [&_ul]:pl-5 [&_ul]:list-disc [&_strong]:text-foreground [&_strong]:font-semibold [&_a]:text-success [&_a:hover]:underline">
        {orderedKeys.map((key) => {
          const value = section[key]
          if (Array.isArray(value)) {
            return (
              <ul key={key} className="list-disc pl-5 space-y-2">
                {(value as string[]).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )
          }
          return <p key={key}>{value as string}</p>
        })}
        {sectionId === "contact" && section.email ? (
          <p>
            <a href={`mailto:${section.email as string}`} className="text-success hover:underline">
              {section.email as string}
            </a>
          </p>
        ) : null}
      </div>
    </article>
  )
}

export default function TermsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = useTranslations("termsPage") as any

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

            <div className="inline-flex items-center gap-2.5 rounded-full border border-success/25 bg-success/[0.06] px-3.5 py-1.5 backdrop-blur mb-7">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-foreground/90">Legal</span>
            </div>

            <h1 className="text-balance text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] text-foreground mb-4">
              {t("title")}
            </h1>
            <p className="text-muted-foreground text-sm mt-3">
              {t("lastUpdated")}: <time dateTime="2025-01-01">January 1, 2025</time>
            </p>
          </div>
        </section>

        {/* ToC + body */}
        <section className="relative w-full py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-6 sm:px-8">
            <nav aria-label="Table of contents" className="mb-16 rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8 backdrop-blur">
              <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-success mb-5">{t("contents")}</div>
              <ol className="space-y-2">
                {SECTION_IDS.map((id) => (
                  <li key={id}>
                    <a href={`#${SECTION_ANCHORS[id]}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {(t.raw(`sections.${id}`) as Record<string, unknown>).title as string}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="space-y-16">
              {SECTION_IDS.map((id) => (
                <TermsSection key={id} sectionId={id} t={t} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
