"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { formatNumber } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, DollarSign, Clock, ExternalLink } from "lucide-react"
import { IndexChart } from "@/components/index-chart"
import type { UserPortfolio } from "@/lib/portfolio-data"
import type { Transaction } from "@/lib/types"
import { chilizMainnet } from "@/lib/chains"
import type { Locale } from "@/i18n-config"

export function PortfolioClient({
  portfolio,
  transactions,
  lang,
  dict,
}: {
  portfolio: UserPortfolio
  transactions: Transaction[]
  lang: Locale
  dict: any
}) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const getStatusVariant = (status: Transaction["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "default"
    }
  }

  const getTypeVariant = (type: Transaction["type"]) => {
    switch (type) {
      case "Buy":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Sell":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-8">
      <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
        <h1 className="text-4xl md:text-5xl font-bold mb-8">{dict.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-black/30 backdrop-blur-xl border border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{dict.total_value}</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(portfolio.totalValue)}</div>
              <p className={`text-xs ${portfolio.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                {portfolio.change24h.toFixed(2)}% {dict.vs_24h}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-black/30 backdrop-blur-xl border border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{dict.overall_pl}</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${portfolio.overallPnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                {formatNumber(portfolio.overallPnl)}
              </div>
              <p className={`text-xs ${portfolio.overallPnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                ({portfolio.overallPnlPercentage.toFixed(2)}%)
              </p>
            </CardContent>
          </Card>
          <Card className="bg-black/30 backdrop-blur-xl border border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{dict.total_invested}</CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatNumber(portfolio.totalInvested)}</div>
              <p className="text-xs text-gray-500">{dict.initial_capital}</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <Card className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl">
          <CardHeader>
            <CardTitle>{dict.performance}</CardTitle>
          </CardHeader>
          <CardContent>
            <IndexChart data={portfolio.chartData} change={portfolio.overallPnl} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <Card className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl">
          <CardHeader>
            <CardTitle>{dict.holdings.replace("{count}", portfolio.holdings.length)}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-white">{dict.holdings_table.index}</TableHead>
                  <TableHead className="text-right text-white">{dict.holdings_table.current_value}</TableHead>
                  <TableHead className="text-right text-white">{dict.holdings_table.invested}</TableHead>
                  <TableHead className="text-right text-white">{dict.holdings_table.pl}</TableHead>
                  <TableHead className="text-right text-white">{dict.holdings_table.change_24h}</TableHead>
                  <TableHead className="text-right text-white">{dict.holdings_table.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio.holdings.map((holding) => (
                  <TableRow key={holding.index.id} className="border-white/10 hover:bg-white/5">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={holding.index.backgroundImageUrl || "/placeholder.svg"}
                            alt={holding.index.name}
                          />
                          <AvatarFallback>{holding.index.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{holding.index.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatNumber(holding.currentValue)}</TableCell>
                    <TableCell className="text-right font-mono text-gray-400">
                      {formatNumber(holding.investedAmount)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${holding.pnl >= 0 ? "text-green-400" : "text-red-400"}`}
                    >
                      {holding.pnl >= 0 ? "+" : ""}
                      {holding.pnlPercentage.toFixed(2)}%
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        holding.index.change >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {holding.index.change.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/${lang}/index/${holding.index.id}`}>
                          {dict.holdings_table.buy} <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <Card className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl">
          <CardHeader>
            <CardTitle>{dict.transactions}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-white">{dict.transactions_table.date}</TableHead>
                  <TableHead className="text-white">{dict.transactions_table.type}</TableHead>
                  <TableHead className="text-white">{dict.transactions_table.index}</TableHead>
                  <TableHead className="text-right text-white">{dict.transactions_table.amount}</TableHead>
                  <TableHead className="text-center text-white">{dict.transactions_table.status}</TableHead>
                  <TableHead className="text-right text-white">{dict.transactions_table.explorer}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-gray-400">{format(new Date(tx.date), "dd MMM yyyy")}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getTypeVariant(tx.type)}>
                        {dict.transaction_types[tx.type.toLowerCase()]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{tx.indexName}</TableCell>
                    <TableCell className="text-right font-mono">{tx.amountCHZ.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={getStatusVariant(tx.status)}>
                        {dict.transaction_statuses[tx.status.toLowerCase()]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <a
                          href={`${chilizMainnet.blockExplorers.default.url}/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View on explorer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
