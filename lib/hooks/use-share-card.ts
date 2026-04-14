import { useCallback, useRef, useState } from "react"

export type ShareCardStatus = "idle" | "capturing" | "success" | "error"

export interface UseShareCardReturn {
  cardRef: React.RefObject<HTMLDivElement | null>
  status: ShareCardStatus
  dataUrl: string | null
  capture: () => Promise<string | null>
  downloadPng: (filename?: string) => Promise<void>
  copyToClipboard: () => Promise<boolean>
  shareToX: (text: string) => void
  reset: () => void
}

export function useShareCard(): UseShareCardReturn {
  const cardRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<ShareCardStatus>("idle")
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  // Keep a ref so callbacks always read the latest value without stale closures
  const dataUrlRef = useRef<string | null>(null)

  const capture = useCallback(async (): Promise<string | null> => {
    // Return cached result immediately — never re-capture
    if (dataUrlRef.current) return dataUrlRef.current
    if (!cardRef.current) return null
    setStatus("capturing")

    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
        onclone: (doc) => {
          const el = doc.querySelector("[data-share-card]") as HTMLElement | null
          if (el) el.style.fontFamily = "inherit"
        },
      })
      const url = canvas.toDataURL("image/png", 1.0)
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
      // Use ref so we always read the latest cached url, even if state hasn't re-rendered yet
      const url = dataUrlRef.current ?? (await capture())
      if (!url) return
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
    },
    [capture]
  )

  const copyToClipboard = useCallback(async (): Promise<boolean> => {
    const url = dataUrlRef.current ?? (await capture())
    if (!url) return false

    try {
      const res = await fetch(url)
      const blob = await res.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ])
      return true
    } catch (err) {
      console.error("[useShareCard] clipboard error:", err)
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

  return { cardRef, status, dataUrl, capture, downloadPng, copyToClipboard, shareToX, reset }
}
