import React from "react";
import { cn } from "@/lib/utils";

// Shared Button primitive. Variants/colors come from design tokens (globals.css),
// so changing --brand-primary re-skins every button.
const variants = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg shadow-primary/25",
  secondary:
    "bg-surface-2 text-foreground border border-border-subtle hover:bg-surface-3",
  ghost:
    "bg-transparent text-muted-foreground hover:text-foreground hover:bg-surface-2",
  outline:
    "bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground",
  danger:
    "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25",
  gradient:
    "text-white shadow-lg shadow-primary/30 bg-gradient-brand hover:brightness-110",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
  icon: "p-2",
};

export function Button({
  as: Comp = "button",
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) {
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-btn font-semibold transition-all",
        "active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export default Button;
