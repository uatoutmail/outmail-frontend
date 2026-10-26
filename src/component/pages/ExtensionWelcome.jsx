"use client";

// The connect screen for the Autofill extension.
//
// It opens by itself the moment the extension is installed, and it is what the
// popup's "Connect to Outmail" button opens. The entire design goal is that a
// student who has just installed the extension does nothing at all: if they
// are signed in and the extension is present, this page pairs them and says so.
//
// Every other outcome is a named state with its own sentence and its own next
// action — not signed in, extension missing, already connected, browser
// blocked our content script. Collapsing those into "something went wrong" is
// how someone ends up uninstalling an extension that was working.

import {
  CheckCircle2,
  Loader2,
  MonitorDown,
  Puzzle,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  describeFailure,
  isExtensionInstalled,
  pairExtension,
  pingExtension,
} from "@/lib/extensionBridge";

/** The states this page can be in. One sentence and one action each. */
const STATE = {
  CHECKING: "checking",
  NEEDS_SIGN_IN: "needs_sign_in",
  NO_EXTENSION: "no_extension",
  READY: "ready",
  CONNECTING: "connecting",
  CONNECTED: "connected",
  ALREADY: "already",
  FAILED: "failed",
};

export default function ExtensionWelcome() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [state, setState] = useState(STATE.CHECKING);
  const [error, setError] = useState("");
  const [showFallback, setShowFallback] = useState(false);

  /**
   * The whole handshake: ask our API for a short-lived code, hand it to the
   * extension, let the extension exchange it. The code is the only thing that
   * crosses — the token it buys never comes back to this page.
   */
  const connect = useCallback(async () => {
    setState(STATE.CONNECTING);
    setError("");
    try {
      const { data } = await api.post("/api/autofill/link/code");
      const result = await pairExtension(data.code);
      if (result.ok) {
        setState(STATE.CONNECTED);
        return;
      }
      setError(describeFailure(result.reason));
      setState(STATE.FAILED);
    } catch (e) {
      // A 403 here means the plan does not include autofill, which is a
      // billing answer rather than a connection one.
      const status = e?.response?.status;
      setError(
        status === 403
          ? "Autofill is part of a paid plan. Once your plan is active, come back to this page."
          : e?.response?.data?.error ||
              "We couldn't reach Outmail. Check your connection and try again."
      );
      setState(STATE.FAILED);
    }
  }, []);

  // Decide what this visit is, then act. The happy path connects with no click
  // at all — which is the point of the page.
  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;
    (async () => {
      if (!isAuthenticated) {
        setState(STATE.NEEDS_SIGN_IN);
        return;
      }
      if (!isExtensionInstalled()) {
        setState(STATE.NO_EXTENSION);
        return;
      }
      const ping = await pingExtension();
      if (cancelled) return;
      if (!ping.installed) {
        setState(STATE.NO_EXTENSION);
        return;
      }
      if (ping.linked) {
        setState(STATE.ALREADY);
        return;
      }
      setState(STATE.READY);
      connect();
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, isAuthenticated, connect]);

  return (
    <main className="min-h-screen bg-surface-page px-5 py-16 font-sans">
      <div className="mx-auto w-full max-w-xl">
        <Header />
        <div className="mt-8 rounded-2xl border border-border-subtle bg-surface-panel p-7">
          <Body
            state={state}
            error={error}
            email={user?.email}
            onRetry={connect}
            showFallback={showFallback}
            onToggleFallback={() => setShowFallback((v) => !v)}
          />
        </div>
        <Assurance />
      </div>
    </main>
  );
}

function Header() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
        <Puzzle size={22} aria-hidden="true" />
      </span>
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Outmail Autofill</h1>
        <p className="text-sm text-muted-foreground">Connect the extension to your account</p>
      </div>
    </div>
  );
}

function Body({ state, error, email, onRetry, showFallback, onToggleFallback }) {
  switch (state) {
    case STATE.CHECKING:
    case STATE.READY:
    case STATE.CONNECTING:
      return (
        <Status
          icon={<Loader2 className="animate-spin" size={20} aria-hidden="true" />}
          title="Connecting…"
          detail="This takes a second. You don't need to do anything."
        />
      );

    case STATE.CONNECTED:
      return (
        <>
          <Status
            tone="good"
            icon={<CheckCircle2 size={20} aria-hidden="true" />}
            title="Connected"
            detail={
              email
                ? `The extension will now fill applications from ${email}.`
                : "The extension will now fill applications from your Outmail profile."
            }
          />
          <NextSteps />
        </>
      );

    case STATE.ALREADY:
      return (
        <>
          <Status
            tone="good"
            icon={<CheckCircle2 size={20} aria-hidden="true" />}
            title="Already connected"
            detail="Nothing to do here. Open a job application and the extension will offer to fill it."
          />
          <NextSteps />
        </>
      );

    case STATE.NEEDS_SIGN_IN:
      return (
        <Status
          icon={<ShieldCheck size={20} aria-hidden="true" />}
          title="Sign in first"
          detail="We connect the extension to the account you're signed in with, so it needs to know who you are."
          action={<SignInButton />}
        />
      );

    case STATE.NO_EXTENSION:
      return (
        <Status
          icon={<MonitorDown size={20} aria-hidden="true" />}
          title="We can't see the extension"
          detail="This browser doesn't have the Outmail Autofill extension installed — or it was just installed and this tab hasn't caught up yet."
          action={
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              <RefreshCw size={15} aria-hidden="true" /> Reload this page
            </button>
          }
        />
      );

    case STATE.FAILED:
      return (
        <>
          <Status
            tone="bad"
            icon={<XCircle size={20} aria-hidden="true" />}
            title="Couldn't connect"
            detail={error}
            action={
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                <RefreshCw size={15} aria-hidden="true" /> Try again
              </button>
            }
          />
          <Fallback show={showFallback} onToggle={onToggleFallback} />
        </>
      );

    default:
      return null;
  }
}

/**
 * Sign-in is Google OAuth handled by the backend, so there is no route to pass
 * a redirect to. We leave a breadcrumb in sessionStorage that /auth/success
 * reads on the way back — otherwise the user signs in, lands on the dashboard,
 * and has to find their way here again to finish connecting.
 */
function SignInButton() {
  const startSignIn = () => {
    try {
      sessionStorage.setItem("outmail.returnTo", "/extension/welcome");
    } catch {
      // Private browsing — they will land on the dashboard instead, which is
      // inconvenient but not broken.
    }
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={startSignIn}
      className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
    >
      Sign in to Outmail
    </button>
  );
}

function Status({ icon, title, detail, action, tone = "neutral" }) {
  const toneClass =
    tone === "good" ? "text-success" : tone === "bad" ? "text-danger" : "text-primary";
  return (
    // aria-live so a screen reader announces the outcome; this panel changes
    // without any interaction from the user, so nothing else would say it.
    <div aria-live="polite">
      <div className={`flex items-center gap-2 ${toneClass}`}>
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{detail}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

function NextSteps() {
  return (
    <div className="mt-6 border-t border-border-subtle pt-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        What happens now
      </p>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        <li>Open any job application and the extension offers to fill it.</li>
        <li>Your résumé attaches wherever the form asks for one.</li>
        <li>Nothing is ever submitted for you — you always press the button.</li>
      </ul>
      <Link
        href="/dashboard?tab=autofillData"
        className="mt-5 inline-flex items-center justify-center rounded-lg border border-border-subtle px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2"
      >
        Review what it will fill
      </Link>
    </div>
  );
}

/**
 * The manual route, folded away. It only matters when a browser or a policy
 * blocks our content script — rare, but when it happens this is the only way
 * through, and support can talk someone through it on the phone.
 */
function Fallback({ show, onToggle }) {
  return (
    <div className="mt-6 border-t border-border-subtle pt-5">
      <button
        type="button"
        onClick={onToggle}
        className="text-sm font-medium text-primary hover:underline"
        aria-expanded={show}
      >
        {show ? "Hide" : "Connect with a code instead"}
      </button>
      {show ? (
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            Open{" "}
            <Link href="/dashboard?tab=settings" className="text-primary hover:underline">
              Settings
            </Link>{" "}
            in your dashboard and generate a link code.
          </li>
          <li>Click the Outmail icon in your browser toolbar.</li>
          <li>
            Choose <strong className="text-foreground">Enter a code instead</strong> and paste it.
          </li>
        </ol>
      ) : null}
    </div>
  );
}

function Assurance() {
  return (
    <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
      The extension reads your Outmail profile and fills forms you open. It does not watch your
      browsing, and it never submits an application on your behalf.
    </p>
  );
}
