"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Home, Info, Sparkles, Briefcase, Menu, X, Coins } from "lucide-react"
import { cn } from "@/lib/utils"
import { ConnectWallet } from "@/components/web3/ConnectWallet"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { useDemoMode } from "@/lib/demo/DemoModeContext"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items?: NavItem[]
  className?: string
}

export function NavBar({ items: itemsProp, className }: NavBarProps) {
  const items = itemsProp || [
    { name: "Home", url: "/", icon: Home },
    { name: "Indices", url: "/indices", icon: Sparkles },
    { name: "Fan Tokens", url: "/fan-tokens", icon: Coins },
    { name: "Portfolio", url: "/portfolio", icon: Briefcase },
    { name: "Whitepaper", url: "/whitepaper", icon: Info },
  ]

  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const { isDemoMode, toggleDemoMode } = useDemoMode()

  useEffect(() => {
    if (pathname === "/portfolio") {
      setActiveTab("Portfolio")
    } else if (pathname === "/indices" || pathname?.startsWith("/indices/")) {
      setActiveTab("Indices")
    } else if (pathname === "/fan-tokens") {
      setActiveTab("Fan Tokens")
    } else if (pathname === "/") {
      setActiveTab("Home")
    } else if (pathname === "/whitepaper") {
      setActiveTab("Whitepaper")
    }
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (item.url.startsWith("/#")) {
      e.preventDefault()
      setActiveTab(item.name)
      setIsMobileMenuOpen(false)

      const hash = item.url.substring(1)
      if (hash === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }
    } else {
      setActiveTab(item.name)
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      {/* Desktop Navbar */}
      <div
        className={cn(
          "hidden md:flex fixed top-0 left-1/2 -translate-x-1/2 z-50 mt-6 pt-6 pointer-events-none",
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-background/5 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg pointer-events-auto">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.name

              return (
                <Link
                  key={item.name}
                  href={item.url}
                  onClick={(e) => handleClick(e, item)}
                  className={cn(
                    "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors whitespace-nowrap",
                    "text-foreground/80 hover:text-success",
                    isActive && "bg-muted text-success",
                  )}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full bg-success/5 rounded-full -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-success rounded-t-full">
                        <div className="absolute w-12 h-6 bg-success/20 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-success/20 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-success/20 rounded-full blur-sm top-0 left-2" />
                      </div>
                    </motion.div>
                  )}
                </Link>
              )
            })}
          </div>
          <div className="flex items-center gap-2 pointer-events-auto">
            <ThemeToggle />
            <ConnectWallet />
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm"
        ref={mobileMenuRef}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/fi-logo.png" alt="FanIndex Logo" width={32} height={32} className="rounded-lg" />
            <span className="text-foreground font-bold text-lg">FanIndex</span>
          </Link>

          <div className="flex items-center gap-2">
            <ConnectWallet />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-accent"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-border bg-card/98 backdrop-blur-lg shadow-lg"
          >
            <div className="px-4 py-4 space-y-2">
              {items.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.name

                return (
                  <Link
                    key={item.name}
                    href={item.url}
                    onClick={(e) => handleClick(e, item)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                      "text-foreground/80 hover:text-success hover:bg-accent/50",
                      isActive && "bg-success/10 text-success font-semibold shadow-sm",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}

              <div className="pt-3 mt-3 border-t border-border space-y-2">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm font-medium text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  )
}
