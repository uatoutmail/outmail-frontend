"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Briefcase, Check } from "lucide-react";
import React from "react";

const EASE_OUT = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

/**
 * Hero right-hand object.
 *
 * Two glass cards floating at different depths — one recruiter, one matched job —
 * because the hero now makes TWO promises and the visual should carry both.
 * They drift continuously but slowly, on opposed cycles so they never look
 * mechanically linked, and they sit inside the hero's existing perspective so
 * the cursor tilt moves them with the headline.
 */
export default function HeroVisual() {
  const reduce = useReducedMotion();
  // Solid translucent panels, not backdrop-blur: these two cards float
  // continuously, and a backdrop-filter on a permanently-animating element is
  // re-sampled every single frame. Over a near-black page the visual
  // difference is nil and the frame cost is gone.
  const float = (dur, amp) =>
    reduce
      ? {}
      : {
          animate: { y: [0, -amp, 0] },
          transition: { duration: dur, repeat: Infinity, ease: "easeInOut" },
          style: { willChange: "transform" },
        };

  return (
    <div
      className="relative w-full h-[380px] hidden lg:block"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* glow behind, so the cards read as lit rather than pasted on */}
      <div
        className="absolute right-8 top-16 w-[340px] h-[340px]"
        style={{
          background:
            "radial-gradient(circle at center, color-mix(in srgb, var(--brand-primary) 32%, transparent), transparent 68%)",
        }}
      />

      {/* card 1 — the recruiter */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 30, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: -6 }}
        transition={{ duration: 0.7, delay: 0.4, ease: EASE_BACK }}
        style={{ transform: "translateZ(90px)" }}
        className="absolute right-16 top-4 w-[260px]"
      >
        <motion.div
          {...float(5.5, 10)}
          className="rounded-2xl border border-white/15 bg-[#171029]/90 p-5 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent-light shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">Priya Sharma</p>
              <p className="text-[11px] text-white/45 truncate">Talent · Razorpay</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
              <Check size={9} /> verified
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
              <Mail size={9} /> emailed
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* card 2 — the matched job, lower and further back */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 34, rotate: 5 }}
        animate={{ opacity: 1, y: 0, rotate: 5 }}
        transition={{ duration: 0.7, delay: 0.75, ease: EASE_BACK }}
        style={{ transform: "translateZ(40px)" }}
        className="absolute right-4 top-48 w-[250px]"
      >
        <motion.div
          {...float(7, 13)}
          className="rounded-2xl border border-white/12 bg-[#140e24]/90 p-5 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-3">
            <Briefcase size={15} className="text-accent-light" />
            <span className="font-mono text-sm text-primary font-semibold">94</span>
          </div>
          <p className="text-sm font-semibold mb-1">SDE Intern · Razorpay</p>
          <p className="text-[11px] text-white/45 mb-3">Bengaluru · matched to your resume</p>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent-light"
              initial={reduce ? false : { width: 0 }}
              animate={{ width: "94%" }}
              transition={{ duration: 1, delay: 1.2, ease: EASE_OUT }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* the line between them — the product in one stroke */}
      {!reduce && (
        <motion.svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ transform: "translateZ(20px)" }}
        >
          <motion.path
            d="M 120 120 Q 170 190 100 250"
            fill="none"
            stroke="url(#g)"
            strokeWidth="1.5"
            strokeDasharray="4 5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.55 }}
            transition={{ duration: 1.1, delay: 1.1, ease: EASE_OUT }}
          />
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4c1fff" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
        </motion.svg>
      )}
    </div>
  );
}
