
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-pmo-primary text-white hover:bg-pmo-primary/80",
        secondary:
          "border-transparent bg-pmo-secondary text-white hover:bg-pmo-secondary/80",
        destructive:
          "border-transparent bg-pmo-danger text-white hover:bg-pmo-danger/80",
        outline: "text-pmo-primary border-pmo-primary",
        success:
          "border-transparent bg-pmo-success text-white hover:bg-pmo-success/80",
        warning:
          "border-transparent bg-pmo-warning text-white hover:bg-pmo-warning/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
