import Image from "next/image"
import type { ComponentProps } from "react"

export const LibertadoresIcon = (props: ComponentProps<"div">) => {
  return (
    <div {...props}>
      <Image
        src="/icons/libertadores.png"
        alt="Libertadores Logo"
        width={48}
        height={48}
        className="h-full w-full object-contain"
      />
    </div>
  )
}
