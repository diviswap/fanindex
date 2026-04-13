"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from "wagmi"
import { parseEther } from "viem"
import { chiliz } from "wagmi/chains"
import { EtfVaultABI, getContractAddresses, hasDeployedContracts, ETF_CONTRACTS } from "@/lib/contracts/abis"
import type { IndexData } from "./IndexCard"
import { Loader2, CheckCircle2, XCircle, TrendingUp, Wallet, Info, Sparkles, ExternalLink, Trophy, Coins, AlertTriangle } from "lucide-react"
import { useDemoMode } from "@/lib/demo/DemoModeContext"
import { useRouter } from "next/navigation"
import { getTokenBySymbol } from "@/lib/data/fan-tokens"

const CHILIZ_MAINNET_ID = chiliz.id // 88888

interface BuyIndexDialogProps {
  index: IndexData
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function BuyIndexDialog({ index, open, onOpenChange, onSuccess }: BuyIndexDialogProps) {
  const [amount, setAmount] = useState("")
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const { isDemoMode, demoBalance, buyIndex: demoBuyIndex } = useDemoMode()
  const [demoSuccess, setDemoSuccess] = useState(false)
  const [demoError, setDemoError] = useState<string | null>(null)
  const [demoLoading, setDemoLoading] = useState(false)

  const contracts = getContractAddresses(index.id)
  const hasContracts = hasDeployedContracts(index.id)

  // Chain guard — only relevant for real (non-demo) wallets
  const isWrongChain = isConnected && !isDemoMode && chainId !== CHILIZ_MAINNET_ID

  useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess()
    }
  }, [isSuccess, onSuccess])

  const [purchaseDetails, setPurchaseDetails] = useState<{
    amount: string
    units: number
    fee: number
  } | null>(null)

  const router = useRouter()

  const handleBuy = async () => {
    if (isDemoMode) {
      if (!amount || Number.parseFloat(amount) <= 0) {
        setDemoError("Please enter a valid amount")
        return
      }

      const entryFee = Number.parseFloat(amount) * 0.01
      const total = Number.parseFloat(amount) + entryFee

      if (total > demoBalance) {
        setDemoError("Insufficient demo balance")
        return
      }

      setDemoLoading(true)
      setDemoError(null)

      setPurchaseDetails({
        amount: amount,
        units: Number.parseFloat(amount) / Number.parseFloat(index.price),
        fee: entryFee,
      })

      setTimeout(() => {
        const success = demoBuyIndex(index.id, index.name, Number.parseFloat(amount), Number.parseFloat(index.price))
        setDemoLoading(false)
        if (success) {
          setDemoSuccess(true)
          onSuccess?.()
          setTimeout(() => handleClose(), 3000)
        } else {
          setDemoError("Demo purchase failed")
        }
      }, 1500)

      return
    }

    if (!isConnected || !address) {
      setDemoError("Please connect your wallet first")
      return
    }

    if (isWrongChain) {
      setDemoError("Please switch to Chiliz Mainnet first")
      return
    }

    if (!hasContracts || !contracts) {
      setDemoError("This index is not yet deployed on Chiliz Mainnet. Use Demo Mode to try it out.")
      return
    }

    setPurchaseDetails({
      amount: amount,
      units: Number.parseFloat(amount) / Number.parseFloat(index.price),
      fee: Number.parseFloat(amount) * 0.01,
    })

    try {
      const contractConfig = ETF_CONTRACTS[index.id as keyof typeof ETF_CONTRACTS]
      const tokenCount = contractConfig?.tokens || 2
      const minOuts = Array(tokenCount).fill(BigInt(0))

      writeContract({
        address: contracts.vault,
        abi: EtfVaultABI.abi,
        functionName: "buyNative",
        args: [address, minOuts],
        value: parseEther(amount),
        gas: BigInt(800_000),
        chain: chiliz,
      })
    } catch (err) {
      // handled by wagmi error state
    }
  }

  const handleClose = () => {
    setAmount("")
    setDemoSuccess(false)
    setDemoError(null)
    setDemoLoading(false)
    setPurchaseDetails(null)
    onOpenChange(false)
  }

  const handleViewPortfolio = () => {
    handleClose()
    router.push("/portfolio")
  }

  const entryFee = amount ? Number.parseFloat(amount) * 0.01 : 0
  const netInvestment = amount ? Number.parseFloat(amount) * 0.99 : 0
  const estimatedUnits = amount ? Number.parseFloat(amount) / Number.parseFloat(index.price) : 0

  const displayBalance = isDemoMode ? demoBalance : undefined
  const showDemoSuccess = isDemoMode && demoSuccess

  // Composition: build token rows from index.tokens list
  const compositionRows = (index.tokens ?? []).map((symbol) => {
    const token = getTokenBySymbol(symbol)
    const weightPct = index.tokens.length > 0 ? 100 / index.tokens.length : 0
    return {
      symbol,
      name: token?.name ?? symbol,
      icon: token?.icon,
      weightPct,
    }
  })

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {(showDemoSuccess || isSuccess) && purchaseDetails ? (
          /* ─── Success screen ─────────────────────────────────────────── */
          <div className="relative">
            <div className="absolute inset-0 rounded-lg overflow-hidden opacity-80 dark:opacity-70">
              <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                <source src="/images/dec77d7d-abd9-4ebc-9a9c-3b387c3f1a98-card.MP4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-background/40 dark:bg-background/20" />
            </div>

            <div className="relative z-10 p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="text-center space-y-2 sm:space-y-3">
                <div className="flex justify-center">
                  <div className="p-3 sm:p-4 rounded-full bg-success/20 border-2 border-success animate-pulse">
                    <Trophy className="h-8 w-8 sm:h-12 sm:w-12 text-success" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-success">Purchase Successful!</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Your position NFT has been minted to your wallet
                  </p>
                </div>
              </div>

              <div className="rounded-xl border-2 border-success/30 bg-card/95 backdrop-blur-sm p-3 sm:p-5 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="text-xs sm:text-sm text-muted-foreground">Index</span>
                  <span className="text-sm sm:text-base font-bold text-foreground">{index.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Amount Invested</span>
                  <span className="text-sm font-semibold">{purchaseDetails.amount} CHZ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Units Received</span>
                  <span className="text-sm font-semibold text-success">{purchaseDetails.units.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Protocol Fee (1%)</span>
                  <span className="text-sm font-semibold">- {purchaseDetails.fee.toFixed(4)} CHZ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-muted-foreground">Net Investment</span>
                  <span className="text-sm font-semibold text-success">
                    {(Number.parseFloat(purchaseDetails.amount) - purchaseDetails.fee).toFixed(4)} CHZ
                  </span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between items-center">
                  <span className="text-sm font-bold">Total Sent</span>
                  <span className="text-base font-bold text-success">
                    {Number.parseFloat(purchaseDetails.amount).toFixed(4)} CHZ
                  </span>
                </div>

                {!isDemoMode && hash && (
                  <div className="pt-2 border-t border-border">
                    <a
                      href={`https://chiliscan.com/tx/${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-xs sm:text-sm text-success hover:text-success/80 transition-colors font-medium"
                    >
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                      View Transaction on Chiliscan
                    </a>
                  </div>
                )}

                {isDemoMode && (
                  <div className="pt-2 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3" />
                    Demo Mode - Simulated Transaction
                  </div>
                )}
              </div>

              <Button
                onClick={handleViewPortfolio}
                className="w-full bg-success hover:bg-success/90 text-black font-bold h-10"
              >
                View Portfolio
              </Button>
            </div>
          </div>
        ) : (
          /* ─── Buy form ───────────────────────────────────────────────── */
          <>
            <DialogHeader className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-success/20 border border-success/40">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
                </div>
                <div>
                  <DialogTitle className="text-lg sm:text-xl md:text-2xl">Buy {index.name}</DialogTitle>
                  <DialogDescription className="text-muted-foreground text-xs sm:text-sm mt-0.5">
                    {index.description}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">

              {/* Demo badge */}
              {isDemoMode && (
                <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-success/10 border border-success/30">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
                    <span className="text-xs sm:text-sm font-medium">Demo Mode</span>
                  </div>
                  <span className="text-xs sm:text-sm text-success font-semibold">
                    {displayBalance?.toFixed(2)} CHZ
                  </span>
                </div>
              )}

              {/* Wrong chain warning + switch button */}
              {isWrongChain && (
                <div className="flex flex-col gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/40">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />
                    <p className="text-xs font-medium text-yellow-500">
                      Your wallet is connected to the wrong network. Transactions require Chiliz Mainnet (chain 88888).
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs h-8 w-full"
                    onClick={() => switchChain({ chainId: CHILIZ_MAINNET_ID })}
                    disabled={isSwitching}
                  >
                    {isSwitching ? (
                      <><Loader2 className="h-3 w-3 animate-spin mr-1" />Switching...</>
                    ) : (
                      "Switch to Chiliz Mainnet"
                    )}
                  </Button>
                </div>
              )}

              {/* Not yet deployed warning */}
              {!isDemoMode && !hasContracts && (
                <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <Info className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This index is not yet deployed on Chiliz Mainnet. Use Demo Mode to try it out.
                  </p>
                </div>
              )}

              {/* Index composition */}
              {compositionRows.length > 0 && (
                <div className="rounded-xl border border-border/60 bg-muted/40 overflow-hidden">
                  <div className="px-3 py-2 border-b border-border/60 flex items-center gap-2">
                    <Coins className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Index Composition</span>
                  </div>
                  <div className="grid grid-cols-3 px-3 py-1.5 border-b border-border/40">
                    <span className="text-xs font-medium text-muted-foreground">Token</span>
                    <span className="text-xs font-medium text-muted-foreground text-center">Weight</span>
                    <span className="text-xs font-medium text-muted-foreground text-right">Est. CHZ</span>
                  </div>
                  {compositionRows.map((row) => (
                    <div
                      key={row.symbol}
                      className="grid grid-cols-3 px-3 py-2.5 border-b border-border/20 last:border-0 items-center"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {row.icon ? (
                          <img src={row.icon} alt={row.symbol} className="w-5 h-5 rounded-full object-contain shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-success/20 border border-success/30 flex items-center justify-center shrink-0">
                            <Coins className="h-3 w-3 text-success" />
                          </div>
                        )}
                        <span className="text-xs font-bold font-mono text-foreground truncate">{row.symbol}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-mono text-success font-semibold">{row.weightPct.toFixed(0)}%</span>
                      </div>
                      <div className="text-right">
                        {amount && Number.parseFloat(amount) > 0 ? (
                          <span className="text-xs font-mono text-foreground tabular-nums">
                            {((Number.parseFloat(amount) * 0.99 * row.weightPct) / 100).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">--</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Amount input */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-xs sm:text-sm font-medium flex items-center gap-2">
                  <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
                  Investment Amount
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-base sm:text-lg h-10 sm:h-12 pr-14 sm:pr-16"
                    disabled={isPending || isConfirming || demoSuccess || demoLoading}
                  />
                  <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base font-medium">
                    CHZ
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <p className="text-muted-foreground">Minimum: {index.price} CHZ</p>
                  {estimatedUnits > 0 && <p className="text-success">≈ {estimatedUnits.toFixed(4)} units</p>}
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl border bg-muted/50 p-3 sm:p-5 space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Price per unit</span>
                  <span className="font-semibold">{index.price} CHZ</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Protocol fee (1%)</span>
                  <span className="font-semibold">- {entryFee.toFixed(4)} CHZ</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Net investment</span>
                  <span className="font-semibold text-success">{netInvestment.toFixed(4)} CHZ</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Expected APY</span>
                  <span className="text-success font-semibold">{index.apy}</span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="text-sm font-bold">You send</span>
                  <span className="text-success font-bold text-base sm:text-lg">
                    {amount ? Number.parseFloat(amount).toFixed(4) : "0.0000"} CHZ
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 sm:p-3 rounded-lg bg-success/10 border border-success/20">
                <Info className="h-3 w-3 sm:h-4 sm:w-4 text-success mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You will receive an NFT representing your position. This NFT can be redeemed at any time to receive
                  the underlying Fan Tokens.
                </p>
              </div>

              {/* Error states */}
              {(isDemoMode ? demoError : error) && (
                <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-destructive/10 border border-destructive/30 animate-in fade-in slide-in-from-top-2">
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive shrink-0" />
                  <p className="text-xs sm:text-sm text-destructive">
                    {isDemoMode ? demoError : "Transaction failed. Please try again."}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <Button
                  onClick={handleBuy}
                  disabled={
                    (!isDemoMode && !isConnected) ||
                    (!isDemoMode && isWrongChain) ||
                    isPending ||
                    isConfirming ||
                    isSuccess ||
                    demoSuccess ||
                    demoLoading ||
                    !amount ||
                    Number.parseFloat(amount) <= 0
                  }
                  className="flex-1 bg-success hover:bg-success/90 text-black font-bold text-sm sm:text-base h-9 sm:h-11"
                >
                  {isPending || isConfirming || demoLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-2" />
                      {isPending || demoLoading ? "Processing..." : "Confirming..."}
                    </>
                  ) : isSuccess || demoSuccess ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    "Confirm Purchase"
                  )}
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  disabled={demoLoading || isPending || isConfirming}
                  className="text-sm sm:text-base h-9 sm:h-11 bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
