import Image from "next/image"
import type { ComponentProps } from "react"

export const ChampionsLeagueIcon = (props: ComponentProps<"div">) => {
  return (
    <div {...props}>
      <Image
        src="/icons/champions-league.png"
        alt="Champions League Logo"
        width={48}
        height={48}
        className="h-full w-full object-contain"
      />
    </div>
  )
}
