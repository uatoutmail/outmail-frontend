import React from "react";
import { Briefcase } from "lucide-react";

const HiringSpotlight = () => {
  const hiringCompanies = [
    { name: 'Swiggy', industry: 'FoodTech', roles: 10, badge: 'hot', badgeColor: 'bg-red-500/20 text-red-400' },
    { name: 'Paytm', industry: 'FinTech', roles: 8, badge: 'new', badgeColor: 'bg-green-500/20 text-green-400' },
    { name: 'Meesho', industry: 'E-commerce', roles: 7, badge: 'hot', badgeColor: 'bg-red-500/20 text-red-400' },
    { name: 'CRED', industry: 'FinTech', roles: 6, badge: 'new', badgeColor: 'bg-green-500/20 text-green-400' },
    { name: 'Razorpay', industry: 'FinTech', roles: 5, badge: 'hot', badgeColor: 'bg-red-500/20 text-red-400' },
    { name: 'Flipkart', industry: 'E-commerce', roles: 4, badge: '', badgeColor: '' },
    { name: 'Zepto', industry: 'Quick Commerce', roles: 3, badge: '', badgeColor: '' },
    { name: 'Zomato', industry: 'FoodTech', roles: 2, badge: '', badgeColor: '' }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
            <Briefcase size={13} className="text-amber-400" />
            Companies Hiring Now
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50 font-semibold uppercase tracking-wide">Sample</span>
          </h3>
          <p className="text-[11px] text-white/40">Illustrative — live hiring data coming soon</p>
        </div>
        <span className="text-[10px] text-white/30">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
      <div className="flex-1 overflow-hidden space-y-1">
        {hiringCompanies.map((company, i) => (
          <div
            key={company.name}
            className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white/50 font-bold flex-shrink-0">
                {i + 1}
              </span>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white">{company.name}</span>
                <span className="text-[10px] text-white/40 ml-1.5">{company.industry}</span>
              </div>
              {company.badge && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide ${company.badgeColor}`}>
                  {company.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] text-white/50 flex-shrink-0">{company.roles} roles</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HiringSpotlight;