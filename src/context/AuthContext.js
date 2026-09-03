"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { api, SESSION_EXPIRED_EVENT } from "@/lib/api";
import { logger } from "@/lib/logger";

const AuthContext = createContext({});

// Token management utilities for cross-domain authentication
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

/**
 * Whether a token exists locally, regardless of whether it is still valid.
 *
 * Exported because /dashboard had its own copy of this three-line helper. Two
 * implementations of "are we probably signed in" is how a redirect ends up
 * firing on one route and not another.
 */
export const hasStoredToken = () => Boolean(getAuthToken());

const setAuthToken = (token) => {
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
      document.cookie = "outmail_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }
};

const captureTokenFromURL = () => {
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      setAuthToken(token);
      document.cookie = `outmail_auth=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
      window.history.replaceState({}, document.title, window.location.pathname);
      return token;
    }
  }
  return null;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const expiredRef = useRef(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // kept only for compatibility with backend payload

  // Read inside the focus handler below instead of closing over `loading`
  // directly - the effect intentionally has an empty dep array (it should
  // attach the listener once, not re-run checkAuth on every loading flip),
  // so a plain closure would see loading's stale value from mount forever.
  const loadingRef = useRef(loading);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  // Check authentication status
  const checkAuth = async () => {
    try {
      setLoading(true);

      // Check for token in URL first (OAuth redirect)
      captureTokenFromURL();

      // Get stored token

      // Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      // quiet: this fires on every public page for anonymous visitors too, and
      // a failure here already means "logged out" — it must never blank the
      // marketing site.
      const response = await api.get("/api/user/me", {
        signal: controller.signal,
        quiet: true,
      });

      clearTimeout(timeoutId);
      const userData = response.data;
      const finalUser = userData.user || userData;
      setUser(finalUser);
      setUserRole(finalUser.role || null);
      setIsAuthenticated(true);
    } catch {
      // A failure here means "not signed in", which is a normal state for
      // every anonymous visitor — not something to report. The request is
      // marked quiet so it cannot trip the service-unavailable screen either.
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post("/api/auth/logout", {});
    } catch (error) {
      // The local session is cleared in `finally` regardless, so a failed
      // server-side logout must never block the user from signing out.
      logger.error("Logout request failed; clearing the local session anyway", error);
    } finally {
      setAuthToken(null); // Clear stored token
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
      // Redirect to home page
      window.location.href = "/";
    }
  };

  /**
   * A token the server rejected.
   *
   * Before this, an expired session produced silent failures on every action:
   * buttons did nothing, lists stayed empty, and nothing told the user why.
   * The interceptor cannot fix that itself — it has no idea what is on screen
   * — so it announces, and the sign-out happens here, once, no matter how
   * many requests failed at the same time.
   */
  useEffect(() => {
    const onExpired = () => {
      if (expiredRef.current) return; // several requests can 401 together
      expiredRef.current = true;
      setAuthToken(null);
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
      toast.error("Your session expired. Please sign in again.");
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  // Login function (to be called after successful OAuth)
  const login = async () => {
    await checkAuth();
  };

  // Silently re-fetch the current user (e.g. after a payment to pick up the new plan)
  const refreshUser = async () => {
    try {
      const response = await api.get("/api/user/me");
      const userData = response.data;
      const finalUser = userData.user || userData;
      setUser(finalUser);
    } catch (error) {
      // Best-effort refresh: the caller already has a usable user object and
      // the next navigation re-fetches. Recorded, never surfaced.
      logger.debug("Silent user refresh failed", error);
    }
  };

  // Update user profile function
  const updateUser = async (userData) => {
    try {
      const response = await api.put("/api/user", userData);
      const updatedUser = response.data.user || response.data;
      setUser(updatedUser);
      toast.success("User updated successfully!");
      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      return { success: false, error: errorMessage };
    }
  };

  // Check auth on mount and when focus returns to window
  useEffect(() => {
    // checkAuth is async and only calls setState after its awaits resolve.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuth();

    // Re-check auth when user returns to the tab
    const handleFocus = () => {
      if (!loadingRef.current) {
        checkAuth();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    userRole,
    login,
    logout,
    checkAuth,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
