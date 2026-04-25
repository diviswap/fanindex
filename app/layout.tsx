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

const SITE_URL = "https://fanindex.io"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FanIndex | Fan Token Index Investment Platform on Chiliz",
    template: "%s | FanIndex",
  },
  description:
    "Invest in diversified fan token indices on Chiliz Chain. FTLX, FGMX, FFLX, FELX, FSLX — structured exposure to football, esports, and combat sports tokens with one transaction.",
  generator: "v0.app",
  applicationName: "FanIndex",
  keywords: [
    "Fan Tokens",
    "Chiliz",
    "CHZ",
    "FTLX",
    "FGMX",
    "FFLX",
    "FELX",
    "FSLX",
    "Fan Token Index",
    "Sports Crypto",
    "DeFi",
    "Crypto Index Fund",
    "Barcelona Fan Token",
    "PSG Fan Token",
    "Juventus Fan Token",
    "OG Esports",
    "UFC Fan Token",
  ],
  authors: [{ name: "FanIndex", url: SITE_URL }],
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
    locale: "en_US",
    url: SITE_URL,
    siteName: "FanIndex",
    title: "FanIndex | Fan Token Index Investment Platform",
    description:
      "Diversified fan token indices on Chiliz Chain. Invest in FTLX, FGMX, FFLX, FELX, FSLX — structured exposure to football, esports, and combat sports.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FanIndex - Fan Token Investment Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@FanIndexes",
    creator: "@FanIndexes",
    title: "FanIndex | Fan Token Index Investment Platform",
    description:
      "Diversified fan token indices on Chiliz Chain. FTLX, FGMX, FFLX, FELX, FSLX — one transaction, multiple tokens.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
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
