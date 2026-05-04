"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { ChevronRight } from "lucide-react"

export default function PrivacyPage() {
  const t = useTranslations("privacyPage")

  const collectItems = t.raw("sections.collect.items") as string[]
  const useItems = t.raw("sections.use.items") as string[]

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="space-y-8">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ChevronRight className="h-4 w-4 rotate-180" />
              {t("back")}
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">{t("title")}</h1>
            <p className="text-muted-foreground">{t("lastUpdated")} {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">{t("sections.intro.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("sections.intro.content")}</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">{t("sections.collect.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("sections.collect.intro")}</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {collectItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">{t("sections.use.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("sections.use.intro")}</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {useItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">{t("sections.security.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("sections.security.content")}</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">{t("sections.blockchain.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("sections.blockchain.content")}</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">{t("sections.contact.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("sections.contact.content")}</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
