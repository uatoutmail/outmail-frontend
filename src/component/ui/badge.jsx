import React from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-primary/15 text-primary-soft border border-primary/25",
  neutral: "bg-surface-2 text-white/70 border border-border-subtle",
  success: "bg-green-500/15 text-green-300 border border-green-500/25",
  warning: "bg-amber-500/15 text-amber-300 border border-amber-500/25",
};

export function Badge({ children, className = "", variant = "primary" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 text-sm font-medium",
        variants[variant] || variants.primary,
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
