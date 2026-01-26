"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { TrendingUp, Users, BarChart3, ArrowUpRight, Info } from "lucide-react"
import { useState, useMemo } from "react"
import { BuyIndexDialog } from "./BuyIndexDialog"
import Link from "next/link"
import { useReadContract } from "wagmi"
import { EtfVaultABI, getContractAddresses, hasDeployedContracts } from "@/lib/contracts/abis"
import { useCoinGeckoPrices } from "@/lib/hooks/use-coingecko-prices"
import { calculateIndexPrice } from "@/lib/data/indices"

export interface IndexData {
  id: string
  name: string
  description: string
  type: "weighted" | "equal" | "managed"
  tokens: string[]
  price: string
  apy: string
  totalValue: string
  holders: number
}

interface IndexCardProps {
  index: IndexData
}

export function IndexCard({ index }: IndexCardProps) {
  const [showBuyDialog, setShowBuyDialog] = useState(false)

  const { prices: liveTokenPrices } = useCoinGeckoPrices()

  const displayPrice = useMemo(() => {
    if (liveTokenPrices && liveTokenPrices.length > 0) {
      const price = calculateIndexPrice(index.tokens, liveTokenPrices)
      return typeof price === "number" ? price.toFixed(2) : Number.parseFloat(price).toFixed(2)
    }
    return typeof index.price === "number" ? index.price.toFixed(2) : Number.parseFloat(index.price).toFixed(2)
  }, [liveTokenPrices, index.tokens, index.price])

  const contracts = getContractAddresses(index.id)
  const hasContracts = hasDeployedContracts(index.id)

  const { data: etfInfo } = useReadContract({
    address: contracts?.vault,
    abi: EtfVaultABI.abi,
    functionName: "getEtfInfo",
    query: {
      enabled: hasContracts && !!contracts,
      refetchInterval: 30000,
    },
  })

  const typeColors = {
    weighted: "text-blue-500",
    equal: "text-purple-500",
    managed: "text-success",
  }

  const typeBgColors = {
    weighted: "bg-blue-500/10 border-blue-500/20",
    equal: "bg-purple-500/10 border-purple-500/20",
    managed: "bg-success/10 border-success/20",
  }

  const typeLabels = {
    weighted: "Weighted",
    equal: "Equal-Weight",
    managed: "Managed",
  }

  return (
    <>
      <TooltipProvider>
        <Link href={`/indices/${index.id}`} className="block h-full group">
          <div className="h-full min-h-[500px] border border-border bg-card/80 backdrop-blur-sm p-8 rounded-2xl cursor-pointer transition-all duration-300 hover:border-border/80 hover:shadow-xl hover:shadow-success/5 hover:-translate-y-1">
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex-1 flex flex-col">
                <div className="mb-8">
                  <div
                    className={`mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${typeBgColors[index.type]}`}
                  >
                    <span className={typeColors[index.type]}>{typeLabels[index.type]}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 text-balance group-hover:text-success transition-colors">
                    {index.name}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed">{index.description}</p>
                </div>

                <div className="mb-8 grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Price</div>
                    <div className="text-xl font-bold text-foreground">{displayPrice} CHZ</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide flex items-center gap-1">
                      APY
                      <Tooltip>
                        <TooltipTrigger
                          asChild
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                        >
                          <Info className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="max-w-xs"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                        >
                          <p className="font-semibold mb-1">Annual Percentage Yield</p>
                          <p className="text-xs">
                            Estimated annual return based on the historical performance of the tokens that make up the
                            index. APY is variable and may change depending on market conditions.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-1.5 text-xl font-bold text-success">
                      <TrendingUp className="h-5 w-5" />
                      {index.apy}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                      Holders
                    </div>
                    <div className="flex items-center gap-1.5 text-xl font-bold text-foreground">
                      <Users className="h-5 w-5" />
                      {index.holders}
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
                    Asset Allocation ({index.tokens.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {index.tokens.slice(0, 5).map((token) => (
                      <span
                        key={token}
                        className="px-3 py-2 rounded-lg bg-muted/50 text-sm font-semibold text-foreground border border-border"
                      >
                        {token}
                      </span>
                    ))}
                    {index.tokens.length > 5 && (
                      <span className="px-3 py-2 rounded-lg bg-muted/50 text-sm font-semibold text-muted-foreground border border-border">
                        +{index.tokens.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-8 border-t border-border">
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowBuyDialog(true)
                  }}
                  className="flex-1 bg-success hover:bg-success/90 text-success-foreground font-semibold h-12 text-base rounded-xl group/btn"
                >
                  <span>Invest Now</span>
                  <ArrowUpRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  className="border-border bg-card/50 text-foreground hover:bg-muted h-12 w-12 p-0 rounded-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <BarChart3 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </TooltipProvider>

      <BuyIndexDialog index={index} open={showBuyDialog} onOpenChange={setShowBuyDialog} />
    </>
  )
}
