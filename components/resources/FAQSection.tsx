"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"

function FAQItem({ qKey, aKey, isOpen, onToggle, t }: { qKey: string; aKey: string; isOpen: boolean; onToggle: () => void; t: any }) {
  return (
    <button
      onClick={onToggle}
      className="w-full text-left group border border-border bg-card/50 backdrop-blur-sm rounded-lg p-6 hover:border-success/30 hover:bg-card transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold text-foreground group-hover:text-success transition-colors">
          {t(qKey)}
        </h3>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-border/30">
          <p className="text-sm text-muted-foreground leading-relaxed">{t(aKey)}</p>
        </div>
      )}
    </button>
  )
}

export function FAQSection() {
  const t = useTranslations("faq")
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqItems = [
    { qKey: "q1", aKey: "a1" },
    { qKey: "q2", aKey: "a2" },
    { qKey: "q3", aKey: "a3" },
    { qKey: "q4", aKey: "a4" },
    { qKey: "q5", aKey: "a5" },
    { qKey: "q6", aKey: "a6" },
    { qKey: "q7", aKey: "a7" },
    { qKey: "q8", aKey: "a8" },
  ]

  return (
    <section id="faq" className="space-y-8">
      <div className="space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t("title")}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {t("description")}
        </p>
      </div>

      <div className="space-y-3">
        {faqItems.map((item, idx) => (
          <FAQItem
            key={idx}
            qKey={item.qKey}
            aKey={item.aKey}
            isOpen={openIndex === idx}
            onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
            t={t}
          />
        ))}
      </div>
    </section>
  )
}
