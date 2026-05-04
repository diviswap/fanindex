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
    const isMobile = typeof window !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

    import("wagmi/connectors").then(({ injected, walletConnect }) => {
      const connectors: any[] = [
        injected({ shimDisconnect: true }),
      ]

      if (projectId) {
        // Single WalletConnect connector — showQrModal:true so the built-in
        // WC modal handles both desktop (QR) and mobile (wallet list + deep-links).
        // Both "WalletConnect" and "Socios" buttons in ConnectWallet.tsx reuse
        // this same connector instance, exactly like the working reference app.
        connectors.push(
          walletConnect({
            projectId,
            metadata: {
              name: "FanIndex",
              description: "Fan Token Investment Platform",
              url: "https://fanindex.pro",
              icons: ["https://fanindex.pro/logo.png"],
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
