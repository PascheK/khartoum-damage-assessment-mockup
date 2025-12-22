import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const codeVariants = cva(
  "font-mono",
  {
    variants: {
      variant: {
        inline: "bg-muted text-foreground rounded px-1.5 py-0.5 text-sm",
        block: "bg-muted text-foreground rounded-lg p-4 text-sm overflow-x-auto block w-full",
      },
    },
    defaultVariants: {
      variant: "inline",
    },
  }
)

export interface CodeProps
  extends React.ComponentProps<"code">,
    VariantProps<typeof codeVariants> {}

function Code({
  className,
  variant,
  ...props
}: CodeProps) {
  return (
    <code
      data-slot="code"
      className={cn(codeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Code, codeVariants }
