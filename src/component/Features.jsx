import React from 'react';
import { Zap, Briefcase, Users, MousePointerClick } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Zap size={28} className="text-white" />,
      title: 'Smart Automated Cold Outreach',
      desc: 'Send personalized emails to recruiters at scale, directly from your Gmail — safely throttled and fully automated.',
    },
    {
      icon: <Briefcase size={28} className="text-white" />,
      title: 'Resume-Matched Job Feed',
      desc: 'Browse roles matched to your resume and job-hunt intent, each ranked by an explainable Outmail Score — skill and seniority fit, hiring urgency, and company momentum.',
    },
    {
      icon: <MousePointerClick size={28} className="text-white" />,
      title: 'One-Click Autofill',
      desc: 'Our Chrome extension fills out job applications for you from your resume and profile — so each application takes seconds, not minutes.',
    },
    {
      icon: <Users size={28} className="text-white" />,
      title: 'Expert Mentorship',
      desc: 'Connect with experienced professionals and alumni for live guidance on interviews, career paths, and building the right outreach strategy.',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[#0a0b14] flex items-center justify-center px-8 py-20 min-h-screen" style={{

  }}>
      <div className="absolute top-14 right-[8%] w-24 h-24 rounded-full border border-white/10 bg-[#ad46ff]/12" />
      <div className="absolute bottom-12 left-[6%] w-20 h-20 rounded-lg border border-white/10 bg-[#6c00ff]/12 rotate-12" />

      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-stretch">
        {/* Left Side */}
        <div className="text-white flex flex-col">
          <p className="text-xs font-display font-medium text-[#AD46FF] uppercase tracking-[4px] mb-2">Everything You Need to Land the Job</p>
          <h2 className="text-3xl md:text-4xl font-syne font-bold mb-10">
            One Platform. Every Edge You Need.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col gap-4 h-full p-6 rounded-xl border border-white/12 bg-white/5 backdrop-blur-xl hover:border-purple-500/40 transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-[0_0_20px_rgba(108,0,255,0.15)]">
                <div className="bg-[#6c00ff]/30 p-3 w-fit rounded-full border border-purple-500/40">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-white/80">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Dashboard image (mockup or actual image) */}
        <div className="w-full flex items-center justify-end">
          <img
            src="/dashboard_edited.png" 
            alt="Outmail Dashboard Preview"
            className="rounded-3xl border border-purple-400/40 shadow-[0_0_18px_rgba(108,0,255,0.28)] max-w-full transition-transform duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1 translate-x-12 md:translate-x-24 lg:translate-x-32"
            width={1000}
          />
        </div>
      </div>
    </div>
  );
}

