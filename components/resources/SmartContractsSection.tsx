"use client"

import { Shield, Lock, Key, Database, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const contractSections = [
  {
    icon: Lock,
    title: "Vault Contracts",
    description: "Core smart contracts managing index positions and asset custody.",
    chain: "Deployed on Chiliz Chain",
  },
  {
    icon: Key,
    title: "NFT Contracts",
    description: "ERC-721 smart contracts representing position ownership and metadata.",
    chain: "ERC-721 Standard",
  },
  {
    icon: Shield,
    title: "Treasury Management",
    description: "Multi-signature contracts controlling protocol treasury and funds.",
    chain: "3-of-5 MultiSig",
  },
  {
    icon: Database,
    title: "Data Oracles",
    description: "Price feed integration and market data aggregation contracts.",
    chain: "Chainlink Integration",
  },
]

export function SmartContractsSection() {
  return (
    <section id="smart-contracts" className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-success/10">
            <Shield className="h-6 w-6 text-success" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Smart Contracts</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Audited, transparent infrastructure securing your investments on-chain.
        </p>
      </div>

      {/* Contract Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {contractSections.map((section) => {
          const Icon = section.icon
          return (
            <div
              key={section.title}
              className="relative group border border-border bg-card/50 backdrop-blur-sm p-6 rounded-2xl hover:border-success/30 hover:bg-card transition-all duration-300"
            >
              <div className="mb-4">
                <div className="p-3 rounded-lg bg-success/5 group-hover:bg-success/10 transition-colors inline-flex">
                  <Icon className="h-5 w-5 text-success" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{section.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
              <div className="pt-4 border-t border-border/30">
                <p className="text-xs font-mono text-success bg-success/5 px-2 py-1 rounded inline-block">
                  {section.chain}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Security Info */}
      <div className="relative border border-success/20 bg-success/5 backdrop-blur-sm rounded-2xl p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-success/10 rounded-full blur-3xl opacity-30" />
        <div className="relative z-10 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-success" />
              Security & Audits
            </h3>
            <p className="text-muted-foreground mb-4">
              All smart contracts have been independently audited by leading security firms to ensure the safety of user funds.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-border/30 rounded-lg p-4 bg-card/50">
              <p className="text-sm font-semibold text-foreground mb-2">Security Audit Report</p>
              <p className="text-xs text-muted-foreground mb-3">
                Complete audit findings and vulnerability remediation tracking.
              </p>
              <Button
                asChild
                variant="outline"
                className="h-8 text-xs border-border hover:border-success/30"
              >
                <a href="#" target="_blank" rel="noopener noreferrer" className="gap-2">
                  View Report
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>

            <div className="border border-border/30 rounded-lg p-4 bg-card/50">
              <p className="text-sm font-semibold text-foreground mb-2">Contract Verification</p>
              <p className="text-xs text-muted-foreground mb-3">
                All contracts verified on-chain with source code and build artifacts.
              </p>
              <Button
                asChild
                variant="outline"
                className="h-8 text-xs border-border hover:border-success/30"
              >
                <a href="#" target="_blank" rel="noopener noreferrer" className="gap-2">
                  Verify
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
