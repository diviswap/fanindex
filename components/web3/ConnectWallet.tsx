"use client"

import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Wallet, LogOut, ChevronDown, User, Copy, ExternalLink, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"

export function ConnectWallet() {
  const { address, isConnected, connector } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({
    address: address,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find((c) => c.id === connectorId)
    if (connector) {
      connect({ connector })
      localStorage.setItem("wagmi.connected", "true")
      localStorage.setItem("wagmi.connector", connectorId)
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
      toast.success("Address copied to clipboard")
    }
  }

  const getWalletInfo = (connectorId: string) => {
    if (connectorId.includes("metaMask")) {
      return {
        name: "MetaMask",
        logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
      }
    }
    if (connectorId.includes("coinbase")) {
      return {
        name: "Coinbase Wallet",
        logo: "https://avatars.githubusercontent.com/u/18060234?s=200&v=4",
      }
    }
    if (connectorId.includes("walletConnect")) {
      return {
        name: "WalletConnect",
        logo: "https://avatars.githubusercontent.com/u/37784886?s=200&v=4",
      }
    }
    return {
      name: "Browser Wallet",
      logo: "https://cdn-icons-png.flaticon.com/512/2965/2965358.png",
    }
  }

  if (!mounted) {
    return (
      <Button
        disabled
        className="wallet-button-glow gap-2 bg-success hover:bg-success/90 text-success-foreground font-bold text-sm px-4 py-2 h-10 rounded-lg border-2 border-success/50 shadow-lg shadow-success/20"
      >
        <Wallet className="h-4 w-4" />
        <span className="hidden sm:inline">Connect Wallet</span>
      </Button>
    )
  }

  if (isConnected && address) {
    const walletInfo = connector
      ? getWalletInfo(connector.id)
      : { name: "Wallet", logo: "https://cdn-icons-png.flaticon.com/512/2965/2965358.png" }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="wallet-connected-glow gap-1 sm:gap-2 border-2 border-success/50 bg-card/60 backdrop-blur-sm text-foreground hover:bg-success/10 hover:border-success text-sm px-3 sm:px-4 py-2 h-10 rounded-lg shadow-lg shadow-success/10 transition-all duration-300"
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <Wallet className="h-4 w-4 text-success" />
              <span className="hidden xs:inline font-mono font-semibold">
                {address.slice(0, 4)}...{address.slice(-3)}
              </span>
              <span className="xs:hidden font-mono font-semibold">{address.slice(0, 3)}...</span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-72 bg-popover/95 backdrop-blur-xl border-2 border-success/30 shadow-2xl shadow-success/20 rounded-xl"
        >
          <DropdownMenuLabel className="text-popover-foreground py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-success/50 p-1.5">
                <Image
                  src={walletInfo.logo || "/placeholder.svg"}
                  alt={walletInfo.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              <div>
                <div className="font-bold text-foreground">{walletInfo.name}</div>
                <div className="text-xs text-success flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  Connected
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-success/20" />

          <div className="px-3 py-3 bg-muted/50 mx-2 my-2 rounded-lg border border-border">
            <div className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">
              Wallet Address
            </div>
            <div className="flex items-center justify-between gap-2">
              <code className="text-sm text-foreground font-mono bg-background/40 px-2 py-1 rounded">
                {address.slice(0, 10)}...{address.slice(-8)}
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={copyAddress}
                className="h-8 w-8 p-0 hover:bg-success/20 hover:text-success transition-colors"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {balance && (
            <div className="px-3 py-3 bg-success/5 mx-2 my-2 rounded-lg border border-success/20">
              <div className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider flex items-center gap-1">
                <Zap className="h-3 w-3 text-success" />
                Balance
              </div>
              <div className="text-lg text-foreground font-bold flex items-baseline gap-1">
                {Number.parseFloat(balance.formatted).toFixed(4)}
                <span className="text-sm text-success font-semibold">{balance.symbol}</span>
              </div>
            </div>
          )}

          <DropdownMenuSeparator className="bg-success/20 my-2" />

          <DropdownMenuItem
            asChild
            className="cursor-pointer text-foreground hover:bg-success/10 focus:bg-success/10 mx-2 rounded-lg my-1 transition-colors"
          >
            <Link href="/portfolio" className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                <User className="h-4 w-4 text-success" />
              </div>
              <span className="font-semibold">My Portfolio</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => window.open(`https://chiliscan.com/address/${address}`, "_blank")}
            className="cursor-pointer text-foreground hover:bg-success/10 focus:bg-success/10 mx-2 rounded-lg my-1 transition-colors"
          >
            <div className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                <ExternalLink className="h-4 w-4 text-success" />
              </div>
              <span className="font-semibold">View on Explorer</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-success/20 my-2" />

          <DropdownMenuItem
            onClick={handleDisconnect}
            className="cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 mx-2 rounded-lg my-1 mb-2 transition-colors"
          >
            <div className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                <LogOut className="h-4 w-4 text-red-400" />
              </div>
              <span className="font-semibold">Disconnect Wallet</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={isPending}
          className="wallet-button-glow gap-2 bg-success hover:bg-success/90 text-success-foreground font-bold text-sm px-4 py-2 h-10 rounded-lg border-2 border-success/50 shadow-lg shadow-success/20 transition-all duration-300 hover:shadow-success/40 hover:scale-105"
        >
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">{isPending ? "Connecting..." : "Connect Wallet"}</span>
          <span className="sm:hidden">Connect</span>
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 bg-popover/95 backdrop-blur-xl border-2 border-success/30 shadow-2xl shadow-success/20 rounded-xl"
      >
        <div className="px-3 py-2 text-sm font-bold text-popover-foreground uppercase tracking-wider">
          Choose Wallet
        </div>
        <DropdownMenuSeparator className="bg-success/20" />
        {connectors.map((connector) => {
          const { name, logo } = getWalletInfo(connector.id)
          return (
            <DropdownMenuItem
              key={connector.id}
              onClick={() => handleConnect(connector.id)}
              className="gap-3 cursor-pointer text-foreground hover:bg-success/10 focus:bg-success/10 mx-2 rounded-lg my-1 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-success/30 p-1.5">
                <Image src={logo || "/placeholder.svg"} alt={name} width={32} height={32} className="rounded-lg" />
              </div>
              <span className="font-semibold">{name}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
