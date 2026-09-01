"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { startCheckout, getPlans } from "@/lib/payments";
import { formatPaise } from "@/lib/paymentOutcome";
import { daysUntilExpiry } from "@/lib/planAccess";

/**
 * Billing — the first place a paying customer can see what they bought.
 *
 * Two gaps this closes:
 *   1. GET /api/payments/orders existed, was correctly scoped to the caller, and
 *      had NO consumer. A user could not see a single thing about their payment.
 *   2. The published refund policy promises "cancel at any time from your
 *      account dashboard" (OUT-234). That promise had no implementation.
 *
 * Renewal lives here too (OUT-236). With a one-time annual payment nothing
 * charges the card again, so every renewal is a fresh decision the user has to
 * be prompted into. Silent expiry does not read as "my plan lapsed" — it reads
 * as "the product broke".
 */

const REFUND_WINDOW_DAYS = 7;

export default function BillingTab() {
  const { user, refreshUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [renewing, setRenewing] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.all([api.get("/api/payments/orders"), getPlans().catch(() => [])])
      .then(([res, planList]) => {
        if (!alive) return;
        setOrders(res.data || []);
        setPlans(planList || []);
        setError(false);
      })
      .catch(() => alive && setError(true))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const plan = user?.currentPlan;
  const days = daysUntilExpiry(user);
  const expired = days != null && days < 0;

  const renew = async () => {
    const target = plans.find((p) => p.code === plan?.code) || plans[0];
    if (!target) return;
    setRenewing(true);
    try {
      await startCheckout({ planId: target.id });
      await refreshUser();
      const res = await api.get("/api/payments/orders");
      setOrders(res.data || []);
    } catch {
      // startCheckout rejects on cancellation too. The pricing page owns the
      // full outcome messaging; here silence is the honest response — nothing
      // changed.
    } finally {
      setRenewing(false);
    }
  };

  if (loading) return <p className="text-white/50 py-12">Loading your billing…</p>;

  return (
    <div className="space-y-8 max-w-3xl">
      <PlanStatus plan={plan} days={days} expired={expired} onRenew={renew} renewing={renewing} />
      {error ? (
        <p className="text-white/50">We could not load your payment history just now.</p>
      ) : (
        <PaymentHistory orders={orders} />
      )}
      <RefundNotice orders={orders} />
    </div>
  );
}

function PlanStatus({ plan, days, expired, onRenew, renewing }) {
  if (!plan) {
    return (
      <Card>
        <h3 className="text-xl font-bold text-white mb-2">No active plan</h3>
        <p className="text-white/60 text-sm mb-5">
          Outmail is a one-time payment for one placement year. Nothing renews automatically.
        </p>
        <a href="/pricing" className="inline-block bg-white text-black font-bold py-2.5 px-6 rounded-full text-sm hover:bg-gray-100">
          See plans
        </a>
      </Card>
    );
  }

  // Expiry is stated in both remaining days and an absolute date. "42 days left"
  // is what people act on; the date is what they check against a bank statement.
  const tone = expired ? "border-red-500/40 bg-red-500/5"
    : days <= 30 ? "border-amber-500/40 bg-amber-500/5"
    : "border-white/12 bg-white/5";

  return (
    <Card className={tone}>
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[3px] text-purple-400 mb-2">Your plan</p>
          <h3 className="text-xl font-bold text-white">{plan.name}</h3>
          {days != null && (
            <p className={`text-sm mt-2 ${expired ? "text-red-300" : days <= 30 ? "text-amber-300" : "text-white/60"}`}>
              {expired
                ? `Your placement year ended ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago.`
                : `${days} day${days === 1 ? "" : "s"} left in your placement year.`}
            </p>
          )}
        </div>
        {(expired || (days != null && days <= 30)) && (
          <button type="button" onClick={onRenew} disabled={renewing}
            className="bg-white text-black font-bold py-2.5 px-6 rounded-full text-sm hover:bg-gray-100 disabled:opacity-50">
            {renewing ? "Opening checkout…" : expired ? "Renew to resume" : "Renew early"}
          </button>
        )}
      </div>

      {expired && (
        <div className="mt-5 pt-5 border-t border-white/10 text-sm text-white/70 space-y-2">
          <p>While your plan is lapsed, sending is paused and job openings are hidden.</p>
          {/* A student worrying their data is gone will not renew. Saying this
              plainly is the single most useful sentence on the lapsed screen. */}
          <p className="text-white/50">
            Nothing has been deleted — your resume, your outreach history and your saved answers are
            all still here, and come back the moment you renew.
          </p>
        </div>
      )}

      {!expired && days != null && days <= 30 && (
        <p className="mt-5 pt-5 border-t border-white/10 text-sm text-white/50">
          Renewing early does not lose the days you have left — they are added on top.
        </p>
      )}
    </Card>
  );
}

function PaymentHistory({ orders }) {
  if (!orders.length) {
    return (
      <Card>
        <h3 className="text-lg font-bold text-white mb-2">Payments</h3>
        <p className="text-white/50 text-sm">No payments yet.</p>
      </Card>
    );
  }
  return (
    <Card>
      <h3 className="text-lg font-bold text-white mb-4">Payments</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/40 text-xs uppercase tracking-[2px] text-left">
              <th className="pb-3 pr-4 font-medium">Date</th>
              <th className="pb-3 pr-4 font-medium">Plan</th>
              <th className="pb-3 pr-4 font-medium">Amount</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-white/80">
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-white/8">
                <td className="py-3 pr-4 whitespace-nowrap">
                  {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="py-3 pr-4">{o.plan?.name || "—"}</td>
                <td className="py-3 pr-4 whitespace-nowrap">{formatPaise(o.amount, o.currency)}</td>
                <td className="py-3"><StatusPill status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-white/40 text-xs mt-4">
        Need a receipt for a payment? Email{" "}
        <a href="mailto:support@outmail.in" className="underline">support@outmail.in</a> with the date and we will send one.
      </p>
    </Card>
  );
}

function StatusPill({ status }) {
  const styles = {
    paid: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    failed: "bg-red-500/15 text-red-300 border-red-500/30",
    created: "bg-white/10 text-white/60 border-white/20",
  }[status] || "bg-white/10 text-white/60 border-white/20";
  // 'created' is opaque to a customer — it means they started a checkout and it
  // never completed, so say that instead of leaking our internal state name.
  const label = status === "created" ? "Not completed" : status === "paid" ? "Paid" : "Failed";
  return <span className={`text-xs px-2.5 py-1 rounded-full border ${styles}`}>{label}</span>;
}

function RefundNotice({ orders }) {
  const lastPaid = orders.find((o) => o.status === "paid");
  if (!lastPaid) return null;

  const daysSince = Math.floor((Date.now() - new Date(lastPaid.created_at)) / 86400000);
  const open = daysSince <= REFUND_WINDOW_DAYS;

  return (
    <Card>
      <h3 className="text-lg font-bold text-white mb-2">Refunds and cancellation</h3>
      {/* There is no recurring charge to cancel — saying so plainly is more
          honest than a disabled "cancel subscription" button, and it matches
          what the refund policy will say after OUT-234. */}
      <p className="text-white/60 text-sm mb-3">
        Outmail is a one-time payment for one year. There is no subscription and nothing renews
        automatically, so there is nothing to cancel — your access simply ends unless you renew.
      </p>
      <p className={`text-sm ${open ? "text-emerald-300" : "text-white/50"}`}>
        {open
          ? `Your 7-day refund window is open for another ${REFUND_WINDOW_DAYS - daysSince} day${REFUND_WINDOW_DAYS - daysSince === 1 ? "" : "s"}. Email support@outmail.in and we will refund in full, no questions asked.`
          : "Your 7-day refund window has closed."}
      </p>
      <a href="/refund-and-cancellation" className="inline-block mt-3 text-sm text-accent-light underline">
        Read the full policy
      </a>
    </Card>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border p-6 ${className || "border-white/12 bg-white/5"}`}>
      {children}
    </div>
  );
}
