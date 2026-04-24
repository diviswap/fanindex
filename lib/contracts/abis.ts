import EtfVaultABI from "./EtfVault.json"
import SimplePositionsNFTABI from "./SimplePositionsNFT.json"

// Extract the ABI array from the artifact JSON files
const ETF_VAULT_ABI = EtfVaultABI.abi || EtfVaultABI
const SIMPLE_POSITIONS_NFT_ABI = SimplePositionsNFTABI.abi || SimplePositionsNFTABI

export { ETF_VAULT_ABI as EtfVaultABI, SIMPLE_POSITIONS_NFT_ABI as SimplePositionsNFTABI }

// Mainnet Contract Addresses (Chiliz Chain)
export const MAINNET_CONTRACTS = {
  ETF_VAULT: "0xFae0b5AC695fa682a2378fB3c144b4B78C0F3c2a" as `0x${string}`,
  BATCH_BUYER: "0x72cE310ef6eC32c14C299e235C471A8779Aab75e" as `0x${string}`,
  NFT: "0x8016f276183D29C0c910239b144793Ef7B977B65" as `0x${string}`,
} as const

// Currently only the FTLX index is deployed on mainnet.
// Additional indices (FGMX, FFLX, FELX, FSLX) are defined in
// `lib/data/indices.ts` and ready to be wired up here once their
// addresses are supplied. To enable one, add an entry keyed by its
// index id with { vault, nft, batchBuyer, name, tokens } — the UI
// will automatically pick it up via `hasDeployedContracts()` and
// `getContractAddresses()`.
export const ETF_CONTRACTS = {
  // ── FTLX — Fan Token Leaders Index (id: "1") ─────────────────────────
  // Tracks the 10 largest / most liquid fan tokens (GAL, ARG, OG, PSG,
  // BAR, ASR, CITY, ATM, POR, JUV) with market-cap weighted allocation.
  "1": {
    vault: MAINNET_CONTRACTS.ETF_VAULT,
    nft: MAINNET_CONTRACTS.NFT,
    batchBuyer: MAINNET_CONTRACTS.BATCH_BUYER,
    name: "FTLX — Fan Token Leaders Index",
    tokens: 10, // GAL, ARG, OG, PSG, BAR, ASR, CITY, ATM, POR, JUV
  },

  // ── Pending deployments ──────────────────────────────────────────────
  // When contract addresses arrive, uncomment and fill the entries below.
  //
  // "2": {  // FGMX — Fan Gaming Index (4 tokens: OG, NAVI, ALL, MIBR)
  //   vault:      "0x..." as `0x${string}`,
  //   nft:        "0x..." as `0x${string}`,
  //   batchBuyer: "0x..." as `0x${string}`,
  //   name: "FGMX — Fan Gaming Index",
  //   tokens: 4,
  // },
  // "3": {  // FFLX — Fan Fight Index (2 tokens: UFC, PFL)
  //   vault:      "0x..." as `0x${string}`,
  //   nft:        "0x..." as `0x${string}`,
  //   batchBuyer: "0x..." as `0x${string}`,
  //   name: "FFLX — Fan Fight Index",
  //   tokens: 2,
  // },
  // "4": {  // FELX — Fan English League Index (5 tokens: CITY, AFC, SPURS, AVL, EFC)
  //   vault:      "0x..." as `0x${string}`,
  //   nft:        "0x..." as `0x${string}`,
  //   batchBuyer: "0x..." as `0x${string}`,
  //   name: "FELX — Fan English League Index",
  //   tokens: 5,
  // },
  // "5": {  // FSLX — Fan Spanish League Index (4 tokens: BAR, ATM, SEVILLA, VCF)
  //   vault:      "0x..." as `0x${string}`,
  //   nft:        "0x..." as `0x${string}`,
  //   batchBuyer: "0x..." as `0x${string}`,
  //   name: "FSLX — Fan Spanish League Index",
  //   tokens: 4,
  // },
} as const

export function getContractAddresses(indexId: string) {
  return ETF_CONTRACTS[indexId as keyof typeof ETF_CONTRACTS]
}

export function hasDeployedContracts(indexId: string): boolean {
  return indexId in ETF_CONTRACTS
}

export const CompetitionVaultABI = EtfVaultABI
export const CompetitionNFTABI = SimplePositionsNFTABI

export const CONTRACT_ADDRESSES = {
  competitionVault: MAINNET_CONTRACTS.ETF_VAULT,
  competitionNFT: MAINNET_CONTRACTS.NFT,
  batchBuyer: MAINNET_CONTRACTS.BATCH_BUYER,
} as const
