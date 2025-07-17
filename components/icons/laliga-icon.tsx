import Image from "next/image"
import type { ComponentProps } from "react"

export const LaLigaIcon = (props: ComponentProps<"div">) => {
  return (
    <div {...props}>
      <Image
        src="/icons/laliga.png"
        alt="LaLiga Logo"
        width={48}
        height={48}
        className="h-full w-full object-contain"
      />
    </div>
  )
}
