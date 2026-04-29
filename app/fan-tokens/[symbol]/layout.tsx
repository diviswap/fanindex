import type { Metadata } from "next"
import { FAN_TOKENS } from "@/lib/data/fan-tokens"

type Props = {
  params: Promise<{ symbol: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol } = await params
  const normalized = symbol.toUpperCase()
  const token = FAN_TOKENS.find((t) => t.symbol.toUpperCase() === normalized)

  if (!token) {
    return {
      title: "Token Not Found",
    }
  }

  const description = `${token.name} (${token.symbol}) fan token on Chiliz Chain. Live price, market cap, trading volume, and contract details.`

  return {
    title: `${token.symbol} - ${token.name}`,
    description,
    openGraph: {
      title: `${token.symbol} | ${token.name} Fan Token`,
      description,
      url: `/fan-tokens/${token.symbol}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${token.symbol} | ${token.name} Fan Token`,
      description,
    },
    alternates: {
      canonical: `/fan-tokens/${token.symbol}`,
    },
  }
}

export default function TokenDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
