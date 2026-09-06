"use client";
import { motion, useReducedMotion } from "framer-motion";
import React from "react";
import HeroVisual from "./HeroVisual";
import { Reveal, MaskLines, Tilt, Cta, Kicker, EASE_OUT } from "@/component/motion/kit";
import { HERO } from "@/content/landing";

/**
 * Landing hero.
 *
 * Carries TWO propositions, in sequence. The first lands on its own, then a
 * second arrives beneath it about matched jobs — outreach alone undersells the
 * product, and job aggregation was previously invisible above the fold.
 *
 * The whole block sits inside one perspective so the cursor tilt moves the
 * headline and the floating cards together rather than as two separate toys.
 *
 * `copy` defaults to HERO[0], which is exactly the production wording — so the
 * live page is unchanged and only the content lab passes anything else.
 */
export default function Hero({ copy = HERO[0] }) {
  const reduce = useReducedMotion();
  return (
    <section
      className="min-h-[calc(100vh-68px)] flex items-center px-6 py-16 relative"
      style={{ perspective: 1200 }}
    >
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-10 items-center">
        <Tilt max={9} z={60} className="lg:col-span-7">
          <Kicker className="mb-6">{copy.kicker}</Kicker>

          <MaskLines
            key={copy.label}
            as="h1"
            lines={copy.lines}
            accentIdx={1}
            className="font-syne text-5xl md:text-7xl font-bold tracking-tight leading-[1.03]"
          />

          <div className="mt-3 overflow-hidden">
            <motion.p
              initial={reduce ? false : { y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.85, ease: EASE_OUT }}
              className="font-syne text-3xl md:text-5xl font-bold tracking-tight leading-[1.08] text-white/45"
            >
              {copy.second.lead}{" "}
              <span className="bg-gradient-to-r from-accent-light to-primary bg-clip-text text-transparent">
                {copy.second.accent}
              </span>
            </motion.p>
          </div>

          <Reveal delay={1.35}>
            <p className="text-lg text-white/50 max-w-lg mt-8 mb-9">{copy.sub}</p>
          </Reveal>
          <Reveal delay={1.5}>
            <div className="flex flex-wrap items-center gap-4">
              <Cta label={copy.cta} />
              <span className="text-sm text-white/35">{copy.micro}</span>
            </div>
          </Reveal>
        </Tilt>

        {/* Hidden below lg: on a phone it would only push the CTA off the fold,
            and the headline is the thing that has to land there. */}
        <div className="hidden lg:block lg:col-span-5">
          <HeroVisual />
        </div>
      </div>

      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[3px] text-white/25"
        animate={reduce ? {} : { y: [0, 7, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        scroll
      </motion.div>
    </section>
  );
}
