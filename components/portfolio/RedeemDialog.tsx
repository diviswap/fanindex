"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
  useSwitchChain,
} from "wagmi"
import { chiliz } from "wagmi/chains"
import { EtfVaultABI, getContractAddresses, hasDeployedContracts } from "@/lib/contracts/abis"
import { XCircle, ArrowDownToLine, AlertTriangle, Info, ExternalLink, Coins, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

const CHILIZ_MAINNET_ID = chiliz.id // 88888

interface TokenRow {
  symbol: string
  name: string
  icon?: string
  amount: number
  priceInCHZ: number
  valueInCHZ: number
}

interface RedeemDialogProps {
  nftId: string
  indexId?: string
  indexName?: string
  tokenRows?: TokenRow[]
  totalValueCHZ?: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function RedeemDialog({
  nftId,
  indexId,
  indexName,
  tokenRows = [],
  totalValueCHZ = 0,
  open,
  onOpenChange,
  onSuccess,
}: RedeemDialogProps) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const isWrongChain = isConnected && chainId !== CHILIZ_MAINNET_ID
  const [redemptionType, setRedemptionType] = useState<"chz" | "tokens">("chz")
  const [redemptionPercentage, setRedemptionPercentage] = useState(100)
  const [redemptionDetails, setRedemptionDetails] = useState<{
    value: number
    received: number
    type: "chz" | "tokens"
    percentage: number
  } | null>(null)

  const contracts = indexId ? getContractAddresses(indexId) : null
  const hasContracts = indexId ? hasDeployedContracts(indexId) : false

  const currentValue = (totalValueCHZ * redemptionPercentage) / 100
  const exitFee = 0
  const youWillReceive = currentValue

  const router = useRouter()

  // Set redemption details and fire onSuccess only after on-chain confirmation
  useEffect(() => {
    if (isSuccess) {
      setRedemptionDetails({
        value: currentValue,
        received: youWillReceive,
        type: redemptionType,
        percentage: redemptionPercentage,
      })
      onSuccess?.()
    }
  }, [isSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRedeem = async () => {
    if (!isConnected || !address) return
    if (isWrongChain) return
    if (!hasContracts || !contracts) return

    reset()

    try {
      // Let the wallet handle gas limit and fee estimation — this matches
      // the working script pattern and produces correct Chiliz Chain fees
      // automatically via MetaMask's estimator.
      if (redemptionType === "chz") {
        writeContract({
          address: contracts.vault,
          abi: EtfVaultABI.abi,
          functionName: "redeemAllToCHZNative",
          args: [BigInt(nftId), redemptionPercentage, BigInt(0)],
        })
      } else {
        writeContract({
          address: contracts.vault,
          abi: EtfVaultABI.abi,
          functionName: "withdrawTokens",
          args: [BigInt(nftId), address, redemptionPercentage],
        })
      }
    } catch {
      // Error handled by wagmi error state
    }
  }

  const handleClose = () => {
    setRedemptionDetails(null)
    setRedemptionType("chz")
    setRedemptionPercentage(100)
    reset()
    onOpenChange(false)
  }

  const handleViewPortfolio = () => {
    handleClose()
    router.push("/portfolio")
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {isSuccess && redemptionDetails ? (
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

                {hash && (
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
              {isWrongChain && (
                <div className="flex flex-col gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/40">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />
                    <p className="text-xs font-medium text-yellow-500">
                      Your wallet is on the wrong network. Redemptions require Chiliz Mainnet (chain 88888).
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

              {!hasContracts && (
                <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <Info className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This index is not yet deployed on Chiliz Mainnet.
                  </p>
                </div>
              )}

              {/* Position composition */}
              {tokenRows.length > 0 && (
                <div className="rounded-xl border border-border/60 bg-muted/40 overflow-hidden">
                  <div className="px-3 py-2 border-b border-border/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Position Composition
                      </span>
                    </div>
                    {totalValueCHZ > 0 && (
                      <span className="text-xs font-bold text-success tabular-nums">
                        {totalValueCHZ.toFixed(2)} CHZ
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 px-3 py-1.5 border-b border-border/40">
                    <span className="text-xs font-medium text-muted-foreground">Token</span>
                    <span className="text-xs font-medium text-muted-foreground text-right">Amount</span>
                    <span className="text-xs font-medium text-muted-foreground text-right">Value (CHZ)</span>
                  </div>
                  {tokenRows.map((row) => (
                    <div
                      key={row.symbol}
                      className="grid grid-cols-3 px-3 py-2.5 border-b border-border/20 last:border-0 items-center"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {row.icon ? (
                          <img
                            src={row.icon}
                            alt={row.symbol}
                            className="w-5 h-5 rounded-full object-contain shrink-0"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-destructive/20 border border-destructive/30 flex items-center justify-center shrink-0">
                            <Coins className="h-3 w-3 text-destructive" />
                          </div>
                        )}
                        <span className="text-xs font-bold font-mono text-foreground truncate">{row.symbol}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono text-foreground tabular-nums">
                          {row.amount > 0
                            ? row.amount < 0.001
                              ? row.amount.toExponential(2)
                              : row.amount.toFixed(4)
                            : "--"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-mono tabular-nums ${row.valueInCHZ > 0 ? "text-success" : "text-muted-foreground"}`}>
                          {row.valueInCHZ > 0
                            ? `${((row.valueInCHZ * redemptionPercentage) / 100).toFixed(3)}`
                            : "--"}
                        </span>
                      </div>
                    </div>
                  ))}
                  {redemptionPercentage < 100 && totalValueCHZ > 0 && (
                    <div className="px-3 py-2 border-t border-border/40 flex justify-between items-center bg-muted/20">
                      <span className="text-xs text-muted-foreground">
                        Redeeming {redemptionPercentage}% →
                      </span>
                      <span className="text-xs font-bold text-success tabular-nums">
                        {((totalValueCHZ * redemptionPercentage) / 100).toFixed(2)} CHZ
                      </span>
                    </div>
                  )}
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
                    {[25, 50, 75, 100].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setRedemptionPercentage(pct)}
                        className="hover:text-foreground transition-colors"
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {redemptionPercentage === 100
                      ? "Redeeming your entire position will burn the NFT"
                      : `Redeeming ${redemptionPercentage}% — the remaining ${100 - redemptionPercentage}% stays in your portfolio`}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border bg-muted/50 p-3 sm:p-5 space-y-3 sm:space-y-4">
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

              <div className="rounded-xl border bg-muted/50 p-3 sm:p-5 space-y-2 sm:space-y-3">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Position ID</span>
                  <span className="font-semibold">#{nftId}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Redemption Value</span>
                  <span className="font-semibold">
                    {currentValue > 0 ? `${currentValue.toFixed(4)} CHZ` : "-- CHZ"}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Exit fee (0%)</span>
                  <span className="font-semibold">0 CHZ</span>
                </div>
                <div className="border-t pt-2 sm:pt-2.5 flex justify-between items-center">
                  <span className="text-sm sm:text-base font-bold">You will receive</span>
                  <span className="text-success font-bold text-base sm:text-lg">
                    {redemptionType === "chz"
                      ? youWillReceive > 0
                        ? `${youWillReceive.toFixed(4)} CHZ`
                        : "-- CHZ"
                      : `${redemptionPercentage}% Fan Tokens`}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 sm:p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {redemptionPercentage === 100
                    ? "This action is irreversible. Your NFT will be burned and you will receive "
                    : `This will redeem ${redemptionPercentage}% of your position. You will receive `}
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

              {error && (
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
                disabled={isPending || isConfirming}
                className="flex-1 h-9 sm:h-11 text-sm sm:text-base bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRedeem}
                disabled={
                  isPending ||
                  isConfirming ||
                  !isConnected ||
                  isWrongChain ||
                  !hasContracts
                }
                className="flex-1 bg-destructive hover:bg-destructive/90 text-white font-bold h-9 sm:h-11 text-sm sm:text-base"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    Waiting for wallet...
                  </span>
                ) : isConfirming ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    Confirming on-chain...
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
