import { ChevronRight, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Blog | FanIndex",
  description: "Latest articles, insights, and updates from FanIndex",
}

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Introduction to Fan Token Indices",
      description: "Learn how FanIndex revolutionizes fan token investing with diversified, ETF-like index funds.",
      date: "March 15, 2024",
      category: "Getting Started",
      readTime: "5 min read",
      image: "🎯",
    },
    {
      id: 2,
      title: "Understanding Index Rebalancing",
      description: "Deep dive into how we maintain optimal portfolio composition and automatically rebalance indices.",
      date: "March 12, 2024",
      category: "Education",
      readTime: "8 min read",
      image: "⚖️",
    },
    {
      id: 3,
      title: "Fan Token Market Analysis: Q1 2024",
      description: "Market trends, top performers, and insights into the fan token ecosystem this quarter.",
      date: "March 10, 2024",
      category: "Market Insights",
      readTime: "10 min read",
      image: "📊",
    },
    {
      id: 4,
      title: "The Benefits of Diversified Fan Token Portfolios",
      description: "Why diversification matters and how FanIndex helps you spread risk across multiple teams and leagues.",
      date: "March 8, 2024",
      category: "Strategy",
      readTime: "6 min read",
      image: "🌍",
    },
    {
      id: 5,
      title: "Chiliz Chain Integration: Why It Matters",
      description: "Explore why we chose Chiliz Chain and what it means for fast, low-cost fan token trading.",
      date: "March 5, 2024",
      category: "Technology",
      readTime: "7 min read",
      image: "⛓️",
    },
    {
      id: 6,
      title: "Getting Started with Your First Fan Token Index",
      description: "A beginner's guide to creating, managing, and optimizing your first fan token index portfolio.",
      date: "March 1, 2024",
      category: "Tutorial",
      readTime: "9 min read",
      image: "🚀",
    },
  ]

  const categories = ["Getting Started", "Education", "Market Insights", "Strategy", "Technology", "Tutorial"]

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
            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">FanIndex Blog</h1>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Stay updated with latest articles, market insights, and expert guides on fan token investing and index management.
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full bg-card border border-border hover:border-success/30 hover:bg-success/5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          <div className="border border-border rounded-2xl p-8 bg-gradient-to-br from-card to-card/50 hover:border-success/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{blogPosts[0].image}</span>
              <div>
                <p className="text-sm font-semibold text-success">{blogPosts[0].category}</p>
                <p className="text-xs text-muted-foreground">{blogPosts[0].date}</p>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance leading-tight">
              {blogPosts[0].title}
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-3xl">
              {blogPosts[0].description}
            </p>
            <Button
              asChild
              className="bg-success hover:bg-success/90 text-success-foreground font-semibold h-11 rounded-xl"
            >
              <Link href={`/blog/${blogPosts[0].id}`}>
                Read Article
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* All Posts Grid */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Latest Articles</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {blogPosts.slice(1).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="border border-border rounded-xl p-6 bg-card hover:border-success/30 transition-all duration-300 hover:shadow-md group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{post.image}</span>
                      <div>
                        <p className="text-xs font-semibold text-success uppercase tracking-wide">{post.category}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          {post.date}
                        </p>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-success transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.readTime}</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="border border-border rounded-2xl p-8 bg-card space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Stay Updated</h2>
            <p className="text-muted-foreground max-w-2xl">
              Subscribe to our newsletter to get the latest FanIndex updates, market insights, and exclusive content delivered to your inbox.
            </p>
            <div className="flex gap-2 max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-success/50 transition-colors"
              />
              <Button className="bg-success hover:bg-success/90 text-success-foreground font-semibold h-11 rounded-lg px-6">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              We respect your privacy. No spam, only valuable content. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
