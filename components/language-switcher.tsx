"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { i18n, type Locale } from "@/i18n-config"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"
import { EnFlag } from "./icons/flags/en-flag"
import { EsFlag } from "./icons/flags/es-flag"
import { PtFlag } from "./icons/flags/pt-flag"
import { FrFlag } from "./icons/flags/fr-flag"
import { ItFlag } from "./icons/flags/it-flag"
import { TrFlag } from "./icons/flags/tr-flag"
import { JaFlag } from "./icons/flags/ja-flag"

const flagMap: Record<Locale, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  en: EnFlag,
  es: EsFlag,
  pt: PtFlag,
  fr: FrFlag,
  it: ItFlag,
  tr: TrFlag,
  ja: JaFlag,
}

export default function LanguageSwitcher({ lang, dict }: { lang: Locale; dict: any }) {
  const pathName = usePathname()

  const redirectedPathName = (locale: Locale) => {
    if (!pathName) return "/"
    const segments = pathName.split("/")
    segments[1] = locale
    return segments.join("/")
  }

  const currentFlag = flagMap[lang]
  const CurrentFlagComponent = currentFlag || Languages // Fallback to Languages icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={dict.change_language} className="h-8 w-8">
          {" "}
          {/* Smaller button */}
          {currentFlag ? <CurrentFlagComponent className="h-4 w-4 rounded-full" /> : <Languages className="h-4 w-4" />}{" "}
          {/* Smaller icon */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
        {i18n.locales.map((locale) => {
          const FlagComponent = flagMap[locale]
          return (
            <DropdownMenuItem key={locale} asChild className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
              <Link href={redirectedPathName(locale)} className="flex items-center gap-2">
                {FlagComponent && <FlagComponent className="h-4 w-4 rounded-full" />}
                {dict[locale].toUpperCase()}
              </Link>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
