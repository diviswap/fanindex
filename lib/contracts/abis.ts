import EtfVaultABI from "./EtfVault.json"
import SimplePositionsNFTABI from "./SimplePositionsNFT.json"

export { EtfVaultABI, SimplePositionsNFTABI }

// Mainnet Contract Addresses (Chiliz Chain)
export const MAINNET_CONTRACTS = {
  ETF_VAULT: "0xFae0b5AC695fa682a2378fB3c144b4B78C0F3c2a" as `0x${string}`,
  BATCH_BUYER: "0x72cE310ef6eC32c14C299e235C471A8779Aab75e" as `0x${string}`,
  NFT: "0x8016f276183D29C0c910239b144793Ef7B977B65" as `0x${string}`,
} as const

// Currently only the FTLX index is deployed on mainnet
export const ETF_CONTRACTS = {
  // FTLX — Fan Token Leaders Index (id: "1")
  // Tracks the 10 largest / most liquid fan tokens (GAL, ARG, OG, PSG, BAR,
  // ASR, CITY, ATM, POR, JUV) with market-cap weighted allocation.
  "1": {
    vault: MAINNET_CONTRACTS.ETF_VAULT,
    nft: MAINNET_CONTRACTS.NFT,
    batchBuyer: MAINNET_CONTRACTS.BATCH_BUYER,
    name: "FTLX — Fan Token Leaders Index",
    tokens: 10, // GAL, ARG, OG, PSG, BAR, ASR, CITY, ATM, POR, JUV
  },
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
