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
  Copy,
  Twitter,
  Check,
  Loader2,
  Wallet,
  BarChart3,
  Tag,
  TrendingUp,
  Layers,
  X,
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
    return `Discover the ${data.index.name} on @FanIndex — ${data.index.apy} APY with ${data.index.tokens.length} fan tokens on Chiliz.\n\n#Chiliz #FanTokens #DeFi\nfanindex.pro`
  }
  if (data.type === "position") {
    const val = data.totalValueCHZ > 0 ? `${data.totalValueCHZ.toFixed(2)} CHZ` : "–"
    return `My ${data.indexName} position is worth ${val} on @FanIndex.\n\n#Chiliz #FanTokens\nfanindex.pro`
  }
  const val = data.totalValue > 0 ? `${data.totalValue.toFixed(2)} CHZ` : "–"
  return `My @FanIndex portfolio is worth ${val} across ${data.positionsCount} positions.\n\n#Chiliz #FanTokens #DeFi\nfanindex.pro`
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
        ? `fanindex-nft-${data.tokenId}.png`
        : "fanindex-portfolio.png"
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
          <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1d9bf0]/10 border border-[#1d9bf0]/20 flex items-center justify-center">
              <Twitter className="h-3.5 w-3.5 text-[#1d9bf0]" />
            </div>
            Share Card
          </DialogTitle>
        </DialogHeader>

        <div className="p-5 space-y-5">

        {/* Card preview — scales down to fit dialog width with 1080x1350 aspect ratio */}
        <div className="relative w-full rounded-xl overflow-hidden bg-[#080808] border border-border/40" style={{ aspectRatio: "1080 / 1350" }}>
          <div
            style={{
              position: "absolute",
              top: 0, left: 0,
              width: 1080,
              transformOrigin: "top left",
            }}
            className="card-scale-wrapper"
          >
            {cardNode}
          </div>
          <style>{`
            .card-scale-wrapper {
              transform: scale(var(--card-preview-scale, 1));
            }
            @media (min-width: 0px) {
              .card-scale-wrapper { --card-preview-scale: calc((min(100vw - 80px, 544px)) / 1080); }
            }
          `}</style>

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

          {/* Action buttons */}
          <div className="space-y-3 pt-1 border-t border-border">
            {!dataUrl ? (
              <Button
                onClick={handleCapture}
                disabled={isCapturing}
                className="w-full bg-success hover:bg-success/90 text-black font-bold h-11 rounded-xl mt-3"
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
            ) : (
              <>
                {/* Primary X share button */}
                <Button
                  onClick={handleShareX}
                  className="w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 text-base"
                >
                  <Twitter className="h-5 w-5" />
                  Share on X
                </Button>

                {/* Secondary actions row */}
                <div className="flex gap-2">
                  {/* Copy to clipboard */}
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="flex-1 border-border bg-card/50 h-11 rounded-xl font-semibold hover:bg-card hover:border-success/30"
                  >
                    {copyDone ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-success" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                  {/* Download */}
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    title="Download PNG"
                    className="border-border bg-card/50 h-11 w-11 p-0 rounded-xl shrink-0 hover:bg-card hover:border-success/30"
                  >
                    {downloadDone ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <button
                  onClick={() => reset()}
                  className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center py-2"
                >
                  ← Regenerate
                </button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
