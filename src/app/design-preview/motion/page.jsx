"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion, animate, useInView } from "framer-motion";
import { RotateCw, Mail, Check, Clock, ArrowRight, Zap } from "lucide-react";

/**
 * MOTION REFERENCE — /design-preview/motion
 *
 * The vocabulary, in one place, replayable and tunable. The point is that pages
 * should ASSEMBLE from these rather than invent their own timings — a site
 * where every section eases differently feels assembled, not designed.
 *
 * The speed control at the top is the real decision: marketing pages can be
 * theatrical, but a dashboard someone opens every day should be quicker. Drag
 * it to 0.5x and every pattern below re-runs at product speed so the difference
 * can be felt rather than argued about.
 *
 * Timings come from the ui-ux-pro-max motion.csv, converted from GSAP eases to
 * Framer cubic-beziers.
 */

const EASE_OUT = [0.16, 1, 0.3, 1];      // power2.out
const EASE_BACK = [0.34, 1.56, 0.64, 1]; // back.out(1.4) — the overshoot
const EASE_INOUT = [0.65, 0, 0.35, 1];

/* A replayable demo cell. Everything on the page lives in one of these. */
function Cell({ title, spec, why, children }) {
  const [k, setK] = useState(0);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex items-start justify-between gap-3 mb-1">
        <h3 className="font-semibold text-sm">{title}</h3>
        <button
          onClick={() => setK((n) => n + 1)}
          className="shrink-0 text-white/40 hover:text-primary transition-colors duration-200"
          aria-label={`Replay ${title}`}
        >
          <RotateCw size={14} />
        </button>
      </div>
      <p className="text-[11px] font-mono text-primary/80 mb-4">{spec}</p>
      <div className="min-h-[132px] flex items-center justify-center rounded-xl bg-black/25 p-4 mb-4">
        <div key={k} className="w-full">{children}</div>
      </div>
      <p className="text-xs text-white/40 leading-relaxed">{why}</p>
    </div>
  );
}

export default function MotionReference() {
  const reduce = useReducedMotion();
  const [speed, setSpeed] = useState(1);        // 1 = marketing, 0.5 = product
  const t = (d) => (reduce ? 0 : d * speed);

  return (
    <div className="min-h-screen bg-surface-page text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">

        <p className="text-xs uppercase tracking-[4px] text-primary mb-3">Motion</p>
        <h1 className="font-syne text-4xl md:text-5xl font-bold tracking-tight mb-4">
          The vocabulary
        </h1>
        <p className="text-white/55 max-w-2xl leading-relaxed mb-8">
          Every pattern the site is allowed to use. Pages assemble from these rather than
          inventing their own — a site where each section eases differently feels assembled,
          not designed. Click the ↻ on any cell to replay it.
        </p>

        {/* ---- the speed decision ---- */}
        <div className="rounded-2xl border border-primary/30 bg-primary/[0.06] p-6 mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div>
              <p className="font-semibold text-sm mb-1">Marketing speed vs product speed</p>
              <p className="text-xs text-white/50 max-w-xl leading-relaxed">
                A landing page can be theatrical — you see it once and it should impress.
                A dashboard is opened every day, and the same animation becomes a delay you
                sit through. Same vocabulary, shorter durations. Drag to feel the difference.
              </p>
            </div>
            <span className="font-mono text-2xl text-primary shrink-0">{speed.toFixed(2)}×</span>
          </div>
          <input
            type="range" min="0.3" max="1.4" step="0.05" value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-[10px] uppercase tracking-[2px] text-white/35 mt-2">
            <span>0.3× — snappy</span>
            <span>0.5× — proposed for dashboard</span>
            <span>1× — proposed for marketing</span>
            <span>1.4×</span>
          </div>
        </div>

        {reduce && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-5 mb-10 text-sm text-amber-200/90">
            You have <code>prefers-reduced-motion</code> on, so everything below renders
            instantly. That is the correct behaviour — turn it off to see the motion.
          </div>
        )}

        {/* ================= ENTRANCES ================= */}
        <h2 className="font-syne text-xl font-bold mb-1">Entrances</h2>
        <p className="text-sm text-white/40 mb-5">How things arrive. Used once per section, never twice.</p>
        <div className="grid md:grid-cols-2 gap-4 mb-12">

          <Cell title="Hero — word by word" spec={`${Math.round(600*speed)}ms · back.out · 80ms stagger`}
            why="The single most 'designed' moment on any page. Reserve it for the h1 — used twice it stops reading as craft and starts reading as a gimmick.">
            <p className="font-syne text-2xl font-bold text-center">
              {["Get", "seen", "by", "real", "recruiters."].map((w, i) => (
                <motion.span key={i}
                  initial={reduce ? false : { opacity: 0, y: 26, rotateX: -50 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: t(0.6), delay: t(i * 0.08), ease: EASE_BACK }}
                  className={`inline-block mr-[0.22em] ${i === 3 ? "text-primary" : ""}`}
                >{w}</motion.span>
              ))}
            </p>
          </Cell>

          <Cell title="Scroll reveal" spec={`${Math.round(500*speed)}ms · power2.out · y+28`}
            why="The workhorse — every section below the fold uses this. Fires once, never on scroll back up, because re-animating content someone has already read is irritating.">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: t(0.5), ease: EASE_OUT }}
              className="rounded-xl border border-white/12 bg-white/[0.04] p-5 text-center text-sm text-white/70"
            >Section content</motion.div>
          </Cell>

          <Cell title="Stagger list" spec={`${Math.round(450*speed)}ms · back.out · 90ms apart`}
            why="For anything that arrives as a set — feature cards, plan features, a list of recruiters. The overshoot is what makes it feel alive rather than mechanical.">
            <div className="space-y-2">
              {[0,1,2].map((i)=>(
                <motion.div key={i}
                  initial={reduce ? false : { opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: t(0.45), delay: t(i*0.09), ease: EASE_BACK }}
                  className="flex items-center gap-2.5 rounded-lg bg-white/[0.05] px-3 py-2.5 text-sm text-white/70"
                ><Check size={13} className="text-primary" />Feature {i+1}</motion.div>
              ))}
            </div>
          </Cell>

          <Cell title="Counter" spec={`${Math.round(1400*speed)}ms · power2.out`}
            why="Numbers that count up read as live data even when static. Cheap, and disproportionately effective on pricing and stats.">
            <CounterDemo to={999} prefix="₹" speed={speed} reduce={reduce} />
          </Cell>
        </div>

        {/* ================= INTERACTIONS ================= */}
        <h2 className="font-syne text-xl font-bold mb-1">Interactions</h2>
        <p className="text-sm text-white/40 mb-5">Response to a person. These run constantly, so they must stay short.</p>
        <div className="grid md:grid-cols-3 gap-4 mb-12">

          <Cell title="Card lift" spec={`${Math.round(220*speed)}ms · power2.out · y-6`}
            why="Hover me. The border brightening matters as much as the lift — movement alone reads as instability.">
            <motion.div whileHover={reduce?{}:{ y: -6 }} transition={{ duration: t(0.22), ease: EASE_OUT }}
              className="rounded-xl border border-white/12 hover:border-primary/60 bg-white/[0.04] p-5 text-center text-sm text-white/70 cursor-pointer transition-colors duration-200"
            >Hover me</motion.div>
          </Cell>

          <Cell title="Button press" spec={`${Math.round(200*speed)}ms · lift + scale`}
            why="Lift on hover, compress on press. The compression is what makes a button feel physical rather than painted on.">
            <motion.button whileHover={reduce?{}:{ y:-3, scale:1.02 }} whileTap={reduce?{}:{ scale:0.97 }}
              transition={{ duration: t(0.2), ease: EASE_OUT }}
              className="w-full bg-primary text-white text-sm font-semibold py-3 rounded-full inline-flex items-center justify-center gap-2"
            >Get Outmail <ArrowRight size={14} /></motion.button>
          </Cell>

          <Cell title="Icon spring" spec={`${Math.round(250*speed)}ms · back.out · rotate -8°`}
            why="A small rotate and scale on the icon inside a card being hovered. Detail nobody consciously notices and everybody feels.">
            <motion.div whileHover={reduce?{}:{ rotate:-8, scale:1.12 }} transition={{ duration: t(0.25), ease: EASE_BACK }}
              className="w-14 h-14 mx-auto rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center cursor-pointer"
            ><Mail size={22} className="text-primary" /></motion.div>
          </Cell>
        </div>

        {/* ================= STATE ================= */}
        <h2 className="font-syne text-xl font-bold mb-1">State changes</h2>
        <p className="text-sm text-white/40 mb-5">The product surfaces. This is where motion earns its keep, not the marketing site.</p>
        <div className="grid md:grid-cols-3 gap-4 mb-12">

          <Cell title="Status transition" spec={`${Math.round(300*speed)}ms · crossfade + slide`}
            why="Queued becoming Sent. Animating the change makes it legible; swapping the text instantly means people miss it happened at all.">
            <StatusDemo speed={speed} reduce={reduce} />
          </Cell>

          <Cell title="Skeleton" spec="1400ms loop · sine.inOut"
            why="Shaped like the content it replaces, never a spinner. A skeleton that matches the final layout means zero shift when data lands — which is most of what 'feels fast' actually is.">
            <div className="space-y-2.5 w-full">
              {[70,100,45].map((w,i)=>(
                <motion.div key={i} className="h-3 rounded-full bg-white/10" style={{ width:`${w}%` }}
                  animate={reduce?{}:{ opacity:[0.35,0.75,0.35] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: i*0.15 }} />
              ))}
            </div>
          </Cell>

          <Cell title="Progress fill" spec={`${Math.round(800*speed)}ms · power2.out`}
            why="Send caps, seats remaining, the weekly plan. Filling from zero shows the value is real rather than decorative.">
            <div className="w-full">
              <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-2">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-accent-light"
                  initial={reduce?false:{ width:0 }} animate={{ width:"62%" }}
                  transition={{ duration: t(0.8), ease: EASE_OUT }} />
              </div>
              <p className="text-xs text-white/40">18 of 29 sent this week</p>
            </div>
          </Cell>
        </div>

        {/* ================= THE EXPENSIVE ONE ================= */}
        <h2 className="font-syne text-xl font-bold mb-1">Mechanism animation</h2>
        <p className="text-sm text-white/40 mb-5">
          The expensive category — bespoke per idea, and the reason the site can carry less copy.
          Budget three or four across the whole site, not one per section.
        </p>
        <div className="mb-12">
          <Cell title="Outreach, explained without a paragraph" spec={`~${Math.round(2400*speed)}ms sequence`}
            why="Replaces 'we send personalised emails to verified recruiters from your own inbox'. Shows it once, then one caption. This is the pattern the whole site is built around.">
            <MechanismDemo speed={speed} reduce={reduce} />
          </Cell>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7">
          <p className="text-sm text-white/70 mb-3 font-medium">Rules that come with this vocabulary</p>
          <ul className="text-sm text-white/50 space-y-2.5 leading-relaxed list-disc pl-5">
            <li><strong className="text-white/70">One continuously-animating element per page.</strong> Continuous motion is what makes a page feel cheap, and it costs battery on the laptops these students own.</li>
            <li><strong className="text-white/70">Transform and opacity only.</strong> Never animate width or height — they force layout on every frame.</li>
            <li><strong className="text-white/70">Reserve space.</strong> Anything animating in must not shift what is already on screen.</li>
            <li><strong className="text-white/70">Reveal once.</strong> Never re-animate on scroll back up.</li>
            <li><strong className="text-white/70">Every pattern honours <code>prefers-reduced-motion</code>.</strong> Non-negotiable.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function CounterDemo({ to, prefix, speed, reduce }) {
  const [v, setV] = useState(reduce ? to : 0);
  useEffect(() => {
    if (reduce) return;
    const c = animate(0, to, { duration: 1.4 * speed, ease: EASE_OUT, onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [to, speed, reduce]);
  return <p className="font-syne text-4xl font-bold text-center">{prefix}{v.toLocaleString("en-IN")}</p>;
}

function StatusDemo({ speed, reduce }) {
  // Derived, not synced: with reduced motion there is no transition to show, so
  // the resolved state IS the initial state. Setting it in an effect would fire
  // a cascading render for no benefit.
  const [sent, setSent] = useState(reduce);
  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(() => setSent(true), 900 * speed);
    return () => clearTimeout(id);
  }, [speed, reduce]);
  return (
    <AnimatePresence mode="wait">
      <motion.span key={sent ? "s" : "q"}
        initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 * speed, ease: EASE_OUT }}
        className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border ${
          sent ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
               : "bg-amber-500/15 text-amber-300 border-amber-500/30"}`}
      >
        {sent ? <Check size={12} /> : <Clock size={12} />}{sent ? "Sent" : "Queued"}
      </motion.span>
    </AnimatePresence>
  );
}

function MechanismDemo({ speed, reduce }) {
  const s = (n) => n * speed;
  return (
    <div className="grid grid-cols-3 gap-3 items-center w-full">
      <motion.div initial={reduce?false:{ opacity:0, scale:0.94 }} animate={{ opacity:1, scale:1 }}
        transition={{ duration: s(0.45), ease: EASE_BACK }}
        className="rounded-xl border border-white/12 bg-white/[0.04] p-3">
        <p className="text-[9px] uppercase tracking-[2px] text-white/40 mb-2">Your resume</p>
        {[70,92,55].map((w,i)=>(
          <motion.div key={i} className="h-1 rounded-full bg-white/20 mb-1.5"
            initial={reduce?false:{ width:0 }} animate={{ width:`${w}%` }}
            transition={{ duration: s(0.5), delay: s(0.2+i*0.1), ease: EASE_OUT }} />
        ))}
      </motion.div>

      <div className="relative flex items-center justify-center h-16">
        <motion.div initial={reduce?false:{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }}
          transition={{ duration: s(0.6), delay: s(0.85), ease: EASE_BACK }}
          className="rounded-xl bg-primary px-3.5 py-3 shadow-[0_12px_30px_-10px_rgba(76,31,255,0.8)]">
          <Mail size={16} className="text-white" />
        </motion.div>
      </div>

      <motion.div initial={reduce?false:{ opacity:0, scale:0.94 }} animate={{ opacity:1, scale:1 }}
        transition={{ duration: s(0.45), delay: s(1.45), ease: EASE_BACK }}
        className="rounded-xl border border-white/12 bg-white/[0.04] p-3">
        <p className="text-[9px] uppercase tracking-[2px] text-white/40 mb-2">A recruiter</p>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent-light" />
          <div className="flex-1">
            <div className="h-1 w-full rounded-full bg-white/25 mb-1" />
            <div className="h-1 w-2/3 rounded-full bg-white/12" />
          </div>
        </div>
        <motion.p initial={reduce?false:{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ delay: s(2.0), duration: s(0.4) }}
          className="text-[10px] text-primary mt-2 font-medium">replied</motion.p>
      </motion.div>
    </div>
  );
}
