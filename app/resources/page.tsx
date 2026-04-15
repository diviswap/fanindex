import { ChevronRight, BookOpen, HelpCircle, FileText, ExternalLink } from "lucide-react"
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
        { text: "Create Your First Index", href: "#" },
        { text: "Understanding Indices", href: "#" },
        { text: "Portfolio Basics", href: "#" },
      ],
    },
    {
      title: "FAQ",
      description: "Frequently asked questions about FanIndex",
      icon: HelpCircle,
      links: [
        { text: "How do indices work?", href: "#" },
        { text: "What are the fees?", href: "#" },
        { text: "How often are indices rebalanced?", href: "#" },
        { text: "Is FanIndex secure?", href: "#" },
      ],
    },
    {
      title: "Documentation",
      description: "Technical documentation and API reference",
      icon: FileText,
      links: [
        { text: "Smart Contract Documentation", href: "#" },
        { text: "API Reference", href: "#" },
        { text: "Integration Guide", href: "#" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="space-y-12">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Resources & Documentation</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Everything you need to understand and use FanIndex. From getting started guides to technical documentation.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {resources.map((section) => {
              const IconComponent = section.icon
              return (
                <div
                  key={section.title}
                  className="border border-border rounded-2xl p-6 bg-card hover:border-success/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-success/10">
                      <IconComponent className="h-5 w-5 text-success" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{section.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{section.description}</p>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.text}>
                        <a
                          href={link.href}
                          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-success transition-colors group"
                        >
                          {link.text}
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Community & Support</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Button
                  asChild
                  variant="outline"
                  className="border-border bg-card h-12 rounded-xl font-semibold hover:border-success/30"
                >
                  <a href="https://x.com/FanIndexes" target="_blank" rel="noopener noreferrer">
                    Join on X (Twitter)
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-border bg-card h-12 rounded-xl font-semibold hover:border-success/30"
                >
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Discord Community
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-border bg-card h-12 rounded-xl font-semibold hover:border-success/30"
                >
                  <a href="mailto:hello@fanindex.pro">
                    Contact Support
                  </a>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Legal & Policies</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Link
                  href="/privacy"
                  className="border border-border rounded-xl p-4 bg-card hover:border-success/30 transition-colors group"
                >
                  <h3 className="font-semibold text-foreground group-hover:text-success transition-colors mb-2">
                    Privacy Policy
                  </h3>
                  <p className="text-sm text-muted-foreground">Learn how we protect your data</p>
                </Link>
                <Link
                  href="/terms"
                  className="border border-border rounded-xl p-4 bg-card hover:border-success/30 transition-colors group"
                >
                  <h3 className="font-semibold text-foreground group-hover:text-success transition-colors mb-2">
                    Terms of Service
                  </h3>
                  <p className="text-sm text-muted-foreground">Review our terms and conditions</p>
                </Link>
                <Link
                  href="/whitepaper"
                  className="border border-border rounded-xl p-4 bg-card hover:border-success/30 transition-colors group"
                >
                  <h3 className="font-semibold text-foreground group-hover:text-success transition-colors mb-2">
                    Whitepaper
                  </h3>
                  <p className="text-sm text-muted-foreground">Read our technical whitepaper</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
