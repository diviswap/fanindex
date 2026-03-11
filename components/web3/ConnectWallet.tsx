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
import { Wallet, LogOut, ChevronDown, User, Copy, ExternalLink, Zap, Shield, CheckCircle2, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function ConnectWallet() {
  const { address, isConnected, connector } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({
    address: address,
  })
  const [mounted, setMounted] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConnect = async (connectorId: string) => {
    const connector = connectors.find((c) => c.id === connectorId)
    if (connector) {
      setConnectingWallet(connectorId)
      try {
        await connect({ connector })
        localStorage.setItem("wagmi.connected", "true")
        localStorage.setItem("wagmi.connector", connectorId)
        setDialogOpen(false)
      } catch (error) {
        console.error("Connection failed:", error)
      } finally {
        setConnectingWallet(null)
      }
    }
  }

  const handleDisconnect = () => {
    disconnect()
    localStorage.removeItem("wagmi.connected")
    localStorage.removeItem("wagmi.connector")
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

  const getWalletInfo = (connectorId: string) => {
    if (connectorId.includes("metaMask")) {
      return {
        name: "MetaMask",
        logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
        description: "Connect using browser extension",
        popular: true,
      }
    }
    if (connectorId.includes("coinbase")) {
      return {
        name: "Coinbase Wallet",
        logo: "https://avatars.githubusercontent.com/u/18060234?s=200&v=4",
        description: "Connect using Coinbase Wallet",
        popular: true,
      }
    }
    if (connectorId.includes("walletConnect")) {
      return {
        name: "WalletConnect",
        logo: "https://avatars.githubusercontent.com/u/37784886?s=200&v=4",
        description: "Scan with mobile wallet",
        popular: true,
      }
    }
    return {
      name: "Browser Wallet",
      logo: "https://cdn-icons-png.flaticon.com/512/2965/2965358.png",
      description: "Connect using browser wallet",
      popular: false,
    }
  }

  if (!mounted) {
    return (
      <Button
        disabled
        className="relative overflow-hidden gap-2 bg-gradient-to-r from-success to-success/80 text-success-foreground font-semibold text-sm px-5 py-2.5 h-11 rounded-xl border border-success/30 shadow-lg shadow-success/25"
      >
        <Wallet className="h-4 w-4" />
        <span className="hidden sm:inline">Connect Wallet</span>
      </Button>
    )
  }

  if (isConnected && address) {
    const walletInfo = connector
      ? getWalletInfo(connector.id)
      : { name: "Wallet", logo: "https://cdn-icons-png.flaticon.com/512/2965/2965358.png", description: "", popular: false }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="group relative overflow-hidden gap-2 border border-success/40 bg-background/80 backdrop-blur-xl text-foreground hover:bg-success/5 hover:border-success/60 text-sm px-4 py-2.5 h-11 rounded-xl shadow-lg shadow-success/10 transition-all duration-500"
          >
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-success/20 via-transparent to-success/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex items-center gap-2">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-success shadow-lg shadow-success/50" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-success animate-ping opacity-75" />
              </div>
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center">
                <Wallet className="h-3.5 w-3.5 text-success" />
              </div>
              <span className="hidden sm:inline font-mono font-medium text-foreground/90">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <span className="sm:hidden font-mono font-medium">{address.slice(0, 4)}...</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-success transition-colors" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-80 p-0 bg-background/95 backdrop-blur-2xl border border-border/50 shadow-2xl shadow-black/20 rounded-2xl overflow-hidden"
        >
          {/* Header with gradient */}
          <div className="relative px-5 py-4 bg-gradient-to-br from-success/10 via-success/5 to-transparent border-b border-border/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-background to-muted flex items-center justify-center border border-success/30 shadow-lg">
                  <Image
                    src={walletInfo.logo || "/placeholder.svg"}
                    alt={walletInfo.name}
                    width={36}
                    height={36}
                    className="rounded-xl"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center shadow-lg shadow-success/50">
                  <CheckCircle2 className="h-3 w-3 text-success-foreground" />
                </div>
              </div>
              <div className="flex-1">
                <div className="font-bold text-foreground text-lg">{walletInfo.name}</div>
                <div className="text-sm text-success font-medium flex items-center gap-1.5 mt-0.5">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-success animate-ping" />
                  </div>
                  Connected to Chiliz Chain
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {/* Address Card */}
            <div className="group relative p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-success/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Wallet Address
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyAddress}
                  className="h-7 px-2 text-xs hover:bg-success/10 hover:text-success transition-all"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <code className="text-sm text-foreground font-mono block truncate">
                {address}
              </code>
            </div>

            {/* Balance Card */}
            {balance && (
              <div className="relative p-4 bg-gradient-to-br from-success/10 via-success/5 to-transparent rounded-xl border border-success/20 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-success/20 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-success/20 flex items-center justify-center">
                      <Zap className="h-3.5 w-3.5 text-success" />
                    </div>
                    <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      Balance
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">
                      {Number.parseFloat(balance.formatted).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </span>
                    <span className="text-sm font-semibold text-success">{balance.symbol}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DropdownMenuSeparator className="bg-border/50 mx-4" />

          {/* Actions */}
          <div className="p-2">
            <DropdownMenuItem
              asChild
              className="cursor-pointer text-foreground hover:bg-success/10 focus:bg-success/10 rounded-xl transition-colors px-3 py-3"
            >
              <Link href="/portfolio" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center border border-success/20">
                  <User className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="font-semibold">My Portfolio</div>
                  <div className="text-xs text-muted-foreground">View your positions & history</div>
                </div>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => window.open(`https://chiliscan.com/address/${address}`, "_blank")}
              className="cursor-pointer text-foreground hover:bg-success/10 focus:bg-success/10 rounded-xl transition-colors px-3 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center border border-success/20">
                  <ExternalLink className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="font-semibold">View on Explorer</div>
                  <div className="text-xs text-muted-foreground">Open in Chiliscan</div>
                </div>
              </div>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator className="bg-border/50 mx-4" />

          <div className="p-2 pb-3">
            <DropdownMenuItem
              onClick={handleDisconnect}
              className="cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 rounded-xl transition-colors px-3 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/5 flex items-center justify-center border border-red-500/20">
                  <LogOut className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <div className="font-semibold">Disconnect</div>
                  <div className="text-xs text-red-400/70">End your session</div>
                </div>
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
          className="group relative overflow-hidden gap-2 bg-gradient-to-r from-success via-success to-success/90 text-success-foreground font-semibold text-sm px-5 py-2.5 h-11 rounded-xl border border-success/30 shadow-lg shadow-success/25 transition-all duration-500 hover:shadow-success/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="relative flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">{isPending ? "Connecting..." : "Connect Wallet"}</span>
            <span className="sm:hidden">Connect</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 bg-background/95 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-3xl overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-success/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-success/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
        
        <div className="relative">
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50 bg-gradient-to-br from-success/5 to-transparent">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center border border-success/30">
                <Wallet className="h-6 w-6 text-success" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Connect Wallet</DialogTitle>
                <p className="text-sm text-muted-foreground mt-0.5">Choose your preferred wallet</p>
              </div>
            </div>
          </DialogHeader>

          {/* Wallet Options */}
          <div className="p-4 space-y-2">
            {connectors.map((connector) => {
              const { name, logo, description, popular } = getWalletInfo(connector.id)
              const isConnecting = connectingWallet === connector.id
              
              return (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector.id)}
                  disabled={isConnecting}
                  className={cn(
                    "w-full group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300",
                    "bg-muted/30 hover:bg-success/5 border-border/50 hover:border-success/40",
                    "focus:outline-none focus:ring-2 focus:ring-success/50 focus:ring-offset-2 focus:ring-offset-background",
                    isConnecting && "opacity-70 cursor-wait"
                  )}
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-success/0 via-success/5 to-success/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-background to-muted flex items-center justify-center border border-border/50 group-hover:border-success/30 transition-colors shadow-lg">
                      <Image 
                        src={logo || "/placeholder.svg"} 
                        alt={name} 
                        width={36} 
                        height={36} 
                        className="rounded-lg"
                      />
                    </div>
                    {popular && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center shadow-lg shadow-success/50">
                        <Sparkles className="h-3 w-3 text-success-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="relative flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground group-hover:text-success transition-colors">
                        {name}
                      </span>
                      {popular && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-success/10 text-success rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">{description}</span>
                  </div>
                  
                  <div className="relative">
                    {isConnecting ? (
                      <div className="w-6 h-6 border-2 border-success/30 border-t-success rounded-full animate-spin" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-success -rotate-90 transition-colors" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border/50 bg-muted/20">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                <Shield className="h-4 w-4 text-success" />
              </div>
              <p>
                By connecting, you agree to Fan Index&apos;s Terms of Service and acknowledge that you have read our Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
