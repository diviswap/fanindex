import { Web3Provider } from "@/lib/web3/Web3Provider"

// The Web3Provider lives here so it is never unmounted when the locale segment
// changes. Wagmi config + QueryClient persist across locale navigations, which
// keeps the wallet connected when the user switches language.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <Web3Provider>{children}</Web3Provider>
}
