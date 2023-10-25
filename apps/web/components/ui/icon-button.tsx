import React from "react"
import { tv, VariantProps } from "tailwind-variants"
import { cn } from "@/utils/cn"
import { forwardRefWithAs } from "@/utils/render"

const iconVariants = tv({
  base: [
    "btn-icon inline-flex items-center justify-center rounded-full transition-colors",
    "focus:outline-none focus:ring-2",
    "disabled:pointer-events-none disabled:text-gray-500/80",
    "active:scale-95",
  ],
  variants: {
    color: {
      primary: "text-primary-500 hover:bg-primary-500/8 focus:ring-primary-500",
      default: "text-gray-800 hover:bg-gray-800/8 focus:ring-gray-500",
      success: "text-success-500 hover:bg-success-500/8 focus:ring-success-500",
      info: "text-info-500 hover:bg-info-500/8 focus:ring-info-500",
      warning: "text-warning-500 hover:bg-warning-500/8 focus:ring-warning-500",
      error: "text-error-500 hover:bg-error-500/8 focus:ring-error-500",
    },
    size: {
      sm: "p-2",
      md: "p-3",
      lg: "p-4",
    },
  },
  defaultVariants: {
    color: "default",
    size: "md",
  },
})

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof iconVariants> {}

export const IconButton = forwardRefWithAs<"button", IconButtonProps>(
  ({ as: Tag = "button", className, size, children, disabled, color, ...props }, ref) => {
    return (
      <Tag className={cn(iconVariants({ size, color }), className)} ref={ref} disabled={disabled} {...props}>
        {children}
      </Tag>
    )
  }
)
