import EtfVaultABI from "./EtfVault.json"
import SimplePositionsNFTABI from "./SimplePositionsNFT.json"

export { EtfVaultABI, SimplePositionsNFTABI }

// Mainnet Contract Addresses (Chiliz Chain)
// Indices registered here are keyed by their ticker (FTLX, FGMX, FFLX…).
// That key also serves as the URL slug (/indices/FTLX) and as the `id` on
// the IndexData object in lib/data/indices.ts.
export const ETF_CONTRACTS = {
  // FTLX — Fan Token Leaders Index (weighted, 10 tokens)
  // Composition: GAL, ARG, OG, PSG, BAR, ASR, CITY, ATM, POR, JUV
  FTLX: {
    vault: "0xFae0b5AC695fa682a2378fB3c144b4B78C0F3c2a" as `0x${string}`,
    nft: "0x8016f276183D29C0c910239b144793Ef7B977B65" as `0x${string}`,
    batchBuyer: "0x72cE310ef6eC32c14C299e235C471A8779Aab75e" as `0x${string}`,
    name: "FTLX — Fan Token Leaders Index",
    tokens: 10,
  },
  // FGMX — Fan Gaming Index (equal weight, 4 tokens)
  // Composition: OG, NAVI, ALL, MIBR
  FGMX: {
    vault: "0xa6124a504D6C574810569aFf1969BC305a8fFc8d" as `0x${string}`,
    nft: "0xF302B001fbc2ee983D18de95330A1264804D3C55" as `0x${string}`,
    batchBuyer: "0x5439b8D01ea15b5fD7e4454f073FDb8B64D3CFB1" as `0x${string}`,
    name: "FGMX — Fan Gaming Index",
    tokens: 4,
  },
  // FFLX — Fan Fight Index (equal weight, 2 tokens)
  // Composition: UFC, PFL
  FFLX: {
    vault: "0x4fc776880E623bfFADDb06539ecD0Fda1542d745" as `0x${string}`,
    nft: "0xc3584D4ade3C5ff4851B4970aBC97C070dAf0aC3" as `0x${string}`,
    batchBuyer: "0xab810dD209AAbeCBbF61c20D0eC09F668c5F7A50" as `0x${string}`,
    name: "FFLX — Fan Fight Index",
    tokens: 2,
  },
} as const

// Backwards-compat alias — some components still reference MAINNET_CONTRACTS
// pointing at the original flagship vault. Keep FTLX as the default.
export const MAINNET_CONTRACTS = {
  ETF_VAULT: ETF_CONTRACTS.FTLX.vault,
  BATCH_BUYER: ETF_CONTRACTS.FTLX.batchBuyer,
  NFT: ETF_CONTRACTS.FTLX.nft,
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
