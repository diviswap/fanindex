import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Portfolio",
  description:
    "Track and manage your FanIndex positions. View real-time performance, holdings breakdown, and redeem your fan token index investments on Chiliz Chain.",
  openGraph: {
    title: "My Portfolio | FanIndex",
    description:
      "Track your fan token index investments with real-time analytics. Manage FTLX, FGMX, FFLX, FELX, FSLX positions.",
    url: "/portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Portfolio | FanIndex",
    description:
      "Track your fan token index investments with real-time analytics on Chiliz Chain.",
  },
  alternates: {
    canonical: "/portfolio",
  },
}

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
