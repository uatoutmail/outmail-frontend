"use client";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import React, { useRef } from "react";
import { Reveal } from "@/component/motion/kit";

/**
 * KINETIC BAND — the four offerings, in product order.
 *
 * Pricing deliberately does not appear here. A price in the same breath as the
 * capabilities reads as a feature, and it already has two better homes: the
 * hero and the closing CTA.
 */
export function KineticBand() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["-14%", "8%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["10%", "-12%"]);
  const x3 = useTransform(scrollYProgress, [0, 1], ["-8%", "10%"]);

  const rows = [
    { x: x1, cls: "text-white", text: "COLD OUTREACH · COLD OUTREACH · " },
    { x: x2, grad: true, text: "JOB AGGREGATION · JOB AGGREGATION · " },
    { x: x3, cls: "text-white/20", text: "AUTOFILL · MENTORSHIP · AUTOFILL · MENTORSHIP · " },
  ];
  return (
    <section ref={ref} className="py-24 overflow-hidden border-y border-white/8">
      <Reveal className="px-6 max-w-5xl mx-auto mb-10">
        <p className="text-[10px] uppercase tracking-[4px] text-primary">Everything Outmail does</p>
      </Reveal>
      <div className="space-y-1 md:space-y-2">
        {rows.map((r, i) => (
          <motion.p
            key={i}
            style={reduce ? {} : { x: r.x, willChange: "transform" }}
            className={`font-syne text-[13vw] md:text-[9vw] font-bold leading-[0.95] whitespace-nowrap ${r.cls || ""}`}
          >
            {r.grad ? (
              <span className="bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent">
                {r.text}
              </span>
            ) : (
              r.text
            )}
          </motion.p>
        ))}
      </div>
    </section>
  );
}

export default KineticBand;
