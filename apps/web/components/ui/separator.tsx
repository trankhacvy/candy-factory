"use client"

import * as SeparatorPrimitive from "@radix-ui/react-separator"
import * as React from "react"
import { cn } from "@/utils/cn"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 border-gray-500/24",
      orientation === "horizontal" ? "w-full border-b" : "h-auto self-stretch border-r",
      className
    )}
    {...props}
  />
))

Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
