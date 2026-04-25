import type { MetadataRoute } from "next"
import { INDICES } from "@/lib/data/indices"
import { FAN_TOKENS } from "@/lib/data/fan-tokens"

const SITE_URL = "https://fanindex.io"

// Deployed indices
const DEPLOYED_INDEX_IDS = ["FTLX", "FGMX", "FFLX", "FELX", "FSLX"]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Core pages
  const corePages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/indices`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/portfolio`,
      lastModified: now,
      changeFrequency: "always",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/fan-tokens`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/resources`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/whitepaper`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ]

  // Individual index pages
  const indexPages: MetadataRoute.Sitemap = INDICES.filter((index) =>
    DEPLOYED_INDEX_IDS.includes(index.id),
  ).map((index) => ({
    url: `${SITE_URL}/indices/${index.symbol ?? index.id}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.85,
  }))

  // Individual fan token pages
  const tokenPages: MetadataRoute.Sitemap = FAN_TOKENS.map((token) => ({
    url: `${SITE_URL}/fan-tokens/${token.symbol}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.6,
  }))

  return [...corePages, ...indexPages, ...tokenPages]
}
