import React from "react";
import { cn } from "@/lib/utils";

const base =
  "w-full p-3 rounded-btn border border-border-subtle bg-surface-2 text-foreground placeholder-white/30 " +
  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors " +
  "disabled:opacity-60 disabled:cursor-not-allowed";

export function Input({ label, className, id, ...props }) {
  const input = (
    <input id={id} className={cn(base, className)} {...props} />
  );
  if (!label) return input;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white/70 mb-1">
        {label}
      </label>
      {input}
    </div>
  );
}

export function Textarea({ label, className, id, rows = 3, ...props }) {
  const area = (
    <textarea id={id} rows={rows} className={cn(base, "resize-none", className)} {...props} />
  );
  if (!label) return area;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white/70 mb-1">
        {label}
      </label>
      {area}
    </div>
  );
}

export default Input;
