// FanX Router ABI for price queries and DEX operations
export const FanXRouterABI = [
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
  {
    inputs: [
      { internalType: "uint256", name: "amountOut", type: "uint256" },
      { internalType: "address[]", name: "path", type: "address[]" },
    ],
    name: "getAmountsIn",
    outputs: [{ internalType: "uint256[]", name: "amounts", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amountIn", type: "uint256" },
      { internalType: "uint256", name: "reserveIn", type: "uint256" },
      { internalType: "uint256", name: "reserveOut", type: "uint256" },
    ],
    name: "getAmountOut",
    outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "factory",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "WETH",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const

// FanX Contract Addresses
export const FANX_CONTRACTS = {
  FACTORY: "0xE2918AA38088878546c1A18F2F9b1BC83297fdD3" as `0x${string}`,
  ROUTER: "0x1918EbB39492C8b98865c5E53219c3f1AE79e76F" as `0x${string}`,
  MASTER_ROUTER_V2: "0x296c39985Fa3eB3B1D76C95245e8Ed44dA4348CF" as `0x${string}`,
  CHILIZ_WRAPPER_FACTORY: "0xAEdcF2bf41891777c5F638A098bbdE1eDBa7B264" as `0x${string}`,
  WCHZ: "0x677F7e16C7Dd57be1D4C8aD1244883214953DC47" as `0x${string}`,
} as const
