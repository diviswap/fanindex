import type { Chain } from "viem"

export const chilizMainnet = {
  id: 88888,
  name: "Chiliz Mainnet",
  nativeCurrency: { name: "CHZ", symbol: "CHZ", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.ankr.com/chiliz"] },
  },
  blockExplorers: {
    default: { name: "ChilizScan", url: "https://chiliscan.com" },
  },
} as const satisfies Chain
