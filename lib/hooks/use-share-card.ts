import { useCallback, useRef, useState } from "react"

export type ShareCardStatus = "idle" | "capturing" | "success" | "error"

export interface UseShareCardReturn {
  cardRef: React.RefObject<HTMLDivElement | null>
  status: ShareCardStatus
  dataUrl: string | null
  isDark: boolean
  capture: () => Promise<string | null>
  downloadPng: (filename?: string) => Promise<void>
  copyToClipboard: () => Promise<boolean>
  shareToX: (text: string) => void
  reset: () => void
}

/** Read the app's active theme from the <html> class — matches Tailwind dark mode */
function detectIsDark(): boolean {
  if (typeof window === "undefined") return true
  return document.documentElement.classList.contains("dark")
}

/** Convert a base64 dataURL to a Blob without using fetch() */
function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(",")
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/png"
  const binary = atob(data)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new Blob([bytes], { type: mime })
}

export function useShareCard(): UseShareCardReturn {
  const cardRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<ShareCardStatus>("idle")
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const dataUrlRef = useRef<string | null>(null)
  const [isDark, setIsDark] = useState<boolean>(() => detectIsDark())

  const capture = useCallback(async (): Promise<string | null> => {
    if (dataUrlRef.current) return dataUrlRef.current

    const el = cardRef.current
    if (!el) {
      console.log("[useShareCard] cardRef is null, cannot capture")
      return null
    }

    const dark = detectIsDark()
    setIsDark(dark)
    setStatus("capturing")

    try {
      const html2canvas = (await import("html2canvas")).default

      // Temporarily make the element visible to html2canvas by removing visibility:hidden
      // from the wrapper while capturing. We do this on the wrapper (parent), not the card.
      const wrapper = el.parentElement
      const prevVisibility = wrapper?.style.visibility ?? ""
      const prevOpacity = wrapper?.style.opacity ?? ""
      if (wrapper) {
        wrapper.style.visibility = "visible"
        wrapper.style.opacity = "0"  // Still invisible to user but readable by html2canvas
      }

      let url: string | null = null
      try {
        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: dark ? "#0a0a0a" : "#ffffff",
          logging: false,
          width: 1080,
          height: 1080,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 1080,
          windowHeight: 1080,
          foreignObjectRendering: false,
        })
        url = canvas.toDataURL("image/png", 1.0)
      } finally {
        // Always restore visibility
        if (wrapper) {
          wrapper.style.visibility = prevVisibility
          wrapper.style.opacity = prevOpacity
        }
      }

      if (!url) {
        setStatus("error")
        return null
      }

      dataUrlRef.current = url
      setDataUrl(url)
      setStatus("success")
      return url
    } catch (err) {
      console.error("[useShareCard] capture error:", err)
      setStatus("error")
      return null
    }
  }, [])

  const downloadPng = useCallback(
    async (filename = "fanindex-share.png") => {
      const url = dataUrlRef.current ?? (await capture())
      if (!url) return
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    [capture]
  )

  const copyToClipboard = useCallback(async (): Promise<boolean> => {
    const url = dataUrlRef.current ?? (await capture())
    if (!url) return false

    try {
      const blob = dataUrlToBlob(url)
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": Promise.resolve(blob) }),
      ])
      return true
    } catch (clipErr) {
      console.error("[useShareCard] clipboard error:", clipErr)
      // Fallback: download
      const fallbackUrl = dataUrlRef.current
      if (fallbackUrl) {
        const a = document.createElement("a")
        a.href = fallbackUrl
        a.download = "fanindex-share.png"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
      return false
    }
  }, [capture])

  const shareToX = useCallback((text: string) => {
    const encoded = encodeURIComponent(text)
    window.open(`https://x.com/intent/tweet?text=${encoded}`, "_blank", "noopener,noreferrer")
  }, [])

  const reset = useCallback(() => {
    dataUrlRef.current = null
    setStatus("idle")
    setDataUrl(null)
  }, [])

  return { cardRef, status, dataUrl, isDark, capture, downloadPng, copyToClipboard, shareToX, reset }
}
