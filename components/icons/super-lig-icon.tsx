import Image from "next/image"
import type { ComponentProps } from "react"

export const SuperLigIcon = (props: ComponentProps<"div">) => {
  return (
    <div {...props}>
      <Image
        src="/icons/super-lig.png"
        alt="Süper Lig Logo"
        width={48}
        height={48}
        className="h-full w-full object-contain"
      />
    </div>
  )
}
