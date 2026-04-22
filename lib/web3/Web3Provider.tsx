"use client"

import { WagmiProvider, createConfig, http, type Config } from "wagmi"
import { chiliz } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, useEffect, type ReactNode } from "react"

// Minimal SSR-safe config — zero connectors, never touches indexedDB or AsyncStorage
const ssrSafeConfig: Config = createConfig({
  chains: [chiliz],
  connectors: [],
  transports: { [chiliz.id]: http() },
  ssr: true,
})

export function Web3Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Keep wagmi reads fresh for 60 s — avoids cascading refetches on
            // every re-render while still updating balances in a reasonable time.
            staleTime: 60_000,
          },
        },
      })
  )
  const [config, setConfig] = useState<Config>(ssrSafeConfig)

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
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
