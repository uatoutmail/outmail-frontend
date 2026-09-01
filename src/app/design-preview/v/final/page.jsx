"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Briefcase, Zap, Users, Check } from "lucide-react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { Reveal, MaskLines, Tilt, Count, Cta, EASE_OUT } from "../kit";
import HeroVisual from "./hero-visual";
import { KineticBand } from "./sections";
import StoryPanels from "./story-layouts";
import ValidationThread from "./validation-layouts";
import FaqTabbed from "./faq-layouts";

/**
 * THE ASSEMBLED LANDING PAGE — proposal.
 *
 * This pass:
 *  · HERO gains an object on the right — two floating glass cards carrying the
 *    two promises the headline makes, inside the same perspective so the cursor
 *    tilt moves them with the type.
 *  · KINETIC BAND now names the four offerings and nothing else. Pricing was
 *    pulled out of it: a price does not belong in the same breath as what the
 *    product does.
 *  · "HOW IT WORKS" is a story now, not a feature list. One student, four
 *    problems, and what each offering does about them. Three layouts to compare.
 *  · TESTIMONIALS and FAQ close the page.
 */

const OFFERINGS = [
  { t: "Cold outreach", d: "Personalised emails to verified recruiters, sent from your own Gmail — never from us.", I: Mail },
  { t: "Matched jobs", d: "Openings scored against your resume, with the reasoning shown so you know why.", I: Briefcase },
  { t: "One-click autofill", d: "Applications completed from answers you saved once, by a browser extension.", I: Zap },
  { t: "Mentorship", d: "Bi-weekly sessions with people who have navigated the path you are on. 25 seats.", I: Users },
];

/* ═══ HERO — two propositions, and an object that carries both ═══ */
function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="min-h-[calc(100vh-76px)] flex items-center px-6 py-16 relative" style={{ perspective: 1200 }}>
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-10 items-center">
        <Tilt max={9} z={60} className="lg:col-span-7">
          <p className="text-[10px] uppercase tracking-[4px] text-primary mb-6">Built for your placement year</p>

          {/* proposition one */}
          <MaskLines lines={["Get seen by", "real recruiters."]} accentIdx={1}
            className="font-syne text-5xl md:text-7xl font-bold tracking-tight leading-[1.03]" />

          {/* proposition two — arrives after the first has landed */}
          <div className="mt-3 overflow-hidden">
            <motion.p
              initial={reduce ? false : { y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.85, ease: EASE_OUT }}
              className="font-syne text-3xl md:text-5xl font-bold tracking-tight leading-[1.08] text-white/45">
              And find the jobs{" "}
              <span className="bg-gradient-to-r from-accent-light to-primary bg-clip-text text-transparent">worth applying to.</span>
            </motion.p>
          </div>

          <Reveal delay={1.35}>
            <p className="text-lg text-white/50 max-w-lg mt-8 mb-9">
              Cold outreach, matched jobs, one-click autofill and mentorship — one payment,
              twelve months. Less than a month of LinkedIn Premium.
            </p>
          </Reveal>
          <Reveal delay={1.5}>
            <div className="flex flex-wrap items-center gap-4">
              <Cta />
              <span className="text-sm text-white/35">₹999 · full refund within 7 days</span>
            </div>
          </Reveal>
        </Tilt>

        {/* the object. Hidden below lg — on a phone it would only push the CTA
            off the fold, and the headline is the thing that has to land there. */}
        <div className="hidden lg:block lg:col-span-5">
          <HeroVisual />
        </div>
      </div>

      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[3px] text-white/25"
        animate={reduce ? {} : { y: [0, 7, 0] }} transition={{ duration: 2, repeat: Infinity }}>scroll</motion.div>
    </section>
  );
}

/* ═══ EDITORIAL FEATURES ═══ */
function Editorial() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-28">
      <Reveal><p className="text-[10px] uppercase tracking-[4px] text-primary mb-10">The four things</p></Reveal>
      <div className="grid grid-cols-12 gap-x-10 gap-y-16">
        <div className="col-span-12 md:col-span-7">
          <MaskLines lines={["Most resumes are", "never read by a", "human being."]} accentIdx={2}
            className="font-syne text-4xl md:text-5xl font-bold leading-[1.03] tracking-tight" />
        </div>
        <Reveal delay={0.3} className="col-span-12 md:col-span-5 md:border-l border-white/15 md:pl-8 md:pt-3">
          <p className="font-syne text-5xl font-bold text-primary/30 leading-none mb-2"><Count to={250} suffix="+" /></p>
          <p className="text-sm text-white/50 leading-relaxed">
            applications per opening. A recruiter reads perhaps twelve. Outmail is how you become
            one of the twelve — and how you find the openings worth that effort.
          </p>
        </Reveal>
        {OFFERINGS.map((o, i) => (
          <Reveal key={o.t} delay={i * 0.06} className={i % 2 === 0 ? "col-span-12 md:col-span-7" : "col-span-12 md:col-span-5"}>
            <div className="border-t border-white/12 pt-5">
              <div className="flex items-baseline gap-3 mb-2">
                <o.I size={17} className="text-primary translate-y-0.5" />
                <p className="font-syne text-2xl md:text-3xl font-bold">{o.t}</p>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">{o.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default function FinalLanding() {
  return (
    <div className="min-h-screen bg-surface-page text-white">
      <Navbar variant="dark" />
      <Hero />
      <KineticBand />
      <Editorial />

      <StoryPanels />
      <ValidationThread />
      <FaqTabbed />

      {/* CTA */}
      <section className="relative max-w-4xl mx-auto px-6 py-28 text-center">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-primary/18 blur-[130px] pointer-events-none" />
        <div className="relative">
          <Reveal>
            <p className="font-syne text-4xl md:text-6xl font-bold tracking-tight mb-5">
              Your placement year<br />starts <span className="bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent">now.</span>
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-white/50 mb-3">
              <span className="font-syne text-3xl font-bold text-white"><Count to={999} prefix="₹" /></span>
              <span className="ml-2">for twelve months</span>
            </p>
          </Reveal>
          <Reveal delay={0.2}><p className="text-sm text-white/35 mb-9">No subscription. Nothing renews. Full refund within 7 days.</p></Reveal>
          <Reveal delay={0.3}><div><Cta /></div></Reveal>
          <Reveal delay={0.4}>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-10 text-xs text-white/35">
              {OFFERINGS.map((o) => (
                <span key={o.t} className="inline-flex items-center gap-1.5"><Check size={11} className="text-primary" />{o.t}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Footer variant="dark" />

    </div>
  );
}
