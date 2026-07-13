import React from "react";
import { cn } from "@/lib/utils";

// Shared glass Card primitive — replaces the copy-pasted
// `bg-white/10 backdrop-blur rounded-2xl border border-white/20` blocks.
export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-card border border-border-subtle bg-surface backdrop-blur-xl",
        "shadow-lg shadow-black/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ icon: Icon, title, iconClassName = "text-primary", right, className }) {
  return (
    <div className={cn("flex items-center justify-between gap-4 mb-5", className)}>
      <div className="flex items-center gap-3">
        {Icon && <Icon className={iconClassName} size={22} />}
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {right}
    </div>
  );
}

export default Card;
