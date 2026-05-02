"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ExternalLink, ArrowRight, Github, BookOpen, Twitter } from "lucide-react"

export function ResourcesFooter() {
  return (
    <section className="border-t border-border pt-16 mt-20 space-y-12">
      {/* Support Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Need More Help?</h2>
          <p className="text-muted-foreground">
            Reach out to our community and support team for assistance.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Button
            asChild
            variant="outline"
            className="h-12 border-border hover:border-success/30 hover:bg-success/5"
          >
            <a href="https://x.com/FanIndexes" target="_blank" rel="noopener noreferrer" className="gap-2">
              <Twitter className="h-4 w-4" />
              Follow on X
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 border-border hover:border-success/30 hover:bg-success/5"
          >
            <a href="https://github.com/fanindex" target="_blank" rel="noopener noreferrer" className="gap-2">
              <Github className="h-4 w-4" />
              GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 border-border hover:border-success/30 hover:bg-success/5"
          >
            <a href="mailto:support@fanindex.pro" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Contact Support
              <ArrowRight className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Quick Links</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/blog"
            className="group relative border border-border bg-card/50 backdrop-blur-sm rounded-2xl p-6 hover:border-success/30 hover:bg-card transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-foreground group-hover:text-success transition-colors">
                Blog
              </h3>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-success opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            <p className="text-sm text-muted-foreground">
              Latest articles, market insights, and platform updates.
            </p>
          </Link>

          <Link
            href="/whitepaper"
            className="group relative border border-border bg-card/50 backdrop-blur-sm rounded-2xl p-6 hover:border-success/30 hover:bg-card transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-foreground group-hover:text-success transition-colors">
                Whitepaper
              </h3>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-success opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            <p className="text-sm text-muted-foreground">
              Technical architecture and tokenomics deep dive.
            </p>
          </Link>

          <Link
            href="/terms"
            className="group relative border border-border bg-card/50 backdrop-blur-sm rounded-2xl p-6 hover:border-success/30 hover:bg-card transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-foreground group-hover:text-success transition-colors">
                Legal
              </h3>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-success opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            <p className="text-sm text-muted-foreground">
              Terms of service and privacy policy.
            </p>
          </Link>
        </div>
      </div>

      {/* CTA */}
      <div className="relative border border-success/20 bg-gradient-to-r from-success/10 via-card to-card rounded-3xl p-8 md:p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-success/10 rounded-full blur-3xl opacity-30" />
        <div className="relative z-10 text-center space-y-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Ready to Start Investing?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of investors using FanIndex for diversified crypto exposure.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-success hover:bg-success/90 text-success-foreground font-semibold h-12 px-8 rounded-xl">
              Start Investing
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-border hover:border-success/30 h-12 px-8 rounded-xl"
            >
              <Link href="/indices">Explore Indices</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
