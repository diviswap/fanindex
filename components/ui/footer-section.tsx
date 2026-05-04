"use client"
import type React from "react"
import type { ComponentProps, ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { FileText } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

export function Footer() {
  const t = useTranslations("footer")

  const XIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  )

  const footerLinks = [
    {
      label: t("sections.product.label"),
      links: [
        { title: t("sections.product.indices"), href: "/indices" },
        { title: t("sections.product.portfolio"), href: "/portfolio" },
        { title: t("sections.product.fanTokens"), href: "/fan-tokens" },
      ],
    },
    {
      label: t("sections.resources.label"),
      links: [
        { title: t("sections.resources.docs"), href: "/resources" },
        { title: t("sections.resources.whitepaper"), href: "/whitepaper", icon: FileText },
      ],
    },
    {
      label: t("sections.legal.label"),
      links: [
        { title: t("sections.legal.privacy"), href: "/privacy" },
        { title: t("sections.legal.terms"), href: "/terms" },
        { title: t("sections.legal.x"), href: "https://x.com/FanIndexes" },
      ],
    },
  ]

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#") && href.length > 1) {
      e.preventDefault()
      const targetId = href.substring(1)
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
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
            {t("description")}
          </p>
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} FanIndex. {t("copyright")}
          </p>
        </AnimatedContainer>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3 xl:col-span-2 xl:mt-0">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div className="mb-10 md:mb-0">
                <h3 className="text-xs text-foreground font-semibold">{section.label}</h3>
                <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                  {section.links.map((link) => {
                    let Icon = (link as any).icon
                    if (link.href === "https://x.com/FanIndexes") {
                      Icon = XIcon
                    }
                    return (
                      <li key={link.title}>
                        <a
                          href={link.href}
                          onClick={(e) => handleLinkClick(e, link.href)}
                          className="hover:text-success inline-flex items-center transition-all duration-300"
                        >
                          {Icon && <Icon className="me-1 size-4" />}
                          {link.title}
                        </a>
                      </li>
                    )
                  })}
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
