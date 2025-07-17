import { Search, Wallet, BarChart } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"

export default async function AboutPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang)
  const aboutDict = dict.about

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <main className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <section className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 text-white [text-shadow:0_0_20px_rgba(255,255,255,0.5)]">
            {aboutDict.title}
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300">{aboutDict.subtitle}</p>
        </section>

        <section className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-10">{aboutDict.how_it_works}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-black/30 backdrop-blur-xl border border-white/10 text-center rounded-2xl">
              <CardHeader>
                <div className="mx-auto bg-green-500/10 p-3 rounded-full w-fit">
                  <Search className="h-8 w-8 text-green-400" />
                </div>
                <CardTitle className="mt-4">{aboutDict.step1_title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{aboutDict.step1_desc}</p>
              </CardContent>
            </Card>
            <Card className="bg-black/30 backdrop-blur-xl border border-white/10 text-center rounded-2xl">
              <CardHeader>
                <div className="mx-auto bg-blue-500/10 p-3 rounded-full w-fit">
                  <Wallet className="h-8 w-8 text-blue-400" />
                </div>
                <CardTitle className="mt-4">{aboutDict.step2_title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{aboutDict.step2_desc}</p>
              </CardContent>
            </Card>
            <Card className="bg-black/30 backdrop-blur-xl border border-white/10 text-center rounded-2xl">
              <CardHeader>
                <div className="mx-auto bg-purple-500/10 p-3 rounded-full w-fit">
                  <BarChart className="h-8 w-8 text-purple-400" />
                </div>
                <CardTitle className="mt-4">{aboutDict.step3_title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{aboutDict.step3_desc}</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
