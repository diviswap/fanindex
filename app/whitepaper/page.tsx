import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs sm:text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Image
              src="https://ipfs.io/ipfs/bafkreiey234lbopsftismqsmyqne6nyfgmold4nn3mbq2eec6hku3iyasi"
              alt="FanIndex Logo"
              width={28}
              height={28}
              className="rounded-lg sm:w-8 sm:h-8"
            />
            <span className="text-lg sm:text-xl font-bold">FanIndex</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          {/* Title */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">FanIndex Whitepaper</h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Transforming Fan Tokens into Structured Financial Instruments
            </p>
          </div>

          {/* Executive Summary */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-success">1. Executive Summary</h2>
            <div className="space-y-3 sm:space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
              <p>
                FanIndex is a decentralized investment platform designed to transform Fan Tokens from simple utility
                assets into structured financial instruments. By introducing index-based products, FanIndex enables
                investors to gain diversified exposure to the Fan Token market through a single transaction.
              </p>
              <p>
                Each index is represented by a unique NFT, which certifies ownership and provides a transparent,
                verifiable record of the investment on-chain. This model not only simplifies access to Fan Tokens but
                also enhances liquidity across the ecosystem: every purchase is automatically distributed among the
                official liquidity pools of the underlying tokens, generating organic trading volume on the Chiliz
                Chain.
              </p>
              <p>FanIndex offers three types of indices:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">Weighted Index</strong> – Tokens allocated proportionally based on
                  liquidity or market capitalization.
                </li>
                <li>
                  <strong className="text-foreground">Equal-Weight Index</strong> – Equal allocation, one Fan Token per
                  team.
                </li>
                <li>
                  <strong className="text-foreground">Managed Index</strong> – Actively managed by the FanIndex team
                  under custody, allowing dynamic adjustments to market conditions.
                </li>
              </ul>
              <p>
                The initial suite of indices covers thematic categories such as the Champions League, Premier League, La
                Liga, and Esports Teams, with expansion planned to include all organizations that have issued Fan
                Tokens.
              </p>
              <p>
                By bridging the worlds of sports fandom and decentralized finance, FanIndex introduces a new layer of
                financial utility, strengthens on-chain activity, and creates a gateway for both fans and investors to
                participate in the growth of the Fan Token economy.
              </p>
            </div>
          </section>

          {/* Market Context */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-success">2. Market Context</h2>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                  2.1 Fan Tokens and the Chiliz Ecosystem
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Fan Tokens, pioneered by Chiliz and Socios.com, are digital assets that allow fans to engage with
                  their favorite sports teams, leagues, and entertainment organizations. Holders can participate in
                  polls, access exclusive rewards, and unlock unique experiences. As of today, more than 80
                  organizations across football, esports, motorsports, and other industries have launched Fan Tokens.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">2.2 Market Limitations</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  <li>
                    <strong className="text-foreground">Fragmented Exposure</strong> – Investors must buy and manage
                    individual Fan Tokens, which can be inefficient and time-consuming.
                  </li>
                  <li>
                    <strong className="text-foreground">Low Financial Integration</strong> – Fan Tokens are rarely
                    considered by traders and portfolio managers due to the absence of structured products.
                  </li>
                  <li>
                    <strong className="text-foreground">Liquidity Concentration</strong> – Trading is often limited to
                    single pools, leading to low organic volume across the ecosystem.
                  </li>
                  <li>
                    <strong className="text-foreground">Volatility</strong> – Single-token exposure carries higher risk,
                    discouraging broader adoption.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">2.3 The Opportunity</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  The global sports industry is valued at over $600 billion annually, with an expanding overlap into
                  digital assets and Web3. Fan Tokens represent the first scalable attempt to tokenize fandom, yet they
                  remain underutilized as financial instruments.
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  By introducing index-based investment products, FanIndex addresses these limitations by:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  <li>Creating diversified exposure to multiple Fan Tokens.</li>
                  <li>Providing a gateway for investors to participate in the sports token economy.</li>
                  <li>Driving organic liquidity and trading volume across all official pools.</li>
                  <li>
                    Strengthening the financial narrative of Fan Tokens, making them attractive beyond fan engagement.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* FanIndex Platform */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-success">3. FanIndex Platform</h2>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">3.1 What is FanIndex?</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  FanIndex is a decentralized platform that allows investors to gain exposure to baskets of Fan Tokens
                  through thematic indices. Instead of purchasing individual tokens, users acquire an NFT that
                  represents ownership of the index, providing a seamless and transparent entry point into the
                  ecosystem.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">3.2 Core Features</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  <li>
                    <strong className="text-foreground">On-Chain Transparency</strong> – All trades are executed on the
                    Chiliz Chain.
                  </li>
                  <li>
                    <strong className="text-foreground">NFT Representation</strong> – Each investment is tokenized as an
                    NFT that certifies ownership and can be transferred or redeemed.
                  </li>
                  <li>
                    <strong className="text-foreground">Automated Distribution</strong> – Purchases are automatically
                    allocated across all underlying Fan Tokens via their official liquidity pools.
                  </li>
                  <li>
                    <strong className="text-foreground">Liquidity Creation</strong> – Every transaction generates volume
                    on-chain, strengthening the Fan Token market.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Types of Indices */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-success">4. Types of Indices</h2>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              FanIndex introduces three distinct investment models:
            </p>

            <div className="space-y-6">
              <div className="space-y-3 border-l-2 border-success/30 pl-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">1. Weighted Index</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  <li>Tokens are allocated proportionally based on market capitalization.</li>
                  <li>Provides exposure aligned with market dynamics.</li>
                </ul>
              </div>

              <div className="space-y-3 border-l-2 border-success/30 pl-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">2. Equal-Weight Index</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  <li>Each Fan Token receives the same allocation, regardless of market cap.</li>
                  <li>Democratizes exposure across teams and organizations.</li>
                </ul>
              </div>

              <div className="space-y-3 border-l-2 border-success/30 pl-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">3. Managed Index</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  <li>Actively managed by the FanIndex team under custody.</li>
                  <li>Dynamic portfolio adjustments based on market conditions, performance, and strategy.</li>
                  <li>Designed for investors seeking professional management and tactical allocation.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-success">5. Use Cases & Benefits</h2>
            <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
              <li>
                <strong className="text-foreground">Diversified Exposure</strong> – Reduce volatility by holding a
                basket of Fan Tokens.
              </li>
              <li>
                <strong className="text-foreground">Financial Utility</strong> – Transform Fan Tokens into structured,
                investment-grade products.
              </li>
              <li>
                <strong className="text-foreground">Liquidity Growth</strong> – Each index purchase distributes trades
                across multiple pools, generating organic on-chain volume.
              </li>
              <li>
                <strong className="text-foreground">Investor Accessibility</strong> – Lower barriers to entry for
                traders, fans, and institutions.
              </li>
              <li>
                <strong className="text-foreground">Fan Engagement Upgrade</strong> – Support teams while also gaining
                financial exposure.
              </li>
            </ul>
          </section>

          {/* Example Indices */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-success">6. Example Indices</h2>
            <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
              <li>
                <strong className="text-foreground">Champions League Index</strong> – Exposure to all clubs competing in
                UEFA Champions League with Fan Tokens.
              </li>
              <li>
                <strong className="text-foreground">Premier League Index</strong> – Basket of all Premier League clubs
                with Fan Tokens.
              </li>
              <li>
                <strong className="text-foreground">La Liga Index</strong> – Spanish football clubs represented in La
                Liga.
              </li>
              <li>
                <strong className="text-foreground">Esports Teams Index</strong> – Covering esports organizations that
                have launched Fan Tokens.
              </li>
              <li>
                <strong className="text-foreground">Future Expansions</strong> – Serie A, NBA, NFL, motorsports, and
                other verticals as adoption grows.
              </li>
            </ul>
          </section>

          {/* Technical Architecture */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-success">7. Technical Architecture</h2>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">7.1 Smart Contracts</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  <li>FanIndex operates through audited smart contracts deployed on the Chiliz Chain.</li>
                  <li>
                    Contracts handle index creation, token purchases, NFT minting, and distribution across liquidity
                    pools.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">7.2 NFT Representation</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  <li>Each investment position is represented by an ERC-721 NFT.</li>
                  <li>The NFT contains metadata with the index type, allocation, and ownership.</li>
                  <li>Redeemable at any time for the underlying assets or equivalent market value.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">7.3 Buy/Sell Mechanism</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  <li>
                    <strong className="text-foreground">Buy</strong> – User deposits CHZ or stablecoins → Smart contract
                    purchases Fan Tokens proportionally across all pools → NFT minted as proof of ownership.
                  </li>
                  <li>
                    <strong className="text-foreground">Sell/Redeem</strong> – User burns NFT → Contract sells or
                    redistributes tokens → Proceeds returned to user.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">7.4 Security</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  <li>All contracts are subject to third-party security audits.</li>
                  <li>Non-custodial design for Weighted and Equal indices.</li>
                  <li>Managed indices use custodial logic under multisig governance for active management.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Tokenomics */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-success">8. Tokenomics & Fees</h2>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">8.1 Fee Structure</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  <li>
                    <strong className="text-foreground">Entry Fee</strong> – 1% applied at purchase, distributed to
                    platform sustainability and community incentives.
                  </li>
                  <li>
                    <strong className="text-foreground">Exit Fee</strong> – 0% (no exit fee).
                  </li>
                  <li>
                    <strong className="text-foreground">Management Fee (Managed Indices only)</strong> – 1–2%
                    annualized, covering strategy and operational costs.
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">8.2 Revenue Distribution</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  <li>
                    <strong className="text-foreground">Protocol Treasury</strong> – For development, audits, and
                    platform growth.
                  </li>
                  <li>
                    <strong className="text-foreground">Community Rewards</strong> – Potential staking or reward
                    mechanisms for long-term users.
                  </li>
                  <li>
                    <strong className="text-foreground">Buyback Programs</strong> – Treasury allocation for supporting
                    liquidity or index growth.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Roadmap */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-success">9. Roadmap</h2>

            <div className="space-y-6">
              <div className="space-y-3 border-l-2 border-success/30 pl-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">Phase 1 – Foundation</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  <li>Smart contract development & audits.</li>
                  <li>Launch of Weighted and Equal indices.</li>
                  <li>Initial release: Champions League, Premier League, La Liga, Esports.</li>
                </ul>
              </div>

              <div className="space-y-3 border-l-2 border-success/30 pl-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">Phase 2 – Expansion</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  <li>Launch of Managed indices with custody.</li>
                  <li>Integration with DeFi tools (lending, staking).</li>
                  <li>Cross-promotion with Chiliz ecosystem partners.</li>
                </ul>
              </div>

              <div className="space-y-3 border-l-2 border-success/30 pl-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">Phase 3 – Global Adoption</h3>
                <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  <li>Expansion to new leagues and sports verticals.</li>
                  <li>DAO-driven governance for index creation.</li>
                  <li>Potential cross-chain deployment.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Governance */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-success">10. Governance & Community</h2>
            <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
              <li>
                Future implementation of a FanIndex DAO to govern:
                <ul className="list-disc list-inside space-y-2 ml-8 mt-2">
                  <li>Selection of new indices.</li>
                  <li>Adjustments to weighting methodologies.</li>
                  <li>Allocation of treasury funds.</li>
                </ul>
              </li>
              <li>Governance tokens may be introduced to align incentives between users, investors, and developers.</li>
            </ul>
          </section>

          {/* Risks */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-success">11. Risks & Mitigation</h2>
            <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
              <li>
                <strong className="text-foreground">Market Volatility</strong> – Diversification reduces risk, but Fan
                Tokens remain speculative assets.
              </li>
              <li>
                <strong className="text-foreground">Liquidity Fragmentation</strong> – Automated distribution ensures
                balanced activity across pools.
              </li>
              <li>
                <strong className="text-foreground">Regulatory Considerations</strong> – Compliance with evolving
                digital asset regulations.
              </li>
              <li>
                <strong className="text-foreground">Smart Contract Risk</strong> – Audits and bug bounty programs
                mitigate technical vulnerabilities.
              </li>
            </ul>
          </section>

          {/* Conclusion */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-success">12. Conclusion</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
              <p>
                FanIndex represents a breakthrough in the sports token economy by transforming Fan Tokens into
                structured financial instruments. Through innovative index products represented as NFTs, FanIndex offers
                investors diversified exposure, generates organic on-chain liquidity, and strengthens the financial
                narrative of the Chiliz ecosystem.
              </p>
              <p>
                By bridging sports fandom with decentralized finance, FanIndex positions itself as the first ETF-like
                platform for Fan Tokens, unlocking new opportunities for fans, traders, and institutions worldwide.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
