"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getPlans, startCheckout, validateCoupon } from '@/lib/payments';
import { rememberIntent, takeIntent } from '@/lib/checkoutIntent';
import { OUTCOME, classify, message, formatPaise } from '@/lib/paymentOutcome';

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

// Selling points per plan code. Deliberately NOT prices — those come from the
// API. Kept here because feature copy is presentation, not billing data.
const HIGHLIGHTS = {
  PLAN_A: {
    tagline: 'Everything you need to get interviews.',
    features: [
      'AI-personalised cold emails, sent from your own Gmail',
      'Verified recruiter and company discovery',
      'Resume-matched job feed with an explainable Outmail Score',
      'One-click Autofill browser extension',
      'Hiring-signal targeting and send scheduling',
      'Outreach analytics',
    ],
    popular: true,
  },
  PLAN_B: {
    tagline: 'Everything above, plus real mentors.',
    features: [
      'Everything in Outreach & Jobs',
      'Bi-weekly mentorship with people who have done it',
      'Mentor Q&A and session recordings',
      'Personalised career guidance',
      'Priority support',
    ],
    popular: false,
  },
};

export default function ZPricing() {
  const { isAuthenticated, refreshUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [busyPlan, setBusyPlan] = useState(null);   // planId mid-checkout
  const [phase, setPhase] = useState(null);         // 'opening' | 'verifying'
  const [outcome, setOutcome] = useState(null);
  const [coupon, setCoupon] = useState('');
  const [couponState, setCouponState] = useState(null);

  useEffect(() => {
    let alive = true;
    getPlans()
      .then((data) => { if (alive) { setPlans(data || []); setLoadError(false); } })
      .catch(() => { if (alive) setLoadError(true); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const buy = useCallback(async (plan) => {
    setOutcome(null);
    setBusyPlan(plan.id);
    setPhase('opening');
    try {
      // The modal is Razorpay's; once it closes we are waiting on our own
      // /verify call, and that gap needs its own state or people click twice.
      const result = await startCheckout({
        planId: plan.id,
        couponCode: couponState?.valid ? couponState.code : undefined,
        onModalClosed: () => setPhase('verifying'),
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
  }, [couponState, refreshUser]);

  const onCta = useCallback((plan) => {
    if (!isAuthenticated) {
      // Carry the choice through Google sign-in so it is not discarded at the
      // highest-intent moment in the funnel (OUT-227).
      rememberIntent(plan.id, plan.code);
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`;
      return;
    }
    buy(plan);
  }, [isAuthenticated, buy]);

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
      setCouponState({ valid: false, error: 'We could not check that code. Try again.' });
    }
  };

  return (
    <div className="text-white py-20 px-4 bg-surface-page">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-xs font-syne font-medium text-accent-light uppercase tracking-[4px] mb-3">Pricing</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tighter">One year. One payment.</h2>
        <p className="text-white/60 mb-3 max-w-2xl mx-auto text-base">
          Outmail is built for your placement year. Pay once, use it for twelve months —
          no subscription, nothing renews automatically.
        </p>
        <p className="text-white/40 mb-12 max-w-2xl mx-auto text-sm">
          For comparison, LinkedIn Premium costs ₹1,400–2,800 <em>per month</em> in India.
        </p>

        {outcome && <OutcomeBanner outcome={outcome} onDismiss={() => setOutcome(null)} />}

        {loading && <p className="text-white/50 py-16">Loading plans…</p>}

        {loadError && (
          <div className="py-16">
            <p className="text-white/70">We could not load our plans just now.</p>
            <button type="button" onClick={() => window.location.reload()}
              className="mt-4 underline text-accent-light">Try again</button>
          </div>
        )}

        {!loading && !loadError && (
          <div className={`grid grid-cols-1 gap-6 ${plans.length > 1 ? 'md:grid-cols-2' : 'max-w-md mx-auto'}`}>
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                busy={busyPlan === plan.id}
                phase={phase}
                anyBusy={Boolean(busyPlan)}
                onBuy={() => onCta(plan)}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}

        {!loading && !loadError && plans.length > 0 && (
          <div className="mt-10 max-w-md mx-auto text-left">
            <label className="block text-white/50 text-xs uppercase tracking-[2px] mb-2">
              Have a college code?
            </label>
            <div className="flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="e.g. PESU999"
                className="flex-1 bg-white/5 border border-white/15 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent-light"
              />
              <button type="button" onClick={applyCoupon}
                className="px-5 py-2 rounded-full bg-white/10 border border-white/20 text-sm hover:bg-white/20">
                Apply
              </button>
            </div>
            {couponState && !couponState.checking && (
              <p className={`mt-2 text-sm ${couponState.valid ? 'text-emerald-400' : 'text-white/50'}`}>
                {couponState.valid
                  ? `Applied — ${formatPaise(couponState.finalAmount)} instead${
                      couponState.spotsLeft != null ? `, ${couponState.spotsLeft} spots left` : ''}`
                  : couponState.error || 'That code is not valid.'}
              </p>
            )}
          </div>
        )}

        <p className="text-white/40 text-sm mt-10">
          {/* The displayed price is the TOTAL. Showing ₹999 and charging more at
              checkout is drip pricing, which the CCPA's 2023 dark-patterns
              guidelines name directly — so the all-in claim is stated, not
              implied (OUT-235). */}
          Prices in INR, inclusive of all taxes. What you see is what you pay — no fees added at
          checkout. Not right for you?
          {' '}<a href="/refund-and-cancellation" className="underline hover:text-white/70">
            Full refund within 7 days
          </a>, no questions asked.
        </p>
      </div>
    </div>
  );
}

function isSoldOut(plan) {
  return plan.seatsRemaining != null && plan.seatsRemaining <= 0;
}

function PlanCard({ plan, busy, phase, anyBusy, onBuy, isAuthenticated }) {
  const meta = HIGHLIGHTS[plan.code] || { tagline: plan.description, features: [], popular: false };
  const soldOut = isSoldOut(plan);
  const discounted = plan.list_amount && plan.list_amount > plan.amount;

  const label = busy
    ? (phase === 'verifying' ? 'Confirming your payment…' : 'Opening checkout…')
    : soldOut ? 'Fully subscribed'
    : isAuthenticated ? 'Get Outmail'
    : 'Sign in to continue';

  return (
    <div className={`relative rounded-2xl p-8 text-left flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 backdrop-blur-xl
      ${meta.popular
        ? 'bg-white/6 border-2 border-purple-500 shadow-[0_0_32px_rgba(108,0,255,0.25)]'
        : 'bg-white/5 border border-white/12 hover:border-primary/40'}`}>

      {meta.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[3px] bg-purple-600 text-white px-4 py-1 rounded-full">
          Most Popular
        </span>
      )}
      {plan.seatsRemaining != null && !soldOut && (
        <span className="absolute -top-3 right-6 text-[11px] uppercase tracking-[2px] bg-white/10 border border-white/20 text-white/80 px-3 py-1 rounded-full">
          {plan.seatsRemaining} of {plan.max_seats} seats left
        </span>
      )}

      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mt-2 mb-1">{plan.name}</h3>
        <p className="text-purple-300 text-sm font-medium mb-3">{meta.tagline}</p>
        <div className="flex items-baseline gap-2 flex-wrap mb-1">
          <span className="text-4xl font-bold text-white">{formatPaise(plan.amount, plan.currency)}</span>
          <span className="text-white/50 text-sm">for one year</span>
        </div>
        {/* The struck-through price is DATA (plan.list_amount), never hardcoded
            copy — and it is a price we genuinely charge after the launch, which
            is what keeps the discount claim honest (OUT-235). */}
        {discounted && (
          <p className="text-white/45 text-sm mb-3">
            <span className="line-through">{formatPaise(plan.list_amount, plan.currency)}</span>
            {' '}— launch price for our first 1,000 students
          </p>
        )}
        <p className="text-white/55 text-sm leading-relaxed">{plan.description}</p>
      </div>

      <ul className="mb-8 space-y-3 flex-1">
        {meta.features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-white/80">
            <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-purple-600/50 border border-purple-500/60 flex items-center justify-center text-[10px] text-purple-300">✓</span>
            {f}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onBuy}
        disabled={busy || soldOut || anyBusy}
        aria-busy={busy}
        className={`w-full block text-center py-3 px-4 rounded-full font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          ${meta.popular ? 'bg-white text-black hover:bg-gray-100' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'}`}
      >
        {label}{!busy && !soldOut ? ' →' : ''}
      </button>
    </div>
  );
}

function OutcomeBanner({ outcome, onDismiss }) {
  const { tone, title, body } = message(outcome);
  const styles = {
    success: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200',
    error: 'bg-red-500/10 border-red-500/40 text-red-200',
    neutral: 'bg-white/5 border-white/20 text-white/70',
  }[tone];
  return (
    <div className={`mb-10 mx-auto max-w-xl rounded-2xl border px-6 py-4 text-left ${styles}`} role="status">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm opacity-80 mt-1">{body}</p>
        </div>
        <button type="button" onClick={onDismiss} aria-label="Dismiss" className="opacity-60 hover:opacity-100">×</button>
      </div>
    </div>
  );
}
