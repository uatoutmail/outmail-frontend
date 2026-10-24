"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth, hasStoredToken } from "@/context/AuthContext";
import { homeRouteFor } from "@/lib/roles";

/**
 * The client half of route protection.
 *
 * Middleware already refuses a request with no session cookie, so this is the
 * second of two checks rather than the only one. It exists because the cookie
 * says nothing about ROLE — a signed-in student and a signed-in placement
 * officer are indistinguishable at the edge — and because a token can expire
 * between the middleware pass and the render.
 *
 * WHY IT RENDERS NOTHING WHILE DECIDING
 *   Rendering the children first and redirecting afterwards is what produced
 *   the flash of a dashboard an unauthenticated visitor could not use. Better
 *   to show nothing for a moment than to show something untrue.
 *
 * WHY IT SHOWS A SPINNER AFTER A SHORT DELAY (not immediately, not never)
 *   The normal check resolves in well under a second, so showing nothing for
 *   that brief window is invisible in practice. But AuthContext's own check
 *   can take up to its 10s abort timeout, and users reading a persistently
 *   blank tab as broken (reported 2026-10-24) retried logging in, which is
 *   exactly what emptied their OAuth rate-limit budget. A short delay keeps
 *   the fast path flash-free and still tells a slow one something is
 *   happening.
 *
 * `hasStoredToken()` is checked alongside `isAuthenticated` because on a hard
 * refresh the token exists before /api/user/me has confirmed it, and bouncing
 * the user during that window would sign them out of their own session.
 */
const SPINNER_DELAY_MS = 600;

export default function RequireAuth({ children, role, signInPath = "/" }) {
  const { isAuthenticated, userRole, loading } = useAuth();
  const router = useRouter();
  const [showSpinner, setShowSpinner] = useState(false);

  const maybeSignedIn = isAuthenticated || hasStoredToken();
  const roleOk = !role || userRole === role;
  const deciding = loading || !maybeSignedIn;

  useEffect(() => {
    if (loading) return;
    if (!maybeSignedIn) {
      router.replace(signInPath);
      return;
    }
    if (isAuthenticated && !roleOk) {
      router.replace(homeRouteFor(userRole));
    }
  }, [loading, maybeSignedIn, isAuthenticated, roleOk, userRole, router, signInPath]);

  useEffect(() => {
    // showSpinner is never read once `deciding` is false (that render path
    // returns children/null directly), so there is nothing to reset here —
    // only the pending-check case needs a timer at all.
    if (!deciding) return;
    const timer = setTimeout(() => setShowSpinner(true), SPINNER_DELAY_MS);
    return () => clearTimeout(timer);
  }, [deciding]);

  if (deciding) {
    return showSpinner ? (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
      </div>
    ) : null;
  }
  if (isAuthenticated && !roleOk) return null;
  return children;
}
