import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fan Tokens",
  description:
    "Explore all fan tokens on Chiliz Chain. Live prices, market caps, and 24h changes for BAR, PSG, JUV, CITY, OG, UFC, and 50+ more sports tokens.",
  openGraph: {
    title: "Fan Tokens Directory | FanIndex",
    description:
      "Complete directory of fan tokens on Chiliz Chain. Real-time prices for football, esports, and combat sports tokens.",
    url: "/fan-tokens",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fan Tokens Directory | FanIndex",
    description:
      "Explore 50+ fan tokens on Chiliz Chain with live prices and market data.",
  },
  alternates: {
    canonical: "/fan-tokens",
  },
}

export default function FanTokensLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
