"use client";
import React, { useState } from "react";
import Link from "next/link";

/** Preview-only switcher, so options can be judged in place. */
export default function LayoutLab({ title, groups, links = [] }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] max-w-[95vw]">
      <div className="rounded-2xl border border-white/15 bg-black/90 backdrop-blur-md shadow-2xl overflow-hidden">
        <button onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-[10px] uppercase tracking-[2px] text-white/45 hover:text-white transition-colors">
          {title} {open ? "▾" : "▴"}
        </button>
        {open && (
          <div className="px-4 pb-3.5 space-y-2.5">
            {groups.map((g) => (
              <div key={g.name} className="flex items-center gap-3 flex-wrap">
                <span className="w-[104px] shrink-0 text-[10px] uppercase tracking-[1.5px] text-white/35">{g.name}</span>
                <div className="flex gap-1 flex-wrap">
                  {g.opts.map((o, k) => (
                    <button key={o.label} onClick={() => g.set(k)}
                      className={`text-[11px] px-2.5 py-1.5 rounded-lg transition-colors duration-200 ${
                        g.i === k ? "bg-primary text-white" : "bg-white/8 text-white/50 hover:bg-white/15"}`}>
                      {k + 1}. {o.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {links.length > 0 && (
              <div className="flex items-center gap-3 pt-1.5 border-t border-white/10">
                <span className="w-[104px] shrink-0 text-[10px] uppercase tracking-[1.5px] text-white/25">Pages</span>
                <div className="flex gap-3 flex-wrap">
                  {links.map((l) => (
                    <Link key={l.href} href={l.href} className="text-[11px] text-white/40 hover:text-primary transition-colors">{l.label}</Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const PAGE_LINKS = [
  { href: "/design-preview/whatyouget", label: "What you get" },
  { href: "/design-preview/gap", label: "The gap" },
];
