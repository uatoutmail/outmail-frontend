"use client";
import Navbar from '@/component/Navbar'
import Hero from '@/component/Hero'
import React from 'react'
import AboutUs from '@/component/aboutuscontent'
import Pricing from '@/component/pricing'
import Footer from '@/component/Footer'
import Faq from '@/component/faq'
import Testimonials from '@/component/Testimonials'
import MembershipBenefits from '@/component/membershipbenefits'

function page() {
  return (
    <div className="min-h-screen bg-[#0a0b14] text-white">
      <Navbar variant="dark"/>

      <div className="bg-[#0a0b14] py-20 relative overflow-hidden">   
      

      <div className="container mx-auto px-4 text-center">
        <p className="text-xs uppercase tracking-[4px] text-purple-400 font-medium mb-4">
          Subscription Plans
        </p>

        <h1 className="text-4xl sm:text-5xl font-syne font-semibold tracking-tight leading-tight mt-3 text-white">
          Flexible Plans Built
          <br />
          <span className="bg-gradient-to-r from-[#b06cff] via-white to-[#b06cff] bg-clip-text text-transparent">
            Around Your Organisation.
          </span>
        </h1>

        <p className="text-white/60 text-base sm:text-lg mt-6 leading-relaxed max-w-2xl mx-auto">
          No fixed price tags — every organisation is different. Pick the plan that fits your goals and we&apos;ll work out the right arrangement on a call.
        </p>

        <div className="text-center mt-10">
          <button
            onClick={() => {
              const missionSection = document.getElementById('pricing');
              missionSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="rounded-full border border-white/20 bg-white/5 text-white px-5 py-3 hover:bg-white/10 transition duration-300"
          >
            ↓
          </button>
        </div>

      </div>
      <div className="absolute top-24 left-[10%] w-36 h-36 rounded-2xl border border-white/10 bg-[#6c00ff]/20 rotate-12 blur-[1px]" />
      <div className="absolute top-32 right-[12%] w-20 h-20 rounded-full border border-white/15 bg-[#ad46ff]/20" />
      <div className="absolute bottom-8 left-[20%] w-24 h-24 rounded-lg border border-white/10 bg-[#2f1a7a]/40 -rotate-12" />
      </div>
      <div id="pricing"><MembershipBenefits/></div>
      <div><Pricing/></div>
      
      <Testimonials/>
      <Faq/>
      <Footer variant="dark"/>

    </div>
  )
}

export default page
