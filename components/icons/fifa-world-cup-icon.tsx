import Image from "next/image"
import type { ComponentProps } from "react"

export const FifaWorldCupIcon = (props: ComponentProps<"div">) => {
  return (
    <div {...props}>
      <Image
        src="/icons/fifa-world-cup.png"
        alt="FIFA World Cup Logo"
        width={48}
        height={48}
        className="h-full w-full object-contain"
      />
    </div>
  )
}
