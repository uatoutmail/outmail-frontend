import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';

const LockedFeatureOverlay = ({ children, feature }) => {
  return (
    <div className="relative w-full h-full min-h-[600px] overflow-hidden rounded-2xl">
      {/* Blurred out background content */}
      <div className="pointer-events-none blur-sm opacity-50 select-none h-full overflow-hidden">
        {children}
      </div>

      {/* Foreground locked overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0b14]/60 backdrop-blur-[4px]">
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 text-center backdrop-blur-xl">
          <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
            <Lock className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Unlock {feature}</h2>
          <p className="text-white/60 mb-8 text-sm leading-relaxed">
            Upgrade your plan to get full access to {feature} and accelerate your career.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-white text-black hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-colors w-full text-sm"
          >
            Upgrade to Access
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LockedFeatureOverlay;
