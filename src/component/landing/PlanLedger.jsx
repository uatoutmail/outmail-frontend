"use client";
import { Check, Minus, Users, Flame } from "lucide-react";
import React from "react";
import { Reveal } from "@/component/motion/kit";
import { formatPaise } from "@/lib/paymentOutcome";

/**
 * The plan ledger — the agreed pricing layout, shared by the landing section
 * and the pricing page so the two can never disagree about what a plan
 * includes. Purely presentational: it is handed the full plans array and a
 * CTA renderer, and knows nothing about checkout.
 *
 * Generalized 2026-11-06 (found live: a disabled plan kept showing a stuck
 * "calculating" price instead of disappearing) to render 1-3 columns from
 * whichever of PLAN_CODES are actually present in `plans` — a plan absent
 * from the array gets NO column at all, never a skeleton. "Still loading"
 * is a separate, explicit `loading` prop; it is never inferred from a plan
 * simply being missing, which is exactly how the original bug happened.
 *
 * Feature copy lives here because it is presentation. Every NUMBER comes from
 * the plan objects, which come from /api/payments/plans — this site once
 * advertised "$0 free forever" for a plan the backend charged ₹499 for
 * (OUT-232), and hardcoded copy carrying numbers is how that happens.
 */
export const PLAN_CODES = ["PLAN_A", "PLAN_B", "PLAN_C"];

// A map, not the old {a, b} booleans, so a 3rd code can get its own row data
// without restructuring this file again. PLAN_A/PLAN_B's content is exactly
// what it was before this supported more than two columns — "the plans
// differ by exactly one thing" (mentorship) is still true for those two.
//
// PLAN_C has no row data: it isn't live today (retired, see
// outmail-backend's seedPlans.js) and there's no real feature set to write
// for a plan that doesn't exist yet. Add it here, as its own object, once a
// real 3rd plan is activated — a content task, not a code task.
export const MATRIX_BY_CODE = {
  PLAN_A: {
    "Cold outreach to verified recruiters": true,
    "Resume-matched job feed with an explainable score": true,
    "One-click application autofill": true,
    "Send scheduling, hiring-signal targeting, analytics": true,
    "Bi-weekly mentorship sessions": false,
    "Mentor Q&A and session recordings": false,
    "Priority support": false,
  },
  PLAN_B: {
    "Cold outreach to verified recruiters": true,
    "Resume-matched job feed with an explainable score": true,
    "One-click application autofill": true,
    "Send scheduling, hiring-signal targeting, analytics": true,
    "Bi-weekly mentorship sessions": true,
    "Mentor Q&A and session recordings": true,
    "Priority support": true,
  },
};

const COLUMN_LABEL = { PLAN_A: "Outreach & Jobs", PLAN_B: "+ Mentorship", PLAN_C: "Plan C" };
const COLUMN_ACCENT = { PLAN_A: "text-primary", PLAN_B: "text-accent-light", PLAN_C: "text-white" };

// Tailwind's compiler scans for literal class strings, not computed ones —
// a lookup keyed by column count, not string interpolation.
const HEADER_LABEL_SPAN = { 1: "col-span-6", 2: "col-span-6", 3: "col-span-3" };
const HEADER_COL_SPAN = { 1: "col-span-6", 2: "col-span-3", 3: "col-span-3" };
const ROW_LABEL_SPAN = { 1: "col-span-6", 2: "col-span-6", 3: "col-span-3" };
const ROW_COL_SPAN = { 1: "col-span-6", 2: "col-span-3", 3: "col-span-3" };
const FOOT_LABEL_SPAN = {
  1: "col-span-12 sm:col-span-6",
  2: "col-span-12 sm:col-span-6",
  3: "col-span-12 sm:col-span-3",
};
const FOOT_COL_SPAN = {
  1: "col-span-12 sm:col-span-6",
  2: "col-span-6 sm:col-span-3",
  3: "col-span-4 sm:col-span-3",
};

/**
 * The launch offer.
 *
 * States what the offer is, who it is for, and what happens when it ends — in
 * that order, and with no countdown timer. A cohort cap is a promise we can
 * keep; a clock is one we would have to keep resetting, and a reset clock is
 * the most recognisable dark pattern there is.
 *
 * 2026-10-20: the places-remaining counter + progress bar (right side) was
 * removed by request. `total` is still read from the plan to keep the "first
 * N students" line on the left honest and in sync with the backend — it just
 * no longer renders a remaining-count readout alongside it.
 */
export function LaunchBanner({ plan }) {
  if (!plan || !(plan.list_amount > plan.amount)) return null;
  if (plan.launchPlacesLeft === 0) return null; // cohort full: the offer is over

  const price = formatPaise(plan.amount, plan.currency);
  const listPrice = formatPaise(plan.list_amount, plan.currency);
  const total = plan.launchPlacesTotal;
  const known = typeof total === "number" && total > 0;

  return (
    <Reveal delay={0.06}>
      <div className="rounded-2xl border border-primary/35 bg-gradient-to-r from-primary/15 via-primary/[0.07] to-transparent px-6 py-5 mb-4 text-left">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0"
          >
            <Flame size={16} className="text-primary" />
          </span>
          <div>
            <p className="font-syne font-bold text-[15px] leading-tight">
              Launch price: {price} instead of{" "}
              <span className="text-white/35 line-through font-normal">{listPrice}</span>
            </p>
            <p className="text-xs text-white/45 mt-0.5">
              {known ? `For the first ${total.toLocaleString("en-IN")} students in India. ` : ""}
              After that it is {listPrice}.
            </p>
          </div>
        </div>
        <p className="text-[11px] text-white/30 mt-3">
          Buy at the launch price and you keep the full year at that price. We never ask for the
          difference later.
        </p>
      </div>
    </Reveal>
  );
}

function PriceCell({ plan, accent, skeleton }) {
  if (skeleton)
    return (
      <span
        className="inline-block w-20 h-7 rounded bg-white/10 animate-pulse align-middle"
        aria-hidden
      />
    );
  return (
    <>
      <p className="font-syne text-2xl sm:text-3xl font-bold leading-none">
        {formatPaise(plan.amount, plan.currency)}
      </p>
      {plan.list_amount > plan.amount && (
        <p className="text-[11px] text-white/25 line-through mt-1">
          {formatPaise(plan.list_amount, plan.currency)}
        </p>
      )}
      {plan.seatsRemaining != null && (
        <p className={`text-[11px] mt-1 font-mono inline-flex items-center gap-1 ${accent}`}>
          <Users size={10} />
          {plan.seatsRemaining > 0
            ? `${plan.seatsRemaining}/${plan.max_seats} seats`
            : "fully subscribed"}
        </p>
      )}
    </>
  );
}

/**
 * @param plans  the full array from /api/payments/plans (or null/undefined
 *               while loading) — NOT pre-filtered by the caller. A code not
 *               present here simply gets no column.
 * @param loading  explicit "still fetching" signal. While true, renders a
 *               fixed 2-skeleton-column placeholder regardless of what
 *               `plans` holds — the real column count is only known once
 *               loading is false.
 * @param renderCta(plan, { code, index })  one CTA renderer for every column.
 */
export default function PlanLedger({ plans, loading, renderCta, footNote }) {
  const columns = loading
    ? [
        { code: "PLAN_A", plan: null, skeleton: true },
        { code: "PLAN_B", plan: null, skeleton: true },
      ]
    : PLAN_CODES.map((code) => ({ code, plan: plans?.find((p) => p.code === code) })).filter(
        (c) => c.plan
      );

  if (columns.length === 0) return null;

  const count = Math.min(columns.length, 3);
  const matrixRows = [
    ...new Set(columns.flatMap(({ code }) => Object.keys(MATRIX_BY_CODE[code] || {}))),
  ];

  return (
    <Reveal delay={0.1}>
      <div className="rounded-2xl border border-white/10 overflow-hidden text-left">
        <div className="grid grid-cols-12 gap-3 px-5 sm:px-6 py-6 border-b border-white/10 bg-white/[0.02] items-end">
          <div className={HEADER_LABEL_SPAN[count]} />
          {columns.map(({ code, plan, skeleton }) => (
            <div key={code} className={`${HEADER_COL_SPAN[count]} text-center`}>
              <p className={`text-[10px] uppercase tracking-[2px] mb-1.5 ${COLUMN_ACCENT[code]}`}>
                {COLUMN_LABEL[code] || code}
              </p>
              <PriceCell plan={plan} accent={COLUMN_ACCENT[code]} skeleton={skeleton} />
            </div>
          ))}
        </div>

        {matrixRows.map((label, i) => (
          <Reveal key={label} delay={i * 0.03}>
            <div className="grid grid-cols-12 gap-3 px-5 sm:px-6 py-4 items-center border-b border-white/[0.06]">
              <span
                className={`${ROW_LABEL_SPAN[count]} text-[13px] sm:text-sm text-white/60 leading-snug`}
              >
                {label}
              </span>
              {columns.map(({ code }) => {
                const included = MATRIX_BY_CODE[code]?.[label];
                return (
                  <span key={code} className={`${ROW_COL_SPAN[count]} flex justify-center`}>
                    {included ? (
                      <Check size={16} className={COLUMN_ACCENT[code]} aria-label="included" />
                    ) : (
                      <Minus size={16} className="text-white/15" aria-label="not included" />
                    )}
                  </span>
                );
              })}
            </div>
          </Reveal>
        ))}

        <div className="grid grid-cols-12 gap-3 px-5 sm:px-6 py-6 items-center bg-white/[0.02]">
          <span
            className={`${FOOT_LABEL_SPAN[count]} text-[11px] text-white/30 leading-relaxed mb-3 sm:mb-0`}
          >
            {footNote ??
              "One payment. Twelve months. Nothing renews. All taxes included. Full refund within 7 days."}
          </span>
          {columns.map(({ code, plan }, index) => (
            <div key={code} className={`${FOOT_COL_SPAN[count]} flex justify-center`}>
              {renderCta?.(plan, { code, index })}
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
