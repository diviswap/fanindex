import { http, createConfig, type Config } from "wagmi"
import { chiliz } from "wagmi/chains"
import { walletConnect, injected } from "wagmi/connectors"

// Get WalletConnect project ID from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ""

// Factory function to create config only on client side
// This avoids indexedDB errors during SSR
export function createWagmiConfig(): Config {
  return createConfig({
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
}

// For backward compatibility - lazy initialized config
let _config: Config | null = null
export const getConfig = (): Config => {
  if (!_config) {
    _config = createWagmiConfig()
  }
  return _config
}
