"use client"

import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Wallet, LogOut, ChevronDown, User, Copy, ExternalLink, Zap, Shield, CheckCircle2, Sparkles, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Wallet metadata helpers
// ---------------------------------------------------------------------------
function getWalletInfo(connectorId: string, isSocios: boolean, isMobile: boolean) {
  if (connectorId.toLowerCase().includes("walletconnect")) {
    if (isSocios) {
      return {
        name: "Socios.com",
        logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vjCpeldsZ6hj0adYPfXyJS6J2Cd9qI.png",
        description: isMobile ? "Open in Socios app" : "Scan with Socios.com app",
        isSociosLogo: true,
      }
    }
    return {
      name: "WalletConnect",
      logo: "https://avatars.githubusercontent.com/u/37784886?s=200&v=4",
      description: isMobile ? "Open in your wallet app" : "Scan with any mobile wallet",
      isSociosLogo: false,
    }
  }
  return {
    name: "Browser Wallet",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
    description: "MetaMask, Coinbase, or any EIP-1193 wallet",
    isSociosLogo: false,
  }
}

// ---------------------------------------------------------------------------
// Wallet picker modal — rendered via portal so it sits above everything and
// its touch events are completely isolated from the rest of the page.
// ---------------------------------------------------------------------------
interface WalletModalProps {
  onClose: () => void
  onSelect: (connectorId: string, isSocios: boolean) => void
  connectingWallet: string | null
  walletItems: { connectorId: string; isSocios: boolean; key: string }[]
  isMobile: boolean
}

function WalletModal({ onClose, onSelect, connectingWallet, walletItems, isMobile }: WalletModalProps) {
  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [])

  return createPortal(
    // Outer layer: purely visual backdrop, pointer-events disabled so it
    // NEVER intercepts taps meant for the panel or the page.
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Backdrop visual only — no pointer events
        backgroundColor: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        pointerEvents: "none",
      }}
    >
      {/* Panel — re-enables pointer events only for itself */}
      <div
        style={{
          position: "relative",
          width: "min(calc(100vw - 2rem), 24rem)",
          borderRadius: "0.75rem",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)",
          pointerEvents: "auto",
          overscrollBehavior: "contain",
        }}
        className="bg-background border border-border/50"
      >
        {/* Header */}
        <div className="relative px-4 pt-4 pb-3 border-b border-border/50 bg-gradient-to-br from-success/5 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center border border-success/30">
              <Wallet className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">Connect Wallet</p>
              <p className="text-xs text-muted-foreground">Choose your wallet to continue</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-3 space-y-2">
          {walletItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 gap-2 text-muted-foreground">
              <div className="w-6 h-6 border-2 border-success/30 border-t-success rounded-full animate-spin" />
              <span className="text-xs">Loading wallets...</span>
            </div>
          ) : (
            walletItems.map(({ connectorId, isSocios, key }) => {
              const { name, logo, description, isSociosLogo } = getWalletInfo(connectorId, isSocios, isMobile)
              const isConnecting = connectingWallet === key
              return (
                <button
                  key={key}
                  type="button"
                  disabled={isConnecting}
                  onClick={() => { if (!isConnecting) onSelect(connectorId, isSocios) }}
                  style={{
                    touchAction: "manipulation",
                    WebkitTapHighlightColor: "transparent",
                    // Minimum 48px touch target for mobile
                    minHeight: "64px",
                    cursor: isConnecting ? "wait" : "pointer",
                  } as React.CSSProperties}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 rounded-xl border transition-colors text-left",
                    "bg-muted/30 active:bg-success/10 hover:bg-success/5 border-border/50 hover:border-success/40",
                    isConnecting && "opacity-60",
                  )}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-background to-muted flex items-center justify-center border border-border/50 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logo}
                        alt={name}
                        width={isSociosLogo ? 44 : 28}
                        height={isSociosLogo ? 44 : 28}
                        className={cn("rounded", isSociosLogo && "w-full h-full object-cover")}
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success flex items-center justify-center">
                      <Sparkles className="h-2.5 w-2.5 text-success-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-sm text-foreground block">{name}</span>
                    <span className="text-xs text-muted-foreground block truncate">{description}</span>
                  </div>
                  <div className="flex-shrink-0 pr-1">
                    {isConnecting ? (
                      <div className="w-5 h-5 border-2 border-success/30 border-t-success rounded-full animate-spin" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground -rotate-90" />
                    )}
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border/50 bg-muted/20">
          <div className="flex items-start gap-2 text-[10px] text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-success flex-shrink-0 mt-0.5" />
            <p>By connecting, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function ConnectWallet() {
  const { address, isConnected, connector } = useAccount()
  const { connect, connectors, isPending, reset } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })

  const [mounted, setMounted] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent))
  }, [])

  // Build the deduplicated wallet items list once per connectors change.
  // The second WalletConnect entry becomes the Socios option.
  const walletItems = useMemo(() => {
    let wcCount = 0
    return connectors.map((c) => {
      const isWC = c.id.toLowerCase().includes("walletconnect")
      const isSocios = isWC && wcCount === 1
      if (isWC) wcCount++
      return { connectorId: c.id, isSocios, key: isSocios ? "socios" : c.id }
    })
  }, [connectors])

  function openModal() {
    reset() // clear any stale wagmi error before showing the picker
    setModalOpen(true)
  }

  function closeModal() {
    setConnectingWallet(null)
    setModalOpen(false)
  }

  function handleSelect(connectorId: string, isSocios: boolean) {
    const found = connectors.find((c) => c.id === connectorId)
    if (!found) return

    // Close the modal immediately so WalletConnect's own modal (QR on desktop,
    // wallet list / deep-link on mobile) can render without interference.
    setModalOpen(false)
    setConnectingWallet(isSocios ? "socios" : connectorId)
    connect({ connector: found })
  }

  function handleDisconnect() {
    disconnect()
    toast.success("Wallet disconnected")
  }

  function copyAddress() {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      toast.success("Address copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // --- SSR skeleton ---
  if (!mounted) {
    return (
      <Button
        disabled
        className="relative overflow-hidden gap-1.5 bg-gradient-to-r from-success to-success/80 text-success-foreground font-medium text-xs sm:text-sm px-3 sm:px-4 py-2 h-9 sm:h-10 rounded-lg border border-success/30 shadow-md shadow-success/20"
      >
        <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Connect</span>
      </Button>
    )
  }

  // --- Connected state ---
  if (isConnected && address) {
    const walletInfo = connector
      ? getWalletInfo(connector.id, false, isMobile)
      : { name: "Wallet", logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg", description: "", isSociosLogo: false }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="group relative overflow-hidden gap-1.5 border border-success/40 bg-background/80 backdrop-blur-xl text-foreground hover:bg-success/5 hover:border-success/60 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 h-9 sm:h-10 rounded-lg shadow-md shadow-success/10 transition-all duration-300"
          >
            <div className="relative flex items-center gap-1.5">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-success" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-success animate-ping opacity-75" />
              </div>
              <Wallet className="h-3.5 w-3.5 text-success" />
              <span className="hidden sm:inline font-mono font-medium text-foreground/90 text-xs">
                {address.slice(0, 4)}...{address.slice(-3)}
              </span>
              <span className="sm:hidden font-mono font-medium text-xs">{address.slice(0, 3)}...</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={6}
          className="w-64 sm:w-72 p-0 bg-background/95 backdrop-blur-xl border border-border/50 shadow-xl rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative px-3 py-3 bg-gradient-to-br from-success/10 via-success/5 to-transparent border-b border-border/50">
            <div className="relative flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-background to-muted flex items-center justify-center border border-success/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={walletInfo.logo} alt={walletInfo.name} width={24} height={24} className="rounded-lg" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-success flex items-center justify-center">
                  <CheckCircle2 className="h-2.5 w-2.5 text-success-foreground" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-foreground text-sm">{walletInfo.name}</div>
                <div className="text-xs text-success font-medium flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                  Chiliz Chain
                </div>
              </div>
            </div>
          </div>

          <div className="p-2.5 space-y-2">
            {/* Address */}
            <div className="p-2.5 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Address</span>
                <Button size="sm" variant="ghost" onClick={copyAddress} className="h-6 px-1.5 text-[10px] hover:bg-success/10 hover:text-success">
                  {copied ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <code className="text-xs text-foreground font-mono block truncate">
                {address.slice(0, 12)}...{address.slice(-10)}
              </code>
            </div>

            {/* Balance */}
            {balance && (
              <div className="p-2.5 bg-success/5 rounded-lg border border-success/20">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="h-3 w-3 text-success" />
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Balance</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-foreground">
                    {Number.parseFloat(balance.formatted).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                  </span>
                  <span className="text-xs font-semibold text-success">{balance.symbol}</span>
                </div>
              </div>
            )}
          </div>

          <DropdownMenuSeparator className="bg-border/50 mx-2.5" />

          <div className="p-1.5">
            <DropdownMenuItem asChild className="cursor-pointer text-foreground hover:bg-success/10 focus:bg-success/10 rounded-lg transition-colors px-2.5 py-2">
              <Link href="/portfolio" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-success" />
                </div>
                <span className="font-medium text-sm">My Portfolio</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => window.open(`https://chiliscan.com/address/${address}`, "_blank")}
              className="cursor-pointer text-foreground hover:bg-success/10 focus:bg-success/10 rounded-lg transition-colors px-2.5 py-2"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <ExternalLink className="h-4 w-4 text-success" />
                </div>
                <span className="font-medium text-sm">View on Explorer</span>
              </div>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator className="bg-border/50 mx-2.5" />

          <div className="p-1.5 pb-2">
            <DropdownMenuItem
              onClick={handleDisconnect}
              className="cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 rounded-lg transition-colors px-2.5 py-2"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <LogOut className="h-4 w-4 text-red-400" />
                </div>
                <span className="font-medium text-sm">Disconnect</span>
              </div>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // --- Disconnected state ---
  return (
    <>
      <Button
        disabled={isPending}
        onClick={openModal}
        style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } as React.CSSProperties}
        className="group relative overflow-hidden gap-1.5 bg-gradient-to-r from-success to-success/90 text-success-foreground font-medium text-xs sm:text-sm px-3 sm:px-4 py-2 h-9 sm:h-10 rounded-lg border border-success/30 shadow-md shadow-success/20 transition-all duration-300 hover:shadow-success/30 active:scale-[0.98]"
      >
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="relative flex items-center gap-1.5">
          <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">{isPending ? "Connecting..." : "Connect"}</span>
          <span className="sm:hidden">{isPending ? "..." : "Connect"}</span>
        </div>
      </Button>

      {modalOpen && (
        <WalletModal
          onClose={closeModal}
          onSelect={handleSelect}
          connectingWallet={connectingWallet}
          walletItems={walletItems}
          isMobile={isMobile}
        />
      )}
    </>
  )
}
