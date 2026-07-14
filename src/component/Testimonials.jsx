import React from 'react';
import StaggerTestimonials from './ui/stagger-testimonials';

export default function Testimonials() {
  return (
    <div className="text-white px-4 py-20 bg-[#0a0b14]">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[4px] text-[#AD46FF] font-display font-medium mb-3">
          Early Validation
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Students Want This. Badly.
        </h2>
        <p className="text-white/55 max-w-xl mx-auto text-sm mb-12">
          Before we built a single feature, we spoke to students across campuses. Here&apos;s what they told us — unprompted.
        </p>

        <StaggerTestimonials />
      </div>
    </div>
  );
}
