"use client"

import { WagmiProvider, createConfig, http } from "wagmi"
import { chiliz } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, useEffect, type ReactNode } from "react"

// Minimal SSR-safe config — zero connectors, never touches indexedDB or AsyncStorage
const ssrSafeConfig = createConfig({
  chains: [chiliz],
  connectors: [],
  transports: { [chiliz.id]: http() },
  ssr: true,
})

export function Web3Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [config, setConfig] = useState(ssrSafeConfig)

  useEffect(() => {
    // Dynamically import wagmi/connectors ONLY after hydration.
    // This keeps @metamask/sdk, WalletConnect, pino, and react-native deps
    // completely out of the SSR/static bundle.
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ""

    import("wagmi/connectors").then(({ injected, walletConnect }) => {
      const connectors: any[] = [
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
          }),
        )
      }

      import("./config").then(({ createWagmiConfig }) => {
        setConfig(createWagmiConfig(connectors))
      })
    })
  }, [])

  return (
    <WagmiProvider config={config} reconnectOnMount>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
