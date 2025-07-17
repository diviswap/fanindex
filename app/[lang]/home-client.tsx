"use client"

import { motion } from "framer-motion"
import { Hero } from "@/components/ui/hero"
import GlassCard from "@/components/ui/glass-card"
import type { Index } from "@/lib/types"
import type { Locale } from "@/i18n-config"

export function HomeClient({ indexes, lang, dict }: { indexes: Index[]; lang: Locale; dict: any }) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const localizedIndexes = indexes.map((index) => ({
    ...index,
    name: dict.indexes[index.id]?.name || index.name,
    description: dict.indexes[index.id]?.description || index.description,
  }))

  return (
    <>
      <Hero
        showTokens={true}
        title={<span className="text-white [text-shadow:0_0_20px_rgba(255,255,255,0.5)]">{dict.hero.title}</span>}
        subtitle={dict.hero.subtitle}
        actions={[
          {
            label: dict.hero.explore_button,
            scrollId: "indexes", // Changed href to scrollId for in-page scrolling
            variant: "default",
          },
          {
            label: dict.hero.learn_more_button,
            href: `/${lang}/about`,
            variant: "secondary",
          },
        ]}
        titleClassName="text-5xl md:text-7xl font-extrabold"
        subtitleClassName="text-lg md:text-xl max-w-[700px] text-gray-300"
        actionsClassName="mt-8"
      />

      <motion.section
        id="indexes" // Ensure this ID exists for scrolling
        className="container mx-auto px-4 md:px-6 py-8 md:py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">{dict.home.explore_title}</h2>
          <p className="text-gray-400 mt-2 max-w-xl mx-auto">{dict.home.explore_subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {localizedIndexes.map((index) => (
            <GlassCard key={index.id} index={index} lang={lang} dict={dict.glass_card} />
          ))}
        </div>
      </motion.section>
    </>
  )
}
