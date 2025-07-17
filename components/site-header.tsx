"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShieldCheck, MenuIcon, Home, LayoutGrid, Info, Twitter } from "lucide-react"
import { ConnectWallet } from "@/components/connect-wallet"
import { cn } from "@/lib/utils"
import LanguageSwitcher from "./language-switcher"
import type { Locale } from "@/i18n-config"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function SiteHeader({ lang, dict }: { lang: Locale; dict: any }) {
  const pathname = usePathname()
  const navDict = dict.navigation
  const footerDict = dict.footer

  const navLinks = [
    { href: `/${lang}`, label: navDict.home, id: "home", icon: <Home className="h-5 w-5" /> },
    { href: `/${lang}/portfolio`, label: navDict.portfolio, id: "portfolio", icon: <LayoutGrid className="h-5 w-5" /> },
    { href: `/${lang}/about`, label: navDict.about, id: "about", icon: <Info className="h-5 w-5" /> },
  ]

  const isLinkActive = (linkId: string) => {
    if (linkId === "home") {
      return pathname === `/${lang}` || pathname === `/${lang}/` || pathname.startsWith(`/${lang}/#`)
    }
    return pathname === `/${lang}/${linkId}`
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left section: Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2">
          <ShieldCheck className="h-7 w-7 text-green-400" />
          <span className="text-xl font-bold">FanIndex</span>
        </Link>

        {/* Center section: Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-green-400",
                isLinkActive(link.id) && "text-green-400 font-semibold",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right section: Wallet, Language Switcher, Mobile Menu */}
        <div className="flex items-center gap-1 sm:gap-2">
          {" "}
          {/* Reduced gap for smaller screens */}
          <ConnectWallet dict={dict.connect_wallet} />
          <LanguageSwitcher lang={lang} dict={dict.language_switcher} />
          {/* Mobile Menu (Hamburger Icon) */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu" className="h-8 w-8">
                {" "}
                {/* Smaller button */}
                <MenuIcon className="h-5 w-5" /> {/* Smaller icon */}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-black/90 backdrop-blur-xl border-l border-gray-800 text-white w-[80vw] flex flex-col"
            >
              <SheetHeader>
                <SheetTitle>
                  <Link href={`/${lang}`} className="flex items-center gap-2">
                    <ShieldCheck className="h-7 w-7 text-green-400" />
                    <span className="text-xl font-bold text-white">FanIndex</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <Separator className="my-4 bg-gray-700" />
              <div className="flex flex-1 flex-col items-start gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md p-3 text-lg font-medium transition-colors hover:bg-gray-800",
                      isLinkActive(link.id) ? "text-green-400 bg-gray-800" : "text-gray-300",
                    )}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
              <Separator className="my-4 bg-gray-700" />
              <div className="mt-auto">
                <p className="mb-2 text-center text-sm text-gray-400">{footerDict.follow_us}</p>
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white"
                    asChild
                  >
                    <Link href="https://x.com/FanIndexes" target="_blank">
                      <Twitter className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
