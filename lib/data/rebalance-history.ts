export interface RebalanceEvent {
  date: string // ISO date: YYYY-MM-DD
  index: string // e.g., "FTLX"
  change: string // Description of the change
  tokens: { symbol: string; weight: number }[] // New composition
}

export const REBALANCE_HISTORY: RebalanceEvent[] = [
  // FTLX — Fan Token Leaders Index
  {
    date: "2026-05-01",
    index: "FTLX",
    change: "Initial launch: Market-cap weighted composition of the 10 largest and most liquid fan tokens",
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

  // FGMX — Fan Gaming Index
  {
    date: "2026-05-01",
    index: "FGMX",
    change: "Initial launch: Equal-weight exposure to the top esports organizations on Chiliz",
    tokens: [
      { symbol: "OG", weight: 20.0 },
      { symbol: "TH", weight: 20.0 },
      { symbol: "ALL", weight: 20.0 },
      { symbol: "MIBR", weight: 20.0 },
      { symbol: "DOJO", weight: 20.0 },
    ],
  },

  // FFLX — Fan Fight Index
  {
    date: "2026-05-01",
    index: "FFLX",
    change: "Initial launch: Equal-weight index tracking the leading combat sports organizations",
    tokens: [
      { symbol: "UFC", weight: 50.0 },
      { symbol: "PFL", weight: 50.0 },
    ],
  },

  // FELX — Fan English League Index
  {
    date: "2026-05-01",
    index: "FELX",
    change: "Initial launch: Market-cap weighted index of English Premier League fan tokens",
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
    date: "2026-05-01",
    index: "FSLX",
    change: "Initial launch: Market-cap weighted index of La Liga fan tokens",
    tokens: [
      { symbol: "ATM", weight: 53.21 },
      { symbol: "BAR", weight: 42.37 },
      { symbol: "SEVILLA", weight: 2.36 },
      { symbol: "VCF", weight: 2.07 },
    ],
  },

  // FNTX — Fan National Teams Index
  {
    date: "2026-05-01",
    index: "FNTX",
    change: "Initial launch: Equal-weight composition of national football federation tokens",
    tokens: [
      { symbol: "BELG", weight: 20.0 },
      { symbol: "SAFA", weight: 20.0 },
      { symbol: "SFA", weight: 20.0 },
      { symbol: "POR", weight: 20.0 },
      { symbol: "ARG", weight: 20.0 },
    ],
  },
]
