"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    testimonial: "I've sent 60+ applications this semester and heard back from maybe 3. The moment the team explained what Outmail does, I literally said — why doesn't this exist already? I'd pay for this right now. Please launch fast.",
    by: "Final-year CSE student",
    imgSrc: "",
  },
  {
    testimonial: "I asked my placement officer if our college could tie up with Outmail and make it part of our placement prep. She loved the idea and asked for a proposal. We're pushing for it to be an official offering next year.",
    by: "3rd-year engineering student",
    imgSrc: "",
  },
  {
    testimonial: "Cold emailing recruiters is something I always knew I should be doing but had no idea how to start. When I saw the Outmail demo, I went and told my entire study group about it. Five of us signed up for early access the same evening.",
    by: "Final-year MBA student",
    imgSrc: "",
  },
  {
    testimonial: "Our placement cell has been looking for something exactly like this — a way to help students reach out to companies that aren't even posting on campus portals. We've already raised this with the TPO and she's asked the Outmail team for a demo.",
    by: "3rd-year ECE student",
    imgSrc: "",
  },
  {
    testimonial: "When I showed this to my batchmates, the reaction was unanimous — we need this. Everyone is frustrated with portal applications going nowhere. I'm personally vouching for Outmail within our placement committee.",
    by: "Student placement coordinator",
    imgSrc: "",
  },
  {
    testimonial: "The idea of targeting companies based on funding signals and growth stage is so obvious in hindsight. I don't understand why no one built this for students before. I've already referred three friends and we're all waiting for the full launch.",
    by: "4th-year CS student",
    imgSrc: "",
  },
];

const TestimonialCard = ({ position, testimonial, handleMove, cardSize }) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border p-8 transition-all duration-500 ease-in-out overflow-hidden",
        isCenter
          ? "z-10 bg-[#5C1ED9] border-purple-400"
          : "z-0 bg-white border-border hover:border-primary/50"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath:
          "polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)",
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px rgba(108,0,255,0.5)" : "0px 0px 0px 0px transparent",
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-border"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
        }}
      />
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-white">
        <GraduationCap className="h-6 w-6" />
      </div>
      <h3
        className={cn(
          "text-sm sm:text-base font-medium leading-relaxed line-clamp-6",
          isCenter ? "text-white" : "text-gray-800"
        )}
      >
        &ldquo;{testimonial.testimonial}&rdquo;
      </h3>
      <p
        className={cn(
          "absolute bottom-8 left-8 right-8 mt-2 text-xs italic",
          isCenter ? "text-white/70" : "text-gray-500"
        )}
      >
        — {testimonial.by}
      </p>
    </div>
  );
};

const StaggerTestimonials = () => {
  const [cardSize, setCardSize] = useState(365);
  // Lazy initializer - Math.random() is impure, so it must only run once on
  // mount (the function form), not on every render (a bare value argument
  // to useState is re-evaluated every render even though only used once).
  const [testimonialsList, setTestimonialsList] = useState(() =>
    testimonials.map((t) => ({ ...t, tempId: Math.random() }))
  );

  const handleMove = (steps) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-muted/30" style={{ height: 600 }}>
      {testimonialsList.map((testimonial, index) => {
        const position =
          testimonialsList.length % 2
            ? index - (testimonialsList.length + 1) / 2
            : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-60">
  <button
    onClick={() => handleMove(-1)}
    className="flex h-14 w-14 items-center justify-center text-2xl bg-background border-2 border-border text-primary rounded-full transition hover:bg-gray-300"
    aria-label="Previous testimonial"
  >
    <ChevronLeft />
  </button>
  <button
    onClick={() => handleMove(1)}
    className="flex h-14 w-14 items-center justify-center text-2xl bg-background border-2 border-border text-primary rounded-full transition hover:bg-gray-300"
    aria-label="Next testimonial"
  >
    <ChevronRight />
  </button>
</div>

    </div>
  );
};

export default StaggerTestimonials;
