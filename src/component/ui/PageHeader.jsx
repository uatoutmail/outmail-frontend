"use client";
import { motion, useReducedMotion } from "framer-motion";
import React from "react";
import { Reveal, MaskLines, Kicker } from "@/component/motion/kit";

/**
 * The header every non-landing page opens with.
 *
 * One component so that nine pages cannot drift into nine different opening
 * treatments — which is exactly what had happened: some pages led with a
 * gradient hero, some with a bare h1, and the kicker label appeared in three
 * different colours and two different fonts.
 *
 * `lines` is an array so the heading can use the site's masked line-by-line
 * reveal rather than fading in as a block.
 */
export default function PageHeader({
  kicker,
  lines,
  sub,
  accentIdx = 1,
  children,
  compact = false,
}) {
  const reduce = useReducedMotion();
  return (
    <header
      className={`relative px-6 overflow-hidden ${compact ? "pt-16 pb-10" : "pt-20 pb-16 md:pt-24 md:pb-20"}`}
    >
      {/* one soft brand bloom — the same device as the landing page's closing CTA */}
      <motion.div
        aria-hidden
        initial={reduce ? false : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[760px] h-[460px]"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, var(--brand-primary) 20%, transparent), transparent 70%)",
        }}
      />
      <div className="relative max-w-5xl mx-auto">
        {kicker && (
          <Reveal>
            <Kicker className="mb-5">{kicker}</Kicker>
          </Reveal>
        )}
        <MaskLines
          as="h1"
          lines={lines}
          accentIdx={accentIdx}
          className="font-syne text-4xl md:text-6xl font-bold tracking-tight leading-[1.04]"
        />
        {sub && (
          <Reveal delay={0.25}>
            <p className="text-white/45 text-base md:text-lg leading-relaxed max-w-2xl mt-6">
              {sub}
            </p>
          </Reveal>
        )}
        {children && (
          <Reveal delay={0.35}>
            <div className="mt-9">{children}</div>
          </Reveal>
        )}
      </div>
    </header>
  );
}
