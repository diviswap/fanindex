import { WebGLShader } from "@/components/ui/web-gl-shader"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Footer } from "@/components/ui/footer-section"
import { IndexDetailView } from "@/components/indices/IndexDetailView"
import { notFound } from "next/navigation"
import { INDICES } from "@/lib/data/indices"

export default function IndexDetailPage({ params }: { params: { id: string } }) {
  const index = INDICES.find((i) => i.id === params.id)

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
