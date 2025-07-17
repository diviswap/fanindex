export const competitionVaultABI = [
  {
    inputs: [],
    name: "depositAndBuy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const

export const fanxRouterABI = [
  {
    inputs: [
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "address[]", name: "path", type: "address[]" },
    ],
    name: "getAmountsOut",
    outputs: [{ internalType: "uint256[]", name: "amounts", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
] as const
