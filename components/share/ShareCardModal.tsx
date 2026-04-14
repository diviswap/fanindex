"use client"

import { useState, useCallback, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Download,
  Check,
  Loader2,
  Wallet,
  BarChart3,
  Tag,
  TrendingUp,
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

// ── Small toggle pill ─────────────────────────────────────────────────────────

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
          : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80"
      }`}
    >
      <Icon className="h-3 w-3 shrink-0" />
      {label}
    </button>
  )
}

// ── Tweet text ────────────────────────────────────────────────────────────────

function buildTweetText(data: ShareData): string {
  if (data.type === "index") {
    const tokens = data.index.tokens.join(", ")
    return `Just discovered the ${data.index.name} on @FanIndexes — earning ${data.index.apy} APY backed by ${tokens} fan tokens on Chiliz Chain.\n\nInvest in the future of sports. fanindex.pro\n\n#Chiliz #CHZ #FanTokens #DeFi`
  }
  if (data.type === "position") {
    const val = data.totalValueCHZ > 0 ? `${data.totalValueCHZ.toFixed(2)} CHZ` : "–"
    return `My ${data.holding.indexName} position on @FanIndexes is currently worth ${val}.\n\nBuilding my sports portfolio on Chiliz Chain. fanindex.pro\n\n#Chiliz #CHZ #FanTokens`
  }
  const val = data.totalValue > 0 ? `${data.totalValue.toFixed(2)} CHZ` : "–"
  return `My @FanIndexes portfolio is worth ${val} across ${data.positionsCount} index position${data.positionsCount !== 1 ? "s" : ""}.\n\nInvesting in fan tokens on Chiliz Chain. fanindex.pro\n\n#Chiliz #CHZ #FanTokens #DeFi`
}

// ── Main modal ────────────────────────────────────────────────────────────────

export function ShareCardModal({ open, onOpenChange, data, walletAddress }: ShareCardModalProps) {
  const [showPrice, setShowPrice] = useState(true)
  const [showTokens, setShowTokens] = useState(true)
  const [showApy, setShowApy] = useState(true)
  const [showComposition, setShowComposition] = useState(true)
  const [showWallet, setShowWallet] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(true)

  const [copyDone, setCopyDone] = useState(false)
  const [downloadDone, setDownloadDone] = useState(false)

  const { cardRef, status, dataUrl, capture, downloadPng, copyToClipboard, shareToX, reset } =
    useShareCard()

  const isCapturing = status === "capturing"

  const handleCapture = useCallback(async () => {
    reset()
    await capture()
  }, [capture, reset])

  const handleDownload = useCallback(async () => {
    const filename =
      data.type === "index"
        ? `fanindex-${data.index.id}.png`
        : data.type === "position"
        ? `fanindex-nft-${data.holding.tokenId}.png`
        : "fanindex-portfolio.png"
    // downloadPng already uses cached dataUrl internally — no need to re-capture
    await downloadPng(filename)
    setDownloadDone(true)
    setTimeout(() => setDownloadDone(false), 2000)
  }, [downloadPng, data])

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard()
    if (ok) {
      setCopyDone(true)
      setTimeout(() => setCopyDone(false), 2500)
    }
  }, [copyToClipboard])

  const handleShareX = useCallback(() => {
    shareToX(buildTweetText(data))
  }, [shareToX, data])

  const handleOpenChange = (v: boolean) => {
    if (!v) reset()
    onOpenChange(v)
  }

  // ── Toggles per type ─────────────────────────────────────────────────────
  const toggleRow =
    data.type === "index" ? (
      <div className="flex flex-wrap gap-2">
        <Toggle label="Price" icon={Tag} checked={showPrice} onChange={setShowPrice} />
        <Toggle label="APY" icon={TrendingUp} checked={showApy} onChange={setShowApy} />
        <Toggle label="Tokens" icon={Layers} checked={showTokens} onChange={setShowTokens} />
      </div>
    ) : data.type === "position" ? (
      <div className="flex flex-wrap gap-2">
        <Toggle label="Composition" icon={BarChart3} checked={showComposition} onChange={setShowComposition} />
        <Toggle label="Wallet address" icon={Wallet} checked={showWallet} onChange={setShowWallet} />
      </div>
    ) : (
      <div className="flex flex-wrap gap-2">
        <Toggle label="Breakdown" icon={BarChart3} checked={showBreakdown} onChange={setShowBreakdown} />
        <Toggle label="Wallet address" icon={Wallet} checked={showWallet} onChange={setShowWallet} />
      </div>
    )

  // ── Card node (shared between preview + hidden capture target) ───────────
  const cardNode =
    data.type === "index" ? (
      <IndexShareCard
        index={data.index}
        livePrice={data.livePrice}
        showPrice={showPrice}
        showTokens={showTokens}
        showApy={showApy}
        cardRef={cardRef}
      />
    ) : data.type === "position" ? (
      <PositionShareCard
        holding={data.holding}
        totalValueCHZ={data.totalValueCHZ}
        tokenRows={data.tokenRows}
        cardRef={cardRef}
      />
    ) : (
      <PortfolioShareCard
        totalValue={data.totalValue}
        nftValue={data.nftValue}
        chzBalance={data.chzBalance}
        fanTokensValue={data.fanTokensValue}
        positionsCount={data.positionsCount}
        walletAddress={walletAddress}
        cardRef={cardRef}
      />
    )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl w-full border-border bg-card p-0 gap-0 overflow-hidden rounded-2xl">
        {/* Header */}
        <DialogHeader className="flex-row items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <DialogTitle className="text-base font-bold text-foreground">
            Share Card
          </DialogTitle>
        </DialogHeader>

        <div className="p-5 space-y-5">

        {/* Card preview — scales the 1080×1350 card to fill the dialog width */}
        {/* The outer div establishes the visible bounding box; overflow:hidden clips the scaled content */}
        <div
          className="relative w-full rounded-xl overflow-hidden border border-border/40"
          style={{ paddingBottom: "calc(1350 / 1080 * 100%)", background: "#080808" }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            {/* Scale wrapper: renders card at 1080px then scales to container width */}
            <div
              style={{
                width: 1080,
                height: 1350,
                transformOrigin: "top left",
                // We use a CSS variable set via inline style on a parent
                // because we need JS to know the container width.
                // Instead we rely on aspect-ratio + 100% width approach:
                // scale = containerWidth / 1080. Expressed as a calc using
                // container-query-style but compatible: vw based approximation
                // is done via the sibling style tag approach:
                transform: "scale(var(--fi-scale))",
                flexShrink: 0,
                overflow: "hidden",
              }}
              ref={(el) => {
                if (el) {
                  const updateScale = () => {
                    const parent = el.parentElement?.parentElement
                    if (parent) {
                      const scale = parent.clientWidth / 1080
                      el.style.setProperty("--fi-scale", String(scale))
                      el.style.transform = `scale(${scale})`
                    }
                  }
                  updateScale()
                  const ro = new ResizeObserver(updateScale)
                  ro.observe(el.parentElement?.parentElement || el)
                  // cleanup stored on el for HMR
                  ;(el as any).__ro = ro
                }
              }}
            >
              {cardNode}
            </div>
          </div>

          {/* Capture overlay */}
          {isCapturing && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-success" />
                Generating image...
              </div>
            </div>
          )}
        </div>

          {/* Generated preview */}
          {dataUrl && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Preview</p>
                <span className="text-xs font-semibold text-success">Ready to share</span>
              </div>
              <div className="rounded-xl overflow-hidden border border-success/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dataUrl} alt="Share card preview" className="w-full h-auto block" />
              </div>
            </div>
          )}

          {/* Customization */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Customize</p>
            {toggleRow}
          </div>

          {/* Generate button — shown when image not yet captured */}
          {!dataUrl && (
            <Button
              onClick={handleCapture}
              disabled={isCapturing}
              className="w-full bg-success hover:bg-success/90 text-black font-bold h-11 rounded-xl"
            >
              {isCapturing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Image"
              )}
            </Button>
          )}

          {/* Once ready: show Save + Share on X */}
          {/* Action buttons */}
          {dataUrl && <div className="flex gap-2 pt-4 border-t border-border">
            {/* Save — downloadPng internally uses cached dataUrl, captures only if needed */}
            <Button
              onClick={handleDownload}
              disabled={isCapturing}
              variant="outline"
              className="flex-1 border-border bg-card h-11 rounded-xl font-semibold hover:bg-muted hover:border-success/30"
            >
              {isCapturing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : downloadDone ? (
                <Check className="h-4 w-4 mr-2 text-success" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {downloadDone ? "Saved!" : "Save"}
            </Button>

            {/* Share on X — opens tweet intent; image must be saved manually (X web intent does not accept blobs) */}
            <Button
              onClick={handleShareX}
              disabled={isCapturing}
              className="flex-1 bg-black hover:bg-neutral-900 text-white border border-neutral-800 font-bold h-11 rounded-xl flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current shrink-0" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
              </svg>
              Share on X
            </Button>
          </div>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
