import { http, createConfig } from "wagmi"
import { chiliz } from "wagmi/chains"
import { walletConnect, injected } from "wagmi/connectors"

// Get WalletConnect project ID from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ""

export const config = createConfig({
  chains: [chiliz],
  connectors: [
    injected({
      target: "metaMask",
    }),
    injected({
      target: "coinbaseWallet",
    }),
    injected(), // Generic injected for other browser wallets
    walletConnect({
      projectId,
      metadata: {
        name: "FanIndex",
        description: "Fan Token Investment Platform",
        url: "https://fanindex.app",
        icons: ["https://fanindex.app/logo.png"],
      },
    }),
  ],
  transports: {
    [chiliz.id]: http(),
  },
})
