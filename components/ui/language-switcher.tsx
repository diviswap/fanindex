"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { useTransition, useState, useRef, useEffect } from "react"
import { Globe, Check, ChevronDown } from "lucide-react"

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const switchLocale = (next: string) => {
    if (next === locale) {
      setIsOpen(false)
      return
    }
    startTransition(() => {
      router.replace(pathname, { locale: next })
    })
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  const currentLang = languages.find(l => l.code === locale) || languages[0]

  return (
    <div 
      ref={dropdownRef}
      className={cn(
        "relative",
        isPending && "opacity-60 pointer-events-none",
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/50 bg-muted/30",
          "text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50",
          "transition-all duration-150",
          isOpen && "bg-muted/50 text-foreground"
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
        <ChevronDown className={cn(
          "h-3 w-3 transition-transform duration-150",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div 
          className={cn(
            "absolute right-0 top-full mt-1 z-50",
            "min-w-[140px] py-1 rounded-lg border border-border/50 bg-card/95 backdrop-blur-sm shadow-lg",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150"
          )}
          role="listbox"
          aria-label="Available languages"
        >
          {languages.map((lang) => {
            const isActive = locale === lang.code
            return (
              <button
                key={lang.code}
                onClick={() => switchLocale(lang.code)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-success/10 text-success font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
                role="option"
                aria-selected={isActive}
              >
                <span className="text-base">{lang.flag}</span>
                <span className="flex-1 text-left">{lang.label}</span>
                {isActive && <Check className="h-4 w-4 text-success" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
