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
      // Don't close if clicking on a dialog or its content
      const target = event.target as Node
      if (document.querySelector('[role="dialog"]')?.contains(target)) {
        return
      }
      
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
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
      <nav className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-md border-b border-border/30 z-50">
        <div className="w-full px-6 flex items-center justify-between">
          {/* Left Section: Logo + Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
              <Image src="/images/fi-logo.png" alt="FanIndex Logo" width={36} height={36} className="rounded-lg" />
              <span className="text-foreground font-bold text-lg hidden sm:inline">FanIndex</span>
            </Link>

            {/* Navigation Items */}
            <div className="flex items-center gap-1">
              {items.map((item) => {
                const isActive = activeTab === item.name

                return (
                  <Link
                    key={item.name}
                    href={item.url}
                    onClick={(e) => handleClick(e, item)}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium transition-colors",
                      "text-foreground/70 hover:text-foreground",
                      isActive && "text-foreground",
                    )}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-success"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 40,
                        }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right Section: Theme + Connect */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ConnectWallet />
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 h-14 bg-background/95 backdrop-blur-md border-b border-border/30 z-50" ref={mobileMenuRef}>
        <div className="w-full h-full px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/images/fi-logo.png" alt="FanIndex Logo" width={32} height={32} className="rounded-lg" />
            <span className="text-foreground font-bold text-base">FanIndex</span>
          </Link>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-accent/50"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-14 left-0 right-0 bg-background/98 backdrop-blur-md border-b border-border/30 shadow-lg"
          >
            <div className="px-4 py-4 space-y-1">
              {items.map((item) => {
                const isActive = activeTab === item.name

                return (
                  <Link
                    key={item.name}
                    href={item.url}
                    onClick={(e) => handleClick(e, item)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium",
                      "text-foreground/70 hover:text-foreground hover:bg-accent/30",
                      isActive && "text-success bg-success/10",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}

              <div className="pt-3 mt-3 border-t border-border/30">
                <div className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Theme</span>
                  <div className="ml-auto">
                    <ThemeToggle />
                  </div>
                </div>
                <div 
                  className="flex items-center justify-stretch pt-2 px-4"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <ConnectWallet />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-16 md:block hidden" />
      <div className="h-14 md:hidden" />
    </>
  )
}
