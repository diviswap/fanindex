import type { Index, Token } from "./types"
import { allTokens } from "./tokens"

const calculateTotalVolume = (tokens: Token[]): number => {
  if (!tokens || tokens.length === 0) return 0
  return tokens.reduce((acc, token) => acc + token.volume24h, 0)
}

const championsLeagueTokens = [
  allTokens.PSG,
  allTokens.CITY,
  allTokens.JUV,
  allTokens.BAR,
  allTokens.ATM,
  allTokens.ACM,
  allTokens.NAP,
]
const libertadoresTokens = [allTokens.MENGO]
const premierLeagueTokens = [allTokens.CITY, allTokens.AFC, allTokens.SPURS]
const serieATokens = [allTokens.JUV, allTokens.ACM, allTokens.NAP]
const laLigaTokens = [allTokens.ATM, allTokens.BAR, allTokens.VCF, allTokens.LEV, allTokens.RSO, allTokens.SEVILLA]
const superLigTokens = [
  allTokens.GAL,
  allTokens.TRA,
  allTokens.GFK,
  allTokens.GOZ,
  allTokens.IBFK,
  allTokens.ALA,
  allTokens.SAM,
] // Updated: Süper Lig tokens

// NOTA IMPORTANTE: Las direcciones 'vaultAddress' a continuación son placeholders.
// Debes reemplazarlas con las direcciones reales de tus contratos CompetitionVault
// desplegados en la Chiliz Mainnet para que la funcionalidad de inversión funcione.
export const indexes: Index[] = [
  {
    id: "champions_league",
    name: "Champions League",
    description: "Top teams from the UEFA Champions League.",
    icon: "champions_league", // Changed to string identifier
    backgroundImageUrl: "/icons/champions-league.png",
    value: 0, // Placeholder
    change: 0, // Placeholder
    totalMarketCap: 0, // Placeholder
    totalVolume24h: calculateTotalVolume(championsLeagueTokens),
    tokens: championsLeagueTokens,
    chartData: [
      { name: "Jan", value: 1.25 },
      { name: "Feb", value: 1.28 },
      { name: "Mar", value: 1.27 },
      { name: "Apr", value: 1.31 },
      { name: "May", value: 1.3 },
      { name: "Jun", value: 0 },
    ],
    vaultAddress: "0x0000000000000000000000000000000000000001", // Reemplazar con la dirección real del vault
  },
  {
    id: "libertadores",
    name: "Copa Libertadores",
    description: "Leading clubs from CONMEBOL Libertadores.",
    icon: "libertadores", // Changed to string identifier
    backgroundImageUrl: "/icons/libertadores.png",
    value: 0, // Placeholder
    change: 0, // Placeholder
    totalMarketCap: 0, // Placeholder
    totalVolume24h: calculateTotalVolume(libertadoresTokens),
    tokens: libertadoresTokens,
    chartData: [
      { name: "Jan", value: 0.12 },
      { name: "Feb", value: 0.11 },
      { name: "Mar", value: 0.1 },
      { name: "Apr", value: 0.09 },
      { name: "May", value: 0.11 },
      { name: "Jun", value: 0 },
    ],
    vaultAddress: "0x0000000000000000000000000000000000000002", // Reemplazar con la dirección real del vault
  },
  {
    id: "premier_league",
    name: "Premier League",
    description: "Giants from the top tier of English football.",
    icon: "premier_league", // Changed to string identifier
    backgroundImageUrl: "/icons/premier-league.png",
    value: 0, // Placeholder
    change: 0, // Placeholder
    totalMarketCap: 0, // Placeholder
    totalVolume24h: calculateTotalVolume(premierLeagueTokens),
    tokens: premierLeagueTokens,
    chartData: [
      { name: "Jan", value: 0.6 },
      { name: "Feb", value: 0.59 },
      { name: "Mar", value: 0.61 },
      { name: "Apr", value: 0.62 },
      { name: "May", value: 0.6 },
      { name: "Jun", value: 0 },
    ],
    vaultAddress: "0x0000000000000000000000000000000000000004", // Reemplazar con la dirección real del vault
  },
  {
    id: "serie_a",
    name: "Serie A",
    description: "Iconic clubs from Italy's premier league.",
    icon: "serie_a", // Changed to string identifier
    backgroundImageUrl: "/icons/serie-a.png",
    value: 0, // Placeholder
    change: 0, // Placeholder
    totalMarketCap: 0, // Placeholder
    totalVolume24h: calculateTotalVolume(serieATokens),
    tokens: serieATokens,
    chartData: [
      { name: "Jan", value: 1.2 },
      { name: "Feb", value: 1.22 },
      { name: "Mar", value: 1.21 },
      { name: "Apr", value: 1.23 },
      { name: "May", value: 1.24 },
      { name: "Jun", value: 0 },
    ],
    vaultAddress: "0x0000000000000000000000000000000000000005", // Reemplazar con la dirección real del vault
  },
  {
    id: "la_liga",
    name: "LaLiga",
    description: "Top-tier clubs from Spanish football.",
    icon: "la_liga", // Changed to string identifier
    backgroundImageUrl: "/icons/laliga.png",
    value: 0, // Placeholder
    change: 0, // Placeholder
    totalMarketCap: 0, // Placeholder
    totalVolume24h: calculateTotalVolume(laLigaTokens),
    tokens: laLigaTokens,
    chartData: [
      { name: "Jan", value: 0.9 },
      { name: "Feb", value: 0.92 },
      { name: "Mar", value: 0.91 },
      { name: "Apr", value: 0.95 },
      { name: "May", value: 0.94 },
      { name: "Jun", value: 0 },
    ],
    vaultAddress: "0xf7b88371b70b4150EE2924EDc62d5238c34390b7",
    nftAddress: "0x0bccAeb9f6C47C33B366f2E6EC14a4B8136e382E",
  },
  {
    id: "super_lig",
    name: "Süper Lig",
    description: "Leading clubs from Turkish football.",
    icon: "super_lig", // New string identifier
    backgroundImageUrl: "/icons/super-lig.png",
    value: 0, // Placeholder
    change: 0, // Placeholder
    totalMarketCap: 0, // Placeholder
    totalVolume24h: calculateTotalVolume(superLigTokens),
    tokens: superLigTokens,
    chartData: [
      { name: "Jan", value: 0.5 },
      { name: "Feb", value: 0.52 },
      { name: "Mar", value: 0.51 },
      { name: "Apr", value: 0.53 },
      { name: "May", value: 0.54 },
      { name: "Jun", value: 0 },
    ],
    vaultAddress: "0x0000000000000000000000000000000000000006", // Placeholder address for Süper Lig vault
  },
]
