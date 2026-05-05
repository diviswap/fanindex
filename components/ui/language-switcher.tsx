"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { useTransition } from "react"

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const switchLocale = (next: string) => {
    if (next === locale) return
    startTransition(() => {
      router.replace(pathname, { locale: next })
    })
  }

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-lg border border-border/50 bg-muted/30 p-0.5",
        isPending && "opacity-60 pointer-events-none",
      )}
      aria-label="Language switcher"
    >
      {(["en", "es"] as const).map((lang) => {
        const isActive = locale === lang
        return (
          <button
            key={lang}
            onClick={() => switchLocale(lang)}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-150",
              isActive
                ? "bg-success text-success-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={isActive}
            aria-label={lang === "en" ? "Switch to English" : "Cambiar a Español"}
          >
            {lang}
          </button>
        )
      })}
    </div>
  )
}
