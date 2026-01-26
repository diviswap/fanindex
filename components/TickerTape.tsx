"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useCoinGeckoPrices } from "@/lib/hooks/use-coingecko-prices"

export function TickerTape() {
  const [isPaused, setIsPaused] = useState(false)
  
  const { tokens, isLoading } = useCoinGeckoPrices()

  // Get top 20 tokens by market cap for the ticker
  const topTokens = tokens
    .filter(token => token.marketCap > 0)
    .sort((a, b) => b.marketCap - a.marketCap)
    .slice(0, 20)

  if (isLoading || topTokens.length === 0) {
    return null
  }

  // Create the ticker items twice for seamless loop
  const tickerItems = topTokens.map((token, index) => {
    const isPositive = token.change24h >= 0

    return (
      <div
        key={`${token.symbol}-${index}`}
        className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 whitespace-nowrap"
      >
        <span className="font-semibold text-foreground text-xs sm:text-sm">{token.symbol}</span>
        <span className="text-muted-foreground text-xs sm:text-sm">{token.priceInCHZ.toFixed(2)} CHZ</span>
        <span
          className={`flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-medium ${
            isPositive ? "text-success" : "text-destructive"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          ) : (
            <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          )}
          {Math.abs(token.change24h).toFixed(2)}%
        </span>
      </div>
    )
  })

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border shadow-lg pb-safe">
      <div className="overflow-hidden py-2 sm:py-3">
        <div
          className="flex animate-scroll"
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* First set of items */}
          <div className="flex">{tickerItems}</div>
          {/* Duplicate for seamless loop */}
          <div className="flex">{tickerItems}</div>
        </div>
      </div>
    </div>
  )
}
