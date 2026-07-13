'use client';
import React, { useState } from 'react';
import { Mail, Clock, Handshake, CalendarDays } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { api } from '@/lib/api';

const infoItems = [
  {
    icon: Mail,
    label: 'Email Us',
    value: 'contact@outmail.in',
    sub: 'For account & campaign questions',
  },
  {
    icon: Handshake,
    label: 'Partnerships & Collaborations',
    value: 'contact@outmail.in',
    sub: 'For brand deals, integrations & co-builds',
  },
  {
    icon: Clock,
    label: 'Response Time',
    value: 'Within 24 hours',
    sub: 'On all weekday submissions',
  },
  {
    icon: CalendarDays,
    label: 'For TPOs & Institutions',
    value: 'Book a Discovery Call',
    sub: 'Explore campus-wide Outmail plans',
    isLink: true,
    href: 'mailto:contact@outmail.in?subject=Discovery%20Call%20Request%20%E2%80%94%20Campus%20Outmail&body=Hi%20Outmail%20team%2C%0A%0AWe%27d%20like%20to%20explore%20campus-wide%20Outmail%20plans.%0A%0AInstitution%3A%0ARole%3A%0APreferred%20time%3A%0A',
  },
];

export default function GetInTouch() {
  const [form, setForm] = useState({ name: '', email: '', role: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await api.post(`/api/contact`, form);
      toast.success('Message sent successfully!');
      setSubmitted(true);
    } catch (error) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0a0b14] py-24 px-4 sm:px-6 lg:px-8">
      <Toaster position="bottom-right" richColors />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Left — Contact Info */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs uppercase tracking-[4px] text-purple-400 font-medium mb-3">Reach Out</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
                Let&apos;s Talk.
              </h2>
              <p className="text-white/55 text-sm leading-relaxed max-w-sm">
                Questions about your campaigns, recruiter outreach, or bringing Outmail to your campus?
                Pick the right channel below or just fill out the form.
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              {infoItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4 backdrop-blur-xl">
                    <div className="flex-shrink-0 p-2.5 bg-purple-500/20 rounded-lg text-purple-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-0.5">{item.label}</p>
                      {item.isLink ? (
                        <a href={item.href} className="text-white font-semibold text-sm hover:text-purple-300 transition underline underline-offset-2">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-white font-semibold text-sm">{item.value}</p>
                      )}
                      <p className="text-white/40 text-xs mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>


          </div>

          {/* Right — Contact Form */}
          <div className="rounded-2xl border border-white/12 bg-white/5 backdrop-blur-xl shadow-[0_0_45px_rgba(108,0,255,0.20)] p-8 lg:p-10">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-4">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                  <Mail className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                <p className="text-white/65 text-sm max-w-xs leading-relaxed">
                  Thanks for reaching out. We&apos;ll get back to you within 24 hours on weekdays.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-purple-300 text-sm font-medium hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-1">Send Us a Message</h3>
                <p className="text-white/65 text-sm mb-8 leading-relaxed">
                  Fill out the form and we&apos;ll get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-xs font-medium text-white/55 uppercase tracking-wider mb-1.5">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="Arjun Mehta"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white text-sm placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-white/55 uppercase tracking-wider mb-1.5">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="arjun@college.edu"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white text-sm placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-xs font-medium text-white/55 uppercase tracking-wider mb-1.5">I am a...</label>
                    <select
                      id="role"
                      name="role"
                      required
                      value={form.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    >
                      <option value="" disabled>Select your role</option>
                      <option value="student">Student</option>
                      <option value="tpo">TPO / Placement Officer</option>
                      <option value="recruiter">Recruiter</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-medium text-white/55 uppercase tracking-wider mb-1.5">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      required
                      placeholder="Tell us what's on your mind..."
                      value={form.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 text-white text-sm placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-[#6c00ff] to-[#b06cff] text-white font-semibold rounded-lg hover:opacity-90 transition text-sm tracking-wide disabled:opacity-70"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>

                  <p className="text-center text-xs text-white/45 mt-1">
                    We reply within 24 hours on weekdays.
                  </p>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
