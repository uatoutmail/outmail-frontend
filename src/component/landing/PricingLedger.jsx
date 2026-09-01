"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Minus, Users, Flame } from "lucide-react";
import { getPlans } from "@/lib/payments";
import { formatPaise } from "@/lib/paymentOutcome";
import { Reveal, MaskLines, Cta, Kicker, EASE_OUT } from "@/component/motion/kit";

/**
 * The landing page's pricing section.
 *
 * EVERY PRICE COMES FROM /api/payments/plans. Nothing is hardcoded, for the
 * same reason component/pricing.jsx is not: this site once carried its own
 * copy of the prices and drifted so far from the database that it advertised
 * "$0 free forever" for a plan the backend charged ₹499 for (OUT-232). The
 * struck-through figure is plan.list_amount — real data, not decoration.
 *
 * A ledger rather than cards, because the plans differ by exactly one thing.
 * The mentorship-only rows are tinted so that difference reads as a block.
 */

/* Feature copy is presentation, not billing data, so it lives here. The `a`/`b`
   flags describe which plan includes each row. */
const MATRIX = [
  { label: "Cold outreach to verified recruiters", a: true, b: true },
  { label: "Resume-matched job feed with an explainable score", a: true, b: true },
  { label: "One-click application autofill", a: true, b: true },
  { label: "Send scheduling, hiring-signal targeting, analytics", a: true, b: true },
  { label: "Bi-weekly mentorship sessions", a: false, b: true },
  { label: "Mentor Q&A and session recordings", a: false, b: true },
  { label: "Priority support", a: false, b: true },
];

/**
 * The launch offer.
 *
 * States what the offer is, who it is for, and what happens when it ends — in
 * that order, and with no countdown timer. A cohort cap is a promise we can
 * keep; a clock is one we would have to keep resetting, and a reset clock is
 * the most recognisable dark pattern there is.
 *
 * The places-remaining bar renders ONLY when the API supplies a real number.
 * Inventing one would be a false scarcity claim, which is actionable under the
 * CCPA 2023 dark-pattern guidelines and trivially disproved by refreshing.
 */
function LaunchBanner({ price, listPrice, placesLeft, placesTotal }) {
  const known = typeof placesLeft === "number" && typeof placesTotal === "number" && placesTotal > 0;
  const pct = known ? Math.max(2, Math.round(((placesTotal - placesLeft) / placesTotal) * 100)) : 0;
  const total = known ? placesTotal.toLocaleString("en-IN") : null;
  return (
    <Reveal delay={0.06}>
      <div className="rounded-2xl border border-primary/35 bg-gradient-to-r from-primary/15 via-primary/[0.07] to-transparent px-6 py-5 mb-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 justify-between">
          <div className="flex items-center gap-3">
            <span aria-hidden className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
              <Flame size={16} className="text-primary" />
            </span>
            <div>
              <p className="font-syne font-bold text-[15px] leading-tight">
                Launch price — {price} instead of{" "}
                <span className="text-white/35 line-through font-normal">{listPrice}</span>
              </p>
              <p className="text-xs text-white/45 mt-0.5">
                {total ? `For the first ${total} students in India. ` : ""}
                After that it is {listPrice}.
              </p>
            </div>
          </div>
          {known && (
            <div className="w-full sm:w-56">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-white/45">Launch places</span>
                <span className="font-mono text-primary">
                  {placesLeft.toLocaleString("en-IN")} of {total} left
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: EASE_OUT }}
                  className="h-full bg-gradient-to-r from-primary to-accent-light" />
              </div>
            </div>
          )}
        </div>
        <p className="text-[11px] text-white/30 mt-3">
          Buy at the launch price and you keep the full year at that price — we never ask for the difference later.
        </p>
      </div>
    </Reveal>
  );
}

export default function PricingLedger() {
  const [plans, setPlans] = useState(null);   // null = still loading
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    getPlans()
      .then((data) => { if (alive) setPlans(Array.isArray(data) ? data : []); })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, []);

  const a = plans?.find((p) => p.code === "PLAN_A");
  const b = plans?.find((p) => p.code === "PLAN_B");

  return (
    <section id="pricing" className="max-w-4xl mx-auto px-6 py-28">
      <Reveal>
        <Kicker className="mb-4">Pricing</Kicker>
        <MaskLines lines={["What each plan", "actually includes."]}
          className="font-syne text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]" />
        <p className="text-white/45 mt-4 max-w-lg">
          The only difference is mentorship. Rather than dress that up, here it is as a list.
          One payment either way — nothing renews.
        </p>
      </Reveal>

      <div className="mt-12">
        {/* If the price cannot be fetched we say so and send people to the
            pricing page, rather than render a plausible-looking wrong number. */}
        {failed || (plans && !a) ? (
          <Reveal>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">
              <p className="text-white/55 mb-5">We couldn&rsquo;t load live pricing just now.</p>
              <Cta label="See pricing" href="/pricing" />
            </div>
          </Reveal>
        ) : (
          <>
            {/* The banner only appears while the offer is genuinely live: there
                must be a real list price above the current one, and places must
                remain. When the cohort fills it disappears rather than counting
                down to "0 left", which would be an offer we are still taking
                money on. */}
            {a && a.list_amount > a.amount && a.launchPlacesLeft !== 0 && (
              <LaunchBanner
                price={formatPaise(a.amount, a.currency)}
                listPrice={formatPaise(a.list_amount, a.currency)}
                placesLeft={a.launchPlacesLeft}
                placesTotal={a.launchPlacesTotal}
              />
            )}

            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-white/10 overflow-hidden">
                <div className="grid grid-cols-12 gap-3 px-5 sm:px-6 py-6 border-b border-white/10 bg-white/[0.02] items-end">
                  <div className="col-span-6" />
                  <div className="col-span-3 text-center">
                    <p className="text-[10px] uppercase tracking-[2px] text-primary mb-1.5">Outreach &amp; Jobs</p>
                    <p className="font-syne text-2xl sm:text-3xl font-bold leading-none">
                      {a ? formatPaise(a.amount, a.currency) : <span className="inline-block w-20 h-7 rounded bg-white/10 animate-pulse align-middle" />}
                    </p>
                    {a?.list_amount > a?.amount && (
                      <p className="text-[11px] text-white/25 line-through mt-1">{formatPaise(a.list_amount, a.currency)}</p>
                    )}
                  </div>
                  <div className="col-span-3 text-center">
                    <p className="text-[10px] uppercase tracking-[2px] text-accent-light mb-1.5">+ Mentorship</p>
                    <p className="font-syne text-2xl sm:text-3xl font-bold leading-none">
                      {b ? formatPaise(b.amount, b.currency) : <span className="inline-block w-20 h-7 rounded bg-white/10 animate-pulse align-middle" />}
                    </p>
                    {b?.seatsRemaining != null && (
                      <p className="text-[11px] text-accent-light mt-1 font-mono inline-flex items-center gap-1">
                        <Users size={10} />{b.seatsRemaining}/{b.max_seats} seats
                      </p>
                    )}
                  </div>
                </div>

                {MATRIX.map((r, i) => (
                  <Reveal key={r.label} delay={i * 0.03}>
                    <div className={`grid grid-cols-12 gap-3 px-5 sm:px-6 py-4 items-center border-b border-white/[0.06] ${!r.a ? "bg-accent-light/[0.05]" : ""}`}>
                      <span className="col-span-6 text-[13px] sm:text-sm text-white/60 leading-snug">{r.label}</span>
                      <span className="col-span-3 flex justify-center">
                        {r.a ? <Check size={16} className="text-primary" aria-label="included" />
                             : <Minus size={16} className="text-white/15" aria-label="not included" />}
                      </span>
                      <span className="col-span-3 flex justify-center">
                        {r.b ? <Check size={16} className="text-accent-light" aria-label="included" />
                             : <Minus size={16} className="text-white/15" aria-label="not included" />}
                      </span>
                    </div>
                  </Reveal>
                ))}

                <div className="grid grid-cols-12 gap-3 px-5 sm:px-6 py-6 items-center bg-white/[0.02]">
                  <span className="col-span-12 sm:col-span-6 text-[11px] text-white/30 leading-relaxed mb-3 sm:mb-0">
                    One payment. Twelve months. Nothing renews. All taxes included.
                    Full refund within 7 days.
                  </span>
                  <div className="col-span-6 sm:col-span-3 flex justify-center"><Cta label="Get it" href="/pricing" /></div>
                  <div className="col-span-6 sm:col-span-3 flex justify-center">
                    <Link href="/pricing"
                      className="font-syne font-semibold text-sm border border-white/20 hover:border-accent-light hover:text-accent-light rounded-btn px-5 py-2.5 transition-colors whitespace-nowrap">
                      Take a seat
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
