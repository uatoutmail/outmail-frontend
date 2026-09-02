"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Where Google sign-in returns to.
 *
 * It used to always land on /dashboard, which silently discarded a plan the
 * visitor had chosen moments earlier — the highest-intent moment in the funnel
 * (OUT-227). If a checkout intent is waiting, we send them back to /pricing
 * instead, where it resumes and opens Razorpay for the plan they picked.
 *
 * The intent is only PEEKED at here; /pricing consumes and clears it. Reading
 * destructively in two places would race, and the user would land on pricing
 * with the choice already thrown away.
 */
export default function AuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    let hasIntent = false;
    try {
      hasIntent = Boolean(sessionStorage.getItem("outmail.checkoutIntent"));
    } catch {
      // Private browsing — fall through to the dashboard.
    }
    router.replace(hasIntent ? "/pricing" : "/dashboard");
  }, [router]);

  // No state here on purpose. Branching the message would mean setting state
  // inside the effect, and this screen is visible for a fraction of a second
  // before the redirect — not worth a cascading render to personalise.
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-l from-black via-primary to-black">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">Signing you in…</p>
      </div>
    </div>
  );
}
