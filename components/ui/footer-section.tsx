"use client"
import type React from "react"
import type { ComponentProps, ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Twitter, MessageCircle, BookOpen, FileText } from "lucide-react"
import Image from "next/image"

interface FooterLink {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

interface FooterSection {
  label: string
  links: FooterLink[]
}

const footerLinks: FooterSection[] = [
  {
    label: "Product",
    links: [
      { title: "Indices", href: "/indices" },
      { title: "Portfolio", href: "/portfolio" },
      { title: "Fan Tokens", href: "/fan-tokens" },
    ],
  },
  {
    label: "Resources",
    links: [
      { title: "Documentation", href: "/resources" },
      { title: "Whitepaper", href: "/whitepaper", icon: FileText },
      { title: "Blog", href: "https://medium.com/fanindex", icon: BookOpen },
    ],
  },
  {
    label: "Legal & Support",
    links: [
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms of Service", href: "/terms" },
      { title: "Twitter", href: "https://x.com/FanIndexes", icon: Twitter },
    ],
  },
]

export function Footer() {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only handle internal section links that start with #
    if (href.startsWith("#") && href.length > 1) {
      e.preventDefault()
      const targetId = href.substring(1)
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
    // External links and regular paths handled by browser default
  }

  return (
    <footer className="md:rounded-t-6xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t border-border bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.success/8%),transparent)] px-6 py-12 lg:py-16">
      <div className="bg-success/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

      <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
        <AnimatedContainer className="space-y-4">
          <div className="flex items-center gap-2">
            <Image src="/images/fi-logo.png" alt="FanIndex Logo" width={32} height={32} className="rounded-lg" />
            <span className="text-xl font-bold text-foreground">FanIndex</span>
          </div>
          <p className="text-muted-foreground mt-8 text-sm md:mt-4 max-w-xs">
            The first ETF-like platform for Fan Tokens. Diversify your portfolio across leagues and teams on the Chiliz
            Chain.
          </p>
          <p className="text-muted-foreground text-xs">© {new Date().getFullYear()} FanIndex. All rights reserved.</p>
        </AnimatedContainer>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3 xl:col-span-2 xl:mt-0">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div className="mb-10 md:mb-0">
                <h3 className="text-xs text-foreground font-semibold">{section.label}</h3>
                <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.href)}
                        className="hover:text-success inline-flex items-center transition-all duration-300"
                      >
                        {link.icon && <link.icon className="me-1 size-4" />}
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </footer>
  )
}

type ViewAnimationProps = {
  delay?: number
  className?: ComponentProps<typeof motion.div>["className"]
  children: ReactNode
}

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return children
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
