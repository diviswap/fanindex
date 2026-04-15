import { ChevronRight, Calendar, Clock, Share2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Article | FanIndex Blog",
  description: "Read the latest article on FanIndex blog",
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  // Blog post data - in a real app, this would come from a database
  const posts: Record<string, any> = {
    "1": {
      title: "Introduction to Fan Token Indices",
      date: "March 15, 2024",
      category: "Getting Started",
      readTime: "5 min read",
      image: "🎯",
      author: "FanIndex Team",
      content: `
Fan Token indices represent a revolutionary approach to diversified investing in the fan token ecosystem. 
Unlike traditional approaches where you might invest in individual teams or leagues, FanIndex brings the power of 
indexed, diversified portfolios to fan tokens – similar to how ETFs work in traditional finance.

## What Makes Fan Token Indices Different?

FanIndex indices are carefully constructed to provide exposure to multiple teams and leagues simultaneously. 
This diversification helps reduce risk while maintaining growth potential. Our proprietary algorithm continuously 
monitors market conditions and adjusts the composition to ensure optimal performance.

## Getting Started

Creating your first index is simple:
1. Connect your wallet to FanIndex
2. Choose a pre-made index or create a custom one
3. Deposit CHZ or other supported tokens
4. Start earning from day one

## The Benefits

- **Diversification**: Spread your investment across multiple fan tokens
- **Passive Income**: Earn from index composition changes
- **Low Fees**: Industry-leading fee structure
- **Easy Management**: No need to constantly rebalance manually

Join thousands of fan token investors who are already using FanIndex to build their perfect portfolio.
      `,
    },
    "2": {
      title: "Understanding Index Rebalancing",
      date: "March 12, 2024",
      category: "Education",
      readTime: "8 min read",
      image: "⚖️",
      author: "FanIndex Team",
      content: `
Rebalancing is one of the most important concepts in index investing. In this article, we'll explain exactly 
how rebalancing works and why it's crucial for maintaining optimal portfolio performance.

## What is Rebalancing?

Rebalancing is the process of adjusting the composition of an index to maintain target weights. 
As different tokens perform at different rates, the percentage each token represents in the index changes. 
Rebalancing brings these percentages back to their target levels.

## How FanIndex Rebalances

Our algorithm monitors indices continuously and executes rebalancing on a set schedule:
- Daily monitoring for significant deviations
- Weekly rebalancing to maintain target composition
- Emergency rebalancing for extreme market conditions

## The Impact on Returns

Studies show that regular rebalancing can improve long-term returns by automatically selling high and 
buying low. This disciplined approach helps capture market inefficiencies without emotional decision-making.

## Getting the Most from Rebalancing

To maximize the benefits of rebalancing in your portfolio, consider these strategies:
1. Choose indices aligned with your risk tolerance
2. Let the algorithm handle rebalancing – don't interfere
3. Review performance quarterly but resist the urge to tinker

Understanding rebalancing empowers you to make better investment decisions.
      `,
    },
    "3": {
      title: "Fan Token Market Analysis: Q1 2024",
      date: "March 10, 2024",
      category: "Market Insights",
      readTime: "10 min read",
      image: "📊",
      author: "FanIndex Team",
      content: `
The Q1 2024 fan token market has shown remarkable resilience and growth. Let's dive into the key trends, 
top performers, and what they mean for investors.

## Market Overview

Total fan token market capitalization grew 35% during Q1 2024, reaching new all-time highs. 
Trading volume increased 50% month-over-month, indicating growing retail and institutional interest.

## Top Performers

Several indices stood out this quarter:
- Sports League Index: +42% return
- Emerging Teams Index: +38% return
- Global Fan Token Index: +35% return

## What's Driving Growth?

1. **Mainstream Adoption**: Major sports organizations are increasingly embracing fan tokens
2. **New Partnerships**: Strategic collaborations between platforms and leagues
3. **Market Maturity**: Better infrastructure and security measures
4. **Retail Interest**: Younger investors seeking alternative assets

## Looking Ahead

We expect continued growth in Q2 2024, with particular focus on:
- European market expansion
- Integration with major sports events
- Launch of new fan token categories

The fundamentals have never been stronger for fan token investing.
      `,
    },
  }

  const post = posts[params.id] || posts["1"]

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="space-y-8">
          {/* Navigation */}
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to blog
          </Link>

          {/* Article Header */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{post.image}</span>
              <div>
                <p className="text-sm font-semibold text-success uppercase tracking-wide mb-1">{post.category}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {post.date}
                </p>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </div>
                <div className="text-sm text-muted-foreground">By {post.author}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-border hover:border-success/30"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Article Content */}
          <article className="prose prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
            {post.content.split('\n\n').map((paragraph: string, idx: number) => {
              if (paragraph.startsWith('##')) {
                return (
                  <h2 key={idx} className="text-2xl font-bold text-foreground mt-8 mb-4">
                    {paragraph.replace('##', '').trim()}
                  </h2>
                )
              }
              if (paragraph.startsWith('-')) {
                const items = paragraph.split('\n').filter((line: string) => line.startsWith('-'))
                return (
                  <ul key={idx} className="list-disc list-inside space-y-2 ml-4">
                    {items.map((item: string, i: number) => (
                      <li key={i} className="text-muted-foreground">
                        {item.replace('-', '').trim()}
                      </li>
                    ))}
                  </ul>
                )
              }
              return (
                <p key={idx} className="text-muted-foreground leading-relaxed">
                  {paragraph.trim()}
                </p>
              )
            })}
          </article>

          {/* Related Articles */}
          <div className="mt-16 pt-8 border-t border-border space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Related Articles</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/blog"
                className="border border-border rounded-lg p-4 bg-card hover:border-success/30 transition-all hover:shadow-md group"
              >
                <p className="text-xs text-success font-semibold mb-2 uppercase">Getting Started</p>
                <h3 className="font-bold text-foreground group-hover:text-success transition-colors mb-2">
                  Your First Fan Token Index
                </h3>
                <p className="text-sm text-muted-foreground">Learn how to create and manage your first index portfolio.</p>
              </Link>
              <Link
                href="/blog"
                className="border border-border rounded-lg p-4 bg-card hover:border-success/30 transition-all hover:shadow-md group"
              >
                <p className="text-xs text-success font-semibold mb-2 uppercase">Education</p>
                <h3 className="font-bold text-foreground group-hover:text-success transition-colors mb-2">
                  Market Analysis Q1 2024
                </h3>
                <p className="text-sm text-muted-foreground">Deep dive into recent market trends and insights.</p>
              </Link>
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="mt-12 p-8 border border-border rounded-2xl bg-card space-y-4">
            <h3 className="text-xl font-bold text-foreground">Don't miss future articles</h3>
            <p className="text-muted-foreground">
              Subscribe to get the latest FanIndex insights and market analysis delivered to your inbox.
            </p>
            <div className="flex gap-2 max-w-md">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-success/50 transition-colors text-sm"
              />
              <Button className="bg-success hover:bg-success/90 text-success-foreground font-semibold px-4 h-10 rounded-lg">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
