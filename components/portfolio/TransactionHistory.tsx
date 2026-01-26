"use client"

import { ArrowDownRight, ArrowUpRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDemoMode } from "@/lib/demo/DemoModeContext"
import { useAccount } from "wagmi"

interface Transaction {
  id: string
  type: "buy" | "sell"
  indexName: string
  amount: number
  price: number
  total: number
  timestamp: Date
  txHash: string
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    type: "buy",
    indexName: "Champions League Index",
    amount: 2,
    price: 100,
    total: 200,
    timestamp: new Date("2024-01-15T10:30:00"),
    txHash: "0x1234...5678",
  },
  {
    id: "2",
    type: "buy",
    indexName: "Premier League Index",
    amount: 1,
    price: 80,
    total: 80,
    timestamp: new Date("2024-01-14T15:45:00"),
    txHash: "0xabcd...efgh",
  },
  {
    id: "3",
    type: "sell",
    indexName: "La Liga Elite",
    amount: 1,
    price: 120,
    total: 120,
    timestamp: new Date("2024-01-10T09:20:00"),
    txHash: "0x9876...4321",
  },
  {
    id: "4",
    type: "buy",
    indexName: "Champions League Index",
    amount: 1,
    price: 95,
    total: 95,
    timestamp: new Date("2024-01-08T14:15:00"),
    txHash: "0xfedc...ba98",
  },
]

export function TransactionHistory() {
  const { isDemoMode, demoTransactions } = useDemoMode()
  const { isConnected } = useAccount()

  const displayTransactions: Transaction[] = isDemoMode
    ? demoTransactions.map((tx) => ({
        id: tx.id,
        type: tx.type,
        indexName: tx.indexName,
        amount: tx.units,
        price: tx.price,
        total: tx.amount,
        timestamp: new Date(tx.timestamp),
        txHash: `0x${tx.id.slice(-8)}...${tx.id.slice(-4)}`,
      }))
    : [] // Empty array for real mode until we implement blockchain transaction reading

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const openExplorer = (txHash: string) => {
    window.open(`https://chiliscan.com/tx/${txHash}`, "_blank")
  }

  return (
    <div className="border border-border bg-card backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Transaction History</h3>
          <p className="text-base text-muted-foreground">
            {displayTransactions.length > 0
              ? `${displayTransactions.length} transactions`
              : isConnected && !isDemoMode
                ? "Connect to view your transactions"
                : "No transactions yet"}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {displayTransactions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-lg text-muted-foreground mb-2">
              {isConnected && !isDemoMode ? "No transactions found" : "No transactions yet"}
            </div>
            <div className="text-sm text-muted-foreground/70">
              {isConnected && !isDemoMode
                ? "Your transaction history will appear here after your first trade"
                : "Start trading to see your transaction history"}
            </div>
          </div>
        ) : (
          displayTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-4 p-5 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 hover:border-border/80 transition-all duration-200"
            >
              <div
                className={`p-2 md:p-3 rounded-xl shrink-0 ${
                  tx.type === "buy"
                    ? "bg-success/10 border border-success/20"
                    : "bg-destructive/10 border border-destructive/20"
                }`}
              >
                {tx.type === "buy" ? (
                  <ArrowDownRight className="h-4 w-4 md:h-5 md:w-5 text-success" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5 text-destructive" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
                  <span className="text-sm md:text-base font-semibold text-foreground capitalize">{tx.type}</span>
                  <span className="text-muted-foreground text-xs md:text-sm">•</span>
                  <span className="text-xs md:text-sm text-foreground/80 truncate">{tx.indexName}</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
                  <span>
                    {tx.amount} × {tx.price} CHZ
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">{formatDate(tx.timestamp)}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <div
                  className={`text-sm md:text-base font-bold ${tx.type === "buy" ? "text-destructive" : "text-success"}`}
                >
                  {tx.type === "buy" ? "-" : "+"}
                  {tx.total.toFixed(2)} CHZ
                </div>
                <button
                  onClick={() => openExplorer(tx.txHash)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <span className="hidden sm:inline">{tx.txHash}</span>
                  <span className="sm:hidden">View</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {displayTransactions.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            className="w-full border-border bg-card text-foreground hover:bg-muted h-11 font-semibold"
          >
            View All Transactions
          </Button>
        </div>
      )}
    </div>
  )
}
