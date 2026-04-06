import EtfVaultABI from "./EtfVault.json"
import SimplePositionsNFTABI from "./SimplePositionsNFT.json"

export { EtfVaultABI, SimplePositionsNFTABI }

// Chiliz Mainnet contract addresses (single deployment shared across all indices)
export const MAINNET_CONTRACTS = {
  vault:       "0x0bDe1d6a9d4dF032B7e7f0615dac6EB7fe74D52f" as `0x${string}`,
  batchBuyer:  "0x0078cE480C41B058ed8a5Ca0d814F810550dbA8C" as `0x${string}`,
  nft:         "0x1cd2309fFdbc9A3a8819ED8b9E7979d1D725B9d9" as `0x${string}`,
} as const

export const ETF_CONTRACTS = {
  // La Liga Elite (id: "4") -> Spain ETF
  "4": {
    vault:      MAINNET_CONTRACTS.vault,
    batchBuyer: MAINNET_CONTRACTS.batchBuyer,
    nft:        MAINNET_CONTRACTS.nft,
    name: "FanIndex SPAIN ETF",
  },
  // Serie A Champions (id: "3") -> Italy ETF
  "3": {
    vault:      MAINNET_CONTRACTS.vault,
    batchBuyer: MAINNET_CONTRACTS.batchBuyer,
    nft:        MAINNET_CONTRACTS.nft,
    name: "FanIndex ITALY ETF",
  },
  // Premier League Index (id: "2") -> England ETF
  "2": {
    vault:      MAINNET_CONTRACTS.vault,
    batchBuyer: MAINNET_CONTRACTS.batchBuyer,
    nft:        MAINNET_CONTRACTS.nft,
    name: "FanIndex ENGLAND ETF",
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
  competitionVault: MAINNET_CONTRACTS.vault,
  competitionNFT:   MAINNET_CONTRACTS.nft,
  batchBuyer:       MAINNET_CONTRACTS.batchBuyer,
} as const
