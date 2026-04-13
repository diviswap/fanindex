"use client"

import { ArrowDownRight, ArrowUpRight, ExternalLink, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDemoMode } from "@/lib/demo/DemoModeContext"
import { useAccount, useWatchContractEvent } from "wagmi"
import { EtfVaultABI, MAINNET_CONTRACTS } from "@/lib/contracts/abis"
import { formatUnits } from "viem"
import { useState, useEffect } from "react"

interface OnChainTx {
  id: string
  type: "buy" | "sell" | "withdraw"
  tokenId: string
  amountCHZ: number
  txHash: `0x${string}` | null
  blockNumber: bigint | null
  /** Address of the user involved */
  user: string
}

interface DisplayTransaction {
  id: string
  type: "buy" | "sell"
  indexName: string
  amount: number
  total: number
  timestamp: Date | null
  txHash: string
  blockNumber?: bigint
}

interface TransactionHistoryProps {
  /** Called after a transaction to re-read portfolio state */
  refetchPortfolio?: () => void
}

export function TransactionHistory({ refetchPortfolio }: TransactionHistoryProps) {
  const { isDemoMode, demoTransactions } = useDemoMode()
  const { address, isConnected } = useAccount()

  const [onChainTxs, setOnChainTxs] = useState<OnChainTx[]>([])
  const [isWatching, setIsWatching] = useState(false)

  // Watch for Purchased events directed to this wallet
  useWatchContractEvent({
    address: MAINNET_CONTRACTS.ETF_VAULT,
    abi: EtfVaultABI.abi as any,
    eventName: "Purchased",
    enabled: isConnected && !isDemoMode && !!address,
    onLogs(logs) {
      logs.forEach((log: any) => {
        const buyer = log.args?.buyer as string | undefined
        if (!buyer || !address) return
        if (buyer.toLowerCase() !== address.toLowerCase()) return

        const tokenId = (log.args?.tokenId as bigint | undefined)?.toString() ?? "?"
        const nativeSpent = log.args?.nativeSpent as bigint | undefined
        const amountCHZ = nativeSpent ? Number(formatUnits(nativeSpent, 18)) : 0

        setOnChainTxs((prev) => {
          const key = `${log.transactionHash}-buy`
          if (prev.some((t) => t.id === key)) return prev
          return [
            {
              id: key,
              type: "buy",
              tokenId,
              amountCHZ,
              txHash: log.transactionHash as `0x${string}` | null,
              blockNumber: log.blockNumber ?? null,
              user: buyer,
            },
            ...prev,
          ]
        })

        // After a buy, refresh portfolio
        refetchPortfolio?.()
        setIsWatching(true)
      })
    },
  })

  // Watch for RedeemedToNative events directed to this wallet
  useWatchContractEvent({
    address: MAINNET_CONTRACTS.ETF_VAULT,
    abi: EtfVaultABI.abi as any,
    eventName: "RedeemedToNative",
    enabled: isConnected && !isDemoMode && !!address,
    onLogs(logs) {
      logs.forEach((log: any) => {
        const user = log.args?.user as string | undefined
        if (!user || !address) return
        if (user.toLowerCase() !== address.toLowerCase()) return

        const tokenId = (log.args?.tokenId as bigint | undefined)?.toString() ?? "?"
        const nativeOut = log.args?.nativeOut as bigint | undefined
        const amountCHZ = nativeOut ? Number(formatUnits(nativeOut, 18)) : 0

        setOnChainTxs((prev) => {
          const key = `${log.transactionHash}-sell`
          if (prev.some((t) => t.id === key)) return prev
          return [
            {
              id: key,
              type: "sell",
              tokenId,
              amountCHZ,
              txHash: log.transactionHash as `0x${string}` | null,
              blockNumber: log.blockNumber ?? null,
              user,
            },
            ...prev,
          ]
        })

        refetchPortfolio?.()
        setIsWatching(true)
      })
    },
  })

  // Watch for WithdrawnTokens (token withdrawal — also a sell variant)
  useWatchContractEvent({
    address: MAINNET_CONTRACTS.ETF_VAULT,
    abi: EtfVaultABI.abi as any,
    eventName: "WithdrawnTokens",
    enabled: isConnected && !isDemoMode && !!address,
    onLogs(logs) {
      logs.forEach((log: any) => {
        const to = log.args?.to as string | undefined
        if (!to || !address) return
        if (to.toLowerCase() !== address.toLowerCase()) return

        const tokenId = (log.args?.tokenId as bigint | undefined)?.toString() ?? "?"

        setOnChainTxs((prev) => {
          const key = `${log.transactionHash}-withdraw`
          if (prev.some((t) => t.id === key)) return prev
          return [
            {
              id: key,
              type: "withdraw",
              tokenId,
              amountCHZ: 0, // underlying tokens, no CHZ amount
              txHash: log.transactionHash as `0x${string}` | null,
              blockNumber: log.blockNumber ?? null,
              user: to,
            },
            ...prev,
          ]
        })

        refetchPortfolio?.()
      })
    },
  })

  // Clear on-chain history when wallet changes
  useEffect(() => {
    setOnChainTxs([])
    setIsWatching(false)
  }, [address])

  const formatDate = (date: Date | null) => {
    if (!date) return "Just now"
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const openExplorer = (txHash: string) => {
    if (!txHash || txHash.startsWith("0x00")) return
    window.open(`https://chiliscan.com/tx/${txHash}`, "_blank")
  }

  // ── Build display transactions ──────────────────────────────────────────
  const displayTransactions: DisplayTransaction[] = isDemoMode
    ? demoTransactions.map((tx) => ({
        id: tx.id,
        type: tx.type,
        indexName: tx.indexName,
        amount: tx.units,
        total: tx.amount,
        timestamp: new Date(tx.timestamp),
        txHash: `0x${tx.id.slice(-8)}...${tx.id.slice(-4)}`,
      }))
    : onChainTxs.map((tx) => ({
        id: tx.id,
        type: tx.type === "buy" ? "buy" : "sell",
        indexName: `NFT Position #${tx.tokenId}`,
        amount: 1,
        total: tx.amountCHZ,
        timestamp: null,
        txHash: tx.txHash ?? "pending",
        blockNumber: tx.blockNumber ?? undefined,
      }))

  return (
    <div className="border border-border bg-card backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Transaction History
          </h3>
          <p className="text-base text-muted-foreground">
            {displayTransactions.length > 0
              ? `${displayTransactions.length} transaction${displayTransactions.length !== 1 ? "s" : ""}`
              : isConnected && !isDemoMode
              ? isWatching
                ? "Monitoring for new transactions..."
                : "Listening for on-chain events"
              : "No transactions yet"}
          </p>
        </div>
        {isConnected && !isDemoMode && (
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-xs text-success font-medium">Live</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {displayTransactions.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted border border-border mb-4">
              <History className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-base text-muted-foreground mb-2 font-medium">
              {isConnected && !isDemoMode
                ? "No transactions detected yet"
                : "No transactions yet"}
            </div>
            <div className="text-sm text-muted-foreground/70">
              {isConnected && !isDemoMode
                ? "Transactions will appear here in real-time as they occur on-chain"
                : "Start trading to see your transaction history"}
            </div>
          </div>
        ) : (
          displayTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 hover:border-border/80 transition-all duration-200"
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  tx.type === "buy"
                    ? "bg-success/10 border border-success/20"
                    : "bg-destructive/10 border border-destructive/20"
                }`}
              >
                {tx.type === "buy" ? (
                  <ArrowDownRight className="h-4 w-4 text-success" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-destructive" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-sm font-semibold text-foreground capitalize">
                    {tx.type}
                  </span>
                  <span className="text-muted-foreground text-xs">•</span>
                  <span className="text-xs text-foreground/80 truncate">{tx.indexName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {tx.blockNumber && (
                    <>
                      <span>Block {tx.blockNumber.toString()}</span>
                      <span className="hidden sm:inline">•</span>
                    </>
                  )}
                  <span className="hidden sm:inline">{formatDate(tx.timestamp)}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <div
                  className={`text-sm font-bold tabular-nums ${
                    tx.type === "buy" ? "text-destructive" : "text-success"
                  }`}
                >
                  {tx.type === "buy" ? "-" : "+"}
                  {tx.total > 0 ? `${tx.total.toFixed(2)} CHZ` : "Tokens"}
                </div>
                {tx.txHash && tx.txHash !== "pending" && (
                  <button
                    onClick={() => openExplorer(tx.txHash)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <span className="hidden sm:inline font-mono">
                      {tx.txHash.slice(0, 10)}...
                    </span>
                    <span className="sm:hidden">View</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                )}
                {tx.txHash === "pending" && (
                  <span className="text-xs text-yellow-500 font-medium">Confirming...</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
