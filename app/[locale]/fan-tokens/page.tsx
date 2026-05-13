"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState, useMemo } from "react"
import { WebGLShader } from "@/components/ui/web-gl-shader"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Footer } from "@/components/ui/footer-section"
import { FAN_TOKENS } from "@/lib/data/fan-tokens"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, TrendingUp, TrendingDown, ArrowUpDown, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { useCoinGeckoPrices } from "@/lib/hooks/use-coingecko-prices"

type SortField = "rank" | "name" | "price" | "change24h" | "change7d" | "marketCap" | "volume" | "percentOfSupply"
type SortOrder = "asc" | "desc"

export default function FanTokensPage() {
  const t = useTranslations("fanTokensPage")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("marketCap")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  const { data: pricesData } = useCoinGeckoPrices()

  // Live CHZ market data — no hardcoded constants
  const chzPrice = pricesData?.chzPrice ?? 0
  const chzMarketCap = pricesData?.chzMarketCap ?? 0
  const chzCirculatingSupply = pricesData?.chzCirculatingSupply ?? 0

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const categories = [
    { id: "all", label: t("categories.all") },
    { id: "football", label: t("categories.football") },
    { id: "esports", label: t("categories.esports") },
    { id: "motorsport", label: t("categories.motorsport") },
    { id: "combat", label: t("categories.combat") },
    { id: "rugby", label: t("categories.rugby") },
    { id: "other", label: t("categories.other") },
  ]

  const tokensWithLivePrices = useMemo(() => {
    return FAN_TOKENS.map((token) => {
      const livePrice = pricesData?.tokens?.find(
        (p) =>
          (token.cgId && p.cgId === token.cgId) ||
          (token.wrapped && p.address?.toLowerCase() === token.wrapped?.toLowerCase()),
      )
      if (livePrice && livePrice.priceUSD > 0) {
        return {
          ...token,
          price: livePrice.priceUSD.toFixed(6),
          priceInCHZ: livePrice.priceInCHZ,
          change24h: livePrice.change24h.toFixed(2),
          change7d: livePrice.change7d.toFixed(2),
          marketCap: livePrice.marketCap.toFixed(0),
          volume: livePrice.volume24h.toFixed(0),
        }
      }
      return token
    })
  }, [pricesData])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const filteredTokens = useMemo(() => {
    const filtered = tokensWithLivePrices.filter((token) => {
      const matchesSearch =
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === "all" || token.category === categoryFilter
      return matchesSearch && matchesCategory
    })

    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "rank": comparison = a.rank - b.rank; break
        case "name": comparison = a.name.localeCompare(b.name); break
        case "price": comparison = Number.parseFloat(a.price) - Number.parseFloat(b.price); break
        case "change24h": comparison = Number.parseFloat(a.change24h) - Number.parseFloat(b.change24h); break
        case "change7d": comparison = Number.parseFloat(a.change7d) - Number.parseFloat(b.change7d); break
        case "marketCap": comparison = Number.parseFloat(a.marketCap.replace(/,/g, "")) - Number.parseFloat(b.marketCap.replace(/,/g, "")); break
        case "volume": comparison = Number.parseFloat(a.volume.replace(/,/g, "")) - Number.parseFloat(b.volume.replace(/,/g, "")); break
        case "percentOfSupply": comparison = Number.parseFloat(a.percentOfSupply) - Number.parseFloat(b.percentOfSupply); break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [searchQuery, categoryFilter, sortField, sortOrder, tokensWithLivePrices])

  const formatNumberInCHZ = (valueUSD: string | number) => {
    if (!chzPrice) return "—"
    const numUSD = typeof valueUSD === "string" ? Number.parseFloat(valueUSD.replace(/,/g, "")) : valueUSD
    const numCHZ = numUSD / chzPrice
    if (numCHZ >= 1000000) return `${(numCHZ / 1000000).toFixed(2)}M`
    if (numCHZ >= 1000) return `${(numCHZ / 1000).toFixed(2)}K`
    return `${numCHZ.toFixed(2)}`
  }

  const totalFanTokenMcap = useMemo(
    () => filteredTokens.reduce((sum, token) => sum + Number.parseFloat(token.marketCap.replace(/,/g, "")), 0),
    [filteredTokens],
  )

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-background min-h-screen">
      <WebGLShader />
      <NavBar />

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
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 pt-36 pb-20 sm:pt-44 sm:pb-28 text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-success/25 bg-success/[0.06] px-3.5 py-1.5 backdrop-blur mb-7">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-foreground/90">
              {t("badge")}
            </span>
          </div>
          <h1 className="text-balance text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-foreground mb-6">
            {t("title")}{" "}
            <span className="text-success">{t("titleHighlight")}</span>
          </h1>
          <p className="text-pretty text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>
      </section>

      <main className="relative z-10 w-full mx-auto max-w-7xl px-3 sm:px-4 lg:px-12 py-10 sm:py-16 pb-20 sm:pb-24">
        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 sm:h-12 bg-card border-border text-sm sm:text-base"
            />
          </div>

          <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 pb-2 sm:pb-0">
            <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={categoryFilter === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter(category.id)}
                  className={cn(
                    "transition-all text-xs sm:text-sm whitespace-nowrap",
                    categoryFilter === category.id && "bg-success hover:bg-success/90 text-success-foreground border-0",
                  )}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="p-3 sm:p-4 lg:p-6 rounded-xl bg-card/50 border border-border backdrop-blur">
            <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">{t("stats.totalTokens")}</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{filteredTokens.length}</div>
          </div>
          <div className="p-3 sm:p-4 lg:p-6 rounded-xl bg-card/50 border border-border backdrop-blur">
            <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">{t("stats.totalMarketCap")}</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
              {formatNumberInCHZ(totalFanTokenMcap)} CHZ
            </div>
          </div>
          <div className="p-3 sm:p-4 lg:p-6 rounded-xl bg-card/50 border border-border backdrop-blur">
            <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">{t("stats.volume24h")}</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
              {formatNumberInCHZ(
                filteredTokens.reduce((sum, token) => sum + Number.parseFloat(token.volume.replace(/,/g, "")), 0),
              )}{" "}
              CHZ
            </div>
          </div>
          <div className="p-3 sm:p-4 lg:p-6 rounded-xl bg-card/50 border border-border backdrop-blur">
            <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">{t("stats.percentSupply")}</div>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-success">
              {chzMarketCap > 0 ? ((totalFanTokenMcap / chzMarketCap) * 100).toFixed(2) : "—"}%
            </div>
          </div>
        </div>

        {/* Tokens Table */}
        <div className="rounded-xl border border-border bg-card/50 backdrop-blur overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border/50">
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">
                <button onClick={() => handleSort("rank")} className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
                  {t("table.rank")}
                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                </button>
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">
                <button onClick={() => handleSort("name")} className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
                  {t("table.name")}
                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                </button>
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right">
                <button onClick={() => handleSort("price")} className="flex items-center gap-1 ml-auto text-[10px] sm:text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
                  {t("table.price")}
                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                </button>
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right">
                <button onClick={() => handleSort("change24h")} className="flex items-center gap-1 ml-auto text-[10px] sm:text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
                  {t("table.change24h")}
                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                </button>
              </th>
              <th className="hidden sm:table-cell px-3 sm:px-4 py-2 sm:py-3 text-right">
                <button onClick={() => handleSort("change7d")} className="flex items-center gap-1 ml-auto text-[10px] sm:text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
                  {t("table.change7d")}
                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                </button>
              </th>
              <th className="hidden sm:table-cell px-3 sm:px-4 py-2 sm:py-3 text-right">
                <button onClick={() => handleSort("marketCap")} className="flex items-center gap-1 ml-auto text-[10px] sm:text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
                  {t("table.marketCap")}
                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                </button>
              </th>
              <th className="hidden md:table-cell px-3 sm:px-4 py-2 sm:py-3 text-right">
                <button onClick={() => handleSort("volume")} className="flex items-center gap-1 ml-auto text-[10px] sm:text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider">
                  {t("table.volume")}
                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                </button>
              </th>
              <th className="hidden md:table-cell px-3 sm:px-4 py-2 sm:py-3 text-right">
                <button onClick={() => handleSort("percentOfSupply")} className="flex items-center gap-1 ml-auto text-[10px] sm:text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider whitespace-nowrap">
                  {t("table.percentOfSupply")}
                  <ArrowUpDown className="h-3 w-3 opacity-50" />
                </button>
              </th>
            </tr>
          </thead>
              <tbody>
                {filteredTokens.map((token, index) => (
                  <tr
                    key={`${token.symbol}-${index}`}
                    className={cn(
                      "border-b border-border hover:bg-muted/30 transition-colors active:bg-muted/50 cursor-pointer group",
                      index % 2 === 0 && "bg-muted/5",
                    )}
                    onClick={() => (window.location.href = `/fan-tokens/${token.symbol.toLowerCase()}`)}
                  >
                    <td className="px-2 sm:px-4 py-3 sm:py-4">
                      <div className="text-xs sm:text-sm font-medium text-muted-foreground">{index + 1}</div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 sticky left-0 bg-card/95 backdrop-blur-sm z-10">
                      <div className="flex items-center gap-2 sm:gap-3">
                        {token.icon ? (
                          <div className="relative w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={token.icon || "/placeholder.svg"}
                              alt={token.name}
                              width={32}
                              height={32}
                              className="object-cover"
                              onError={(e) => { e.currentTarget.style.display = "none" }}
                            />
                          </div>
                        ) : (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] sm:text-xs font-bold text-success">{token.symbol.slice(0, 2)}</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap">{token.symbol}</div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block whitespace-nowrap">{token.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-right">
                      <div className="text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">
                        {"priceInCHZ" in token && token.priceInCHZ
                          ? token.priceInCHZ.toFixed(2)
                          : chzPrice > 0 ? (Number.parseFloat(token.price) / chzPrice).toFixed(2) : "—"}
                        <span className="text-[10px] sm:text-xs text-muted-foreground ml-1">CHZ</span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-right">
                      <div className={cn("inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap", Number.parseFloat(token.change24h) >= 0 ? "text-success bg-success/10" : "text-red-500 bg-red-500/10")}>
                        {Number.parseFloat(token.change24h) >= 0 ? <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                        {Math.abs(Number.parseFloat(token.change24h)).toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-right">
                      <div className={cn("inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap", Number.parseFloat(token.change7d) >= 0 ? "text-success bg-success/10" : "text-red-500 bg-red-500/10")}>
                        {Number.parseFloat(token.change7d) >= 0 ? <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                        {Math.abs(Number.parseFloat(token.change7d)).toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-right">
                      <div className="text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">
                        {formatNumberInCHZ(token.marketCap)}
                        <span className="text-[10px] sm:text-xs text-muted-foreground ml-1">CHZ</span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-right">
                      <div className="text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">
                        {formatNumberInCHZ(token.volume)}
                        <span className="text-[10px] sm:text-xs text-muted-foreground ml-1">CHZ</span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 sm:py-4 text-right">
                      <div className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap">
                        {chzMarketCap > 0 ? ((Number.parseFloat(token.marketCap.replace(/,/g, "")) / chzMarketCap) * 100).toFixed(4) : "—"}%
                      </div>
                    </td>
                    <td className="px-2 py-3 sm:py-4">
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredTokens.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm sm:text-base">No tokens found matching your criteria.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
