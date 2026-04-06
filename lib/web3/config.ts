import { http, createConfig, type Config } from "wagmi"
import { chiliz } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ""

// Factory function — only called client-side to avoid SSR issues with indexedDB
export function createWagmiConfig(): Config {
  const connectors = [
    // Use plain injected() — detects MetaMask, Coinbase, and any EIP-1193 wallet
    // via window.ethereum without pulling in @metamask/sdk or react-native deps
    injected({ shimDisconnect: true }),
  ]

  if (projectId) {
    connectors.push(
      walletConnect({
        projectId,
        metadata: {
          name: "FanIndex",
          description: "Fan Token Investment Platform",
          url: "https://fanindex.app",
          icons: ["https://fanindex.app/logo.png"],
        },
        showQrModal: true,
      }) as any,
    )
  }

  return createConfig({
    chains: [chiliz],
    connectors,
    transports: {
      [chiliz.id]: http(),
    },
  })
}

// Lazy singleton for getConfig usage
let _config: Config | null = null
export const getConfig = (): Config => {
  if (!_config) _config = createWagmiConfig()
  return _config
}
