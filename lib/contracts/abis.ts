import EtfVaultABI from "./EtfVault.json"
import SimplePositionsNFTABI from "./SimplePositionsNFT.json"

export { EtfVaultABI, SimplePositionsNFTABI }

export const ETF_CONTRACTS = {
  // La Liga Elite (id: "4") -> Spain ETF
  "4": {
    vault: "0xC8b9b6C9403946bb394DC0ab8296688b56C47c41" as `0x${string}`,
    nft: "0x5F449a7DB81AaD36F0C2EFc2B39D8d8656d727D8" as `0x${string}`,
    name: "FanIndex SPAIN ETF",
  },
  // Serie A Champions (id: "3") -> Italy ETF
  "3": {
    vault: "0x27F2d8a60B153fc5EBD1c17F3d2dC4C233631869" as `0x${string}`,
    nft: "0x37626A4148B60fF9A7F6b518CB656875D2dE1B95" as `0x${string}`,
    name: "FanIndex ITALY ETF",
  },
  // Premier League Index (id: "2") -> England ETF
  "2": {
    vault: "0x2b3268E8d57677e97655FFaae570222aD0e124a7" as `0x${string}`,
    nft: "0x7c8cECAA6bF34ABf52dAEd430581Af07dF10A0e0" as `0x${string}`,
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
  competitionVault: ETF_CONTRACTS["2"].vault,
  competitionNFT: ETF_CONTRACTS["2"].nft,
} as const
