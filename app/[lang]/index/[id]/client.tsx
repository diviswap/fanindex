"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, TrendingUp, BarChart2, DollarSign } from "lucide-react"
import { IndexChart } from "@/components/index-chart"
import { formatNumber } from "@/lib/utils"
import { InvestCard } from "@/components/invest-card"
import type { Index } from "@/lib/types"
import { IndexIcon } from "@/components/index-icon"
import type { Locale } from "@/i18n-config"

export function IndexDetailClient({ index, lang, dict }: { index: Index; lang: Locale; dict: any }) {
  const detailDict = dict.index_details
  const localizedIndex = {
    ...index,
    name: dict.indexes[index.id]?.name || index.name,
    description: dict.indexes[index.id]?.description || index.description,
  }
  const sortedTokens = [...localizedIndex.tokens].sort((a, b) => b.marketCap - a.marketCap)

  return (
    <>
      <div className="relative pt-12 pb-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-6">
            <Link
              href={`/${lang}/#indexes`}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              {detailDict.back_link}
            </Link>
          </div>
          <div className="flex items-center gap-4 md:gap-6 mb-8">
            <div className="bg-black/20 p-2 rounded-lg border border-white/10">
              <IndexIcon iconName={localizedIndex.icon} className="w-12 h-12 md:w-16 md:h-16" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-white [text-shadow:0_0_20px_rgba(255,255,255,0.5)]">
                {localizedIndex.name}
              </h1>
              <p className="text-gray-400 text-base md:text-lg mt-1">{localizedIndex.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-black/30 backdrop-blur-xl border border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">{detailDict.index_value}</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${localizedIndex.value.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className="bg-black/30 backdrop-blur-xl border border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">{detailDict.change_24h}</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${localizedIndex.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {localizedIndex.change.toFixed(2)}%
                </div>
              </CardContent>
            </Card>
            <Card className="bg-black/30 backdrop-blur-xl border border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">{detailDict.market_cap}</CardTitle>
                <BarChart2 className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(localizedIndex.totalMarketCap)}</div>
              </CardContent>
            </Card>
            <Card className="bg-black/30 backdrop-blur-xl border border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">{detailDict.volume_24h}</CardTitle>
                <BarChart2 className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(localizedIndex.totalVolume24h)}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <Card className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl">
              <CardHeader>
                <CardTitle>{detailDict.price_chart}</CardTitle>
              </CardHeader>
              <CardContent>
                <IndexChart data={localizedIndex.chartData} change={localizedIndex.change} />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <InvestCard index={localizedIndex} dict={dict} />
          </div>

          <div className="lg:col-span-3">
            <Card className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl">
              <CardHeader>
                <CardTitle>
                  {detailDict.token_holdings} ({sortedTokens.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-white">{detailDict.table.token}</TableHead>
                      <TableHead className="text-right text-white">{detailDict.table.price}</TableHead>
                      <TableHead className="text-right text-white">{detailDict.table.change_24h}</TableHead>
                      <TableHead className="text-right text-white">{detailDict.table.weight}</TableHead>
                      <TableHead className="text-right text-white">{detailDict.table.market_cap}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTokens.map((token) => (
                      <TableRow key={token.symbol} className="border-white/10 hover:bg-white/5">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={token.logo || "/placeholder.svg"} alt={token.name} />
                              <AvatarFallback>{token.symbol.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{token.name}</p>
                              <p className="text-sm text-gray-400">{token.symbol}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">${token.price.toFixed(4)}</TableCell>
                        <TableCell
                          className={`text-right font-medium ${
                            token.change24h >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {token.change24h.toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {((token.marketCap / localizedIndex.totalMarketCap) * 100).toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-right font-mono">{formatNumber(token.marketCap)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
