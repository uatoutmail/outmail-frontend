import React from "react";
import { cn } from "@/lib/utils";

// options: [{ value, label }]
export function Select({ label, options = [], className, id, ...props }) {
  const select = (
    <select
      id={id}
      className={cn(
        "w-full p-3 rounded-btn border border-border-subtle bg-surface-2 text-foreground",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors",
        className
      )}
      {...props}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-surface-panel">
          {o.label}
        </option>
      ))}
    </select>
  );
  if (!label) return select;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white/70 mb-1">
        {label}
      </label>
      {select}
    </div>
  );
}

export default Select;
