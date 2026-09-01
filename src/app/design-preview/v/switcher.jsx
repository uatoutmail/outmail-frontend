"use client";
import React from "react";
import Link from "next/link";
import { CONCEPTS } from "./kit";

/** Floating switcher — pinned so you can flip concepts without going back. */
export default function Switcher({ current }) {
  const c = CONCEPTS.find((x) => x.id === current);
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[95vw]">
      <div className="rounded-2xl border border-white/15 bg-black/85 backdrop-blur-xl px-3 py-2.5 shadow-2xl">
        <p className="text-[10px] uppercase tracking-[2px] text-white/40 text-center mb-2">
          {current}/10 · <span className="text-primary">{c?.name}</span> — {c?.tag}
        </p>
        <div className="flex items-center gap-1 overflow-x-auto">
          {CONCEPTS.map((x) => (
            <Link key={x.id} href={`/design-preview/v/${x.id}`}
              className={`shrink-0 w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors duration-200 ${
                x.id === current ? "bg-primary text-white" : "bg-white/8 text-white/50 hover:bg-white/15"}`}>
              {x.id}
            </Link>
          ))}
          <Link href="/design-preview/v/1" className="ml-2 shrink-0 text-[10px] uppercase tracking-[2px] text-white/35 hover:text-primary px-2">
            index
          </Link>
        </div>
      </div>
    </div>
  );
}
