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
 *
 * `returnTo` is the same idea for pages that send someone to sign in and need
 * them back afterwards — the extension connect page, which is useless if the
 * user lands on the dashboard instead. Unlike the checkout intent this one IS
 * consumed here, because nothing downstream reads it.
 */

// Only our own paths, and only a path — never a full URL. A value that
// survives sign-in and then gets navigated to is an open-redirect if anything
// but this is allowed.
const safeReturnTo = (value) =>
  typeof value === "string" && /^\/[a-zA-Z0-9\-_/]*$/.test(value) ? value : null;
export default function AuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    let hasIntent = false;
    let returnTo = null;
    try {
      hasIntent = Boolean(sessionStorage.getItem("outmail.checkoutIntent"));
      returnTo = safeReturnTo(sessionStorage.getItem("outmail.returnTo"));
      if (returnTo) sessionStorage.removeItem("outmail.returnTo");
    } catch {
      // Private browsing — fall through to the dashboard.
    }
    router.replace(returnTo || (hasIntent ? "/pricing" : "/dashboard"));
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
