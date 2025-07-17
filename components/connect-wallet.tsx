"use client"

import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createAvatar } from "@dicebear/core"
import { identicon } from "@dicebear/collection"
import { useMemo } from "react"

export function ConnectWallet({ dict }: { dict: any }) {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance, isLoading } = useBalance({
    address,
  })

  const avatarSvg = useMemo(() => {
    if (!address) return null
    const avatar = createAvatar(identicon, {
      seed: address,
      size: 24,
    })
    const svgString = avatar.toString()
    const base64Svg = btoa(
      encodeURIComponent(svgString).replace(/%([0-9A-F]{2})/g, (match, p1) =>
        String.fromCharCode(Number.parseInt(p1, 16)),
      ),
    )
    return `data:image/svg+xml;base64,${base64Svg}`
  }, [address])

  if (isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-1 rounded-full bg-gray-800 border-gray-700 px-2 py-1 h-auto hover:bg-gray-700 text-white sm:gap-2 sm:px-3 sm:py-1.5"
          >
            {avatarSvg && (
              <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                <img src={avatarSvg || "/placeholder.svg"} alt="Wallet Avatar" />
                <AvatarFallback>{address?.slice(0, 2)}</AvatarFallback>
              </Avatar>
            )}
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold leading-tight sm:text-sm">
                {isLoading
                  ? "..."
                  : `${balance ? Number.parseFloat(balance.formatted).toFixed(2) : "0.00"} ${balance?.symbol}`}
              </span>
              <span className="text-[0.6rem] font-mono text-gray-400 leading-tight hidden sm:block">
                {`${address?.slice(0, 4)}...${address?.slice(-4)}`}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
          <DropdownMenuItem onClick={() => disconnect()} className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
            {dict.disconnect}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full bg-green-500 hover:bg-green-600 text-gray-900 font-bold px-3 py-1.5 h-auto sm:px-4 sm:py-2">
          {dict.connect}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
        {connectors.map((connector) => (
          <DropdownMenuItem
            key={connector.uid}
            onClick={() => connect({ connector })}
            className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
          >
            {connector.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
