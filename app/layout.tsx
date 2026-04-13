import type React from "react"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Web3Provider } from "@/lib/web3/Web3Provider"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { TickerTape } from "@/components/TickerTape"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "FanIndex - Fan Token Investment Platform",
  description:
    "Transform Fan Tokens into structured financial instruments. Gain diversified exposure to sports teams through index-based products on the Chiliz Chain.",
  generator: "v0.app",
  applicationName: "FanIndex",
  keywords: ["Fan Tokens", "Chiliz", "NFT", "DeFi", "Sports Investment", "Crypto Index"],
  authors: [{ name: "FanIndex" }],
  creator: "FanIndex",
  publisher: "FanIndex",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FanIndex",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "FanIndex",
    title: "FanIndex - Fan Token Investment Platform",
    description: "Transform Fan Tokens into structured financial instruments. Join the waitlist for early access.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FanIndex - Fan Token Investment Platform",
    description: "Transform Fan Tokens into structured financial instruments. Join the waitlist for early access.",
    creator: "@FanIndexes",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Web3Provider>
            <Suspense fallback={null}>{children}</Suspense>
            <Toaster />
            <TickerTape />
          </Web3Provider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
