import "server-only"
import type { Locale } from "@/i18n-config"

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((module) => module.default),
  es: () => import("@/dictionaries/es.json").then((module) => module.default),
  pt: () => import("@/dictionaries/pt.json").then((module) => module.default),
  fr: () => import("@/dictionaries/fr.json").then((module) => module.default),
  it: () => import("@/dictionaries/it.json").then((module) => module.default),
  tr: () => import("@/dictionaries/tr.json").then((module) => module.default),
  ja: () => import("@/dictionaries/ja.json").then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
