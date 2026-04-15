import { ChevronRight } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Privacy Policy | FanIndex",
  description: "Privacy policy for FanIndex platform",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="space-y-8">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                FanIndex ("we," "our," or "us") operates the fanindex.pro website and related services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                We collect information you provide directly to us, such as:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Wallet address and blockchain transaction data</li>
                <li>Email address (if you opt-in for communications)</li>
                <li>Usage data and analytics</li>
                <li>Device information and browser data</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Provide and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Respond to your inquiries and requests</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Comply with legal obligations</li>
                <li>Analyze usage patterns to enhance user experience</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Blockchain Transparency</h2>
              <p className="text-muted-foreground leading-relaxed">
                Please be aware that transactions on the Chiliz Chain and other blockchain networks are public and transparent. Any information recorded on the blockchain is permanently visible to all network participants.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at privacy@fanindex.pro
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
