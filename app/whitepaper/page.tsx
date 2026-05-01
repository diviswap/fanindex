import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Footer } from "@/components/ui/footer-section"

export const metadata = {
  title: "Whitepaper v2 | FanIndex",
  description:
    "FanIndex Whitepaper v2 — The Index Layer for Fan Tokens. Decentralized SportFi infrastructure built on the Chiliz Chain.",
}

const SECTIONS = [
  {
    id: "executive-summary",
    title: "1. Executive Summary",
    content: (
      <>
        <p>
          FanIndex is a decentralized SportFi infrastructure platform built on the Chiliz Chain that
          transforms Fan Tokens into structured, index-based financial products.
        </p>
        <p>
          Instead of manually buying and managing individual Fan Tokens, users can gain diversified
          exposure to entire segments of the ecosystem through professionally structured indices.
        </p>
        <p>FanIndex introduces:</p>
        <ul>
          <li>Tokenized sports indices</li>
          <li>On-chain portfolio infrastructure</li>
          <li>Fan Token analytics</li>
          <li>NFT-based investment positions</li>
          <li>Transparent index methodologies</li>
        </ul>
        <p>
          Each index position is represented by a unique NFT that certifies ownership of the underlying
          basket of assets.
        </p>
        <p>When users invest into an index:</p>
        <ul>
          <li>CHZ is deposited into the protocol</li>
          <li>Smart contracts execute proportional purchases of the underlying Fan Tokens</li>
          <li>Tokens are held by the protocol treasury</li>
          <li>An NFT representing the position is minted to the investor</li>
        </ul>
        <p>This model creates:</p>
        <ul>
          <li>Diversified exposure</li>
          <li>Simplified investing</li>
          <li>Continuous on-chain activity</li>
          <li>Organic liquidity generation across the Chiliz ecosystem</li>
        </ul>
        <p>FanIndex is designed to become the financial infrastructure layer for Fan Tokens.</p>
      </>
    ),
  },
  {
    id: "vision",
    title: "2. Vision",
    content: (
      <>
        <p>Fan Tokens introduced digital ownership and engagement for sports communities.</p>
        <p>FanIndex expands that model by introducing financial infrastructure around the ecosystem.</p>
        <p>Our vision is to create:</p>
        <ul>
          <li>The benchmark indices of the Fan Token market</li>
          <li>The portfolio infrastructure for SportFi investors</li>
          <li>The analytics layer for Fan Token capital markets</li>
          <li>The gateway between sports fandom and decentralized finance</li>
        </ul>
        <p>
          FanIndex aims to make Fan Tokens investable, trackable, and structurally accessible for both
          retail and institutional participants.
        </p>
      </>
    ),
  },
  {
    id: "market-context",
    title: "3. Market Context",
    content: (
      <>
        <h3>3.1 The Rise of Fan Tokens</h3>
        <p>
          Fan Tokens, pioneered by Chiliz and Socios.com, created a new category of blockchain-based
          sports assets.
        </p>
        <p>Today:</p>
        <ul>
          <li>80+ organizations have launched Fan Tokens</li>
          <li>Billions in cumulative trading volume have been generated</li>
          <li>
            Global clubs, national teams, esports organizations, and combat sports brands participate
            in the ecosystem
          </li>
        </ul>
        <p>
          Fan Tokens established the foundation for SportFi. However, financial infrastructure around
          these assets remains extremely limited.
        </p>

        <h3>3.2 Market Limitations</h3>
        <ul>
          <li>
            <strong>Fragmented Exposure.</strong> Investors must manually purchase and manage multiple
            individual Fan Tokens.
          </li>
          <li>
            <strong>Lack of Structured Products.</strong> There are currently no benchmark indices or
            diversified financial instruments for the ecosystem.
          </li>
          <li>
            <strong>Limited Portfolio Infrastructure.</strong> Most platforms focus exclusively on
            trading rather than portfolio construction and analytics.
          </li>
          <li>
            <strong>Volatility Concentration.</strong> Single-token exposure creates significant
            volatility and risk concentration.
          </li>
          <li>
            <strong>Underdeveloped Capital Markets.</strong> Fan Tokens have engagement utility but
            limited financial infrastructure.
          </li>
        </ul>

        <h3>3.3 The Opportunity</h3>
        <p>Traditional finance evolved through ETFs, indices, portfolio products, and structured exposure. Crypto adopted these concepts across DeFi, Layer 1 ecosystems, AI tokens, and meme indices.</p>
        <p>
          Fan Tokens remain one of the last major crypto verticals without index infrastructure.
          FanIndex fills that gap.
        </p>
      </>
    ),
  },
  {
    id: "platform",
    title: "4. The FanIndex Platform",
    content: (
      <>
        <h3>4.1 What is FanIndex?</h3>
        <p>FanIndex is a decentralized platform for:</p>
        <ul>
          <li>Investing in Fan Token indices</li>
          <li>Tracking portfolio positions</li>
          <li>Analyzing the Fan Token market</li>
          <li>Accessing structured SportFi exposure</li>
        </ul>
        <p>The platform combines index products, NFT portfolio infrastructure, market analytics, and on-chain transparency into a single ecosystem.</p>

        <h3>4.2 Core Platform Features</h3>
        <ul>
          <li>
            <strong>Tokenized Indices.</strong> Structured baskets of Fan Tokens grouped by theme,
            geography, category, or strategy.
          </li>
          <li>
            <strong>NFT-Based Positions.</strong> Every investment position is represented by an NFT.
          </li>
          <li>
            <strong>Portfolio Tracking.</strong> Users can monitor positions, allocations, exposure, and
            performance directly on-chain.
          </li>
          <li>
            <strong>Fan Token Analytics.</strong> Real-time market data including price, market cap,
            volume, circulating supply, and performance metrics for the entire Fan Token ecosystem.
          </li>
          <li>
            <strong>On-Chain Infrastructure.</strong> All transactions occur transparently on the Chiliz
            Chain.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "index-architecture",
    title: "5. Index Architecture",
    content: (
      <>
        <p>
          FanIndex indices are designed to provide diversified exposure across specific segments of the
          Fan Token market.
        </p>

        <h3>5.1 Weighted Indices</h3>
        <p>
          Weighted indices allocate assets proportionally based on market relevance. Factors may include
          market capitalization, liquidity, and ecosystem importance. These products function similarly
          to traditional market-cap weighted indices.
        </p>
        <p>
          <strong>Example — FTLX (Fan Token Leaders Index):</strong> The benchmark index of the Fan
          Token market, tracking the largest and most liquid Fan Tokens.
        </p>

        <h3>5.2 Equal-Weight Indices</h3>
        <p>
          Equal-weight indices allocate the same exposure to every constituent. This approach reduces
          concentration risk, increases diversification, and gives equal representation across
          organizations.
        </p>
        <p>
          <strong>Examples:</strong> FGMX (Fan Gaming Index), FFLX (Fan Fight Index).
        </p>

        <h3>5.3 Managed Indices (Future)</h3>
        <p>
          Managed indices introduce active portfolio management. The FanIndex team may rebalance
          dynamically, rotate exposure, and manage allocations strategically. Managed products are
          designed for advanced investors seeking tactical exposure.
        </p>
      </>
    ),
  },
  {
    id: "index-suite",
    title: "6. Current Index Suite",
    content: (
      <>
        <ul>
          <li>
            <strong>FTLX — Fan Token Leaders Index.</strong> The benchmark index of the Fan Token
            market. Tracks the largest and most liquid Fan Tokens representing the overall ecosystem.
          </li>
          <li>
            <strong>FGMX — Fan Gaming Index.</strong> An equal-weight index focused on esports
            organizations with Fan Tokens.
          </li>
          <li>
            <strong>FFLX — Fan Fight Index.</strong> An equal-weight index focused on combat sports
            organizations.
          </li>
          <li>
            <strong>FELX — Fan English League Index.</strong> Tracks leading English football clubs
            with Fan Tokens.
          </li>
          <li>
            <strong>FSLX — Fan Spanish League Index.</strong> Tracks leading Spanish football clubs
            represented in the ecosystem.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "future-expansion",
    title: "7. Future Index Expansion",
    content: (
      <>
        <p>Planned future indices include:</p>
        <ul>
          <li>Italian League Index</li>
          <li>Turkish League Index</li>
          <li>National Teams Index</li>
          <li>Brazil League Index</li>
          <li>Asia Sports Index</li>
        </ul>
        <p>Long-term expansion may include:</p>
        <ul>
          <li>Motorsports</li>
          <li>Basketball</li>
          <li>UFC / MMA</li>
          <li>Global tournaments</li>
          <li>Custom user-generated indices</li>
        </ul>
      </>
    ),
  },
  {
    id: "pricing-methodology",
    title: "8. Pricing Methodology",
    content: (
      <>
        <p>
          The value of each index is calculated using a weighted pricing model applied to real-time
          market data.
        </p>
        <p>
          <strong>Formula:</strong>
        </p>
        <div className="my-4 rounded-xl border border-border/60 bg-card/40 px-5 py-4 font-mono text-sm text-foreground">
          Index = &Sigma;(w&#8342; &times; P&#8342;)&nbsp;&nbsp;&nbsp;for i = 1 to n
        </div>
        <p>Where:</p>
        <ul>
          <li>
            <strong>w&#8342;</strong> = asset weight
          </li>
          <li>
            <strong>P&#8342;</strong> = real-time token price
          </li>
          <li>
            <strong>n</strong> = number of assets
          </li>
        </ul>
        <p>
          Market prices are sourced using live market data providers such as CoinGecko.
        </p>
      </>
    ),
  },
  {
    id: "nft-infrastructure",
    title: "9. NFT Position Infrastructure",
    content: (
      <>
        <p>Each investment position is represented by an NFT. The NFT contains:</p>
        <ul>
          <li>Index type</li>
          <li>Deposited value</li>
          <li>Allocation data</li>
          <li>Timestamp</li>
          <li>Ownership information</li>
        </ul>
        <p>The NFT acts as:</p>
        <ul>
          <li>Proof of ownership</li>
          <li>Portfolio certificate</li>
          <li>Redeemable claim on the underlying assets</li>
        </ul>
      </>
    ),
  },
  {
    id: "buy-redeem",
    title: "10. Buy & Redeem Flow",
    content: (
      <>
        <h3>Buy Flow</h3>
        <ol>
          <li>User deposits CHZ</li>
          <li>Smart contract executes proportional purchases</li>
          <li>Underlying Fan Tokens are acquired</li>
          <li>Position NFT is minted to the investor</li>
        </ol>

        <h3>Redeem Flow</h3>
        <ol>
          <li>User burns NFT</li>
          <li>Underlying portfolio is redeemed</li>
          <li>Assets are sold or redistributed</li>
          <li>CHZ is returned to the investor</li>
        </ol>
      </>
    ),
  },
  {
    id: "rebalancing",
    title: "11. Rebalancing",
    content: (
      <>
        <p>
          Indices are periodically rebalanced to maintain target allocations. Initial rebalances are
          manually executed by the team.
        </p>
        <p>Future versions may include:</p>
        <ul>
          <li>Automated smart contract rebalancing</li>
          <li>DAO governance</li>
          <li>Dynamic methodology updates</li>
        </ul>
        <p>Rebalancing aims to:</p>
        <ul>
          <li>Maintain index integrity</li>
          <li>Adjust to market changes</li>
          <li>Optimize diversification</li>
        </ul>
      </>
    ),
  },
  {
    id: "technical-architecture",
    title: "12. Technical Architecture",
    content: (
      <>
        <h3>12.1 Smart Contracts</h3>
        <p>FanIndex smart contracts manage:</p>
        <ul>
          <li>Index creation</li>
          <li>Token allocation</li>
          <li>NFT minting</li>
          <li>Portfolio accounting</li>
          <li>Redemption logic</li>
        </ul>
        <p>All contracts are deployed on the Chiliz Chain.</p>

        <h3>12.2 Security</h3>
        <p>Security measures include:</p>
        <ul>
          <li>Multisig treasury management</li>
          <li>Third-party audits</li>
          <li>Modular contract architecture</li>
          <li>Transparent on-chain execution</li>
        </ul>
      </>
    ),
  },
  {
    id: "fee-structure",
    title: "13. Fee Structure",
    content: (
      <>
        <ul>
          <li>
            <strong>Entry Fee.</strong> 1% protocol fee on purchases.
          </li>
          <li>
            <strong>Exit Fee.</strong> 0% — no exit fee.
          </li>
          <li>
            <strong>Managed Index Fee.</strong> 1–2% annualized for actively managed products.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "revenue",
    title: "14. Revenue Allocation",
    content: (
      <>
        <p>Protocol revenue may be allocated toward:</p>
        <ul>
          <li>Platform development</li>
          <li>Security audits</li>
          <li>Ecosystem incentives</li>
          <li>Liquidity support</li>
          <li>Treasury growth</li>
        </ul>
      </>
    ),
  },
  {
    id: "governance",
    title: "15. Governance",
    content: (
      <>
        <p>
          FanIndex plans future governance mechanisms allowing the community to participate in:
        </p>
        <ul>
          <li>Index proposals</li>
          <li>Methodology adjustments</li>
          <li>Treasury decisions</li>
          <li>Ecosystem expansion</li>
        </ul>
        <p>Governance infrastructure may evolve into a DAO model.</p>
      </>
    ),
  },
  {
    id: "roadmap",
    title: "16. Roadmap",
    content: (
      <>
        <h3>Phase 1 — Foundation</h3>
        <ul>
          <li>Mainnet launch</li>
          <li>Core index deployment</li>
          <li>Portfolio infrastructure</li>
          <li>Fan Token analytics</li>
        </ul>

        <h3>Phase 2 — Expansion</h3>
        <ul>
          <li>Additional regional indices</li>
          <li>Automated rebalancing</li>
          <li>DeFi integrations</li>
          <li>Enhanced analytics</li>
        </ul>

        <h3>Phase 3 — Open Infrastructure</h3>
        <ul>
          <li>User-created indices</li>
          <li>DAO governance</li>
          <li>API infrastructure</li>
          <li>Institutional tooling</li>
        </ul>
      </>
    ),
  },
  {
    id: "risks",
    title: "17. Risks",
    content: (
      <>
        <ul>
          <li>
            <strong>Market Volatility.</strong> Fan Tokens remain volatile digital assets. The value of
            index positions may fluctuate substantially. Past performance is not indicative of future
            results.
          </li>
          <li>
            <strong>Liquidity Conditions.</strong> Some Fan Tokens may experience lower liquidity,
            which may affect the ability to rebalance or redeem positions at expected prices.
          </li>
          <li>
            <strong>Smart Contract Risk.</strong> Despite audits, blockchain infrastructure carries
            technical risks including bugs, exploits, and protocol failures.
          </li>
          <li>
            <strong>Regulatory Evolution.</strong> Digital asset regulations continue evolving
            globally. Changes in applicable laws may impact the availability of FanIndex services in
            certain jurisdictions.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "conclusion",
    title: "18. Conclusion",
    content: (
      <>
        <p>
          FanIndex introduces the first dedicated index infrastructure for the Fan Token economy.
        </p>
        <p>By combining:</p>
        <ul>
          <li>Diversified exposure</li>
          <li>NFT-based ownership</li>
          <li>On-chain transparency</li>
          <li>Portfolio analytics</li>
          <li>Structured investment products</li>
        </ul>
        <p>
          FanIndex transforms Fan Tokens from isolated engagement assets into a scalable financial
          ecosystem.
        </p>
        <p>Fan Tokens unlocked digital engagement. FanIndex unlocks financial infrastructure.</p>
      </>
    ),
  },
]

export default function WhitepaperPage() {
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
                Whitepaper v2
              </span>
            </div>

            <h1 className="text-balance text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] text-foreground mb-4">
              The Index Layer for{" "}
              <span className="text-success">Fan Tokens</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mt-3 max-w-2xl leading-relaxed">
              FanIndex is the decentralized SportFi infrastructure platform that transforms Fan Tokens
              into structured, index-based financial products on the Chiliz Chain.
            </p>
          </div>
        </section>

        {/* Table of contents + body */}
        <section className="relative w-full py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-6 sm:px-8">

            {/* Table of contents */}
            <nav
              aria-label="Table of contents"
              className="mb-16 rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8 backdrop-blur"
            >
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
                  <div className="space-y-4 text-sm leading-relaxed text-muted-foreground [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3 [&_ol]:mt-3 [&_ol]:space-y-2 [&_ol]:pl-5 [&_ol]:list-decimal [&_ul]:mt-3 [&_ul]:space-y-2.5 [&_ul]:pl-5 [&_ul]:list-disc [&_strong]:text-foreground [&_strong]:font-semibold [&_a]:text-success [&_a:hover]:underline">
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
