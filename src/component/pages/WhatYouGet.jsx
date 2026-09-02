"use client";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Radio, Search, GraduationCap, BarChart3 } from "lucide-react";
import React, { useRef } from "react";
import { Reveal, MaskLines, Kicker } from "@/component/motion/kit";

/**
 * The pricing page's "what you get" section.
 *
 * A kinetic band names the four capabilities and a two-column list explains
 * them. It replaced a left-text / right-mock split whose mock was a large
 * empty rectangle on wide screens — and it reuses the landing page's kinetic
 * type, so the two pages sound like one site rather than two.
 *
 * `stat` is unused by this layout but kept on the data: it belongs to the
 * copy, not to the arrangement.
 */
export const BENEFITS = [
  {
    Icon: Radio,
    n: "01",
    t: "Direct recruiter outreach",
    d: "Bypass the ATS and land in a recruiter's inbox — from your own Gmail, personalised from your resume.",
    stat: "5/day",
    statL: "warm-up, growing",
  },
  {
    Icon: Search,
    n: "02",
    t: "Curated job intelligence",
    d: "Openings ranked by hiring urgency and company growth, scored against your resume with the reasoning shown.",
    stat: "94",
    statL: "match score, explained",
  },
  {
    Icon: GraduationCap,
    n: "03",
    t: "Expert mentorship sessions",
    d: "Live sessions with people who have navigated the exact path you're on. Real advice, not generic tips.",
    stat: "25",
    statL: "seats, capped",
  },
  {
    Icon: BarChart3,
    n: "04",
    t: "Campaign analytics",
    d: "Opens, replies and outreach performance in real time — so you know what is working and where to push.",
    stat: "12mo",
    statL: "one payment",
  },
];

const HEAD = ["Every edge you need,", "in one place."];

export function BenefitMarquee() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["-8%", "6%"]);
  return (
    <section ref={ref} className="py-24">
      <Reveal className="max-w-5xl mx-auto px-6 mb-8">
        <Kicker className="mb-5">What you get</Kicker>
        <MaskLines
          lines={HEAD}
          accentIdx={1}
          className="font-syne text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]"
        />
      </Reveal>
      <div className="overflow-hidden py-6 mb-10 border-y border-white/8">
        <motion.p
          style={reduce ? {} : { x, willChange: "transform" }}
          className="font-syne text-[9vw] md:text-[5.5vw] font-bold leading-none whitespace-nowrap text-white/85"
        >
          OUTREACH <span className="text-primary">·</span> INTELLIGENCE{" "}
          <span className="text-primary">·</span> MENTORSHIP <span className="text-primary">·</span>{" "}
          ANALYTICS <span className="text-primary">·</span> OUTREACH{" "}
          <span className="text-primary">·</span>
        </motion.p>
      </div>
      <div className="max-w-5xl mx-auto px-6 grid sm:grid-cols-2 gap-x-10 gap-y-8">
        {BENEFITS.map((b, i) => (
          <Reveal key={b.t} delay={i * 0.06}>
            <div className="flex gap-4">
              <b.Icon size={18} className="text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-syne text-lg font-bold mb-1.5">{b.t}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{b.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default BenefitMarquee;
