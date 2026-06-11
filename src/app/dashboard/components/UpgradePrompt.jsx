"use client";
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Lock, Sparkles } from 'lucide-react';
import { startCheckout, validateCoupon, getPlans } from '@/lib/payments';
import { useAuth } from '@/context/AuthContext';

const FEATURE_DETAILS = {
  Mentorship: {
    description: 'Book sessions with industry experts, get personalised career guidance, and fast-track your growth.',
    perks: ['1:1 sessions with working professionals', 'Career strategy & resume review', 'Live Q&A and panel events', 'Post-session recordings'],
  },
  'Job Openings': {
    description: 'Access AI-ranked job opportunities with hiring urgency signals so you apply at exactly the right time.',
    perks: ['Curated jobs ranked by Outmail Priority Score', 'Funding & growth-stage filters', 'Hiring urgency signals', 'Job bookmarking & application tracker'],
  },
};

export default function UpgradePrompt({ feature }) {
  const { user, refreshUser } = useAuth();
  const [couponInput, setCouponInput] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [validating, setValidating] = useState(false);
  const [loading, setLoading] = useState(false);

  const details = FEATURE_DETAILS[feature] || {};

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setValidating(true);
    setCouponData(null);
    try {
      // Get the plan ID for PLAN_B (the primary paid plan)
      const plans = await getPlans();
      const planB = plans.find((p) => p.code === 'PLAN_B');
      const result = await validateCoupon({ code: couponInput.trim(), planId: planB?.id });
      if (result.valid) {
        setCouponData(result);
        toast.success(`Coupon applied! ${result.spotsLeft - 1} spot${result.spotsLeft - 1 !== 1 ? 's' : ''} left at this price.`);
      } else {
        toast.error(result.error || 'Invalid coupon code.');
      }
    } catch {
      toast.error('Could not validate coupon. Try again.');
    } finally {
      setValidating(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const plans = await getPlans();
      const planB = plans.find((p) => p.code === 'PLAN_B');
      if (!planB) throw new Error('Plan not found.');

      await startCheckout({
        planId: planB.id,
        couponCode: couponData?.valid ? couponData.code : undefined,
        prefill: { name: user?.display_name || '', email: user?.email || '' },
      });

      toast.success('Payment successful! Welcome to Outmail Premium 🎉');
      await refreshUser();
    } catch (err) {
      if (err?.message === 'Payment cancelled') {
        toast.message('Payment cancelled.');
      } else {
        toast.error(err?.response?.data?.error || err?.message || 'Payment failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const displayPrice = couponData?.valid
    ? `₹${(couponData.finalAmount / 100).toLocaleString('en-IN')}`
    : '₹2,999';
  const originalPrice = couponData?.valid ? '₹2,999' : null;

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-lg bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        {/* Lock icon */}
        <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
          <Lock size={24} className="text-purple-400" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">{feature} is a Premium Feature</h2>
        <p className="text-white/60 text-sm mb-6 leading-relaxed">{details.description}</p>

        {/* Perks */}
        {details.perks && (
          <ul className="mb-6 space-y-2 text-left">
            {details.perks.map((perk, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-white/75">
                <Sparkles size={14} className="text-purple-400 flex-shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
        )}

        {/* Price */}
        <div className="mb-5">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-3xl font-bold text-white">{displayPrice}</span>
            {originalPrice && (
              <span className="text-lg text-white/40 line-through">{originalPrice}</span>
            )}
            <span className="text-white/50 text-sm">/yr</span>
          </div>
          <p className="text-white/40 text-xs mt-1">First 10 students per university get ₹999/yr</p>
        </div>

        {/* Coupon input */}
        {couponData?.valid ? (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-400/40 rounded-lg px-3 py-2 mb-4">
            <span className="text-emerald-400 text-sm font-semibold flex-1">✓ {couponData.code} applied</span>
            <button
              type="button"
              onClick={() => { setCouponData(null); setCouponInput(''); }}
              className="text-white/40 hover:text-white text-xs transition"
            >Remove</button>
          </div>
        ) : (
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="University coupon (e.g. PESU999)"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
              className="flex-1 bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500/60 transition"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={validating}
              className="bg-purple-600/40 hover:bg-purple-600/60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              {validating ? '…' : 'Apply'}
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full bg-[#6c00ff] hover:bg-[#8a00ff] text-white font-semibold py-3 rounded-full transition disabled:opacity-60"
        >
          {loading ? 'Processing…' : 'Upgrade Now →'}
        </button>

        <p className="text-white/30 text-xs mt-3">Secure payment via Razorpay. Cancel anytime.</p>
      </div>
    </div>
  );
}
