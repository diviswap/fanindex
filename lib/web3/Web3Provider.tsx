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
        // Shared QR-modal options: ensure WalletConnect's modal sits ABOVE
        // our own picker (which uses z-index 9999) on every platform.
        const qrModalOptions = {
          themeVariables: {
            "--wcm-z-index": "100000",
            "--w3m-z-index": "100000",
          },
        }

        // Standard WalletConnect — always show its built-in modal.
        // - Desktop: renders the QR code
        // - Mobile: renders the wallet list with native deep-links
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
            qrModalOptions,
          }),
        )

        // Socios connector — same WC protocol, but on mobile we suppress the
        // built-in WC modal and redirect directly to the Socios app via the
        // `display_uri` event (handled in ConnectWallet.tsx). On desktop we
        // fall back to the standard QR modal so the user can scan it.
        connectors.push(
          walletConnect({
            projectId,
            metadata: {
              name: "FanIndex",
              description: "Fan Token Investment Platform",
              url: "https://fanindex.pro",
              icons: ["https://fanindex.pro/logo.png"],
            },
            showQrModal: !isMobile,
            qrModalOptions,
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
