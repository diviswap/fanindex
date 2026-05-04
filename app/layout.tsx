// This root layout is intentionally minimal.
// All actual layout logic (providers, fonts, metadata) lives in app/[locale]/layout.tsx
// The middleware handles locale detection and redirects.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
