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
import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Wallet picker entries — both options invoke the same WalletConnect
// connector underneath. The "Socios" tile is purely cosmetic so users who
// recognize that brand have a familiar entry point.
// ---------------------------------------------------------------------------
type PickerItem = {
  key: "walletconnect" | "socios" | "injected"
  name: string
  description: (mobile: boolean) => string
  logo: string
  isSociosLogo?: boolean
  // Which wagmi connector ID this entry should use.
  // "walletconnect" matches the WC connector; "injected" the browser one.
  target: "walletconnect" | "injected"
}

const PICKER_ITEMS: PickerItem[] = [
  {
    key: "walletconnect",
    name: "WalletConnect",
    description: (mobile) => (mobile ? "Open in your wallet app" : "Scan with any mobile wallet"),
    logo: "https://avatars.githubusercontent.com/u/37784886?s=200&v=4",
    target: "walletconnect",
  },
  {
    key: "socios",
    name: "Socios.com",
    description: (mobile) => (mobile ? "Open in Socios app" : "Scan with Socios.com app"),
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vjCpeldsZ6hj0adYPfXyJS6J2Cd9qI.png",
    isSociosLogo: true,
    target: "walletconnect",
  },
  {
    key: "injected",
    name: "Browser Wallet",
    description: () => "MetaMask, Coinbase, or any EIP-1193 wallet",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
    target: "injected",
  },
]

// ---------------------------------------------------------------------------
// Wallet picker modal — rendered via portal so it sits above everything.
// IMPORTANT: we use a SOLID interactive backdrop (no `pointer-events:none` +
// `backdrop-filter` combo, which is broken on iOS Safari and was the reason
// taps appeared to do nothing on mobile).
// ---------------------------------------------------------------------------
interface WalletModalProps {
  onClose: () => void
  onSelect: (item: PickerItem) => void
  connectingKey: string | null
  isMobile: boolean
  items: PickerItem[]
}

function WalletModal({ onClose, onSelect, connectingKey, isMobile, items }: WalletModalProps) {
  // Lock body scroll while modal is open.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Connect wallet"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.7)",
        // Plain solid backdrop — NO backdrop-filter, NO pointer-events:none.
        // Both of those broke tap handling on iOS in the previous version.
        padding: "1rem",
      }}
    >
      {/* Panel — stop click-through so taps inside don't close the modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "min(calc(100vw - 2rem), 24rem)",
          maxHeight: "calc(100vh - 2rem)",
          borderRadius: "0.75rem",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)",
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
        <div className="p-3 space-y-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 12rem)" }}>
          {items.map((item) => {
            const isConnecting = connectingKey === item.key
            return (
              <button
                key={item.key}
                type="button"
                disabled={isConnecting}
                onClick={() => {
                  if (!isConnecting) onSelect(item)
                }}
                style={{
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
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
                      src={item.logo}
                      alt={item.name}
                      width={item.isSociosLogo ? 44 : 28}
                      height={item.isSociosLogo ? 44 : 28}
                      className={cn("rounded", item.isSociosLogo && "w-full h-full object-cover")}
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success flex items-center justify-center">
                    <Sparkles className="h-2.5 w-2.5 text-success-foreground" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-sm text-foreground block">{item.name}</span>
                  <span className="text-xs text-muted-foreground block truncate">{item.description(isMobile)}</span>
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
          })}
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
    document.body,
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
  const [connectingKey, setConnectingKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent))
  }, [])

  // Filter the picker items based on which connectors are actually loaded.
  // We always show WalletConnect + Socios (same connector under the hood);
  // the injected option is only shown if a browser wallet is detected.
  const items = useMemo(() => {
    const hasInjected = connectors.some((c) => c.id === "injected" || c.type === "injected")
    const hasWC = connectors.some((c) => c.id.toLowerCase().includes("walletconnect"))
    return PICKER_ITEMS.filter((it) => {
      if (it.target === "injected") return hasInjected
      if (it.target === "walletconnect") return hasWC
      return true
    })
  }, [connectors])

  function openModal() {
    reset()
    setModalOpen(true)
  }

  function closeModal() {
    reset()
    setConnectingKey(null)
    setModalOpen(false)
  }

  async function handleSelect(item: PickerItem) {
    // Find the wagmi connector matching this picker item.
    const found =
      item.target === "walletconnect"
        ? connectors.find((c) => c.id.toLowerCase().includes("walletconnect"))
        : connectors.find((c) => c.id === "injected" || c.type === "injected")

    if (!found) {
      toast.error("Wallet connector not available yet, please try again.")
      return
    }

    reset()
    setConnectingKey(item.key)

    // Close our picker BEFORE invoking connect, so the WalletConnect modal
    // (or the wallet app on mobile) is never blocked by our overlay.
    setModalOpen(false)

    try {
      await connect({ connector: found })
    } catch (err) {
      console.error("[v0] connect error:", err)
      reset()
    } finally {
      setConnectingKey(null)
    }
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
    const walletInfo = (() => {
      if (!connector) {
        return {
          name: "Wallet",
          logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
        }
      }
      if (connector.id.toLowerCase().includes("walletconnect")) {
        return {
          name: "WalletConnect",
          logo: "https://avatars.githubusercontent.com/u/37784886?s=200&v=4",
        }
      }
      return {
        name: "Browser Wallet",
        logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
      }
    })()

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
          connectingKey={connectingKey}
          isMobile={isMobile}
          items={items}
        />
      )}
    </>
  )
}
