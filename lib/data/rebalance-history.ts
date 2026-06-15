export interface RebalanceEvent {
  date: string // ISO date: YYYY-MM-DD
  index: string // e.g., "FTLX"
  change: string // Description of the change
  tokens: { symbol: string; weight: number }[] // New composition
}

export const REBALANCE_HISTORY: RebalanceEvent[] = [
  // FTLX — Fan Token Leaders Index
  {
    date: "2024-06-15",
    index: "FTLX",
    change: "Quarterly rebalancing: Updated token weights to reflect market leadership",
    tokens: [
      { symbol: "OG", weight: 17.02 },
      { symbol: "ASR", weight: 12.52 },
      { symbol: "ATM", weight: 12.20 },
      { symbol: "PSG", weight: 11.84 },
      { symbol: "BAR", weight: 9.68 },
      { symbol: "GAL", weight: 8.95 },
      { symbol: "ARG", weight: 7.64 },
      { symbol: "JUV", weight: 7.40 },
      { symbol: "CITY", weight: 7.24 },
      { symbol: "ACM", weight: 5.51 },
    ],
  },

  // FELX — Fan English League Index
  {
    date: "2024-06-15",
    index: "FELX",
    change: "Quarterly rebalancing: Updated weights to reflect current market conditions",
    tokens: [
      { symbol: "CITY", weight: 47.07 },
      { symbol: "AFC", weight: 32.35 },
      { symbol: "SPURS", weight: 12.72 },
      { symbol: "AVL", weight: 4.36 },
      { symbol: "EFC", weight: 3.52 },
    ],
  },

  // FSLX — Fan Spanish League Index
  {
    date: "2024-06-15",
    index: "FSLX",
    change: "Quarterly rebalancing: Adjusted La Liga club weights",
    tokens: [
      { symbol: "ATM", weight: 53.21 },
      { symbol: "BAR", weight: 42.37 },
      { symbol: "SEVILLA", weight: 2.36 },
      { symbol: "VCF", weight: 2.07 },
    ],
  },

  // FNTX — Fan National Teams Index
  {
    date: "2024-06-15",
    index: "FNTX",
    change: "Initial launch: Equal-weight composition of national team federation tokens",
    tokens: [
      { symbol: "BELG", weight: 20.0 },
      { symbol: "SAFA", weight: 20.0 },
      { symbol: "SFA", weight: 20.0 },
      { symbol: "POR", weight: 20.0 },
      { symbol: "ARG", weight: 20.0 },
    ],
  },
]
