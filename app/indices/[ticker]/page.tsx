import { WebGLShader } from "@/components/ui/web-gl-shader"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Footer } from "@/components/ui/footer-section"
import { IndexDetailView } from "@/components/indices/IndexDetailView"
import { notFound, redirect } from "next/navigation"
import { INDICES } from "@/lib/data/indices"

export default async function IndexDetailPage({
  params,
}: {
  params: Promise<{ ticker: string }>
}) {
  const { ticker } = await params
  const normalised = ticker.toUpperCase()

  // Primary lookup: by ticker code (e.g. "FTLX", "FGMX").
  let index = INDICES.find((i) => i.ticker?.toUpperCase() === normalised)

  // Backwards-compat: if someone still hits a legacy numeric URL
  // (e.g. /indices/1), resolve it and redirect to the ticker URL.
  if (!index) {
    const byId = INDICES.find((i) => i.id === ticker)
    if (byId?.ticker) {
      redirect(`/indices/${byId.ticker}`)
    }
  }

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
