import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';

/**
 * The teaser shown in place of a feature the user's plan does not include.
 *
 * `reason` decides the words, and the distinction matters: telling a paying
 * customer to "subscribe" reads as a bug in something they already bought.
 *   'none'    -> never paid, or the placement year lapsed
 *   'upgrade' -> paying, but on a lower tier
 *
 * `targetPlan` deep-links to the plan that actually unlocks THIS feature
 * instead of dropping the user on a generic pricing page — the old link went
 * to /pricing, whose CTA sent them straight back to /dashboard (OUT-226).
 */
const LockedFeatureOverlay = ({ feature, reason = 'none', targetPlan }) => {
  const upgrading = reason === 'upgrade';
  const href = targetPlan ? `/pricing?plan=${targetPlan}` : '/pricing';
  return (
    <div className="relative w-full h-full min-h-[600px] overflow-hidden rounded-2xl">
      {/* Static teaser backdrop — no live component mounts here, so locked
          features never fetch data behind the paywall. */}
      <div className="pointer-events-none blur-sm opacity-40 select-none h-full overflow-hidden p-6 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white/10 border border-white/10 rounded-xl h-24" />
          ))}
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white/10 border border-white/10 rounded-xl h-28" />
        ))}
      </div>

      {/* Foreground locked overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface-page/60 backdrop-blur-[4px]">
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 text-center backdrop-blur-xl">
          <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
            <Lock className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            {upgrading ? `${feature} is on a higher plan` : `Unlock ${feature}`}
          </h2>
          <p className="text-white/60 mb-8 text-sm leading-relaxed">
            {upgrading
              ? `Your current plan doesn't include ${feature}. Upgrade to add it — you keep everything you already have.`
              : `Get full access to ${feature} and everything else Outmail does, for one placement year.`}
          </p>
          <Link
            href={href}
            className="inline-block bg-white text-black hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-colors w-full text-sm"
          >
            {upgrading ? 'Upgrade my plan' : 'See plans'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LockedFeatureOverlay;
