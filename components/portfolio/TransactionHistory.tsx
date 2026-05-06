"use client"

import { ArrowDownRight, ArrowUpRight, ExternalLink, History } from "lucide-react"
import { useAccount } from "wagmi"
import { useTranslations } from "next-intl"

interface OnChainTx {
  id: string
  type: "buy" | "sell" | "withdraw"
  tokenId: string
  amountCHZ: number
  txHash: `0x${string}` | null
  blockNumber: bigint | null
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
  refetchPortfolio?: () => void
  onChainTxs?: OnChainTx[]
}

export function TransactionHistory({ onChainTxs = [] }: TransactionHistoryProps) {
  const { isConnected } = useAccount()
  const t = useTranslations("transactionHistory")

  const formatDate = (date: Date | null) => {
    if (!date) return t("justNow")
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

  const displayTransactions: DisplayTransaction[] = onChainTxs.map((tx) => ({
    id: tx.id,
    type: (tx.type === "buy" ? "buy" : "sell") as "buy" | "sell",
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
            {t("title")}
          </h3>
          <p className="text-base text-muted-foreground">
            {displayTransactions.length > 0
              ? (displayTransactions.length !== 1 ? t("txCount_other", { count: displayTransactions.length }) : t("txCount_one", { count: displayTransactions.length }))
              : t("emptyDescription")}
          </p>
        </div>
        {isConnected && (
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-xs text-success font-medium">{t("liveLabel")}</span>
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
              {t("noTransactions")}
            </div>
            <div className="text-sm text-muted-foreground/70">
              {t("noTransactionsHint")}
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
                      <span>{t("block")} {tx.blockNumber.toString()}</span>
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
                    <span className="sm:hidden">{t("view")}</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                )}
                {tx.txHash === "pending" && (
                  <span className="text-xs text-yellow-500 font-medium">{t("confirming")}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
