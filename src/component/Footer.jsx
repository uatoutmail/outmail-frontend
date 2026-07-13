"use client";

import React, { useState } from "react";
import Wordmark from "@/component/ui/wordmark";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function Footer({ variant = "gradient" }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const isDark = variant === "dark";
  const emailSchema = z.email();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailSchema.safeParse(email).success) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      await subscribeNewsletter(email);
      setError("");
      setSubscribed(true);
      setEmail("");
      setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    } catch (err) {
      setError("Failed to subscribe. Please try again later.");
    }
  };

  const subscribeNewsletter = async (email) => {
    try {
      await api.post(`/api/newsletter/subscribe`, { email });
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
    }
    toast.success("Subscribed Successfully!");
  };

  return (
    <footer
      className={`text-white px-6 pt-20 pb-10 relative ${
        isDark
          ? "border-t border-white/10 bg-[#090b16]"
          : "bg-gradient-to-l from-black via-[#6c00ff] to-black"
      }`}
    >
      <div className="max-w-7xl mx-auto grid gap-12 md:grid-cols-2">
        {/* Left Column */}
        <div>
          <div className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Image
              src="/logo-nav.png"
              alt="Outmail Logo"
              width={40}
              height={40}
            />
            <Wordmark className="text-white text-2xl" />
          </div>

          <p className="text-white/70 text-sm leading-relaxed max-w-md mb-6">
            Hiring is harder than ever. Outmail keeps you ahead — reach
            recruiters directly, spot opportunities early, and get the guidance
            to convert them.
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-white/80">
            <Link href="/features" className="hover:underline">
              features
            </Link>
            <Link
              href="/terms-and-conditions"
              className="hover:underline"
            >
              Terms and Conditions
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:underline"
            >
              Privacy Policy
            </Link>
            <Link href="/faq" className="hover:underline">
              FAQ
            </Link>
            <Link href="/contactus" className="hover:underline">
              contact us
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Stay Connected</h3>
          <p className="text-sm text-white/60 mb-4">
            Join our newsletter for job search tips, product updates, and
            exclusive offers from Outmail.
          </p>

          <form
            className="flex flex-col sm:flex-row gap-4"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              aria-label="Email address"
              className="px-5 py-3 rounded-full text-white w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-white placeholder:text-white border border-amber-50"
            />
            <button
              type="submit"
              className={`px-6 py-3 rounded-full font-semibold transition duration-200 relative overflow-hidden focus:outline-none
                        ${
                          subscribed
                            ? "animate-pop bg-gradient-to-r from-[#6c00ff] via-[#a100ff] to-[#6c00ff] text-white scale-110 shadow-lg"
                            : "bg-white text-black hover:bg-gray-200"
                        }
                      `}
              disabled={subscribed}
            >
              {subscribed ? (
                <span className="animate-pop">Subscribed!</span>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
          {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
        </div>
      </div>

      {/* Bottom Line */}
      <div
        className={`mt-12 pt-6 text-center text-sm text-white/50 ${isDark ? "border-t border-white/10" : "border-t border-white/20"}`}
      >
        <p>© {new Date().getFullYear()} Outmail. All rights reserved.</p>
      </div>
    </footer>
  );
}
