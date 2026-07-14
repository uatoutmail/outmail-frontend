"use client";

import {
  BrandGoogle,
  BrandAmazon,
  BrandApple,
  BrandFacebook,
  BrandLinkedin,
  BrandAdobe,
  BrandUber,
  BrandNetflix,
  BrandPaypal,
  BrandStripe,
  BrandSlack,
  BrandZoom,
} from "tabler-icons-react";

// Each entry is either an icon-based MNC or a text-based Indian startup/company
const companies = [
  { type: "icon", component: <BrandGoogle size={40} />,   label: "Google" },
  { type: "text", name: "Zomato" },
  { type: "icon", component: <BrandAmazon size={40} />,   label: "Amazon" },
  { type: "text", name: "PhonePe" },
  { type: "icon", component: <BrandApple size={40} />,    label: "Apple" },
  { type: "text", name: "Razorpay" },
  { type: "icon", component: <BrandFacebook size={40} />, label: "Meta" },
  { type: "text", name: "Swiggy" },
  { type: "icon", component: <BrandAdobe size={40} />,    label: "Adobe" },
  { type: "text", name: "Paytm" },
  { type: "icon", component: <BrandUber size={40} />,     label: "Uber" },
  { type: "text", name: "CRED" },
  { type: "icon", component: <BrandNetflix size={40} />,  label: "Netflix" },
  { type: "text", name: "Meesho" },
  { type: "icon", component: <BrandPaypal size={40} />,   label: "PayPal" },
  { type: "text", name: "Zepto" },
  { type: "icon", component: <BrandStripe size={40} />,   label: "Stripe" },
  { type: "text", name: "Groww" },
  { type: "icon", component: <BrandSlack size={40} />,    label: "Slack" },
  { type: "icon", component: <BrandLinkedin size={40} />, label: "LinkedIn" },
  { type: "text", name: "Zerodha" },
  { type: "icon", component: <BrandZoom size={40} />,     label: "Zoom" },
];

function CompanyItem({ company }) {
  if (company.type === "icon") {
    return (
      <div className="flex flex-col items-center justify-center gap-1.5 min-w-[80px] h-14 group">
        <span className="text-white/60 group-hover:text-white transition-colors duration-300">
          {company.component}
        </span>
        <span className="text-[11px] text-white/40 group-hover:text-white/70 tracking-wide transition-colors duration-300">
          {company.label}
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center min-w-[80px] h-14 group">
      <span className="text-white/60 group-hover:text-white font-semibold text-xl tracking-wide transition-colors duration-300">
        {company.name}
      </span>
    </div>
  );
}

export default function Partners() {
  return (
    <div className="w-full overflow-hidden py-12 bg-[#0a0b14]">
      <h2 className="text-2xl font-bold text-white text-center mb-3 mt-10">
        Get in front of recruiters at companies like these
      </h2>
      <p className="text-white/50 text-center text-sm max-w-xl mx-auto mb-14">
        The kinds of companies Outmail helps students reach — from global names to fast-growing startups.
      </p>

      {/* Outer mask for fade edges */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        {/* Two copies exactly — animation goes from 0 to -50% for seamless loop */}
        <div className="flex animate-scroll whitespace-nowrap gap-10 px-4 py-4 border-y border-white/10 bg-white/[0.03]">
          {[...companies, ...companies].map((company, index) => (
            <CompanyItem key={index} company={company} />
          ))}
        </div>
      </div>
    </div>
  );
}
