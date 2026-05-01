"use client"

import { useMemo } from "react"
import { useCoinGeckoPrices } from "./use-coingecko-prices"
import { calculateIndexPrice } from "@/lib/data/indices"
import type { IndexData } from "@/components/indices/IndexCard"

/**
 * Single source of truth for an index's "current NAV" — used by every screen
 * that displays an index price (the home portfolio panel, the /indices cards,
 * the /indices/[symbol] detail view, share cards, etc.).
 *
 * Why a shared hook?
 *   The card on /indices and the detail view on /indices/{symbol} were each
 *   computing the NAV inline. Even though the math was identical, subtle
 *   differences in fallback ordering (one fell back to historical aggregate,
 *   the other to static price) meant the two screens could momentarily show
 *   different numbers under network conditions like CoinGecko rate limits.
 *
 *   Centralising the calculation guarantees they always render the same value.
 *
 * Behaviour:
 *   1. If live CoinGecko prices are available, return the weighted average via
 *      `calculateIndexPrice` — the canonical formula.
 *   2. Otherwise, return the static `index.price` (which is itself a
 *      `calculateIndexPrice` call against the static USD fallbacks at module
 *      load) so the headline never shows 0 or a stale historical aggregate
 *      that doesn't match the rest of the UI.
 */
export function useIndexNav(index: Pick<IndexData, "tokens" | "weights" | "price">) {
  const { prices: liveTokenPrices, isLoading } = useCoinGeckoPrices()

  const navPrice = useMemo(() => {
    if (liveTokenPrices && liveTokenPrices.length > 0) {
      const nav = calculateIndexPrice(index.tokens, liveTokenPrices, index.weights)
      if (nav > 0) return nav
    }
    return Number.parseFloat(index.price) || 0
  }, [liveTokenPrices, index.tokens, index.weights, index.price])

  return {
    navPrice,
    /** 2-decimal string used everywhere as the headline NAV ("28.34") */
    displayPrice: navPrice.toFixed(2),
    livePrices: liveTokenPrices,
    isLoading,
  }
}
