import { ChevronRight, BookOpen, HelpCircle, FileText, ExternalLink, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Resources | FanIndex",
  description: "Documentation, guides, and resources for FanIndex",
}

export default function ResourcesPage() {
  const resources = [
    {
      title: "Getting Started",
      description: "Learn the basics of FanIndex and how to create your first index",
      icon: BookOpen,
      links: [
        { text: "What are Index Funds?", description: "Understand the fundamentals of diversified index investing" },
        { text: "Create Your First Index", description: "Step-by-step guide to building your custom index" },
        { text: "Understanding Composition", description: "Learn how index composition affects returns" },
        { text: "Portfolio Best Practices", description: "Tips for managing a successful portfolio" },
      ],
    },
    {
      title: "FAQ",
      description: "Frequently asked questions about FanIndex",
      icon: HelpCircle,
      links: [
        { text: "How do indices work?", description: "Technical overview of index mechanics and pricing" },
        { text: "What are the fees?", description: "Transparent fee structure and cost breakdown" },
        { text: "How often are indices rebalanced?", description: "Rebalancing schedule and methodology" },
        { text: "Is FanIndex secure?", description: "Security measures and audit information" },
        { text: "Can I withdraw anytime?", description: "Liquidity and withdrawal information" },
        { text: "What is the minimum investment?", description: "Entry requirements and investment limits" },
      ],
    },
    {
      title: "Technical Docs",
      description: "For developers and advanced users",
      icon: FileText,
      links: [
        { text: "Smart Contract Documentation", description: "Detailed SC architecture and function reference" },
        { text: "API Reference", description: "REST API endpoints and integration guide" },
        { text: "Webhook Integration", description: "Real-time event notifications setup" },
        { text: "Security Audit Report", description: "Third-party security audit findings" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="space-y-16">
          {/* Header */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">Resources & Documentation</h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Everything you need to understand and use FanIndex. From getting started guides to technical documentation and FAQs.
            </p>
          </div>

          {/* Main Resources Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {resources.map((section) => {
              const IconComponent = section.icon
              return (
                <div
                  key={section.title}
                  className="border border-border rounded-2xl p-6 bg-card hover:border-success/30 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-lg bg-success/10">
                      <IconComponent className="h-5 w-5 text-success" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{section.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{section.description}</p>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.text}>
                        <button
                          className="w-full text-left inline-flex flex-col gap-1 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center justify-between">
                            {link.text}
                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </span>
                          <span className="text-xs text-muted-foreground/70">{link.description}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* Getting Help Section */}
          <div className="space-y-8 border-t border-border pt-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">Community & Support</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Button
                  asChild
                  variant="outline"
                  className="border-border bg-card h-12 rounded-xl font-semibold hover:border-success/30 hover:bg-success/5"
                >
                  <a href="https://x.com/FanIndexes" target="_blank" rel="noopener noreferrer">
                    Follow on X
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-border bg-card h-12 rounded-xl font-semibold hover:border-success/30 hover:bg-success/5"
                >
                  <a href="https://blog.fanindex.pro" target="_blank" rel="noopener noreferrer">
                    Read Our Blog
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-border bg-card h-12 rounded-xl font-semibold hover:border-success/30 hover:bg-success/5"
                >
                  <a href="mailto:support@fanindex.pro">
                    Contact Support
                  </a>
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Quick Links</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Link
                  href="/blog"
                  className="border border-border rounded-xl p-6 bg-card hover:border-success/30 transition-all duration-300 hover:shadow-md group"
                >
                  <h3 className="font-semibold text-foreground group-hover:text-success transition-colors mb-2 flex items-center gap-2">
                    Blog
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-muted-foreground">Latest articles and market insights</p>
                </Link>
                <Link
                  href="/whitepaper"
                  className="border border-border rounded-xl p-6 bg-card hover:border-success/30 transition-all duration-300 hover:shadow-md group"
                >
                  <h3 className="font-semibold text-foreground group-hover:text-success transition-colors mb-2 flex items-center gap-2">
                    Whitepaper
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-muted-foreground">Technical architecture and tokenomics</p>
                </Link>
                <Link
                  href="/terms"
                  className="border border-border rounded-xl p-6 bg-card hover:border-success/30 transition-all duration-300 hover:shadow-md group"
                >
                  <h3 className="font-semibold text-foreground group-hover:text-success transition-colors mb-2 flex items-center gap-2">
                    Legal
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-muted-foreground">Terms of service and privacy policy</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
