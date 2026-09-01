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
    <div className="min-h-screen bg-surface-page text-white">
      <Navbar variant="dark"/>

      <div className="bg-surface-page py-20 relative overflow-hidden">   
      

      <div className="container mx-auto px-4 text-center">
        <p className="text-xs uppercase tracking-[4px] text-accent-light font-display font-medium mb-4">
          Pricing
        </p>

        <h1 className="text-4xl sm:text-5xl font-syne font-semibold tracking-tight leading-tight mt-3 text-white">
          Built for your placement year.
          <br />
          <span className="gradient-hero">
            One payment. Twelve months.
          </span>
        </h1>

        <p className="text-white/60 text-base sm:text-lg mt-6 leading-relaxed max-w-2xl mx-auto">
          Outmail emails real recruiters from your own inbox and puts matched openings in front of
          you. Pay once — no subscription, nothing renews automatically. Not right for you? Full
          refund within 7 days.
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
      <div className="absolute top-24 left-[10%] w-36 h-36 rounded-2xl border border-white/10 bg-primary/20 rotate-12 blur-[1px]" />
      <div className="absolute top-32 right-[12%] w-20 h-20 rounded-full border border-white/15 bg-accent-light/20" />
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
