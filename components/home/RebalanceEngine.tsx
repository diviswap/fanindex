"use client"

import Image from "next/image"
import { Calendar, GitBranch, Scale, FileText } from "lucide-react"
import { INDICES } from "@/lib/data/indices"
import { getTokenBySymbol } from "@/lib/data/fan-tokens"
import { useTranslations } from "next-intl"

export function RebalanceEngine() {
  const t = useTranslations("rebalance")
  const ftlx = INDICES.find((i) => i.symbol === "FTLX")!

  const totalWeight = ftlx.weights?.reduce((s, w) => s + w, 0) ?? 0
  const rows = ftlx.tokens.map((sym, i) => ({
    symbol: sym,
    weight: ftlx.weights?.[i] ?? 100 / ftlx.tokens.length,
    token: getTokenBySymbol(sym),
  }))
  const maxWeight = Math.max(...rows.map((r) => r.weight))

  const PRINCIPLES = [
    { icon: Calendar, titleKey: "principles.monthly.title", descKey: "principles.monthly.description" },
    { icon: Scale, titleKey: "principles.rules.title", descKey: "principles.rules.description" },
    { icon: GitBranch, titleKey: "principles.onchain.title", descKey: "principles.onchain.description" },
    { icon: FileText, titleKey: "principles.public.title", descKey: "principles.public.description" },
  ] as const

  return (
    <section className="relative w-full border-b border-border/40 py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-success">
            {t("label")}
          </span>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.15fr]">
          {/* Principles grid */}
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/40 sm:grid-cols-2">
            {PRINCIPLES.map(({ icon: Icon, titleKey, descKey }) => (
              <div key={titleKey} className="bg-background p-7">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/80 bg-card/60">
                  <Icon className="h-4 w-4 text-success" strokeWidth={1.75} />
                </div>
                <h3 className="mt-6 text-base font-semibold tracking-tight text-foreground">
                  {t(titleKey)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(descKey)}
                </p>
              </div>
            ))}
          </div>

          {/* FTLX factsheet */}
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/30 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-border/60 bg-background/40 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold tracking-tight text-foreground">FTLX</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  · {t("factsheet")}
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {t("weighted")} · {ftlx.tokens.length} {t("constituents")}
              </span>
            </div>

            <div className="divide-y divide-border/40">
              {rows.map((row, i) => (
                <div
                  key={row.symbol}
                  className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-card/40"
                >
                  <span className="w-5 font-mono text-[10px] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex w-24 items-center gap-2.5">
                    {row.token?.icon ? (
                      <Image src={row.token.icon} alt={row.symbol} width={20} height={20} className="rounded-full" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-border bg-muted" />
                    )}
                    <span className="font-mono text-xs font-semibold text-foreground">{row.symbol}</span>
                  </div>
                  <div className="relative flex-1 overflow-hidden rounded-full bg-muted/30">
                    <div
                      className="h-1.5 rounded-full bg-success/70"
                      style={{ width: `${(row.weight / maxWeight) * 100}%` }}
                    />
                  </div>
                  <span className="w-14 text-right font-mono text-xs text-foreground">
                    {row.weight.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-px border-t border-border/60 bg-border/40">
              <FactCell label={t("methodology")} value={t("methodologyValue")} />
              <FactCell label={t("rebalanceFreq")} value={t("rebalanceValue")} />
              <FactCell label={t("totalWeight")} value={`${totalWeight.toFixed(2)}%`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FactCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background/60 px-5 py-4">
      <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-sm font-semibold tracking-tight text-foreground">{value}</div>
    </div>
  )
}
