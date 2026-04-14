"use client"

import { useState, useCallback } from "react"
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
  LayoutGrid,
  Eye,
  Wallet,
  Tag,
  TrendingUp,
  BarChart3,
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
  tokenId: string
  indexName: string
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

// ── Toggle option helper ───────────────────────────────────────────────────────

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
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
        checked
          ? "border-success/60 bg-success/10 text-success"
          : "border-border bg-card/50 text-muted-foreground hover:text-foreground hover:border-border/80"
      }`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {label}
    </button>
  )
}

// ── Tweet text builders ────────────────────────────────────────────────────────

function buildTweetText(data: ShareData): string {
  if (data.type === "index") {
    return `Discover ${data.index.name} on FanIndex — ${data.index.apy} APY with ${data.index.tokens.length} fan tokens. #Chiliz #FanTokens #DeFi`
  }
  if (data.type === "position") {
    const val = data.totalValueCHZ > 0 ? `${data.totalValueCHZ.toFixed(2)} CHZ` : "–"
    return `My ${data.indexName} position is worth ${val} on FanIndex. #Chiliz #FanTokens #DeFi`
  }
  const val = data.totalValue > 0 ? `${data.totalValue.toFixed(2)} CHZ` : "–"
  return `My FanIndex portfolio is worth ${val} across ${data.positionsCount} positions. #Chiliz #FanTokens #DeFi`
}

// ── Main modal ────────────────────────────────────────────────────────────────

export function ShareCardModal({ open, onOpenChange, data, walletAddress }: ShareCardModalProps) {
  // Customization toggles (applicable fields vary by card type)
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
      setTimeout(() => setCopyDone(false), 2000)
    }
  }, [copyToClipboard])

  const handleShareX = useCallback(() => {
    shareToX(buildTweetText(data))
  }, [shareToX, data])

  // Reset preview whenever modal opens
  const handleOpenChange = (v: boolean) => {
    if (!v) reset()
    onOpenChange(v)
  }

  // ── Toggles per card type ─────────────────────────────────────────────────
  const toggles =
    data.type === "index" ? (
      <div className="flex flex-wrap gap-2">
        <Toggle label="Price" icon={Tag} checked={showPrice} onChange={setShowPrice} />
        <Toggle label="APY" icon={TrendingUp} checked={showApy} onChange={setShowApy} />
        <Toggle label="Tokens" icon={LayoutGrid} checked={showTokens} onChange={setShowTokens} />
      </div>
    ) : data.type === "position" ? (
      <div className="flex flex-wrap gap-2">
        <Toggle label="Composition" icon={LayoutGrid} checked={showComposition} onChange={setShowComposition} />
        <Toggle label="Wallet" icon={Wallet} checked={showWallet} onChange={setShowWallet} />
      </div>
    ) : (
      <div className="flex flex-wrap gap-2">
        <Toggle label="Breakdown" icon={BarChart3} checked={showBreakdown} onChange={setShowBreakdown} />
        <Toggle label="Wallet" icon={Wallet} checked={showWallet} onChange={setShowWallet} />
      </div>
    )

  // ── Card renderer (renders off-screen reference + visible preview) ─────────
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
        tokenId={data.tokenId}
        indexName={data.indexName}
        totalValueCHZ={data.totalValueCHZ}
        tokenRows={data.tokenRows}
        walletAddress={walletAddress}
        showComposition={showComposition}
        showWallet={showWallet}
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
        showWallet={showWallet}
        showBreakdown={showBreakdown}
        cardRef={cardRef}
      />
    )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl w-full border-border bg-card p-0 gap-0 overflow-hidden rounded-2xl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center">
              <Twitter className="h-3.5 w-3.5 text-success" />
            </div>
            Share Card
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Card preview — scales to fit container */}
          <div className="relative w-full overflow-hidden rounded-xl bg-[#050505] border border-border/60">
            <div
              className="mx-auto"
              style={{
                // Scale 600px card to fit ~90% of dialog width
                width: "min(600px, 100%)",
                transformOrigin: "top center",
              }}
            >
              {/* Actual card rendered at full size but visually shown */}
              <div className="overflow-x-auto">
                <div style={{ minWidth: 600 }}>
                  {cardNode}
                </div>
              </div>
            </div>

            {/* Capturing overlay */}
            {isCapturing && (
              <div className="absolute inset-0 bg-background/70 flex items-center justify-center rounded-xl">
                <div className="flex items-center gap-2 text-foreground text-sm font-medium">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating image...
                </div>
              </div>
            )}
          </div>

          {/* Preview result if captured */}
          {dataUrl && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Generated Preview</span>
                <span className="ml-auto text-xs text-success font-medium">Ready to share</span>
              </div>
              <div className="overflow-hidden rounded-xl border border-success/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dataUrl} alt="Share card preview" className="w-full h-auto" />
              </div>
            </div>
          )}

          {/* Customization toggles */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Customize</p>
            {toggles}
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2 border-t border-border">
            {/* Capture button */}
            {!dataUrl && (
              <Button
                onClick={handleCapture}
                disabled={isCapturing}
                className="w-full bg-success hover:bg-success/90 text-success-foreground font-semibold h-11 rounded-xl"
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

            {/* Share / download / copy — shown after capture */}
            {dataUrl && (
              <div className="flex gap-2">
                <Button
                  onClick={handleShareX}
                  className="flex-1 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-semibold h-11 rounded-xl"
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Share on X
                </Button>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="flex-1 border-border bg-card/50 h-11 rounded-xl font-semibold"
                >
                  {copyDone ? (
                    <>
                      <Check className="h-4 w-4 mr-2 text-success" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Image
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="border-border bg-card/50 h-11 w-11 p-0 rounded-xl"
                  title="Download PNG"
                >
                  {downloadDone ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}

            {/* Regenerate after capture */}
            {dataUrl && (
              <button
                onClick={() => reset()}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center py-1"
              >
                Regenerate with new settings
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
