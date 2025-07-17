import type { Index } from "./types"

export interface Holding {
  index: Index
  investedAmount: number
  unitsOwned: number
  currentValue: number
  pnl: number
  pnlPercentage: number
}

export interface UserPortfolio {
  totalValue: number
  totalInvested: number
  overallPnl: number
  overallPnlPercentage: number
  change24h: number
  holdings: Holding[]
  chartData: { name: string; value: number }[]
}

// --- Mock Data Generation ---

// We now define a target P/L for each investment to simulate a positive return.
const userInvestments = [
  { indexId: "la_liga", amount: 3, targetPnlPercentage: 18 },
  { indexId: "premier_league", amount: 2, targetPnlPercentage: 15 },
  { indexId: "champions_league", amount: 3, targetPnlPercentage: 20 },
  { indexId: "serie_a", amount: 2, targetPnlPercentage: 16 },
  { indexId: "libertadores", amount: 2.5, targetPnlPercentage: 12 },
  { indexId: "super_lig", amount: 1.5, targetPnlPercentage: 10 }, // New: Add Süper Lig to portfolio
]

export function generatePortfolioData(indexes: Index[]): UserPortfolio {
  const holdings: Holding[] = userInvestments
    .map((investment) => {
      const index = indexes.find((i) => i.id === investment.indexId)
      if (!index || index.value === 0) return null // Don't show if index data isn't loaded

      // Dynamically calculate a hypothetical purchasePrice that would result in the target P/L
      const purchasePrice = index.value / (1 + investment.targetPnlPercentage / 100)

      const unitsOwned = investment.amount / purchasePrice
      const currentValue = unitsOwned * index.value // This will now reflect the target P/L
      const pnl = currentValue - investment.amount
      const pnlPercentage = (pnl / investment.amount) * 100

      return {
        index,
        investedAmount: investment.amount,
        unitsOwned,
        currentValue,
        pnl,
        pnlPercentage,
      }
    })
    .filter((h): h is Holding => h !== null)

  const totalValue = holdings.reduce((acc, h) => acc + h.currentValue, 0)
  const totalInvested = holdings.reduce((acc, h) => acc + h.investedAmount, 0)
  const overallPnl = totalValue - totalInvested
  const overallPnlPercentage = totalInvested > 0 ? (overallPnl / totalInvested) * 100 : 0

  // Calculate weighted 24h change for the portfolio
  const total24hChangeValue = holdings.reduce((acc, h) => acc + h.currentValue * (h.index.change / 100), 0)
  const change24h = totalValue > 0 ? (total24hChangeValue / totalValue) * 100 : 0

  // Mock chart data for the portfolio, showing growth from invested amount to current value
  const portfolioChartData = [
    { name: "Jan", value: totalInvested },
    { name: "Feb", value: totalInvested * 1.05 },
    { name: "Mar", value: totalInvested * 1.02 },
    { name: "Apr", value: totalInvested * 1.1 },
    { name: "May", value: totalInvested * 1.12 },
    { name: "Jun", value: totalValue },
  ]

  return {
    totalValue,
    totalInvested,
    overallPnl,
    overallPnlPercentage,
    change24h,
    holdings,
    chartData: portfolioChartData,
  }
}
