import React from "react";
import { cn } from "@/lib/utils";

// Shared page header so every dashboard tab shares one heading rhythm
// (replaces the per-tab text-lg/2xl/3xl/4xl + mt-4/mt-10 drift).
export function PageHeader({ title, subtitle, icon: Icon, actions, className }) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8", className)}>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
          {Icon && <Icon className="text-primary shrink-0" size={26} />}
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground text-sm mt-1.5 max-w-2xl">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 flex-wrap">{actions}</div>}
    </div>
  );
}

export default PageHeader;
