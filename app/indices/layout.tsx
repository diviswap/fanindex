import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fan Token Indices",
  description:
    "Browse all FanIndex indices: FTLX (Leaders), FGMX (Gaming), FFLX (Fight), FELX (English League), FSLX (Spanish League). Diversified fan token investment on Chiliz Chain.",
  openGraph: {
    title: "Fan Token Indices | FanIndex",
    description:
      "Explore FTLX, FGMX, FFLX, FELX, FSLX — diversified fan token indices covering football, esports, and combat sports on Chiliz.",
    url: "/indices",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fan Token Indices | FanIndex",
    description:
      "Explore FTLX, FGMX, FFLX, FELX, FSLX — diversified fan token indices on Chiliz Chain.",
  },
  alternates: {
    canonical: "/indices",
  },
}

export default function IndicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
