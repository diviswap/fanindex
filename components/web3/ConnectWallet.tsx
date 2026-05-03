"use client"

import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Wallet,
  LogOut,
  ChevronDown,
  User,
  Copy,
  ExternalLink,
  Zap,
  Shield,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Globe,
  ArrowRight,
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"

type WalletOption = {
  id: string
  connectorId: "injected" | "walletConnect"
  name: string
  description: string
  logo: string | null
  iconBg: string
  badge?: string
  featured?: boolean
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    id: "socios",
    connectorId: "walletConnect",
    name: "Socios.com",
    description: "Connect with the official Fan Token wallet",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Chiliz_2022.svg",
    iconBg: "from-[#CD0124]/30 to-[#CD0124]/5",
    badge: "Recommended",
    featured: true,
  },
  {
    id: "browser",
    connectorId: "injected",
    name: "Browser Wallet",
    description: "MetaMask, Coinbase, Rabby, or any EIP-1193 wallet",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
    iconBg: "from-warning/30 to-warning/5",
  },
  {
    id: "walletconnect",
    connectorId: "walletConnect",
    name: "WalletConnect",
    description: "Scan with any compatible mobile wallet",
    logo: null,
    iconBg: "from-blue-500/30 to-blue-500/5",
  },
]

export function ConnectWallet() {
  const { address, isConnected, connector } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })
  const [mounted, setMounted] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [connectingOption, setConnectingOption] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConnect = async (option: WalletOption) => {
    const found = connectors.find((c) => c.id === option.connectorId)
    if (!found) {
      toast.error("Wallet connector not available yet, please try again.")
      return
    }
    setConnectingOption(option.id)
    try {
      await connect({ connector: found })
      setDialogOpen(false)
      toast.success(`Connected via ${option.name}`)
    } catch (error) {
      // wagmi surfaces errors via its own error state
    } finally {
      setConnectingOption(null)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast.success("Wallet disconnected")
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      toast.success("Address copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getConnectedWalletInfo = (connectorId: string | undefined) => {
    if (!connectorId) {
      return {
        name: "Wallet",
        logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
      }
    }
    if (connectorId.includes("walletConnect")) {
      return {
        name: "WalletConnect",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Chiliz_2022.svg",
      }
    }
    return {
      name: "Browser Wallet",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
    }
  }

  const connectorsLoading = connectors.length === 0

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

  if (isConnected && address) {
    const walletInfo = getConnectedWalletInfo(connector?.id)

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
                  <img
                    src={walletInfo.logo}
                    alt={walletInfo.name}
                    width={24}
                    height={24}
                    className="rounded-lg"
                  />
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
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyAddress}
                  className="h-6 px-1.5 text-[10px] hover:bg-success/10 hover:text-success"
                >
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

          {/* Actions */}
          <div className="p-1.5">
            <DropdownMenuItem
              asChild
              className="cursor-pointer text-foreground hover:bg-success/10 focus:bg-success/10 rounded-lg transition-colors px-2.5 py-2"
            >
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

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isPending}
          className="group relative overflow-hidden gap-1.5 bg-gradient-to-r from-success to-success/90 text-success-foreground font-medium text-xs sm:text-sm px-3 sm:px-4 py-2 h-9 sm:h-10 rounded-lg border border-success/30 shadow-md shadow-success/20 transition-all duration-300 hover:shadow-success/30 active:scale-[0.98]"
        >
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="relative flex items-center gap-1.5">
            <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{isPending ? "Connecting..." : "Connect"}</span>
            <span className="sm:hidden">{isPending ? "..." : "Connect"}</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md p-0 bg-background/95 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-2xl overflow-hidden">
        {/* Decorative glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -left-20 w-60 h-60 bg-success/15 rounded-full blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -right-20 w-60 h-60 bg-success/10 rounded-full blur-3xl"
        />

        <div className="relative">
          {/* Header */}
          <DialogHeader className="px-5 pt-5 pb-4 border-b border-border/50 bg-gradient-to-br from-success/8 via-transparent to-transparent">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-success/25 to-success/5 flex items-center justify-center border border-success/30">
                <Wallet className="h-5 w-5 text-success" />
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success flex items-center justify-center">
                  <Sparkles className="h-2.5 w-2.5 text-success-foreground" />
                </div>
              </div>
              <div className="flex-1 text-left">
                <DialogTitle className="text-lg font-bold tracking-tight">Connect Wallet</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose how you want to connect to <span className="text-foreground font-medium">FanIndex</span>
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Wallet Options */}
          <div className="p-4 space-y-2">
            {connectorsLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground">
                <div className="w-7 h-7 border-2 border-success/30 border-t-success rounded-full animate-spin" />
                <span className="text-xs">Loading wallets…</span>
              </div>
            ) : (
              WALLET_OPTIONS.map((option) => {
                const isConnecting = connectingOption === option.id
                const connectorAvailable = connectors.some((c) => c.id === option.connectorId)
                const disabled = !connectorAvailable || isConnecting

                return (
                  <button
                    key={option.id}
                    onClick={() => handleConnect(option)}
                    disabled={disabled}
                    className={cn(
                      "w-full group relative flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 text-left",
                      "bg-muted/20 hover:bg-success/5 border-border/60 hover:border-success/40",
                      "focus:outline-none focus:ring-2 focus:ring-success/40",
                      option.featured && "bg-gradient-to-br from-success/8 via-success/3 to-transparent border-success/30",
                      isConnecting && "opacity-70 cursor-wait",
                      disabled && !isConnecting && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    {/* Featured glow */}
                    {option.featured && (
                      <div
                        aria-hidden
                        className="absolute inset-0 rounded-xl pointer-events-none opacity-50"
                        style={{
                          background:
                            "radial-gradient(ellipse 60% 70% at 0% 0%, color-mix(in oklch, var(--success) 12%, transparent), transparent 60%)",
                        }}
                      />
                    )}

                    <div className="relative flex-shrink-0">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center border border-border/60 group-hover:border-success/40 transition-all bg-gradient-to-br",
                          option.iconBg,
                        )}
                      >
                        {option.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={option.logo}
                            alt={option.name}
                            width={28}
                            height={28}
                            className="rounded-md"
                          />
                        ) : option.id === "walletconnect" ? (
                          <Smartphone className="h-5 w-5 text-blue-400" />
                        ) : (
                          <Globe className="h-5 w-5 text-foreground/70" />
                        )}
                      </div>
                      {option.featured && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success flex items-center justify-center ring-2 ring-background">
                          <Sparkles className="h-2.5 w-2.5 text-success-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="relative flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-sm text-foreground group-hover:text-success transition-colors">
                          {option.name}
                        </span>
                        {option.badge && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-success/15 text-success rounded-full border border-success/20">
                            {option.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground truncate block leading-relaxed">
                        {option.description}
                      </span>
                    </div>

                    <div className="relative flex-shrink-0">
                      {isConnecting ? (
                        <div className="w-5 h-5 border-2 border-success/30 border-t-success rounded-full animate-spin" />
                      ) : (
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-success group-hover:translate-x-0.5 transition-all" />
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>

          {/* Network info */}
          <div className="px-5 pb-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/40">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
                  <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-success animate-ping opacity-75" />
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Network <span className="text-foreground font-medium">Chiliz Chain</span>
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground/70">CHZ</span>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-border/50 bg-muted/15">
            <div className="flex items-start gap-2 text-[11px] text-muted-foreground leading-relaxed">
              <Shield className="h-3.5 w-3.5 text-success flex-shrink-0 mt-0.5" />
              <p>
                By connecting, you agree to our{" "}
                <Link href="/terms" className="text-success hover:underline font-medium">
                  Terms
                </Link>{" "}
                &amp;{" "}
                <Link href="/privacy" className="text-success hover:underline font-medium">
                  Privacy Policy
                </Link>
                . Your keys, your coins.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
