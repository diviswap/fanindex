"use client"

import type * as React from "react"
import { WagmiProvider, createConfig, http } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { chilizMainnet } from "@/lib/chains"
import { walletConnect } from "wagmi/connectors"

const queryClient = new QueryClient()

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we'll log an error to the console.
  console.error("Vercel WalletConnect Project ID is not set")
}

const config = createConfig({
  chains: [chilizMainnet],
  connectors: [
    walletConnect({
      projectId: projectId || "",
      metadata: {
        name: "FanIndex",
        description: "Invest in Football Passion",
        url: "https://v0.dev", // Should be the production URL
        icons: ["/logo.png"], // Should be a full URL to your logo
      },
      showQrModal: true,
    }),
  ],
  transports: {
    [chilizMainnet.id]: http(),
  },
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
