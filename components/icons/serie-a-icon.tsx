import Image from "next/image"
import type { ComponentProps } from "react"

export const SerieAIcon = (props: ComponentProps<"div">) => {
  return (
    <div {...props}>
      <Image
        src="/icons/serie-a.png"
        alt="Serie A Logo"
        width={48}
        height={48}
        className="h-full w-full object-contain"
      />
    </div>
  )
}
