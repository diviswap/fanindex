"use client"

import { WagmiProvider, createConfig, http } from "wagmi"
import { chiliz } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, useEffect, type ReactNode } from "react"

// Create a minimal SSR-safe config without connectors that use indexedDB
const ssrSafeConfig = createConfig({
  chains: [chiliz],
  connectors: [],
  transports: {
    [chiliz.id]: http(),
  },
  ssr: true,
})

export function Web3Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [mounted, setMounted] = useState(false)
  const [config, setConfig] = useState(ssrSafeConfig)

  useEffect(() => {
    // Dynamically import full config with connectors only on client side
    import("./config").then((module) => {
      setConfig(module.createWagmiConfig())
      setMounted(true)
    })
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
