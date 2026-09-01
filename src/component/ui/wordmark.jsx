import React from "react";
import { cn } from "@/lib/utils";

/**
 * The "Outmail" brand wordmark.
 *
 * Set in Syne as of 2026-09-01, not the Satisfy cursive it used to be. The
 * cursive was the last thing on the page still speaking the old visual
 * language: sitting in a header and footer whose every other label is Syne,
 * it read as a logo pasted onto someone else's site.
 *
 * To go back: swap the classes below for `font-satisfy` and re-add the Satisfy
 * import to app/layout.js — it was dropped with the change, because an unused
 * webfont downloaded on every page load is what we had just finished removing.
 *
 * variant:
 *   "inherit"  → takes the surrounding text colour (nav, footer, inline)
 *   "gradient" → the brand purple→white→purple gradient (heroes)
 * Size/extra styles via className.
 */
export function Wordmark({ variant = "inherit", className, children = "Outmail" }) {
  return (
    <span
      className={cn(
        "font-syne font-bold tracking-tight",
        variant === "gradient" && "gradient-hero",
        className
      )}
    >
      {children}
    </span>
  );
}

export default Wordmark;
