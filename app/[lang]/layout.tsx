import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Web3Provider } from "@/components/providers/web3-provider"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { i18n, type Locale } from "@/i18n-config"
import { getDictionary } from "@/lib/get-dictionary"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "FanIndex - Invest in Football Passion",
  description:
    "FanIndex lets you invest in curated baskets of Fan Tokens, just like ETFs. Diversify your portfolio across leagues and teams with a single click.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16" },
      { url: "/favicon-32x32.png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192" },
      { url: "/android-chrome-512x512.png", sizes: "512x512" },
    ],
  },
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: { lang: Locale }
}>) {
  const dict = await getDictionary(params.lang)
  return (
    <html lang={params.lang} className="dark no-scrollbar">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <Suspense>
          <Web3Provider>
            <SiteHeader lang={params.lang} dict={dict} />
            {children}
            <SiteFooter lang={params.lang} dict={dict.footer} />
            <Analytics />
          </Web3Provider>
        </Suspense>
      </body>
    </html>
  )
}
