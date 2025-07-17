import { getDictionary } from "@/lib/get-dictionary"
import type { Locale } from "@/i18n-config"

export default async function PrivacyPolicyPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang)

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <main className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-8 text-white [text-shadow:0_0_20px_rgba(255,255,255,0.5)]">
            Privacy Policy
          </h1>
          <div className="prose prose-invert prose-lg max-w-none text-gray-300 space-y-6">
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
            <p>
              Welcome to FanIndex. We are committed to protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>

            <h2 className="text-2xl font-bold text-white">2. Information We Collect</h2>
            <p>
              We may collect information about you in a variety of ways. The information we may collect on the Site
              includes:
            </p>
            <ul>
              <li>
                <strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain
                personally identifiable information that can be used to contact or identify you. This may include, but
                is not limited to, your email address.
              </li>
              <li>
                <strong>Blockchain Data:</strong> We may collect publicly available blockchain data, such as your wallet
                address and transaction history on the Chiliz network, to provide our services.
              </li>
              <li>
                <strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used.
                This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP
                address), browser type, browser version, the pages of our Service that you visit, the time and date of
                your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-white">3. How We Use Your Information</h2>
            <p>
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized
              experience. Specifically, we may use information collected about you via the Site to:
            </p>
            <ul>
              <li>Create and manage your account.</li>
              <li>Provide and maintain our Service.</li>
              <li>Monitor the usage of our Service.</li>
              <li>Detect, prevent and address technical issues.</li>
              <li>Notify you about changes to our Service.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white">4. Security of Your Information</h2>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal
              information. While we have taken reasonable steps to secure the personal information you provide to us,
              please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method
              of data transmission can be guaranteed against any interception or other type of misuse.
            </p>

            <h2 className="text-2xl font-bold text-white">5. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>

            <h2 className="text-2xl font-bold text-white">6. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at: contact@fanindex.pro</p>
          </div>
        </div>
      </main>
    </div>
  )
}
