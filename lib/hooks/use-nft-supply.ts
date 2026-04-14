import { useReadContract } from "wagmi"
import { SimplePositionsNFTABI } from "@/lib/contracts/abis"
import { CONTRACT_ADDRESSES } from "@/lib/contracts/abis"

export function useNFTSupply() {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESSES.competitionNFT,
    abi: SimplePositionsNFTABI as any,
    functionName: "totalSupply",
  })

  const totalSupply = data ? Number(data).toLocaleString() : undefined

  return { totalSupply, isLoading, error }
}
