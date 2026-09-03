"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Mail, Phone, X } from "lucide-react";
import { useState } from "react";

/**
 * The "Book a call" button and its dialog.
 *
 * Extracted so /partnership can stay a SERVER component. It was marked
 * "use client" in its entirety for this one piece of state, and a client page
 * cannot export `metadata` — which is why the page shipped with no title,
 * description or canonical. One dialog should not cost a page its SEO.
 */
export default function BookCallDialog({ triggerClassName = "", label = "Book a call" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          triggerClassName ||
          "inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 font-syne font-semibold rounded-btn transition-colors"
        }
      >
        <Phone size={16} /> {label} <ArrowRight size={16} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center"
            onClick={() => setOpen(false)}
            role="presentation"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md rounded-2xl border border-white/15 bg-[#121625] p-7 relative"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="book-call-title"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-primary to-accent-light flex items-center justify-center mb-5 shadow-[0_10px_25px_-6px_var(--brand-primary)]">
                <Phone size={24} />
              </div>

              <h3 id="book-call-title" className="font-syne text-2xl font-bold mb-3">
                Book a Call
              </h3>
              <p className="text-white/70 leading-relaxed mb-6">
                Email us at contact@outmail.in with your institution and a preferred time, and
                we&apos;ll get in touch to set up a call.
              </p>
              <a
                href="mailto:contact@outmail.in?subject=Campus%20Outmail%20%E2%80%94%20Discovery%20Call"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 font-syne font-semibold rounded-btn transition-colors w-full"
              >
                <Mail size={16} /> Email us
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
