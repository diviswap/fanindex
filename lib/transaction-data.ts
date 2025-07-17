import type { Transaction } from "./types"

// Mock data for transaction history
export const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-07-15T10:30:00Z",
    type: "Buy",
    status: "Completed",
    indexName: "Champions League",
    indexId: "champions_league",
    amountCHZ: 150.0,
    txHash: "0x123...abc",
  },
  {
    id: "2",
    date: "2024-07-14T15:45:00Z",
    type: "Buy",
    status: "Completed",
    indexName: "Premier League",
    indexId: "premier_league",
    amountCHZ: 100.0,
    txHash: "0x456...def",
  },
  {
    id: "3",
    date: "2024-07-13T09:00:00Z",
    type: "Buy",
    status: "Completed",
    indexName: "LaLiga",
    indexId: "la_liga",
    amountCHZ: 200.0,
    txHash: "0x789...ghi",
  },
  {
    id: "4",
    date: "2024-07-12T18:20:00Z",
    type: "Sell",
    status: "Completed",
    indexName: "Serie A",
    indexId: "serie_a",
    amountCHZ: 75.0,
    txHash: "0xabc...123",
  },
  {
    id: "5",
    date: "2024-07-11T11:05:00Z",
    type: "Buy",
    status: "Failed",
    indexName: "Süper Lig",
    indexId: "super_lig",
    amountCHZ: 50.0,
    txHash: "0xdef...456",
  },
]

export function getMockTransactions(): Transaction[] {
  return mockTransactions
}
