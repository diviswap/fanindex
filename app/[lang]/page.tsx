import { getIndexesWithOnChainPrices } from "@/lib/onchain"
import { HomeClient } from "./home-client"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"

export default async function FanIndexPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang)
  const indexes = await getIndexesWithOnChainPrices()

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <main className="relative z-10">
        <HomeClient indexes={indexes} lang={lang} dict={dict} />
      </main>
    </div>
  )
}
