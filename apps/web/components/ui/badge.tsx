import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/utils/cn";

const badgeVariants = tv({
  base: [
    "h-6 min-w-[24px] inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none",
  ],
  variants: {
    variant: {
      default: "bg-gray-500/16 text-gray-600",
      primary: "bg-primary-500/16 text-primary-700",
      success: "bg-success-500/16 text-success-700",
      warning: "bg-warning-500/16 text-warning-700",
      info: "bg-info-500/16 text-info-700",
      error: "bg-error-500/16 text-error-700",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };