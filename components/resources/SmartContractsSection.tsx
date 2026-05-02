"use client"

import { Shield, Lock, Key, Database, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ETF_CONTRACTS } from "@/lib/contracts/abis"

const contractSections = [
  {
    icon: Lock,
    title: "ETF Vault Contracts",
    description: "Core smart contracts managing index positions and asset custody for each index.",
    chain: "FTLX (Fan Token Leaders Index)",
    address: ETF_CONTRACTS.FTLX.vault,
  },
  {
    icon: Key,
    title: "NFT Position Contracts",
    description: "ERC-721 smart contracts representing position ownership and metadata.",
    chain: "FTLX NFT",
    address: ETF_CONTRACTS.FTLX.nft,
  },
  {
    icon: Database,
    title: "Batch Buyer",
    description: "Contract for efficient batch purchasing of index positions.",
    chain: "FTLX Batch",
    address: ETF_CONTRACTS.FTLX.batchBuyer,
  },
  {
    icon: Shield,
    title: "Secure Infrastructure",
    description: "Multi-contract architecture ensuring security and composability.",
    chain: "Chiliz Chain",
    address: ETF_CONTRACTS.FTLX.vault,
  },
]

const allIndices = [
  { ticker: "FTLX", name: "Fan Token Leaders Index", vault: ETF_CONTRACTS.FTLX.vault, nft: ETF_CONTRACTS.FTLX.nft },
  { ticker: "FGMX", name: "Fan Gaming Index", vault: ETF_CONTRACTS.FGMX.vault, nft: ETF_CONTRACTS.FGMX.nft },
  { ticker: "FFLX", name: "Fan Fight Index", vault: ETF_CONTRACTS.FFLX.vault, nft: ETF_CONTRACTS.FFLX.nft },
  { ticker: "FELX", name: "Fan English League Index", vault: ETF_CONTRACTS.FELX.vault, nft: ETF_CONTRACTS.FELX.nft },
  { ticker: "FSLX", name: "Fan Spanish League Index", vault: ETF_CONTRACTS.FSLX.vault, nft: ETF_CONTRACTS.FSLX.nft },
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
              <div className="space-y-3 pt-4 border-t border-border/30">
                <p className="text-xs font-mono text-success bg-success/5 px-2 py-1 rounded inline-block">
                  {section.chain}
                </p>
                <div className="bg-card/70 p-2 rounded border border-border/30 break-all">
                  <p className="text-xs text-muted-foreground font-mono">{section.address}</p>
                </div>
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

      {/* All Indices Contracts */}
      <div className="border border-border rounded-2xl bg-card/50 backdrop-blur-sm p-6 md:p-8">
        <h3 className="text-2xl font-semibold text-foreground mb-6">Index Contract Addresses</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left py-3 px-3 text-sm font-semibold text-muted-foreground">Index</th>
                <th className="text-left py-3 px-3 text-sm font-semibold text-muted-foreground">Vault Contract</th>
                <th className="text-left py-3 px-3 text-sm font-semibold text-muted-foreground">NFT Contract</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {allIndices.map((index) => (
                <tr key={index.ticker} className="hover:bg-muted/10 transition-colors">
                  <td className="py-4 px-3">
                    <div>
                      <p className="font-mono font-semibold text-success text-sm">{index.ticker}</p>
                      <p className="text-xs text-muted-foreground">{index.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <code className="text-xs bg-muted/30 px-2 py-1 rounded font-mono text-muted-foreground truncate">
                      {index.vault}
                    </code>
                  </td>
                  <td className="py-4 px-3">
                    <code className="text-xs bg-muted/30 px-2 py-1 rounded font-mono text-muted-foreground truncate">
                      {index.nft}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
