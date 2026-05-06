"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Copy,
  Check,
  Loader2,
  Download,
  Wallet,
  BarChart3,
  Tag,
  Layers,
} from "lucide-react"
import { useShareCard } from "@/lib/hooks/use-share-card"
import { IndexShareCard } from "./IndexShareCard"
import { PositionShareCard } from "./PositionShareCard"
import { PortfolioShareCard } from "./PortfolioShareCard"
import type { IndexData } from "@/components/indices/IndexCard"

// ── Types ─────────────────────────────────────────────────────────────────────

export type ShareCardType = "index" | "position" | "portfolio"

export interface IndexShareData {
  type: "index"
  index: IndexData
  livePrice?: string
}

export interface PositionShareData {
  type: "position"
  holding: {
    tokenId: bigint
    indexName: string
  }
  totalValueCHZ: number
  tokenRows: {
    symbol: string
    name: string
    amount: number
    valueInCHZ: number
  }[]
}

export interface PortfolioShareData {
  type: "portfolio"
  totalValue: number
  nftValue: number
  chzBalance: number
  fanTokensValue: number
  positionsCount: number
}

export type ShareData = IndexShareData | PositionShareData | PortfolioShareData

interface ShareCardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: ShareData
  walletAddress?: string
}

  // ── Toggle pill ────────────────────────────────────────────────────────────────

function Toggle({
  label,
  icon: Icon,
  checked,
  onChange,
}: {
  label: string
  icon: React.ElementType
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
        checked
          ? "border-success/50 bg-success/10 text-success"
          : "border-border bg-card text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-3 w-3 shrink-0" />
      {label}
    </button>
  )
}

// ── Tweet text ─────────────────────────────────────────────────────────────────

function buildTweetText(data: ShareData, t: ReturnType<typeof useTranslations>): string {
  if (data.type === "index") {
    return `Just discovered the ${data.index.name} on @FanIndexes — backed by ${data.index.tokens.join(", ")} fan tokens on Chiliz Chain.\n\nfanindex.pro\n\n#Chiliz #CHZ #FanTokens`
  }
  if (data.type === "position") {
    const val = data.totalValueCHZ > 0 ? `${data.totalValueCHZ.toFixed(2)} CHZ` : "–"
    return `My ${data.holding.indexName} position on @FanIndexes is worth ${val}.\n\nfanindex.pro\n\n#Chiliz #CHZ`
  }
  const val = data.totalValue > 0 ? `${data.totalValue.toFixed(2)} CHZ` : "–"
  return `My @FanIndexes portfolio is worth ${val} across ${data.positionsCount} position${data.positionsCount !== 1 ? "s" : ""}.\n\nfanindex.pro\n\n#Chiliz #CHZ`
}

// ── Main modal ─────────────────────────────────────────────────────────────────

export function ShareCardModal({ open, onOpenChange, data, walletAddress }: ShareCardModalProps) {
  const t = useTranslations("shareCardModal")
  const [showPrice, setShowPrice] = useState(true)
  const [showTokens, setShowTokens] = useState(true)
  const [showComposition, setShowComposition] = useState(true)
  const [showWallet, setShowWallet] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(true)
  const [copyDone, setCopyDone] = useState(false)
  const [downloadDone, setDownloadDone] = useState(false)

  // Track app theme via MutationObserver on <html>
  const [isDark, setIsDark] = useState(true)
  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains("dark"))
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  const { cardRef, status, dataUrl, capture, downloadPng, copyToClipboard, shareToX, reset } =
    useShareCard()

  const isCapturing = status === "capturing"

  // Auto-capture on open; re-capture when toggles or theme change
  const togglesRef = useRef({ showPrice, showTokens, showComposition, showWallet, showBreakdown, isDark })
  useEffect(() => { togglesRef.current = { showPrice, showTokens, showComposition, showWallet, showBreakdown, isDark } })

  useEffect(() => {
    if (!open) return
    // Give React one frame to render the card before capturing
    const t = setTimeout(() => capture(), 150)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return
    reset()
    const t = setTimeout(() => capture(), 150)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPrice, showTokens, showComposition, showWallet, showBreakdown, isDark])

  const handleDownload = useCallback(async () => {
    const filename =
      data.type === "index"
        ? `fanindex-${data.index.id}.png`
        : data.type === "position"
        ? `fanindex-nft-${data.holding.tokenId}.png`
        : "fanindex-portfolio.png"
    await downloadPng(filename)
    setDownloadDone(true)
    setTimeout(() => setDownloadDone(false), 2000)
  }, [downloadPng, data])

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard()
    setCopyDone(true)
    setTimeout(() => setCopyDone(false), 2500)
    if (!ok) {
      // copyToClipboard already triggered a download fallback
    }
  }, [copyToClipboard])

  const handleShareX = useCallback(() => {
    shareToX(buildTweetText(data, t))
  }, [shareToX, data, t])

  const handleOpenChange = (v: boolean) => {
    if (!v) reset()
    onOpenChange(v)
  }

  // ── Build the actual card element ─────────────────────────────────────────
  const cardElement = (() => {
    if (data.type === "index") {
      return (
        <IndexShareCard
          index={data.index}
          livePrice={data.livePrice}
          showPrice={showPrice}
          showTokens={showTokens}
          isDark={isDark}
          cardRef={cardRef}
        />
      )
    }
    if (data.type === "position") {
      return (
        <PositionShareCard
          holding={data.holding}
          totalValueCHZ={data.totalValueCHZ}
          tokenRows={data.tokenRows}
          isDark={isDark}
          cardRef={cardRef}
        />
      )
    }
    return (
      <PortfolioShareCard
        totalValue={data.totalValue}
        nftValue={data.nftValue}
        chzBalance={data.chzBalance}
        fanTokensValue={data.fanTokensValue}
        positionsCount={data.positionsCount}
        walletAddress={showWallet ? walletAddress : undefined}
        isDark={isDark}
        cardRef={cardRef}
      />
    )
  })()

  // ── Toggles per card type ─────────────────────────────────────────────────
  const toggleRow =
    data.type === "index" ? (
      <div className="flex flex-wrap gap-2">
        <Toggle label={t("price")} icon={Tag} checked={showPrice} onChange={setShowPrice} />
        <Toggle label={t("tokens")} icon={Layers} checked={showTokens} onChange={setShowTokens} />
      </div>
    ) : data.type === "position" ? (
      <div className="flex flex-wrap gap-2">
        <Toggle label={t("composition")} icon={BarChart3} checked={showComposition} onChange={setShowComposition} />
        <Toggle label={t("wallet")} icon={Wallet} checked={showWallet} onChange={setShowWallet} />
      </div>
    ) : (
      <div className="flex flex-wrap gap-2">
        <Toggle label={t("breakdown")} icon={BarChart3} checked={showBreakdown} onChange={setShowBreakdown} />
        <Toggle label={t("wallet")} icon={Wallet} checked={showWallet} onChange={setShowWallet} />
      </div>
    )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl w-[calc(100vw-2rem)] sm:w-full border-border bg-card p-0 gap-0 overflow-hidden rounded-2xl max-h-[90dvh] overflow-y-auto">

        {/*
          Capture target: visibility:hidden keeps it in document flow so
          html2canvas can measure and read it, but it's invisible to the user.
          We temporarily flip to opacity:0 during capture (hook handles this).
        */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1080,
            height: 1080,
            visibility: "hidden",
            pointerEvents: "none",
            zIndex: -1,
            overflow: "hidden",
          }}
        >
          {cardElement}
        </div>

        {/* Header */}
        <DialogHeader className="flex-row items-center justify-between px-4 sm:px-5 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-border">
          <DialogTitle className="text-base font-bold text-foreground">{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">

          {/* Preview: show generated PNG when ready, otherwise scaled live preview */}
          <div className="relative w-full rounded-xl overflow-hidden border border-border/40" style={{ paddingBottom: "100%" }}>
            <div className="absolute inset-0">
              {dataUrl ? (
                // Generated PNG image
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dataUrl}
                  alt="Share card preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                // Scaled live preview while generating
                <div style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
                  <div
                    style={{
                      width: 1080,
                      height: 1080,
                      transformOrigin: "top left",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                    ref={(el) => {
                      if (!el) return
                      const scale = () => {
                        const parent = el.parentElement
                        if (parent) {
                          const s = parent.clientWidth / 1080
                          el.style.transform = `scale(${s})`
                        }
                      }
                      scale()
                      const ro = new ResizeObserver(scale)
                      const parent = el.parentElement
                      if (parent) ro.observe(parent)
                    }}
                  >
                    {/* Duplicate for preview — no cardRef */}
                    {data.type === "index" ? (
                      <IndexShareCard
                        index={data.index}
                        livePrice={data.livePrice}
                        showPrice={showPrice}
                        showTokens={showTokens}
                        isDark={isDark}
                        cardRef={{ current: null }}
                      />
                    ) : data.type === "position" ? (
                      <PositionShareCard
                        holding={data.holding}
                        totalValueCHZ={data.totalValueCHZ}
                        tokenRows={data.tokenRows}
                        isDark={isDark}
                        cardRef={{ current: null }}
                      />
                    ) : (
                      <PortfolioShareCard
                        totalValue={data.totalValue}
                        nftValue={data.nftValue}
                        chzBalance={data.chzBalance}
                        fanTokensValue={data.fanTokensValue}
                        positionsCount={data.positionsCount}
                        walletAddress={showWallet ? walletAddress : undefined}
                        isDark={isDark}
                        cardRef={{ current: null }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Capturing overlay */}
            {isCapturing && (
              <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 rounded-xl">
                <Loader2 className="h-6 w-6 animate-spin text-success" />
                <span className="text-sm font-semibold text-foreground">{t("generating")}</span>
              </div>
            )}
          </div>

          {/* Customization toggles */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t("customize")}</p>
            {toggleRow}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4 border-t border-border">
            <Button
              onClick={handleCopy}
              disabled={isCapturing}
              variant="outline"
              className="border-border bg-card h-10 sm:h-11 rounded-xl font-semibold text-xs sm:text-sm hover:bg-muted hover:border-success/30"
            >
              {isCapturing ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : copyDone ? (
                <Check className="h-3.5 w-3.5 mr-1.5 text-success" />
              ) : (
                <Copy className="h-3.5 w-3.5 mr-1.5" />
              )}
              {copyDone ? t("copied") : t("copy")}
            </Button>

            <Button
              onClick={handleDownload}
              disabled={isCapturing}
              variant="outline"
              className="border-border bg-card h-10 sm:h-11 rounded-xl font-semibold text-xs sm:text-sm hover:bg-muted"
            >
              {downloadDone ? (
                <Check className="h-3.5 w-3.5 mr-1.5 text-success" />
              ) : (
                <Download className="h-3.5 w-3.5 mr-1.5" />
              )}
              {downloadDone ? t("saved") : t("download")}
            </Button>

            <Button
              onClick={handleShareX}
              disabled={isCapturing}
              className="col-span-2 sm:col-span-1 bg-black hover:bg-neutral-900 text-white border border-neutral-800 font-bold h-10 sm:h-11 rounded-xl text-xs sm:text-sm"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 mr-1.5 fill-current shrink-0" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
              </svg>
              {t("postOnX")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
