import { notFound } from "next/navigation"
import { getIndexByIdWithOnChainPrices } from "@/lib/onchain"
import { IndexDetailClient } from "./client"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"

export default async function IndexDetailPage({ params }: { params: { id: string; lang: Locale } }) {
  const dict = await getDictionary(params.lang)
  const index = await getIndexByIdWithOnChainPrices(params.id)

  if (!index) {
    notFound()
  }

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <main>
        <IndexDetailClient index={index} lang={params.lang} dict={dict} />
      </main>
    </div>
  )
}
