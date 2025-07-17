"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown, ArrowUpRight } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { Index } from "@/lib/types"
import { IndexIcon } from "@/components/index-icon"
import type { Locale } from "@/i18n-config"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  index: Index
  lang: Locale
  dict: any
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, index, lang, dict, ...props }, ref) => {
    return (
      <Link
        href={`/${lang}/index/${index.id}`}
        className={`group h-[300px] w-[290px] [perspective:1000px] ${className}`}
        {...props}
      >
        <div
          ref={ref}
          className="relative h-full rounded-[50px] shadow-2xl transition-all duration-500 ease-in-out [transform-style:preserve-3d] group-hover:[box-shadow:rgba(0,0,0,0.3)_30px_50px_25px_-40px,rgba(0,0,0,0.1)_0px_25px_30px_0px] group-hover:[transform:rotate3d(1,1,0,30deg)]"
        >
          {/* Background Layer */}

          {/* Scrim/Overlay for Text Readability */}
          <div className="absolute inset-0 h-full w-full rounded-[50px] bg-gradient-to-b from-black/60 to-transparent" />

          <div className="absolute inset-2 rounded-[55px] border-b border-l border-white/20 bg-gradient-to-b from-white/30 to-white/10 backdrop-blur-sm [transform-style:preserve-3d] [transform:translate3d(0,0,25px)]"></div>

          <div className="absolute px-7 pt-8 [transform:translate3d(0,0,26px)]">
            <span className="block text-xl font-black text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
              {index.name}
            </span>
            <div className="mt-2">
              <span className="block text-3xl font-bold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                ${index.value.toFixed(2)}
              </span>
              <span
                className={`flex items-center text-sm font-semibold [text-shadow:0_1px_2px_rgba(0,0,0,0.7)] ${
                  index.change >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                <ArrowUpRight className={`w-4 h-4 mr-1 transition-transform ${index.change < 0 && "rotate-180"}`} />
                {index.change.toFixed(2)}% (24h)
              </span>
            </div>
            <span className="mt-3 block text-[14px] text-zinc-300 [text-shadow:0_1px_2px_rgba(0,0,0,0.7)]">
              {index.description}
            </span>
          </div>

          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between [transform-style:preserve-3d] [transform:translate3d(0,0,26px)]">
            <div className="flex -space-x-2 [transform-style:preserve-3d]">
              {index.tokens.slice(0, 3).map((token, i) => (
                <div
                  key={token.symbol}
                  className="group/social grid h-[30px] w-[30px] place-content-center rounded-full border-none bg-white shadow-[rgba(0,0,0,0.5)_0px_7px_5px_-5px] transition-all duration-200 ease-in-out group-hover:[box-shadow:rgba(0,0,0,0.2)_-5px_20px_10px_0px] group-hover:[transform:translate3d(0,0,50px)]"
                  style={{ transitionDelay: `${i * 150 + 400}ms` }}
                >
                  <Avatar className="h-full w-full">
                    <AvatarImage src={token.logo || "/placeholder.svg"} alt={token.name} />
                    <AvatarFallback>{token.symbol.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>
            <div className="flex w-2/5 cursor-pointer items-center justify-end transition-all duration-200 ease-in-out hover:[transform:translate3d(0,0,10px)]">
              <span className="border-none bg-none text-xs font-bold text-white">{dict.buy_now}</span>
              <ChevronDown className="h-4 w-4 stroke-white" strokeWidth={3} />
            </div>
          </div>

          <div className="absolute top-0 right-0 [transform-style:preserve-3d]">
            {[
              { size: "170px", pos: "8px", z: "20px", delay: "0s" },
              { size: "140px", pos: "10px", z: "40px", delay: "0.4s" },
              { size: "110px", pos: "17px", z: "60px", delay: "0.8s" },
              { size: "80px", pos: "23px", z: "80px", delay: "1.2s" },
            ].map((circle, index) => (
              <div
                key={index}
                className="absolute aspect-square rounded-full bg-white/10 shadow-[rgba(100,100,111,0.2)_-10px_10px_20px_0px] transition-all duration-500 ease-in-out"
                style={{
                  width: circle.size,
                  top: circle.pos,
                  right: circle.pos,
                  transform: `translate3d(0, 0, ${circle.z})`,
                  transitionDelay: circle.delay,
                }}
              ></div>
            ))}
            <div
              className="absolute grid aspect-square w-[50px] place-content-center rounded-full bg-white shadow-[rgba(100,100,111,0.2)_-10px_10px_20px_0px] transition-all duration-500 ease-in-out [transform:translate3d(0,0,100px)] [transition-delay:1.6s] group-hover:[transform:translate3d(0,0,120px)]"
              style={{ top: "30px", right: "30px" }}
            >
              <IndexIcon iconName={index.icon} className={`w-6 h-6 ${index.iconColor || ""}`} />
            </div>
          </div>
        </div>
      </Link>
    )
  },
)
GlassCard.displayName = "GlassCard"

export default GlassCard
