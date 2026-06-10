"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { getPlans, startCheckout } from '@/lib/payments';
import { useAuth } from '@/context/AuthContext';

const plans = [
  {
    code: 'PLAN_A',
    badge: 'Plan A',
    title: 'Smart Cold Outreach',
    tagline: 'Direct recruiter reach, at scale.',
    description:
      'For organisations that want to put their candidates directly in front of the right recruiters — bypassing ATS filters with personalised, signal-driven cold email campaigns.',
    features: [
      'Automated personalised cold email outreach',
      'Live hiring signal targeting (funding, headcount, job postings)',
      'Smart company database with priority scoring',
      'Multiple customisable email templates',
      'Campaign scheduling, throttling & safe sending',
      'Campaign analytics & performance reports',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    code: 'PLAN_B',
    badge: 'Plan B',
    title: 'Outreach + Job Intelligence',
    tagline: 'Everything in Plan A, plus curated job visibility.',
    description:
      'For organisations that want to combine direct recruiter outreach with a curated, signal-ranked job feed — so candidates can act on the right opportunities at exactly the right time.',
    features: [
      'Everything in Plan A',
      'Curated job openings ranked by Outmail Priority Score',
      'Hiring urgency & company momentum signals',
      'Funding & growth-stage filters',
      'Job bookmarking & application tracking',
      'Dedicated account support',
    ],
    cta: 'Get Started',
    highlight: true,
  },
  {
    code: 'PLAN_C',
    badge: 'Plan C',
    title: 'Custom Suite',
    tagline: 'Your tools, your combination.',
    description:
      'For organisations with specific needs. Pick any combination of cold outreach, job intelligence, and expert mentorship sessions — or request a fully tailored setup. Let\'s talk.',
    features: [
      'Choose any combination of Plan A & Plan B features',
      'Expert mentorship session access for candidates',
      'Bulk account management & admin dashboard',
      'Placement officer controls & reporting',
      'Custom integrations & onboarding assistance',
      'Priority support with dedicated account manager',
    ],
    cta: 'Get a Custom Quote',
    highlight: false,
  },
];

const formatPrice = (amount, currency) => {
  if (amount == null) return null;
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0,
    }).format(amount / 100);
  } catch {
    return `₹${(amount / 100).toLocaleString('en-IN')}`;
  }
};

export default function ZPricing() {
  const { isAuthenticated, user } = useAuth();
  const [dbPlans, setDbPlans] = useState({}); // code -> { id, amount, currency }
  const [loadingCode, setLoadingCode] = useState(null);

  useEffect(() => {
    getPlans()
      .then((rows) => {
        const map = {};
        rows.forEach((p) => {
          map[p.code] = { id: p.id, amount: p.amount, currency: p.currency };
        });
        setDbPlans(map);
      })
      .catch(() => {
        /* Pricing still renders with copy if the plans endpoint is unavailable. */
      });
  }, []);

  const handleCheckout = async (plan) => {
    const db = dbPlans[plan.code];

    // Custom / quote-only plan — route to contact instead of checkout.
    if (!db || db.amount == null) {
      window.location.href = '/contactus';
      return;
    }

    if (!isAuthenticated) {
      toast.message('Please log in to continue to payment.');
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`;
      return;
    }

    try {
      setLoadingCode(plan.code);
      await startCheckout({
        planId: db.id,
        prefill: { name: user?.display_name || '', email: user?.email || '' },
      });
      toast.success('Payment successful! 🎉');
    } catch (err) {
      if (err?.message === 'Payment cancelled') {
        toast.message('Payment cancelled.');
      } else {
        toast.error(err?.response?.data?.error || err?.message || 'Payment failed.');
      }
    } finally {
      setLoadingCode(null);
    }
  };

  return (
    <div className="text-white py-20 px-4 bg-[#0a0b14]">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm font-medium text-indigo-300 uppercase tracking-[4px] mb-3">
          Subscription Plans
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tighter">
          Flexible Plans Built Around Your Organisation
        </h2>
        <p className="text-white/60 mb-12 max-w-2xl mx-auto text-base">
          Pick the plan that matches your goals and check out securely. Need something tailored? Talk to us for a custom quote.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, idx) => {
            const db = dbPlans[plan.code];
            const price = formatPrice(db?.amount, db?.currency);
            const isCustom = !db || db.amount == null;
            const isCurrentPlan = isAuthenticated && user?.currentPlan?.code === plan.code;
            return (
              <div
                key={idx}
                className={`relative rounded-2xl p-8 text-left flex flex-col justify-between transition-all duration-300 hover:-translate-y-1
                  ${isCurrentPlan
                    ? 'bg-emerald-500/10 border-2 border-emerald-400 shadow-[0_0_32px_rgba(16,185,129,0.25)] backdrop-blur-xl'
                    : plan.highlight
                      ? 'bg-white/6 border-2 border-purple-500 shadow-[0_0_32px_rgba(108,0,255,0.25)] backdrop-blur-xl'
                      : 'bg-white/5 border border-white/12 hover:border-purple-500/40 backdrop-blur-xl'
                  }`}
              >
                {isCurrentPlan ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[3px] bg-emerald-500 text-white px-4 py-1 rounded-full">
                    Current Plan
                  </span>
                ) : plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[3px] bg-purple-600 text-white px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                )}

                {/* Header */}
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-[3px] text-purple-400 font-medium">
                    {plan.badge}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-2 mb-1">{plan.title}</h3>
                  <p className="text-purple-300 text-sm font-medium mb-3">{plan.tagline}</p>
                  <div className="mb-3">
                    {price ? (
                      <span className="text-3xl font-bold text-white">{price}</span>
                    ) : (
                      <span className="text-2xl font-bold text-white">Custom</span>
                    )}
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="mb-8 space-y-3 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                      <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-purple-600/50 border border-purple-500/60 flex items-center justify-center text-[10px] text-purple-300">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  type="button"
                  onClick={() => handleCheckout(plan)}
                  disabled={loadingCode === plan.code || isCurrentPlan}
                  className={`w-full block text-center py-3 px-4 rounded-full font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                    ${isCurrentPlan
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                      : plan.highlight
                        ? 'bg-white text-black hover:bg-gray-100'
                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    }`}
                >
                  {isCurrentPlan
                    ? 'Your Current Plan'
                    : loadingCode === plan.code
                      ? 'Processing…'
                      : `${plan.cta} →`}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-white/60 text-sm mt-10">
          Secure payments powered by Razorpay. Custom plans are scoped on a discovery call.
        </p>
      </div>
    </div>
  );
}
