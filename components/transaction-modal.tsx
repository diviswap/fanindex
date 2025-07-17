"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Loader2, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react"
import { chilizMainnet } from "@/lib/chains"
import type { Token } from "@/lib/types"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  hash?: `0x${string}`
  isConfirming: boolean
  isConfirmed: boolean
  error: Error | null
  indexName: string
  tokens: Token[]
  investedAmount: string
  dict: any
}

const TokenIcons = ({ tokens, isProcessing }: { tokens: Token[]; isProcessing?: boolean }) => (
  <div className="relative flex h-24 w-full items-center justify-center">
    {tokens.slice(0, 5).map((token, i) => (
      <div
        key={token.symbol}
        className={`absolute transition-all duration-500 ease-in-out ${isProcessing ? "animate-orbit" : ""}`}
        style={
          isProcessing
            ? {
                animationDelay: `${i * 0.5}s`,
                transformOrigin: "80px",
              }
            : {
                transform: `translateX(${(i - (tokens.slice(0, 5).length - 1) / 2) * 32}px)`,
              }
        }
      >
        <Avatar className="h-12 w-12 border-2 border-gray-700 bg-gray-800">
          <AvatarImage src={token.logo || "/placeholder.svg"} alt={token.name} />
          <AvatarFallback>{token.symbol.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    ))}
  </div>
)

export function TransactionModal({
  isOpen,
  onClose,
  hash,
  isConfirming,
  isConfirmed,
  error,
  indexName,
  tokens,
  investedAmount,
  dict,
}: TransactionModalProps) {
  const getStatusContent = () => {
    if (error) {
      return (
        <>
          <div className="mx-auto bg-red-500/10 p-3 rounded-full w-fit mb-4">
            <AlertTriangle className="h-10 w-10 text-red-400" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">{dict.failed_title}</DialogTitle>
          <p className="text-center text-red-400 mt-2 break-words">
            {error.shortMessage || "An unknown error occurred."}
          </p>
        </>
      )
    }
    if (isConfirmed) {
      return (
        <>
          <div className="mx-auto bg-green-500/10 p-3 rounded-full w-fit mb-4">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">{dict.success_title}</DialogTitle>
          <p className="text-center text-gray-400 mt-2">
            {dict.success_message.replace("{investedAmount}", investedAmount).replace("{indexName}", indexName)}
          </p>
          <div className="my-6">
            <TokenIcons tokens={tokens} />
          </div>
          <p className="text-center text-gray-400 text-sm">{dict.nft_minted}</p>
        </>
      )
    }
    if (isConfirming) {
      return (
        <>
          <DialogTitle className="text-center text-2xl font-bold">{dict.processing}</DialogTitle>
          <p className="text-center text-gray-400 mt-2">{dict.waiting_for_confirmation}</p>
          <div className="flex items-center justify-center my-10">
            <Loader2 className="h-16 w-16 text-blue-400 animate-spin" />
          </div>
          <p className="text-center text-gray-400 text-sm">{dict.may_take_moments}</p>
        </>
      )
    }
    return (
      <>
        <DialogTitle className="text-center text-2xl font-bold">{dict.awaiting_confirmation}</DialogTitle>
        <p className="text-center text-gray-400 mt-2">{dict.confirm_in_wallet}</p>
        <div className="flex items-center justify-center my-10">
          <Loader2 className="h-16 w-16 text-blue-400 animate-spin" />
        </div>
      </>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/50 backdrop-blur-xl border border-white/10 text-white rounded-2xl w-[90vw] max-w-md">
        <div className="py-6 px-2">{getStatusContent()}</div>
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-4 border-t border-white/10">
          {hash ? (
            <Button variant="link" asChild className="text-blue-400 p-0 h-auto">
              <a
                href={`${chilizMainnet.blockExplorers.default.url}/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {dict.view_on_chiliscan}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          ) : (
            <div />
          )}
          <Button onClick={onClose} variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
            {isConfirmed || error ? dict.close : dict.cancel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
