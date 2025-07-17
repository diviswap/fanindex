export const i18n = {
  defaultLocale: "en",
  locales: ["en", "es", "pt", "fr", "it", "tr", "ja"],
} as const

export type Locale = (typeof i18n)["locales"][number]
