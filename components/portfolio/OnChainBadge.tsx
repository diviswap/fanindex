"use client"

import { ExternalLink, ShieldCheck } from "lucide-react"

interface OnChainBadgeProps {
  /** NFT token ID — links to chiliscan.com/token/...  */
  tokenId?: bigint | string
  /** If true renders a compact inline variant without text label */
  compact?: boolean
}

const NFT_CONTRACT = "0x1cd2309fFdbc9A3a8819ED8b9E7979d1D725B9d9"

export function OnChainBadge({ tokenId, compact = false }: OnChainBadgeProps) {
  const href =
    tokenId !== undefined
      ? `https://chiliscan.com/token/${NFT_CONTRACT}?a=${tokenId.toString()}`
      : "https://chiliscan.com"

  if (compact) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-success hover:text-success/80 transition-colors"
        title="Verified on Chiliz Chain"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
        </span>
        <ExternalLink className="h-3 w-3" />
      </a>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/25 hover:bg-success/20 hover:border-success/40 transition-all duration-200 group"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
      </span>
      <ShieldCheck className="h-3 w-3 text-success" />
      <span className="text-xs font-semibold text-success leading-none">On-Chain</span>
      <ExternalLink className="h-3 w-3 text-success/60 group-hover:text-success transition-colors" />
    </a>
  )
}
