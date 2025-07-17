import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"

export default async function TermsOfServicePage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang)

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <main className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-8 text-white [text-shadow:0_0_20px_rgba(255,255,255,0.5)]">
            Terms of Service
          </h1>
          <div className="prose prose-invert prose-lg max-w-none text-gray-300 space-y-6">
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the FanIndex website and services, you agree to be bound by these Terms of Service
              and our Privacy Policy. If you do not agree to these terms, please do not use our services.
            </p>

            <h2 className="text-2xl font-bold text-white">2. Description of Service</h2>
            <p>
              FanIndex provides a platform that allows users to invest in curated baskets of Fan Tokens ("Indexes").
              These services are provided on an "as is" and "as available" basis. We do not provide financial advice.
            </p>

            <h2 className="text-2xl font-bold text-white">3. Investment Risks</h2>
            <p>
              You acknowledge that investing in Fan Tokens and other digital assets involves significant risk. The value
              of your investments can go up as well as down, and you may lose all of your invested capital. You should
              not invest more than you can afford to lose. FanIndex is not responsible for any financial losses you may
              incur.
            </p>

            <h2 className="text-2xl font-bold text-white">4. User Obligations</h2>
            <p>You agree to the following:</p>
            <ul>
              <li>You are responsible for the security of your wallet and private keys.</li>
              <li>You will not use our services for any illegal activities.</li>
              <li>You are responsible for complying with all applicable laws in your jurisdiction.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white">5. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, in no event will FanIndex, its affiliates, directors,
              or employees be liable for any indirect, incidental, special, consequential or punitive damages, including
              without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your
              access to or use of or inability to access or use the service.
            </p>

            <h2 className="text-2xl font-bold text-white">6. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will
              provide notice of any changes by posting the new Terms of Service on this page.
            </p>

            <h2 className="text-2xl font-bold text-white">7. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at: contact@fanindex.pro</p>
          </div>
        </div>
      </main>
    </div>
  )
}
