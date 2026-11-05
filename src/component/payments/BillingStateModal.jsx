"use client";
import { useEffect, useRef } from "react";
import { INDIAN_STATES } from "@/lib/indianStates";

/**
 * The one extra step checkout gained once GST registration went live
 * (2026-11-05). The backend needs the customer's billing state to decide
 * CGST+SGST vs IGST on the receipt — nothing else in the signup/checkout
 * flow ever asks for an address, so this is the only place to collect it.
 *
 * Deliberately NOT a Radix AlertDialog (src/component/ui/alert-dialog.jsx):
 * that primitive is built for a yes/no confirmation, not a required form
 * field with its own validation and a cancel path that must not trigger
 * checkout. Hand-rolled to match that component's visual language instead.
 */
export default function BillingStateModal({ open, onConfirm, onCancel }) {
  const selectRef = useRef(null);

  useEffect(() => {
    if (open) selectRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    const state = new FormData(e.currentTarget).get("billingState");
    if (state) onConfirm(state);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="billing-state-title"
    >
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-white/20 bg-black/90 p-6 font-syne"
      >
        <h2 id="billing-state-title" className="text-lg font-semibold text-white mb-1.5">
          One more thing
        </h2>
        <p className="text-sm text-gray-400 mb-5">
          Which state is your billing address in? This decides how GST is split on your receipt — it
          never changes what you pay.
        </p>
        <select
          ref={selectRef}
          name="billingState"
          required
          defaultValue=""
          aria-label="Billing state"
          className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="" disabled>
            Select a state or UT…
          </option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s} className="bg-black">
              {s}
            </option>
          ))}
        </select>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="mt-2 sm:mt-0 inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-purple-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Continue to payment
          </button>
        </div>
      </form>
    </div>
  );
}
