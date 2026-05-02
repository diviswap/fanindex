"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"

const faqItems = [
  {
    q: "How do indices work on FanIndex?",
    a: "FanIndex indices are collections of carefully selected crypto assets with weighted allocations. Each index tracks the combined value of its constituents and rebalances monthly to maintain target weights. Positions are backed by NFTs representing verifiable ownership.",
  },
  {
    q: "What are the fees?",
    a: "Entry Fee: 1% when buying in. Exit Fee: 0%. Management Fee: Only for managed indices (1-2% annually). Weighted and equal-weight indices have no management fees. Performance Fee: 20% of gains above benchmark (for managed indices only). All fees are transparent and deducted automatically.",
  },
  {
    q: "How often are indices rebalanced?",
    a: "Indices rebalance monthly on a set schedule. Rebalancing ensures allocations stay true to targets and removes underperforming assets. You're notified before each rebalancing, and all transactions are recorded on-chain.",
  },
  {
    q: "Is FanIndex secure?",
    a: "Yes. All smart contracts are independently audited. We use multi-signature wallets for treasury management and Chainlink oracles for price feeds. Your NFT positions represent real on-chain ownership backed by underlying assets.",
  },
  {
    q: "Can I withdraw anytime?",
    a: "Yes, you can withdraw instantly anytime with zero exit fees. Redeem your position and receive CHZ or Fan tokens according to your preference. Withdrawals are processed immediately on-chain. No lockup period or restrictions.",
  },
  {
    q: "What is the minimum investment?",
    a: "The minimum investment is 100 CHZ. There's no maximum limit. You can buy fractional positions of any index.",
  },
  {
    q: "Can I create my own custom index?",
    a: "Not yet. Custom index creation is planned for a future release. Currently, you can invest in pre-built indices created by FanIndex. We're working on enabling community-created indices, which will allow you to design and share custom allocations.",
  },
  {
    q: "How are index prices determined?",
    a: "Index prices (NAV) are calculated using the formula: NAV = Σ(wᵢ × Pᵢ), where wᵢ is the weight of asset i and Pᵢ is its current price in CHZ. Prices update in real-time with market data.",
  },
]

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="w-full text-left group border border-border bg-card/50 backdrop-blur-sm rounded-lg p-6 hover:border-success/30 hover:bg-card transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold text-foreground group-hover:text-success transition-colors">
          {q}
        </h3>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-border/30">
          <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
        </div>
      )}
    </button>
  )
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="space-y-8">
      <div className="space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Frequently Asked Questions</h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Can't find the answer you're looking for? Contact our support team.
        </p>
      </div>

      <div className="space-y-3">
        {faqItems.map((item, idx) => (
          <FAQItem
            key={idx}
            q={item.q}
            a={item.a}
            isOpen={openIndex === idx}
            onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
          />
        ))}
      </div>
    </section>
  )
}
