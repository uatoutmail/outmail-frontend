"use client";
import React from 'react';
import { useAuth } from '@/context/AuthContext';

// Free-first pricing (USD). Free = Cold Outreach; paid tiers add the next two
// pillars (Job Aggregator, then Mentorship). Cumulative.
const plans = [
  {
    id: 'free',
    badge: 'Free',
    title: 'Cold Outreach',
    price: '$0',
    period: 'free forever',
    tagline: 'Get seen by the right recruiters.',
    description:
      'Find the right companies and send AI-personalized cold emails from your own inbox — free, forever.',
    features: [
      'AI-personalized cold emails from your own Gmail',
      'Recruiter & company discovery',
      'Hiring-signal targeting',
      'Send scheduling & daily limits',
      'Outreach analytics',
    ],
    cta: 'Get Started Free',
    highlight: false,
  },
  {
    id: 'pro',
    badge: 'Pro',
    title: 'Outreach + Job Intelligence',
    price: '$9',
    period: 'per month',
    tagline: 'Everything in Free, plus matched jobs.',
    description:
      'Add a resume- and intent-matched job feed with an explainable Outmail Score, plus the one-click Autofill browser extension.',
    features: [
      'Everything in Free',
      'Resume & intent-matched job feed',
      'Explainable Outmail Score + "why matched"',
      'Autofill browser extension',
      'Apply / save / discard tracking',
      'Priority support',
    ],
    cta: 'Get Started',
    highlight: true,
  },
  {
    id: 'elite',
    badge: 'Elite',
    title: 'Everything + Mentorship',
    price: '$19',
    period: 'per month',
    tagline: 'Outreach, jobs, and real mentors.',
    description:
      "Everything in Pro, plus bi-weekly mentorship sessions with people who've navigated the path you're on.",
    features: [
      'Everything in Pro',
      'Bi-weekly mentorship sessions',
      'Mentor Q&A + session recordings',
      'Personalized career guidance',
      'Priority support',
    ],
    cta: 'Get Started',
    highlight: false,
  },
];

export default function ZPricing() {
  const { isAuthenticated } = useAuth();

  const handleCta = () => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`;
    }
  };

  return (
    <div className="text-white py-20 px-4 bg-[#0a0b14]">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm font-medium text-indigo-300 uppercase tracking-[4px] mb-3">
          Pricing
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tighter">
          Choose your plan
        </h2>
        <p className="text-white/60 mb-12 max-w-2xl mx-auto text-base">
          Every plan includes the ones before it. Start with free cold outreach; add jobs, then mentorship.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 text-left flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 backdrop-blur-xl
                ${plan.highlight
                  ? 'bg-white/6 border-2 border-purple-500 shadow-[0_0_32px_rgba(108,0,255,0.25)]'
                  : 'bg-white/5 border border-white/12 hover:border-purple-500/40'
                }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[3px] bg-purple-600 text-white px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <span className="text-xs uppercase tracking-[3px] text-purple-400 font-medium">
                  {plan.badge}
                </span>
                <h3 className="text-2xl font-bold text-white mt-2 mb-1">{plan.title}</h3>
                <p className="text-purple-300 text-sm font-medium mb-3">{plan.tagline}</p>
                <div className="flex items-baseline gap-2 flex-wrap mb-3">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/50 text-sm">{plan.period}</span>
                </div>
                <p className="text-white/55 text-sm leading-relaxed">{plan.description}</p>
              </div>

              <ul className="mb-8 space-y-3 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                    <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-purple-600/50 border border-purple-500/60 flex items-center justify-center text-[10px] text-purple-300">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={handleCta}
                className={`w-full block text-center py-3 px-4 rounded-full font-semibold text-sm transition-all duration-200
                  ${plan.highlight
                    ? 'bg-white text-black hover:bg-gray-100'
                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  }`}
              >
                {plan.cta} →
              </button>
            </div>
          ))}
        </div>

        <p className="text-white/50 text-sm mt-10">
          Prices in USD. Paid plans are billed monthly, cancel anytime.
        </p>
      </div>
    </div>
  );
}
