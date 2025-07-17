import Image from "next/image"
import type { ComponentProps } from "react"

export const PremierLeagueIcon = (props: ComponentProps<"div">) => {
  return (
    <div {...props}>
      <Image
        src="/icons/premier-league.png"
        alt="Premier League Logo"
        width={48}
        height={48}
        className="h-full w-full object-contain"
      />
    </div>
  )
}
