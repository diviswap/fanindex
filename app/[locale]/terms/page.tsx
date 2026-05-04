import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Footer } from "@/components/ui/footer-section"

export const metadata = {
  title: "Terms of Service | FanIndex",
  description: "Terms of service and legal disclosures for the FanIndex platform.",
}

const SECTIONS = [
  {
    id: "agreement",
    title: "1. Agreement to Terms",
    content: (
      <>
        <p>
          By accessing and using the FanIndex website, platform, and services (collectively, the
          &quot;Platform&quot;), you accept and agree to be bound by these Terms of Service and all
          applicable laws and regulations. If you do not agree with any of these terms, you are prohibited
          from using or accessing this Platform.
        </p>
        <p>
          These terms apply to all users of the Platform, including investors, visitors, and any other
          persons who access or use the service.
        </p>
      </>
    ),
  },
  {
    id: "platform",
    title: "2. Platform Description",
    content: (
      <>
        <p>
          FanIndex is a decentralized SportFi infrastructure platform built on the Chiliz Chain. The
          Platform enables users to gain diversified exposure to Fan Token ecosystems through
          professionally structured, tokenized index products.
        </p>
        <p>FanIndex provides the following core services:</p>
        <ul>
          <li>Tokenized sports indices composed of Fan Tokens</li>
          <li>On-chain portfolio infrastructure and position tracking</li>
          <li>Fan Token market analytics and real-time price data</li>
          <li>NFT-based investment position certificates</li>
          <li>Transparent on-chain index methodologies</li>
        </ul>
        <p>
          All index operations, including purchases and redemptions, are executed transparently on the
          Chiliz Chain via smart contracts. The Platform does not custody assets in a traditional
          financial sense — all positions are held on-chain and represented by NFTs.
        </p>
      </>
    ),
  },
  {
    id: "investment-process",
    title: "3. Investment Process",
    content: (
      <>
        <p>
          When a user invests in a FanIndex product, the following process occurs automatically via
          smart contract:
        </p>
        <ul>
          <li>CHZ is deposited into the protocol by the user</li>
          <li>Smart contracts execute proportional purchases of the underlying Fan Tokens</li>
          <li>Fan Tokens are held by the protocol treasury on-chain</li>
          <li>A unique NFT representing the position is minted to the investor&apos;s wallet</li>
        </ul>
        <p>
          Redemptions are processed by burning the position NFT, after which the underlying portfolio
          is liquidated and CHZ is returned to the investor. There is no exit fee on redemptions.
        </p>
        <p>
          A 1% protocol entry fee is applied to all purchases. Actively managed index products may carry
          an additional annualized management fee of 1–2% as disclosed on the relevant product page.
        </p>
      </>
    ),
  },
  {
    id: "index-methodology",
    title: "4. Index Methodology",
    content: (
      <>
        <p>
          FanIndex indices are constructed using a transparent, rules-based methodology. The value of
          each index is calculated using a weighted pricing model applied to real-time market prices
          sourced from CoinGecko and other market data providers.
        </p>
        <p>
          Indices may be structured as market-cap weighted, equal-weight, or actively managed products.
          The applicable methodology is disclosed on each product&apos;s individual page.
        </p>
        <p>
          Indices are periodically rebalanced to maintain target allocations. Rebalancing is currently
          executed manually by the FanIndex team. Future protocol versions may introduce automated
          smart contract rebalancing and DAO governance mechanisms.
        </p>
        <p>
          FanIndex reserves the right to update index methodologies, add or remove constituents, and
          adjust rebalancing schedules in accordance with market conditions and protocol improvements.
          Material changes will be disclosed to users.
        </p>
      </>
    ),
  },
  {
    id: "risks",
    title: "5. Risk Disclosures",
    content: (
      <>
        <p>
          Investing in Fan Token indices involves significant risk. You should carefully consider the
          following risk factors before using the Platform:
        </p>
        <ul>
          <li>
            <strong>Market Volatility.</strong> Fan Tokens are highly volatile digital assets. The value
            of index positions may fluctuate substantially and may decline to zero. Past performance is
            not indicative of future results.
          </li>
          <li>
            <strong>Liquidity Risk.</strong> Some Fan Tokens within an index may experience periods of
            low liquidity, which may affect the ability to rebalance or redeem positions at expected
            prices.
          </li>
          <li>
            <strong>Smart Contract Risk.</strong> Despite security audits and multisig treasury
            management, smart contracts may contain vulnerabilities. The use of blockchain infrastructure
            carries inherent technical risks including bugs, exploits, and protocol failures.
          </li>
          <li>
            <strong>Regulatory Risk.</strong> Digital asset regulations continue to evolve globally.
            Changes in applicable laws may impact the availability of FanIndex services in certain
            jurisdictions.
          </li>
          <li>
            <strong>Concentration Risk.</strong> Individual index products are concentrated in the Fan
            Token ecosystem and are not diversified across broader asset classes.
          </li>
        </ul>
        <p>
          You should only invest amounts you can afford to lose entirely. FanIndex does not provide
          investment advice, and nothing on the Platform constitutes a recommendation to invest.
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "6. User Eligibility",
    content: (
      <>
        <p>
          By using the Platform, you represent and warrant that you are of legal age in your jurisdiction
          to enter into binding contracts, and that your use of the Platform does not violate any
          applicable laws or regulations in your jurisdiction.
        </p>
        <p>
          The Platform is not available to persons located in jurisdictions where decentralized finance
          products, digital assets, or blockchain-based financial instruments are restricted or
          prohibited. You are solely responsible for ensuring compliance with local laws.
        </p>
        <p>
          FanIndex reserves the right to restrict access to the Platform in any jurisdiction at any
          time without prior notice.
        </p>
      </>
    ),
  },
  {
    id: "nft-positions",
    title: "7. NFT Position Certificates",
    content: (
      <>
        <p>
          Each investment position in a FanIndex product is represented by a unique NFT minted to your
          wallet. The NFT contains the following on-chain data:
        </p>
        <ul>
          <li>Index type and identifier</li>
          <li>Deposited CHZ value</li>
          <li>Proportional allocation data at time of purchase</li>
          <li>Mint timestamp and ownership information</li>
        </ul>
        <p>
          The NFT acts as proof of ownership, a portfolio certificate, and a redeemable claim on the
          underlying assets. Transfer of the NFT constitutes transfer of the underlying position.
          FanIndex is not responsible for NFTs transferred, sold, or lost by users.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "8. Intellectual Property",
    content: (
      <>
        <p>
          All content on the FanIndex Platform, including but not limited to index methodologies, brand
          assets, interface designs, documentation, and software, is the proprietary intellectual
          property of FanIndex and its licensors.
        </p>
        <p>
          Permission is granted to access and use the Platform for personal, non-commercial purposes
          only. You may not reproduce, distribute, modify, create derivative works from, or commercially
          exploit any part of the Platform without express written permission.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "9. Disclaimers",
    content: (
      <>
        <p>
          The Platform and its services are provided on an &quot;as is&quot; and &quot;as
          available&quot; basis without warranties of any kind, whether express or implied. FanIndex
          expressly disclaims all warranties, including but not limited to implied warranties of
          merchantability, fitness for a particular purpose, and non-infringement.
        </p>
        <p>
          FanIndex does not warrant that the Platform will be uninterrupted, error-free, secure, or
          free of viruses. Market data displayed on the Platform is sourced from third parties and may
          be delayed, inaccurate, or incomplete. FanIndex does not guarantee the accuracy or
          completeness of any price data or analytics.
        </p>
        <p>
          Nothing on the Platform constitutes financial, investment, legal, or tax advice. You should
          consult independent professional advisers before making any investment decisions.
        </p>
      </>
    ),
  },
  {
    id: "limitation",
    title: "10. Limitation of Liability",
    content: (
      <>
        <p>
          To the fullest extent permitted by applicable law, FanIndex, its founders, contributors,
          partners, and affiliates shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages, including but not limited to loss of funds, loss of data,
          loss of profits, or business interruption, arising from your use of or inability to use the
          Platform.
        </p>
        <p>
          In no event shall the total liability of FanIndex to any user exceed the fees paid by that
          user to the protocol in the twelve months preceding the event giving rise to the claim.
        </p>
      </>
    ),
  },
  {
    id: "governance",
    title: "11. Protocol Governance",
    content: (
      <>
        <p>
          FanIndex plans to introduce decentralized governance mechanisms in future protocol versions,
          allowing the community to participate in index proposals, methodology adjustments, treasury
          decisions, and ecosystem expansion.
        </p>
        <p>
          Governance infrastructure may evolve into a DAO model. Until such mechanisms are deployed,
          all protocol decisions are made by the FanIndex team. Users acknowledge that protocol
          parameters, fees, and index compositions may change through governance or team decisions.
        </p>
      </>
    ),
  },
  {
    id: "modifications",
    title: "12. Modifications to Terms",
    content: (
      <>
        <p>
          FanIndex reserves the right to modify these Terms of Service at any time. Updated terms will
          be posted to this page with a revised effective date. Continued use of the Platform following
          any modification constitutes acceptance of the updated terms.
        </p>
        <p>
          It is your responsibility to review these terms periodically. Material changes to terms that
          affect user rights will be communicated through the Platform or official communication
          channels.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "13. Contact",
    content: (
      <>
        <p>
          If you have any questions, concerns, or legal inquiries regarding these Terms of Service or
          the FanIndex Platform, please contact us at:
        </p>
        <p>
          <a href="mailto:legal@fanindex.pro" className="text-success hover:underline">
            legal@fanindex.pro
          </a>
        </p>
      </>
    ),
  },
]

export default function TermsPage() {
  return (
    <div className="relative flex w-full flex-col min-h-screen bg-background">
      <NavBar />

      <main className="relative z-10 w-full flex-1">
        {/* Hero */}
        <section className="relative w-full border-b border-border/40 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 0%, color-mix(in oklch, var(--success) 8%, transparent), transparent 70%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-success/40 to-transparent"
          />

          <div className="mx-auto max-w-4xl px-6 sm:px-8 pt-36 pb-16 sm:pt-44 sm:pb-20">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to home
            </Link>

            <div className="inline-flex items-center gap-2.5 rounded-full border border-success/25 bg-success/[0.06] px-3.5 py-1.5 backdrop-blur mb-7">
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-foreground/90">
                Legal
              </span>
            </div>

            <h1 className="text-balance text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] text-foreground mb-4">
              Terms of{" "}
              <span className="text-success">Service</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-3">
              Last updated:{" "}
              <time dateTime="2025-01-01">January 1, 2025</time>
            </p>
          </div>
        </section>

        {/* Table of contents + body */}
        <section className="relative w-full py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-6 sm:px-8">

            {/* Table of contents */}
            <nav aria-label="Table of contents" className="mb-16 rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8 backdrop-blur">
              <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-success mb-5">
                Contents
              </div>
              <ol className="space-y-2">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Sections */}
            <div className="space-y-16">
              {SECTIONS.map((s) => (
                <article
                  key={s.id}
                  id={s.id}
                  className="scroll-mt-28 border-b border-border/40 pb-16 last:border-0 last:pb-0"
                >
                  <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mb-6">
                    {s.title}
                  </h2>
                  <div className="space-y-4 text-sm leading-relaxed text-muted-foreground [&_ul]:mt-3 [&_ul]:space-y-2.5 [&_ul]:pl-5 [&_ul]:list-disc [&_strong]:text-foreground [&_strong]:font-semibold [&_a]:text-success [&_a:hover]:underline">
                    {s.content}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
