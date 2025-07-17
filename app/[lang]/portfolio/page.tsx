import { getIndexesWithOnChainPrices } from "@/lib/onchain"
import { generatePortfolioData } from "@/lib/portfolio-data"
import { getMockTransactions } from "@/lib/transaction-data"
import { PortfolioClient } from "./client"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"

export default async function PortfolioPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang)
  const indexes = await getIndexesWithOnChainPrices()
  const portfolio = generatePortfolioData(indexes)
  const transactions = getMockTransactions()

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <main className="container mx-auto px-4 md:px-6 py-12">
        <PortfolioClient portfolio={portfolio} transactions={transactions} lang={lang} dict={dict.portfolio} />
      </main>
    </div>
  )
}
