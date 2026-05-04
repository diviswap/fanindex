"use client"

import { useTranslations } from "next-intl"
import { useEffect, Component, type ReactNode } from "react"
import { WebGLShader } from "@/components/ui/web-gl-shader"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Footer } from "@/components/ui/footer-section"
import { PortfolioView } from "@/components/portfolio/PortfolioView"
import { Activity, PieChart, RefreshCw } from "lucide-react"

function PortfolioErrorFallback() {
  const t = useTranslations("portfolioPage.error")
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20">
        <svg className="h-10 w-10 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{t("title")}</h2>
        <p className="text-muted-foreground text-sm max-w-sm">{t("description")}</p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="px-5 py-2.5 rounded-full bg-success text-success-foreground font-semibold text-sm hover:bg-success/90 transition-colors"
      >
        {t("refresh")}
      </button>
    </div>
  )
}

class PortfolioErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

export default function PortfolioPage() {
  const t = useTranslations("portfolioPage")

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const trustItems = [
    { icon: Activity, label: t("trust.prices") },
    { icon: PieChart, label: t("trust.positions") },
    { icon: RefreshCw, label: t("trust.updated") },
  ]

  const steps = [
    { step: t("howItWorks.steps.deposit.step"), title: t("howItWorks.steps.deposit.title"), description: t("howItWorks.steps.deposit.description") },
    { step: t("howItWorks.steps.receive.step"), title: t("howItWorks.steps.receive.title"), description: t("howItWorks.steps.receive.description") },
    { step: t("howItWorks.steps.track.step"), title: t("howItWorks.steps.track.title"), description: t("howItWorks.steps.track.description") },
    { step: t("howItWorks.steps.redeem.step"), title: t("howItWorks.steps.redeem.title"), description: t("howItWorks.steps.redeem.description") },
  ]

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-background min-h-screen">
      <WebGLShader />
      <NavBar />

      <main className="relative z-10 w-full">
        {/* Hero */}
        <section className="relative w-full border-b border-border/40 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 0%, color-mix(in oklch, var(--success) 8%, transparent), transparent 70%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-success/40 to-transparent"
          />

          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 pt-28 sm:pt-36 pb-10 sm:pb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-success/25 bg-success/[0.06] px-3 py-1.5 backdrop-blur mb-5 sm:mb-7">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.14em] text-foreground/90">
                {t("badge")}
              </span>
            </div>

            <h1 className="text-balance text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-foreground mb-3 sm:mb-6">
              {t("title")}{" "}
              <span className="text-success">{t("titleHighlight")}</span>
            </h1>
            <p className="text-pretty text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8 sm:mb-12">
              {t("description")}
            </p>

            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 max-w-2xl">
              {trustItems.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 bg-background px-3 py-3 sm:px-4 sm:py-3.5">
                  <Icon className="h-3.5 w-3.5 text-success shrink-0" />
                  <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground truncate">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio content */}
        <section className="relative w-full py-10 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PortfolioErrorBoundary fallback={<PortfolioErrorFallback />}>
              <PortfolioView />
            </PortfolioErrorBoundary>
          </div>
        </section>

        {/* How it works */}
        <section className="relative w-full border-t border-border/40 py-16 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="max-w-2xl mb-10 sm:mb-16">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-success">
                {t("howItWorks.label")}
              </span>
              <h2 className="mt-3 text-balance text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
                {t("howItWorks.title")}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 md:grid-cols-2">
              {steps.map(({ step, title, description }) => (
                <div
                  key={step}
                  className="group relative bg-background p-8 transition-colors hover:bg-card/60 sm:p-10"
                >
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-success mb-5">
                    {step}
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground mb-3">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-success/0 to-transparent transition-colors group-hover:via-success/40"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
