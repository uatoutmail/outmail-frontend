"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import PlanLedger, { LaunchBanner } from "@/component/landing/PlanLedger";
import { Reveal, MaskLines, Kicker } from "@/component/motion/kit";
import { useAuth } from "@/context/AuthContext";
import { rememberIntent, takeIntent } from "@/lib/checkoutIntent";
import { OUTCOME, classify, message, formatPaise } from "@/lib/paymentOutcome";
import { getPlans, startCheckout, validateCoupon } from "@/lib/payments";

/**
 * The pricing page, and the only place a customer can buy Outmail.
 *
 * EVERY NUMBER COMES FROM /api/payments/plans. Nothing here is hardcoded, on
 * purpose: this page used to carry its own copy of the prices and drifted so far
 * from the database that it advertised "$0 free forever" in USD for a plan the
 * backend charged ₹499 for in INR, and its third card would have returned 400 on
 * click. Copy that carries numbers is how that happens (OUT-232).
 *
 * What we sell: a one-time payment for one placement year. Not a subscription —
 * nothing renews automatically.
 */

// Feature copy moved to PlanLedger's MATRIX when this page adopted the ledger
// layout — it is presentation, and keeping one copy is what stops the landing
// page and the pricing page from disagreeing about what a plan includes.

export default function ZPricing() {
  const { isAuthenticated, refreshUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [busyPlan, setBusyPlan] = useState(null); // planId mid-checkout
  const [phase, setPhase] = useState(null); // 'opening' | 'verifying'
  const [outcome, setOutcome] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [couponState, setCouponState] = useState(null);

  useEffect(() => {
    let alive = true;
    getPlans()
      .then((data) => {
        if (alive) {
          setPlans(data || []);
          setLoadError(false);
        }
      })
      .catch(() => {
        if (alive) setLoadError(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const buy = useCallback(
    async (plan) => {
      setOutcome(null);
      setBusyPlan(plan.id);
      setPhase("opening");
      try {
        // The modal is Razorpay's; once it closes we are waiting on our own
        // /verify call, and that gap needs its own state or people click twice.
        const result = await startCheckout({
          planId: plan.id,
          couponCode: couponState?.valid ? couponState.code : undefined,
          onModalClosed: () => setPhase("verifying"),
        });
        // isRepeatPurchase, NOT wasAlreadyPaid. Both confirmation paths race on
        // every payment, and the webhook usually wins — observed at 11 seconds
        // ahead in UAT. wasAlreadyPaid is therefore true for most FIRST purchases,
        // and using it here told new customers "you already have this plan"
        // moments after they bought it, which reads as a double charge.
        // isRepeatPurchase is true only when the order was paid long ago.
        setOutcome(result?.isRepeatPurchase ? OUTCOME.ALREADY : OUTCOME.SUCCESS);
        await refreshUser();
      } catch (err) {
        setOutcome(classify(err));
      } finally {
        setBusyPlan(null);
        setPhase(null);
      }
    },
    [couponState, refreshUser]
  );

  const onCta = useCallback(
    (plan) => {
      if (!isAuthenticated) {
        // Carry the choice through Google sign-in so it is not discarded at the
        // highest-intent moment in the funnel (OUT-227).
        rememberIntent(plan.id, plan.code);
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`;
        return;
      }
      buy(plan);
    },
    [isAuthenticated, buy]
  );

  // Resume a checkout the user started before signing in (OUT-227).
  //
  // Deferred to a microtask rather than called in the effect body. Opening
  // Razorpay is an external side effect, not state synchronisation, and calling
  // it synchronously here sets state mid-effect and cascades a re-render — which
  // is what react-hooks/set-state-in-effect flags. The guard ref stops a second
  // render from starting a second checkout before the first has set busyPlan.
  const resumedRef = useRef(false);
  useEffect(() => {
    if (resumedRef.current || !isAuthenticated || loading || !plans.length) return;
    const intent = takeIntent();
    if (!intent) return;
    const plan = plans.find((p) => p.id === intent.planId || p.code === intent.planCode);
    if (!plan || isSoldOut(plan)) return;
    resumedRef.current = true;
    queueMicrotask(() => buy(plan));
  }, [isAuthenticated, loading, plans, buy]);

  const applyCoupon = async () => {
    const code = coupon.trim();
    if (!code) return;
    setCouponState({ checking: true });
    try {
      const res = await validateCoupon({ code, planId: plans[0]?.id });
      setCouponState({ ...res, code });
    } catch {
      setCouponState({ valid: false, error: "We could not check that code. Try again." });
    }
  };

  const planA = plans.find((p) => p.code === "PLAN_A");
  const planB = plans.find((p) => p.code === "PLAN_B");

  // One CTA renderer for both columns: the label carries every state the
  // button can be in, so a disabled button always says why it is disabled.
  const cta = (plan, primary) => {
    if (!plan) return null;
    const soldOut = isSoldOut(plan);
    const busy = busyPlan === plan.id;
    const label = busy
      ? phase === "verifying"
        ? "Confirming…"
        : "Opening…"
      : soldOut
        ? "Fully subscribed"
        : isAuthenticated
          ? "Get it"
          : "Sign in to continue";
    return (
      <button
        type="button"
        onClick={() => onCta(plan)}
        disabled={busy || soldOut || Boolean(busyPlan)}
        aria-busy={busy}
        className={`font-syne font-semibold text-sm rounded-btn px-5 py-2.5 transition-colors whitespace-nowrap disabled:opacity-45 disabled:cursor-not-allowed ${
          primary
            ? "bg-primary hover:bg-primary-hover text-white"
            : "border border-white/20 hover:border-accent-light hover:text-accent-light text-white"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="text-white py-20 px-4 bg-surface-page">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <Kicker className="mb-4">Pricing</Kicker>
          <MaskLines
            lines={["What each plan", "actually includes."]}
            className="font-syne text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]"
          />
          <p className="text-white/45 mt-4 max-w-lg">
            The only difference is mentorship. One payment either way — nothing renews. For
            comparison, LinkedIn Premium is ₹1,400–2,800 <em>per month</em> in India.
          </p>
        </Reveal>

        <div className="mt-12">
          {outcome && <OutcomeBanner outcome={outcome} onDismiss={() => setOutcome(null)} />}

          {loading && (
            <p className="text-white/40 py-16 text-center" role="status">
              Loading plans…
            </p>
          )}

          {loadError && (
            <div className="py-16 text-center rounded-2xl border border-white/10 bg-white/[0.02]">
              <p className="text-white/70">We could not load our plans just now.</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 underline text-primary"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !loadError && (
            <>
              <LaunchBanner plan={planA} />
              <PlanLedger
                a={planA}
                b={planB}
                renderCtaA={(p) => cta(p, true)}
                renderCtaB={(p) => cta(p, false)}
              />
            </>
          )}

          {!loading && !loadError && plans.length > 0 && (
            <div className="mt-8 max-w-md">
              <label
                htmlFor="coupon"
                className="block text-white/40 text-[10px] uppercase tracking-[2px] mb-2"
              >
                Have a college code?
              </label>
              <div className="flex gap-2">
                <input
                  id="coupon"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="e.g. PESU999"
                  className="flex-1 bg-white/[0.04] border border-white/12 rounded-btn px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="px-5 py-2.5 rounded-btn border border-white/20 text-sm font-syne font-semibold hover:border-primary hover:text-primary transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponState && !couponState.checking && (
                <p
                  className={`mt-2 text-sm ${couponState.valid ? "text-emerald-400" : "text-white/45"}`}
                  role="status"
                >
                  {couponState.valid
                    ? `Applied — ${formatPaise(couponState.finalAmount)} instead${
                        couponState.spotsLeft != null ? `, ${couponState.spotsLeft} spots left` : ""
                      }`
                    : couponState.error || "That code is not valid."}
                </p>
              )}
            </div>
          )}

          <p className="text-white/35 text-sm mt-10 max-w-2xl">
            {/* The displayed price is the TOTAL. Showing ₹999 and charging more at
                checkout is drip pricing, which the CCPA's 2023 dark-patterns
                guidelines name directly — so the all-in claim is stated, not
                implied (OUT-235). */}
            Prices in INR, inclusive of all taxes. What you see is what you pay — no fees added at
            checkout. Not right for you?{" "}
            <a href="/refund-and-cancellation" className="underline hover:text-white/70">
              Full refund within 7 days
            </a>
            , no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}

function isSoldOut(plan) {
  return plan.seatsRemaining != null && plan.seatsRemaining <= 0;
}

function OutcomeBanner({ outcome, onDismiss }) {
  const { tone, title, body } = message(outcome);
  const styles = {
    success: "bg-emerald-500/10 border-emerald-500/40 text-emerald-200",
    error: "bg-red-500/10 border-red-500/40 text-red-200",
    neutral: "bg-white/5 border-white/20 text-white/70",
  }[tone];
  return (
    <div
      className={`mb-10 mx-auto max-w-xl rounded-2xl border px-6 py-4 text-left ${styles}`}
      role="status"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm opacity-80 mt-1">{body}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="opacity-60 hover:opacity-100"
        >
          ×
        </button>
      </div>
    </div>
  );
}
