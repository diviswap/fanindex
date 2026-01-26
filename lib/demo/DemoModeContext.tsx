"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface DemoPosition {
  indexId: string
  indexName: string
  amount: number // Amount in CHZ invested
  units: number // Number of units owned
  purchasePrice: number // Price per unit at purchase
  timestamp: number
}

export interface DemoTransaction {
  id: string
  type: "buy" | "sell"
  indexId: string
  indexName: string
  amount: number
  units: number
  price: number
  timestamp: number
}

interface DemoModeContextType {
  isDemoMode: boolean
  toggleDemoMode: () => void
  demoBalance: number
  demoPositions: DemoPosition[]
  demoTransactions: DemoTransaction[]
  buyIndex: (indexId: string, indexName: string, amount: number, price: number) => boolean
  sellIndex: (indexId: string, indexName: string, units: number, price: number) => boolean
  resetDemo: () => void
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined)

const DEMO_STORAGE_KEY = "fanindex_demo_data"
const INITIAL_DEMO_BALANCE = 10000 // 10,000 CHZ

interface DemoData {
  balance: number
  positions: DemoPosition[]
  transactions: DemoTransaction[]
}

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoBalance, setDemoBalance] = useState(INITIAL_DEMO_BALANCE)
  const [demoPositions, setDemoPositions] = useState<DemoPosition[]>([])
  const [demoTransactions, setDemoTransactions] = useState<DemoTransaction[]>([])

  // Load demo data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(DEMO_STORAGE_KEY)
    if (stored) {
      try {
        const data: DemoData = JSON.parse(stored)
        setDemoBalance(data.balance)
        setDemoPositions(data.positions)
        setDemoTransactions(data.transactions)
      } catch (error) {
        console.error("[v0] Failed to load demo data:", error)
      }
    }
  }, [])

  // Save demo data to localStorage whenever it changes
  useEffect(() => {
    const data: DemoData = {
      balance: demoBalance,
      positions: demoPositions,
      transactions: demoTransactions,
    }
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data))
  }, [demoBalance, demoPositions, demoTransactions])

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev)
  }

  const buyIndex = (indexId: string, indexName: string, amount: number, price: number): boolean => {
    const entryFee = amount * 0.01
    const total = amount + entryFee

    if (total > demoBalance) {
      return false // Insufficient balance
    }

    const units = amount / price

    // Update balance
    setDemoBalance((prev) => prev - total)

    // Update or create position
    setDemoPositions((prev) => {
      const existingIndex = prev.findIndex((p) => p.indexId === indexId)
      if (existingIndex >= 0) {
        const existing = prev[existingIndex]
        const newUnits = existing.units + units
        const newAmount = existing.amount + amount
        const avgPrice = newAmount / newUnits

        return [
          ...prev.slice(0, existingIndex),
          {
            ...existing,
            amount: newAmount,
            units: newUnits,
            purchasePrice: avgPrice,
            timestamp: Date.now(),
          },
          ...prev.slice(existingIndex + 1),
        ]
      }
      return [
        ...prev,
        {
          indexId,
          indexName,
          amount,
          units,
          purchasePrice: price,
          timestamp: Date.now(),
        },
      ]
    })

    // Add transaction
    setDemoTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: "buy",
        indexId,
        indexName,
        amount,
        units,
        price,
        timestamp: Date.now(),
      },
      ...prev,
    ])

    return true
  }

  const sellIndex = (indexId: string, indexName: string, units: number, price: number): boolean => {
    const position = demoPositions.find((p) => p.indexId === indexId)
    if (!position || position.units < units) {
      return false // Position not found or insufficient units
    }

    const saleAmount = units * price
    const exitFee = 0
    const netAmount = saleAmount

    // Update balance
    setDemoBalance((prev) => prev + netAmount)

    // Update position
    setDemoPositions((prev) => {
      const existingIndex = prev.findIndex((p) => p.indexId === indexId)
      if (existingIndex >= 0) {
        const existing = prev[existingIndex]
        const remainingUnits = existing.units - units

        if (remainingUnits <= 0) {
          // Remove position entirely
          return [...prev.slice(0, existingIndex), ...prev.slice(existingIndex + 1)]
        }

        // Update position
        const remainingAmount = (existing.amount / existing.units) * remainingUnits
        return [
          ...prev.slice(0, existingIndex),
          {
            ...existing,
            amount: remainingAmount,
            units: remainingUnits,
            timestamp: Date.now(),
          },
          ...prev.slice(existingIndex + 1),
        ]
      }
      return prev
    })

    // Add transaction
    setDemoTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        type: "sell",
        indexId,
        indexName,
        amount: saleAmount,
        units,
        price,
        timestamp: Date.now(),
      },
      ...prev,
    ])

    return true
  }

  const resetDemo = () => {
    setDemoBalance(INITIAL_DEMO_BALANCE)
    setDemoPositions([])
    setDemoTransactions([])
    localStorage.removeItem(DEMO_STORAGE_KEY)
  }

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode,
        toggleDemoMode,
        demoBalance,
        demoPositions,
        demoTransactions,
        buyIndex,
        sellIndex,
        resetDemo,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  )
}

export function useDemoMode() {
  const context = useContext(DemoModeContext)
  if (context === undefined) {
    throw new Error("useDemoMode must be used within a DemoModeProvider")
  }
  return context
}
