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
  const [isDark, setIsDark] = useState<boolean>(true)

  const capture = useCallback(async (): Promise<string | null> => {
    if (dataUrlRef.current) return dataUrlRef.current
    if (!cardRef.current) return null

    // Detect and store theme at capture time
    const dark = detectIsDark()
    setIsDark(dark)

    setStatus("capturing")

    try {
      const html2canvas = (await import("html2canvas")).default

      const canvas = await html2canvas(cardRef.current, {
        scale: 1,             // element is already 1080x1080 — no extra scaling needed
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
        width: 1080,
        height: 1080,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1080,
        windowHeight: 1080,
        ignoreElements: (el) => {
          // Skip any ResizeObserver-attached wrappers that might interfere
          return el.tagName === "SCRIPT" || el.tagName === "STYLE"
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
      // Use ClipboardItem with a Promise to work around async clipboard restrictions
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": Promise.resolve(blob) }),
      ])
      return true
    } catch (err) {
      console.error("[useShareCard] clipboard error:", err)
      // Fallback: trigger download so user at least gets the image
      const url2 = dataUrlRef.current
      if (url2) {
        const a = document.createElement("a")
        a.href = url2
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
