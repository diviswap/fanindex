/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Handle missing modules from wagmi connectors
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'pino-pretty': false,
      '@react-native-async-storage/async-storage': false,
    }
    
    // Externalize problematic modules on server
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        'pino-pretty': 'pino-pretty',
        '@react-native-async-storage/async-storage': '@react-native-async-storage/async-storage',
      })
    }
    
    return config
  },
}

export default nextConfig
