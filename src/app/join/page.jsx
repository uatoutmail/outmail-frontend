"use client";

import { Loader2, CheckCircle2, XCircle, School } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Wordmark from "@/component/ui/wordmark";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

// TPO campus onboarding (2026-11-19): the landing page for a student join
// link (outmail.in/join?code=...), shared live in a TPO's Zoom session so
// hundreds of students can self-tag to their college in one click.
//
// Reads `code` from window.location directly, same reason tpo/claim does:
// a value only ever read once on mount doesn't need the useSearchParams hook
// or its Suspense boundary.
//
// Not authenticated -> leave a "come back here" breadcrumb in sessionStorage
// (the same outmail.returnTo pattern /auth/success already reads for the
// extension-connect page — there is no way to pass a redirect through
// Google's OAuth round trip other than a same-browser breadcrumb) and send
// them into the ordinary sign-in flow, no special backend client param
// needed. Already authenticated -> call the join endpoint directly.
export default function JoinInstitutionPage() {
  const { isAuthenticated, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [code, setCode] = useState(undefined); // undefined = not read yet
  const [status, setStatus] = useState("loading-preview"); // loading-preview | preview-error | ready | redirecting | joining | success | error
  const [institution, setInstitution] = useState(null);
  const [message, setMessage] = useState("");
  const joinAttempted = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCode(params.get("code") || null);
  }, []);

  // Public preview — works before any sign-in, so a student sees "You're
  // about to join {College}" immediately rather than a blank spinner while
  // auth resolves.
  useEffect(() => {
    if (code === undefined) return;
    if (!code) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("preview-error");
      setMessage("This link is missing its join code. Use the link your college shared directly.");
      return;
    }
    (async () => {
      try {
        const { data } = await api.get(`/api/institutions/by-code/${encodeURIComponent(code)}`);
        setInstitution(data);
        setStatus("ready");
      } catch {
        setStatus("preview-error");
        setMessage(
          "This link isn't valid or has expired — check with your college's placement office for a fresh one."
        );
      }
    })();
  }, [code]);

  useEffect(() => {
    if (loading || !institution || joinAttempted.current) return;

    if (!isAuthenticated) {
      joinAttempted.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("redirecting");
      try {
        sessionStorage.setItem("outmail.returnTo", `/join?code=${encodeURIComponent(code)}`);
      } catch {
        // Private browsing — they'll land on the dashboard instead and can
        // use the code again from Settings, which is inconvenient but not broken.
      }
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`;
      return;
    }

    joinAttempted.current = true;
    setStatus("joining");
    (async () => {
      try {
        const { data } = await api.put("/api/user/join", { institutionCode: code });
        await refreshUser();
        setMessage(data.message || `You're now part of ${institution.name} on Outmail!`);
        setStatus("success");
        setTimeout(() => router.replace("/dashboard"), 1500);
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.error || "Couldn't join this institution. Please try the link again."
        );
      }
    })();
  }, [loading, isAuthenticated, institution, code, refreshUser, router]);

  return (
    <main className="min-h-screen bg-background text-white font-syne flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute top-[10%] left-[5%] w-72 h-72 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, color-mix(in srgb, var(--brand-primary) 24%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-[10%] right-[5%] w-72 h-72 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, color-mix(in srgb, var(--brand-accent) 20%, transparent), transparent 70%)",
        }}
      />

      <div className="mb-8 z-10 flex flex-col items-center">
        <Link
          href="/"
          className="flex items-center gap-3 group transition-transform hover:scale-105"
        >
          <Image
            src="/logo-nav.png"
            alt="Outmail Logo"
            width={50}
            height={50}
            className="drop-shadow-[0_0_15px_var(--brand-primary)]"
          />
          <Wordmark className="text-white text-3xl" />
        </Link>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="glass-card p-8 md:p-10 border border-white/10 bg-surface-panel/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

          {status === "loading-preview" ? (
            <div className="py-8 flex flex-col items-center gap-3 text-white/60">
              <Loader2 className="animate-spin" size={28} />
              <p>Loading your invite…</p>
            </div>
          ) : status === "preview-error" ? (
            <div className="py-4 flex flex-col items-center gap-3">
              <XCircle className="text-red-400" size={32} />
              <h1 className="text-xl font-bold">Couldn&apos;t load this invite</h1>
              <p className="text-white/60 text-sm">{message}</p>
            </div>
          ) : status === "ready" || status === "redirecting" || status === "joining" ? (
            <div className="py-8 flex flex-col items-center gap-3 text-white/60">
              <School className="text-emerald-400" size={28} />
              <p className="text-white font-semibold">
                You&apos;re about to join {institution?.name}
              </p>
              {institution?.location && (
                <p className="text-white/50 text-sm">{institution.location}</p>
              )}
              <Loader2 className="animate-spin mt-2" size={24} />
              <p className="text-sm">
                {status === "redirecting"
                  ? "Taking you to sign in…"
                  : status === "joining"
                    ? "Joining…"
                    : "One moment…"}
              </p>
            </div>
          ) : status === "success" ? (
            <div className="py-8 flex flex-col items-center gap-3">
              <CheckCircle2 className="text-emerald-400" size={32} />
              <p className="text-white/80">{message}</p>
              <p className="text-white/50 text-sm">Taking you to your dashboard…</p>
            </div>
          ) : (
            <div className="py-4 flex flex-col items-center gap-3">
              <XCircle className="text-red-400" size={32} />
              <h1 className="text-xl font-bold">Couldn&apos;t join</h1>
              <p className="text-white/60 text-sm">{message}</p>
              <Link
                href="/dashboard"
                className="text-purple-400 hover:text-purple-300 text-sm font-medium mt-2"
              >
                Go to your dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
