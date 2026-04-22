import EtfVaultABI from "./EtfVault.json"
import SimplePositionsNFTABI from "./SimplePositionsNFT.json"

export { EtfVaultABI, SimplePositionsNFTABI }

// Mainnet Contract Addresses (Chiliz Chain)
export const MAINNET_CONTRACTS = {
  ETF_VAULT: "0x0bDe1d6a9d4dF032B7e7f0615dac6EB7fe74D52f" as `0x${string}`,
  BATCH_BUYER: "0x0078cE480C41B058ed8a5Ca0d814F810550dbA8C" as `0x${string}`,
  NFT: "0x1cd2309fFdbc9A3a8819ED8b9E7979d1D725B9d9" as `0x${string}`,
} as const

// Currently only the Global ETF is deployed on mainnet
export const ETF_CONTRACTS = {
  // FanIndex Global ETF (id: "1") -> Main Mainnet ETF (50% OG, 50% VCF)
  "1": {
    vault: MAINNET_CONTRACTS.ETF_VAULT,
    nft: MAINNET_CONTRACTS.NFT,
    batchBuyer: MAINNET_CONTRACTS.BATCH_BUYER,
    name: "FanIndex Global ETF",
    tokens: 2, // OG and VCF
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
