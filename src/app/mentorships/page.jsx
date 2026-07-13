"use client";
import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  Star,
  Loader2,
  Calendar,
  ChevronRight,
  TrendingUp,
  Clock,
  Tag
} from "lucide-react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { motion } from "framer-motion";

function StarRow({ count }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          className={
            i <= Math.round(count)
              ? "text-[#6c00ff] fill-[#6c00ff]"
              : "text-white/10 fill-white/5"
          }
        />
      ))}
    </div>
  );
}

export default function MentorshipsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await api.get("/api/mentorship/sessions");
        const data = response.data;

        // Transform the data
        const formattedData = data.map((s) => ({
          id: s.id,
          mentor: s.mentorName,
          role: s.mentorRole,
          image: s.mentorImage,
          topic: s.topic,
          sessionTime: s.sessionTime,
          sessionType: s.sessionType,
          whyAttend: s.whyThisMentor,
          date: new Date(s.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).toUpperCase(),
          attendees: s.attendees,
          rating: s.rating,
          reviews: s.reviews.map((r) => ({
            name: r.reviewerName.toUpperCase(),
            text: r.reviewText,
            stars: r.stars,
          })),
        }));

        setSessions(formattedData);
      } catch (error) {
        console.error("Error fetching mentorship sessions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white selection:bg-[#6c00ff]/30">
      <Navbar variant="dark" />

      {/* Simplified Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[#ad46ff] text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              <TrendingUp size={12} /> Empowering Your Journey
            </span>
            <h1 className="text-4xl md:text-6xl font-syne font-bold mb-6 tracking-tight gradient-hero">
              Expert Mentorship
            </h1>
            <p className="text-base text-white/50 max-w-xl mx-auto leading-relaxed">
              Accelerate your growth with personalized sessions from industry leaders. 
              Master cold outreach, resume architecture, and professional presence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[#6c00ff]" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-40 bg-white/[0.02] border border-white/5 rounded-[32px]">
             <h3 className="text-xl font-semibold opacity-40 italic">No scheduled sessions at the moment</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {sessions.map((s, idx) => (
              <motion.div
                key={s.id || idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#13141f] border border-white/5 rounded-[32px] p-8 hover:border-white/10 transition-all duration-300 shadow-2xl"
              >
                {/* Mentor Header */}
                <div className="flex items-center gap-5 mb-10">
                  {s.image ? (
                    <img 
                      src={s.image} 
                      alt={s.mentor} 
                      className="w-16 h-16 rounded-2xl object-cover shadow-[0_8px_20px_-6px_rgba(108,0,255,0.5)]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6c00ff] to-[#ad46ff] flex items-center justify-center text-xl font-bold text-white shadow-[0_8px_20px_-6px_rgba(108,0,255,0.5)]">
                      {s.mentor.split(" ").map(n => n[0]).join("")}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-syne font-bold text-white tracking-wide uppercase">
                      {s.mentor}
                    </h3>
                    <p className="text-sm font-medium text-white/60">{s.role}</p>
                  </div>
                </div>

                {/* Session Context Box */}
                <div className="bg-white/5 border border-white/5 rounded-3xl p-7 mb-10">
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#ad46ff]" />
                      <span className="text-[10px] font-bold text-[#ad46ff] tracking-[0.15em]">
                        {s.date}
                      </span>
                    </div>
                    {s.sessionTime && (
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#ad46ff]" />
                        <span className="text-[10px] font-bold text-white/40 tracking-[0.1 tracking-[0.1em]">
                          {s.sessionTime}
                        </span>
                      </div>
                    )}
                  </div>
                  <h4 className="text-2xl font-syne font-bold leading-tight mb-4">
                    {s.topic}
                  </h4>
                  {s.sessionType && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/60">
                      <Tag size={10} /> {s.sessionType}
                    </div>
                  )}
                </div>

                {/* Why Attend Box */}
                {s.whyAttend && (
                  <div className="mb-10 px-4 py-3 bg-purple-500/5 border-l-2 border-purple-500/30 rounded-r-xl">
                    <p className="text-xs font-bold text-purple-300/80 uppercase tracking-widest mb-1">Expert Focus</p>
                    <p className="text-sm text-white/60 italic leading-relaxed">
                      {s.whyAttend}
                    </p>
                  </div>
                )}

                {/* Performance Metrics */}
                <div className="flex items-end justify-between border-t border-white/5 pt-2 mb-10">
                  <div>
                    <p className="text-sm font-extrabold text-white/60 tracking-[0.15em] mb-2 uppercase">
                      Attendees
                    </p>
                    <p className="text-lg font-syne font-bold">{s.attendees} Students</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-white/60 tracking-[0.15em] mb-2 uppercase">
                      Reviews
                    </p>
                    <div className="flex items-center justify-end gap-3">
                      <StarRow count={s.rating} />
                      <span className="text-lg font-syne font-bold leading-none">{s.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Evidence / Review Quote */}
                {s.reviews && s.reviews.length > 0 && (
                  <div className="relative pl-6 py-2 border-l-4 border-[#6c00ff] mb-10 text-left">
                     <p className="text-md italic font-medium text-white/60">
                        &ldquo;{s.reviews[0].text}&rdquo;
                     </p>
                     <p className="text-sm font-bold text-[#ad46ff] mt-2">
                        — {s.reviews[0].name}
                     </p>
                  </div>
                )}

                <button className="w-full group/btn flex items-center justify-center gap-3 py-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300">
                  <span className="text-base font-bold tracking-tight">Book Session</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer variant="dark" />
    </div>
  );
}

