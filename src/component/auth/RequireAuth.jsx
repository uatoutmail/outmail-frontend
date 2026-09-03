"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
 * `hasStoredToken()` is checked alongside `isAuthenticated` because on a hard
 * refresh the token exists before /api/user/me has confirmed it, and bouncing
 * the user during that window would sign them out of their own session.
 */
export default function RequireAuth({ children, role, signInPath = "/" }) {
  const { isAuthenticated, userRole, loading } = useAuth();
  const router = useRouter();

  const maybeSignedIn = isAuthenticated || hasStoredToken();
  const roleOk = !role || userRole === role;

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

  if (loading || !maybeSignedIn) return null;
  if (isAuthenticated && !roleOk) return null;
  return children;
}
