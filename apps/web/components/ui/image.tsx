import NextImage, { ImageProps } from "next/image"
import { useState } from "react"
import { cn } from "@/utils/cn"

export default function Image(props: ImageProps) {
  const [src, setSrc] = useState(props.src)

  return (
    <NextImage
      {...props}
      src={src}
      className={cn(props.className, "bg-gray-500/24")}
      onError={() => setSrc("/assets/placeholder-image.svg")}
    />
  )
}
