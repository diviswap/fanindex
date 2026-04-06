import { http, createConfig, type Config } from "wagmi"
import { chiliz } from "wagmi/chains"
import { injected } from "wagmi/connectors"

// Factory function to create config only on client side
// Using only injected() connector to avoid problematic dependencies
// from walletConnect and metaMask SDK (pino-pretty, async-storage, etc.)
export function createWagmiConfig(): Config {
  return createConfig({
    chains: [chiliz],
    connectors: [
      // Generic injected connector works with MetaMask, Coinbase Wallet,
      // and any other browser extension wallet
      injected(),
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
