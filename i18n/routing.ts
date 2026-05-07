import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "es", "pt", "fr", "it"],
  defaultLocale: "en",
  localeDetection: true,
})
