import { ChevronRight } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Terms of Service | FanIndex",
  description: "Terms of service for FanIndex platform",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="space-y-8">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using the FanIndex website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Use License</h2>
              <p className="text-muted-foreground leading-relaxed">
                Permission is granted to temporarily download one copy of the materials (information or software) on FanIndex for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile, disassemble, or reverse engineer any software contained on the site</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transmitting the materials to anyone or storing it on any network server</li>
                <li>Using automated tools or scripts to access the platform</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials on FanIndex are provided on an 'as is' basis. FanIndex makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Limitations</h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall FanIndex or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption,) arising out of the use or inability to use the materials on FanIndex, even if FanIndex or a FanIndex authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Accuracy of Materials</h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials appearing on FanIndex could include technical, typographical, or photographic errors. FanIndex does not warrant that any of the materials on its website are accurate, complete, or current. FanIndex may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Limitations on Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your use of FanIndex and its services is at your own risk. To the fullest extent permitted by law, FanIndex disclaims all warranties, express or implied, in connection with the site and your use thereof.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at legal@fanindex.pro
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
