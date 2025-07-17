"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { i18n, type Locale } from "@/i18n-config"

// Define a type for the dictionary structure relevant to loading
interface LoadingDictionary {
  common: {
    loading_data: string
  }
}

// Function to dynamically load dictionary (client-side)
const loadDictionary = async (locale: Locale): Promise<LoadingDictionary> => {
  switch (locale) {
    case "es":
      return (await import("@/dictionaries/es.json")).default as LoadingDictionary
    case "pt":
      return (await import("@/dictionaries/pt.json")).default as LoadingDictionary
    case "fr":
      return (await import("@/dictionaries/fr.json")).default as LoadingDictionary
    case "it":
      return (await import("@/dictionaries/it.json")).default as LoadingDictionary
    case "tr":
      return (await import("@/dictionaries/tr.json")).default as LoadingDictionary
    case "ja":
      return (await import("@/dictionaries/ja.json")).default as LoadingDictionary
    case "en":
    default:
      return (await import("@/dictionaries/en.json")).default as LoadingDictionary
  }
}

export default function Loading() {
  const [dots, setDots] = useState("")
  const [loadingText, setLoadingText] = useState("Loading data") // Default text
  const pathname = usePathname()

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const segments = pathname.split("/")
    const currentLocale = (segments[1] || i18n.defaultLocale) as Locale

    loadDictionary(currentLocale)
      .then((dict) => {
        setLoadingText(dict.common.loading_data)
      })
      .catch((error) => {
        console.error("Failed to load dictionary for loading screen:", error)
        setLoadingText("Loading data") // Fallback in case of error
      })
  }, [pathname])

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col items-center gap-8"
      >
        {/* Fan Tokens Image */}
        <Image
          src="/fan-tokens-loading.png"
          alt="Fan Tokens Loading"
          width={600}
          height={118}
          className="max-w-sm px-4 md:max-w-md"
          priority
        />

        {/* Progress Bar and Text */}
        <div className="w-64 md:w-80 space-y-3">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-800">
            <motion.div
              className="absolute left-0 top-0 h-full bg-green-500"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            />
          </div>
          <p className="text-center text-sm text-gray-400">
            {loadingText}
            {dots}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
