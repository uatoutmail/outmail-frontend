import React from "react";
import { cn } from "@/lib/utils";

/**
 * The "Outmail" brand wordmark — the cursive (Satisfy) signature.
 * Centralized so the brand-name styling can be changed in ONE place.
 *
 * variant:
 *   "inherit"  → cursive, takes the surrounding text color (nav, footer, inline)
 *   "gradient" → cursive with the brand purple→white→purple gradient (heroes)
 * Size/extra styles via className.
 */
export function Wordmark({ variant = "inherit", className, children = "Outmail" }) {
  return (
    <span
      className={cn(
        "font-satisfy",
        variant === "gradient" &&
          "bg-gradient-to-r from-primary-soft via-white to-primary-soft bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}

export default Wordmark;
