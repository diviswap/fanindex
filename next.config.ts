import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Stub out optional native/react-native deps that WalletConnect and MetaMask SDK
    // try to import but are not available (or needed) in a web environment.
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      // Silence missing optional peer deps from @metamask/sdk and pino
      "pino-pretty": false,
      "lokijs": false,
      "encoding": false,
      "@react-native-async-storage/async-storage": false,
    }
    return config
  },
}

export default nextConfig
