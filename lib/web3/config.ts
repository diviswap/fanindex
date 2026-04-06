import { http, createConfig, type Config } from "wagmi"
import { chiliz } from "wagmi/chains"

// Base config factory — no connectors here.
// Connectors are injected by Web3Provider after mount to avoid
// pulling @metamask/sdk and WalletConnect into the SSR bundle.
export function createWagmiConfig(connectors: any[] = []): Config {
  return createConfig({
    chains: [chiliz],
    connectors,
    transports: {
      [chiliz.id]: http(),
    },
  })
}
