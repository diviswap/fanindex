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
            staleTime: 60_000,
          },
        },
      })
  )
  const [config, setConfig] = useState<Config>(ssrSafeConfig)

  useEffect(() => {
    // Dynamically import wagmi/connectors ONLY after hydration so the
    // WalletConnect bundle never enters the SSR/static output.
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ""

    import("wagmi/connectors").then(({ injected, walletConnect }) => {
      const connectors: any[] = [
        injected({ shimDisconnect: true }),
      ]

      if (projectId) {
        // ONE WalletConnect connector. Its built-in modal handles wallet
        // selection and deep-linking on mobile, and shows the QR code on
        // desktop. Both the "WalletConnect" and "Socios" buttons in the UI
        // invoke this same connector — Socios is just a cosmetic alias.
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
            qrModalOptions: {
              themeVariables: {
                // Make sure the WalletConnect modal stacks above our picker.
                "--wcm-z-index": "100000",
                "--w3m-z-index": "100000",
              },
            },
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
