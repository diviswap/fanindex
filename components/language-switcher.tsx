"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { i18n, type Locale } from "@/i18n-config"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"

// Mapa de banderas para cada idioma
const flagMap: Record<Locale, string> = {
  en: "/flags/uk.gif",
  es: "/flags/spain.gif",
  pt: "/flags/portugues.gif",
  fr: "/flags/france.gif",
  it: "/flags/italy.gif",
  tr: "/flags/turkey.gif",
  ja: "/flags/japan.gif",
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={dict.change_language} className="h-8 w-8">
          {currentFlag ? (
            <Image
              src={currentFlag || "/placeholder.svg"}
              alt={`${lang} flag`}
              width={20}
              height={15}
              className="rounded-sm object-cover"
            />
          ) : (
            <Languages className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
        {i18n.locales.map((locale) => {
          const flagSrc = flagMap[locale]
          return (
            <DropdownMenuItem key={locale} asChild className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
              <Link href={redirectedPathName(locale)} className="flex items-center gap-2">
                {flagSrc && (
                  <Image
                    src={flagSrc || "/placeholder.svg"}
                    alt={`${locale} flag`}
                    width={20}
                    height={15}
                    className="rounded-sm object-cover"
                  />
                )}
                {dict[locale].toUpperCase()}
              </Link>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
