import type { Metadata } from "next"
import { WebGLShader } from "@/components/ui/web-gl-shader"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Footer } from "@/components/ui/footer-section"
import { IndexDetailView } from "@/components/indices/IndexDetailView"
import { notFound } from "next/navigation"
import { INDICES } from "@/lib/data/indices"

type Props = {
  params: Promise<{ symbol: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol } = await params
  const normalized = symbol.toUpperCase()
  const index = INDICES.find(
    (i) => i.symbol?.toUpperCase() === normalized || i.id.toUpperCase() === normalized,
  )

  if (!index) {
    return {
      title: "Index Not Found",
    }
  }

  const tokenList = index.tokens.slice(0, 5).join(", ") + (index.tokens.length > 5 ? "..." : "")
  const description = `${index.name}: ${index.description} Composition: ${tokenList}. Invest on Chiliz Chain.`

  return {
    title: index.name,
    description,
    openGraph: {
      title: `${index.symbol} | ${index.name}`,
      description,
      url: `/indices/${index.symbol}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${index.symbol} | ${index.name}`,
      description,
    },
    alternates: {
      canonical: `/indices/${index.symbol}`,
    },
  }
}

export async function generateStaticParams() {
  return INDICES.filter((i) =>
    ["FTLX", "FGMX", "FFLX", "FELX", "FSLX"].includes(i.id),
  ).map((index) => ({
    symbol: index.symbol ?? index.id,
  }))
}

export default async function IndexDetailPage({ params }: Props) {
  const { symbol } = await params

  // Match on ticker symbol (e.g. "FTLX") case-insensitively. We also match
  // against `id` as a fallback so legacy links like /indices/FTLX still
  // resolve when the id and symbol are identical (which is the case for all
  // deployed indices).
  const normalized = symbol.toUpperCase()
  const index = INDICES.find(
    (i) => i.symbol?.toUpperCase() === normalized || i.id.toUpperCase() === normalized,
  )

  if (!index) {
    notFound()
  }

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-background min-h-screen">
      <WebGLShader />
      <NavBar />

      <main className="relative z-10 w-full mx-auto max-w-7xl px-6 py-20">
        <IndexDetailView index={index} />
      </main>

      <Footer />
    </div>
  )
}
