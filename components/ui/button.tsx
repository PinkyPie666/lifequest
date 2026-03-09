import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 font-retro tracking-wide pixel-btn",
  {
    variants: {
      variant: {
        default: "bg-[#8b5cf6] hover:bg-[#7c3aed] text-white",
        destructive: "bg-[#ef4444] hover:bg-[#dc2626] text-white",
        outline: "bg-transparent border-[#2a2a5a] hover:bg-[#1e1e3a] text-[#94a3b8] hover:text-white",
        secondary: "bg-[#1e1e3a] hover:bg-[#2a2a5a] text-[#e2e8f0]",
        ghost: "hover:bg-white/5 text-[#94a3b8] hover:text-white border-transparent shadow-none",
        link: "text-[#8b5cf6] underline-offset-4 hover:underline border-transparent shadow-none",
        success: "bg-[#22c55e] hover:bg-[#16a34a] text-white",
        gold: "bg-[#f59e0b] hover:bg-[#d97706] text-[#0c0c1d]",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-lg",
        xl: "h-14 px-10 text-xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
