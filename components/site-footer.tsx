"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Send, ShieldCheck, Twitter } from "lucide-react"
import type { Locale } from "@/i18n-config"

export function SiteFooter({ lang, dict }: { lang: Locale; dict: any }) {
  return (
    <footer className="relative border-t bg-black text-gray-300 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-7 w-7 text-green-400" />
              <span className="text-xl font-bold text-white">FanIndex</span>
            </div>
            <p className="mb-6 text-gray-400">{dict.newsletter_prompt}</p>
            <form className="relative">
              <Input
                type="email"
                placeholder={dict.email_placeholder}
                className="pr-12 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-green-500"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-green-500 text-gray-900 transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">{dict.subscribe}</span>
              </Button>
            </form>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">{dict.quick_links}</h3>
            <nav className="space-y-2 text-sm">
              <Link href={`/${lang}`} className="block transition-colors hover:text-green-400">
                {dict.home}
              </Link>
              <Link href={`/${lang}/#indexes`} className="block transition-colors hover:text-green-400">
                {dict.indexes}
              </Link>
              <Link href={`/${lang}/portfolio`} className="block transition-colors hover:text-green-400">
                {dict.portfolio}
              </Link>
              <Link href={`/${lang}/about`} className="block transition-colors hover:text-green-400">
                {dict.about}
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">{dict.contact_us}</h3>
            <address className="space-y-2 text-sm not-italic text-gray-400">
              <p>{dict.hq}</p>
              <p>{dict.blockchain}</p>
              <p>{dict.email}</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold text-white">{dict.follow_us}</h3>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="https://x.com/FanIndexes">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white"
                      >
                        <Twitter className="h-4 w-4" />
                        <span className="sr-only">Twitter</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{dict.twitter_tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 text-center md:flex-row">
          <p className="text-sm text-gray-500">{dict.copyright.replace("{year}", new Date().getFullYear())}</p>
          <nav className="flex gap-4 text-sm">
            <Link href={`/${lang}/privacy-policy`} className="transition-colors hover:text-green-400">
              {dict.privacy_policy}
            </Link>
            <Link href={`/${lang}/terms-of-service`} className="transition-colors hover:text-green-400">
              {dict.terms_of_service}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
