"use client"

import { useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { WebGLShader } from "@/components/ui/web-gl-shader"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Footer } from "@/components/ui/footer-section"
import { FAN_TOKENS } from "@/lib/data/fan-tokens"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  ExternalLink,
  Copy,
  Check
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useCoinGeckoPrices } from "@/lib/hooks/use-coingecko-prices"
import { useState } from "react"

const CHZ_MARKET_CAP = 301580000
const CHZ_CIRCULATING_SUPPLY = 10106836844
const CHZ_PRICE_USD = CHZ_MARKET_CAP / CHZ_CIRCULATING_SUPPLY

export default function FanTokenDetailPage() {
  const params = useParams()
  const router = useRouter()
  const symbol = (params.symbol as string)?.toUpperCase()
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const { data: pricesData } = useCoinGeckoPrices()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const token = useMemo(() => {
    const staticToken = FAN_TOKENS.find(t => t.symbol.toUpperCase() === symbol)
    if (!staticToken) return null

    // Find live price data
    const livePrice = pricesData?.tokens?.find(
      (p) =>
        (staticToken.cgId && p.cgId === staticToken.cgId) ||
        (staticToken.wrapped && p.address?.toLowerCase() === staticToken.wrapped?.toLowerCase()),
    )

    if (livePrice && livePrice.priceUSD > 0) {
      return {
        ...staticToken,
        price: livePrice.priceUSD.toFixed(6),
        priceInCHZ: livePrice.priceInCHZ,
        change24h: livePrice.change24h.toFixed(2),
        change7d: livePrice.change7d.toFixed(2),
        marketCap: livePrice.marketCap.toFixed(0),
        volume: livePrice.volume24h.toFixed(0),
      }
    }

    return staticToken
  }, [symbol, pricesData])

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(address)
    setTimeout(() => setCopiedAddress(null), 2000)
  }

  const formatNumberInCHZ = (valueUSD: string | number) => {
    const numUSD = typeof valueUSD === "string" ? Number.parseFloat(valueUSD.replace(/,/g, "")) : valueUSD
    const numCHZ = numUSD / CHZ_PRICE_USD

    if (numCHZ >= 1000000) {
      return `${(numCHZ / 1000000).toFixed(2)}M`
    } else if (numCHZ >= 1000) {
      return `${(numCHZ / 1000).toFixed(2)}K`
    }
    return `${numCHZ.toFixed(2)}`
  }

  const formatNumber = (value: string | number) => {
    const num = typeof value === "string" ? Number.parseFloat(value.replace(/,/g, "")) : value
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`
    }
    return num.toFixed(2)
  }

  if (!token) {
    return (
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-background min-h-screen">
        <WebGLShader />
        <NavBar />
        <main className="relative z-10 w-full mx-auto max-w-7xl px-4 py-32 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Token Not Found</h1>
          <p className="text-muted-foreground mb-8">The fan token "{symbol}" could not be found.</p>
          <Button onClick={() => router.push("/fan-tokens")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Fan Tokens
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  const priceInCHZ = "priceInCHZ" in token && token.priceInCHZ
    ? token.priceInCHZ
    : Number.parseFloat(token.price) / CHZ_PRICE_USD

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-background min-h-screen">
      <WebGLShader />
      <NavBar />

      <main className="relative z-10 w-full mx-auto max-w-5xl px-4 lg:px-8 py-20 sm:py-24 md:py-32 mt-12 sm:mt-16 md:mt-0 pb-20">
        {/* Back Button */}
        <Button 
          onClick={() => router.push("/fan-tokens")} 
          variant="ghost" 
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Fan Tokens
        </Button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8">
          {token.icon ? (
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-muted flex-shrink-0 border-2 border-border">
              <Image
                src={token.icon || "/placeholder.svg"}
                alt={token.name}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 border-2 border-success/20">
              <span className="text-xl sm:text-2xl font-bold text-success">
                {token.symbol.slice(0, 2)}
              </span>
            </div>
          )}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                {token.name}
              </h1>
              <span className="px-2 py-1 rounded bg-muted text-muted-foreground text-sm font-medium">
                {token.symbol}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span className="capitalize">{token.category}</span>
              <span>•</span>
              <span>Rank #{token.rank}</span>
            </div>
          </div>
        </div>

        {/* Price Card */}
        <Card className="mb-6 bg-card/50 backdrop-blur border-border">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Current Price</div>
                <div className="text-3xl sm:text-4xl font-bold text-foreground">
                  {priceInCHZ.toFixed(4)} <span className="text-lg text-muted-foreground">CHZ</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  ≈ ${Number.parseFloat(token.price).toFixed(4)} USD
                </div>
              </div>
              <div className="flex gap-3">
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg",
                  Number.parseFloat(token.change24h) >= 0
                    ? "bg-success/10 text-success"
                    : "bg-red-500/10 text-red-500"
                )}>
                  {Number.parseFloat(token.change24h) >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="font-medium">{Math.abs(Number.parseFloat(token.change24h)).toFixed(2)}%</span>
                  <span className="text-xs opacity-70">24h</span>
                </div>
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg",
                  Number.parseFloat(token.change7d) >= 0
                    ? "bg-success/10 text-success"
                    : "bg-red-500/10 text-red-500"
                )}>
                  {Number.parseFloat(token.change7d) >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="font-medium">{Math.abs(Number.parseFloat(token.change7d)).toFixed(2)}%</span>
                  <span className="text-xs opacity-70">7d</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground mb-1">Market Cap</div>
              <div className="text-lg font-bold text-foreground">
                {formatNumberInCHZ(token.marketCap)} CHZ
              </div>
              <div className="text-xs text-muted-foreground">
                ≈ ${formatNumber(token.marketCap)} USD
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground mb-1">24h Volume</div>
              <div className="text-lg font-bold text-foreground">
                {formatNumberInCHZ(token.volume)} CHZ
              </div>
              <div className="text-xs text-muted-foreground">
                ≈ ${formatNumber(token.volume)} USD
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground mb-1">Circulating Supply</div>
              <div className="text-lg font-bold text-foreground">
                {formatNumber(token.circulatingSupply)}
              </div>
              <div className="text-xs text-muted-foreground">
                {token.symbol}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground mb-1">Total Supply</div>
              <div className="text-lg font-bold text-foreground">
                {formatNumber(token.totalSupply)}
              </div>
              <div className="text-xs text-muted-foreground">
                {token.symbol}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supply Info */}
        <Card className="mb-6 bg-card/50 backdrop-blur border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Supply Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Circulating / Total Supply</span>
                <span className="font-medium text-foreground">{token.percentOfSupply}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-success rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(Number.parseFloat(token.percentOfSupply), 100)}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-border">
              <span className="text-muted-foreground">% of CHZ Market Cap</span>
              <span className="font-medium text-success">
                {((Number.parseFloat(token.marketCap.replace(/,/g, "")) / CHZ_MARKET_CAP) * 100).toFixed(4)}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Contract Addresses */}
        {(token.unwrapped || token.wrapped) && (
          <Card className="mb-6 bg-card/50 backdrop-blur border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Contract Addresses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {token.unwrapped && (
                <div className="flex items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg">
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground mb-1">Unwrapped Token</div>
                    <div className="text-sm font-mono text-foreground truncate">
                      {token.unwrapped}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(token.unwrapped!)}
                    >
                      {copiedAddress === token.unwrapped ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      asChild
                    >
                      <a 
                        href={`https://chiliscan.com/address/${token.unwrapped}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              )}
              {token.wrapped && (
                <div className="flex items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg">
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground mb-1">Wrapped Token</div>
                    <div className="text-sm font-mono text-foreground truncate">
                      {token.wrapped}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(token.wrapped!)}
                    >
                      {copiedAddress === token.wrapped ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      asChild
                    >
                      <a 
                        href={`https://chiliscan.com/address/${token.wrapped}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* External Links */}
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">External Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {token.cgId && (
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href={`https://www.coingecko.com/en/coins/${token.cgId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CoinGecko
                    <ExternalLink className="h-3 w-3 ml-2 opacity-50" />
                  </a>
                </Button>
              )}
              {token.wrapped && (
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href={`https://chiliscan.com/token/${token.wrapped}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chiliscan
                    <ExternalLink className="h-3 w-3 ml-2 opacity-50" />
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
