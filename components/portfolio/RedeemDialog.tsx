"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { EtfVaultABI, getContractAddresses, hasDeployedContracts } from "@/lib/contracts/abis"
import { XCircle, ArrowDownToLine, AlertTriangle, Info, Sparkles, ExternalLink, Coins } from "lucide-react"
import { useDemoMode } from "@/lib/demo/DemoModeContext"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

interface RedeemDialogProps {
  nftId: string
  indexId?: string
  indexName?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  demoUnits?: number
  demoPrice?: number
  onSuccess?: () => void
}

export function RedeemDialog({
  nftId,
  indexId,
  indexName,
  open,
  onOpenChange,
  demoUnits,
  demoPrice,
  onSuccess,
}: RedeemDialogProps) {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const { isDemoMode, sellIndex: demoSellIndex } = useDemoMode()
  const [demoSuccess, setDemoSuccess] = useState(false)
  const [demoError, setDemoError] = useState<string | null>(null)
  const [demoLoading, setDemoLoading] = useState(false)
  const [redemptionType, setRedemptionType] = useState<"chz" | "tokens">("chz")
  const [redemptionPercentage, setRedemptionPercentage] = useState(100)
  const [redemptionDetails, setRedemptionDetails] = useState<{
    units: number
    value: number
    fee: number
    received: number
    type: "chz" | "tokens"
    percentage: number
  } | null>(null)

  const contracts = indexId ? getContractAddresses(indexId) : null
  const hasContracts = indexId ? hasDeployedContracts(indexId) : false

  const currentValue = isDemoMode && demoUnits && demoPrice ? (demoUnits * demoPrice * redemptionPercentage) / 100 : 0
  const exitFee = 0
  const youWillReceive = currentValue

  const router = useRouter()

  const handleRedeem = async () => {
    if (isDemoMode && demoUnits && demoPrice && indexName) {
      setDemoLoading(true)
      setDemoError(null)

      setRedemptionDetails({
        units: (demoUnits * redemptionPercentage) / 100,
        value: currentValue,
        fee: exitFee,
        received: youWillReceive,
        type: redemptionType,
        percentage: redemptionPercentage,
      })

      setTimeout(() => {
        const success = demoSellIndex(nftId, indexName, (demoUnits * redemptionPercentage) / 100, demoPrice)

        setDemoLoading(false)

        if (success) {
          setDemoSuccess(true)
          onSuccess?.()
          setTimeout(() => {
            handleClose()
          }, 3000)
        } else {
          setDemoError("Demo redemption failed")
        }
      }, 1500)

      return
    }

    if (!isConnected || !address) {
      setDemoError("Please connect your wallet first")
      return
    }

    if (!hasContracts || !contracts) {
      setDemoError("This index is not yet deployed on testnet. Please use Demo Mode.")
      return
    }

    setRedemptionDetails({
      units: (demoUnits || 0) * (redemptionPercentage / 100),
      value: currentValue,
      fee: exitFee,
      received: youWillReceive,
      type: redemptionType,
      percentage: redemptionPercentage,
    })

    try {
      if (redemptionType === "chz") {
        writeContract({
          address: contracts.vault,
          abi: EtfVaultABI.abi,
          functionName: "redeemAllToCHZNative",
          args: [BigInt(nftId), redemptionPercentage],
        })
      } else {
        writeContract({
          address: contracts.vault,
          abi: EtfVaultABI.abi,
          functionName: "withdrawTokens",
          args: [BigInt(nftId), address, redemptionPercentage],
        })
      }
    } catch (err) {
      console.error("[v0] Error redeeming position:", err)
    }
  }

  const handleClose = () => {
    setDemoSuccess(false)
    setDemoError(null)
    setDemoLoading(false)
    setRedemptionDetails(null)
    setRedemptionType("chz")
    setRedemptionPercentage(100)
    onOpenChange(false)
  }

  const handleViewPortfolio = () => {
    handleClose()
    router.push("/portfolio")
    router.refresh()
  }

  useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess()
    }
  }, [isSuccess, onSuccess])

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {(demoSuccess || isSuccess) && redemptionDetails ? (
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
                    <Coins className="h-8 w-8 sm:h-12 sm:w-12 text-success" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-success">
                    {redemptionDetails.percentage === 100 ? "Redemption Successful!" : "Partial Redemption Successful!"}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {redemptionDetails.type === "chz"
                      ? `${redemptionDetails.percentage}% of your position has been closed and CHZ transferred`
                      : `${redemptionDetails.percentage}% of your position has been closed and fan tokens transferred`}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border-2 border-success/30 bg-card/95 backdrop-blur-sm p-3 sm:p-5 space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-border">
                    <span className="text-xs sm:text-sm text-muted-foreground">Index</span>
                    <span className="text-sm sm:text-base font-bold text-foreground">{indexName || "Position"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-muted-foreground">Position ID</span>
                    <span className="text-sm sm:text-base font-semibold text-foreground">#{nftId}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-muted-foreground">Percentage Redeemed</span>
                    <span className="text-sm sm:text-base font-semibold text-success">
                      {redemptionDetails.percentage}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-muted-foreground">Redemption Type</span>
                    <span className="text-sm sm:text-base font-semibold text-foreground">
                      {redemptionDetails.type === "chz" ? "Convert to CHZ" : "Receive Fan Tokens"}
                    </span>
                  </div>

                  {redemptionDetails.units > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-muted-foreground">Units Redeemed</span>
                      <span className="text-sm sm:text-base font-semibold text-foreground">
                        {redemptionDetails.units.toFixed(4)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-muted-foreground">Position Value</span>
                    <span className="text-sm sm:text-base font-semibold text-foreground">
                      {redemptionDetails.value.toFixed(4)} CHZ
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-muted-foreground">Exit Fee (0%)</span>
                    <span className="text-sm sm:text-base font-semibold text-foreground">{exitFee.toFixed(4)} CHZ</span>
                  </div>

                  <div className="pt-2 sm:pt-3 border-t border-border flex justify-between items-center">
                    <span className="text-sm sm:text-base font-bold">
                      {redemptionDetails.type === "chz" ? "CHZ Received" : "Fan Tokens Received"}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-success">
                      {redemptionDetails.type === "chz"
                        ? `${redemptionDetails.received.toFixed(4)} CHZ`
                        : "Underlying Tokens"}
                    </span>
                  </div>
                </div>

                {!isDemoMode && hash && (
                  <div className="pt-2 sm:pt-3 border-t border-border">
                    <a
                      href={`https://chiliscan.com/tx/${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 text-xs sm:text-sm text-success hover:text-success/80 transition-colors font-medium"
                    >
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>View Transaction on Chiliz Explorer</span>
                    </a>
                  </div>
                )}

                {isDemoMode && (
                  <div className="pt-2 sm:pt-3 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="h-3 w-3" />
                    <span>Demo Mode - Simulated Transaction</span>
                  </div>
                )}
              </div>

              <Button
                onClick={handleViewPortfolio}
                className="w-full bg-success hover:bg-success/90 text-black font-bold h-9 sm:h-11 text-sm sm:text-base"
              >
                View Portfolio
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-destructive/20 border border-destructive/40">
                  <ArrowDownToLine className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
                </div>
                <div>
                  <DialogTitle className="text-lg sm:text-xl md:text-2xl">Redeem Position</DialogTitle>
                  <DialogDescription className="text-muted-foreground text-xs sm:text-sm mt-0.5 sm:mt-1">
                    {indexName ? `Redeem your ${indexName} position` : "Redeem your position"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-3 sm:space-y-4 md:space-y-5 py-3 sm:py-4">
              {isDemoMode && (
                <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-success/10 border border-success/30">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
                  <span className="text-xs sm:text-sm font-medium">Demo Mode - Simulated Redemption</span>
                </div>
              )}

              {!isDemoMode && !hasContracts && (
                <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <Info className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This index is not yet deployed on Chiliz Spicy Testnet. Use Demo Mode to try it out.
                  </p>
                </div>
              )}

              <div className="rounded-xl border bg-muted/50 p-3 sm:p-5 space-y-3 sm:space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs sm:text-sm font-semibold">Redemption Amount</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={redemptionPercentage}
                        onChange={(e) => {
                          const val = Math.max(1, Math.min(100, Number(e.target.value) || 1))
                          setRedemptionPercentage(val)
                        }}
                        className="w-16 h-7 text-xs text-right"
                      />
                      <span className="text-xs font-medium">%</span>
                    </div>
                  </div>
                  <Slider
                    value={[redemptionPercentage]}
                    onValueChange={(vals) => setRedemptionPercentage(vals[0])}
                    min={1}
                    max={100}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => setRedemptionPercentage(25)}
                      className="hover:text-foreground transition-colors"
                    >
                      25%
                    </button>
                    <button
                      type="button"
                      onClick={() => setRedemptionPercentage(50)}
                      className="hover:text-foreground transition-colors"
                    >
                      50%
                    </button>
                    <button
                      type="button"
                      onClick={() => setRedemptionPercentage(75)}
                      className="hover:text-foreground transition-colors"
                    >
                      75%
                    </button>
                    <button
                      type="button"
                      onClick={() => setRedemptionPercentage(100)}
                      className="hover:text-foreground transition-colors"
                    >
                      100%
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {redemptionPercentage === 100
                      ? "Redeeming your entire position will burn the NFT"
                      : `Redeeming ${redemptionPercentage}% of your position - the remaining ${100 - redemptionPercentage}% will stay in your portfolio`}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border bg-muted/50 p-3 sm:p-5 space-y-3 sm:space-y-4">
                <div>
                  <Label className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 block">
                    Choose Redemption Method
                  </Label>
                  <RadioGroup
                    value={redemptionType}
                    onValueChange={(value) => setRedemptionType(value as "chz" | "tokens")}
                  >
                    <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="chz" id="chz" className="mt-0.5" />
                      <div className="flex-1">
                        <Label htmlFor="chz" className="text-xs sm:text-sm font-medium cursor-pointer">
                          Convert to CHZ
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1">
                          Sell {redemptionPercentage === 100 ? "all" : `${redemptionPercentage}%`} fan tokens and
                          receive CHZ (native currency)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="tokens" id="tokens" className="mt-0.5" />
                      <div className="flex-1">
                        <Label htmlFor="tokens" className="text-xs sm:text-sm font-medium cursor-pointer">
                          Receive Fan Tokens
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5 sm:mt-1">
                          Withdraw {redemptionPercentage === 100 ? "all" : `${redemptionPercentage}%`} underlying fan
                          tokens directly to your wallet
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="rounded-xl border bg-muted/50 p-3 sm:p-5 space-y-2 sm:space-y-3">
                <div className="space-y-2 sm:space-y-2.5">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Position ID</span>
                    <span className="font-semibold">#{nftId}</span>
                  </div>
                  {isDemoMode && demoUnits && (
                    <>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Total Units</span>
                        <span className="font-semibold">{demoUnits.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Units to Redeem ({redemptionPercentage}%)</span>
                        <span className="font-semibold text-destructive">
                          {((demoUnits * redemptionPercentage) / 100).toFixed(4)}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Redemption Value</span>
                    <span className="font-semibold">
                      {currentValue > 0 ? `${currentValue.toFixed(4)} CHZ` : "-- CHZ"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Exit fee (0%)</span>
                    <span className="font-semibold">{exitFee > 0 ? `${exitFee.toFixed(4)} CHZ` : "0 CHZ"}</span>
                  </div>
                  <div className="border-t pt-2 sm:pt-2.5 flex justify-between items-center">
                    <span className="text-sm sm:text-base font-bold">You will receive</span>
                    <span className="text-destructive font-bold text-base sm:text-lg">
                      {redemptionType === "chz"
                        ? youWillReceive > 0
                          ? `${youWillReceive.toFixed(4)} CHZ`
                          : "-- CHZ"
                        : `${redemptionPercentage}% Fan Tokens`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 sm:p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {redemptionPercentage === 100
                    ? "This action is irreversible. Your NFT will be burned and you will receive "
                    : `This will redeem ${redemptionPercentage}% of your position. The remaining ${100 - redemptionPercentage}% will stay in your portfolio. You will receive `}
                  {redemptionType === "chz" ? "CHZ" : "the underlying fan tokens"} directly to your wallet.
                </p>
              </div>

              <div className="flex items-start gap-2 p-2 sm:p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Info className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The redemption value is calculated based on the current market prices of the underlying Fan Tokens in
                  this index.
                </p>
              </div>

              {isDemoMode && demoError && (
                <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-destructive/10 border border-destructive/30 animate-in fade-in slide-in-from-top-2">
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-destructive">{demoError}</p>
                </div>
              )}

              {error && !isDemoMode && (
                <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-destructive/10 border border-destructive/30 animate-in fade-in slide-in-from-top-2">
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-destructive">Transaction failed. Please try again.</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 sm:gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isPending || isConfirming || demoLoading}
                className="flex-1 h-9 sm:h-11 text-sm sm:text-base bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRedeem}
                disabled={
                  isPending ||
                  isConfirming ||
                  demoLoading ||
                  (!isDemoMode && !isConnected) ||
                  (!isDemoMode && !hasContracts)
                }
                className="flex-1 bg-destructive hover:bg-destructive/90 text-white font-bold h-9 sm:h-11 text-sm sm:text-base"
              >
                {isPending || isConfirming || demoLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isConfirming ? "Confirming..." : "Processing..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ArrowDownToLine className="h-3 w-3 sm:h-4 sm:w-4" />
                    {redemptionPercentage === 100 ? "Confirm Redemption" : `Redeem ${redemptionPercentage}%`}
                  </span>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
