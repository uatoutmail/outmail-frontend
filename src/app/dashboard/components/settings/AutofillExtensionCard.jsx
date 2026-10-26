"use client";
import { CheckCircle2, Copy, Puzzle, RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  describeFailure,
  isExtensionInstalled,
  pairExtension,
  pingExtension,
} from "@/lib/extensionBridge";

// Connects the Outmail Autofill browser extension to this account (OUT-40 /
// OUT-48 / OUT-50).
//
// The card used to do one thing: print a code for the user to copy into the
// extension popup. That was six steps and a manual transfer. Now, when the
// extension is installed in this browser, Connect hands the code across
// directly and the user types nothing. The code path survives underneath for
// the case where the extension is on a DIFFERENT browser from the one the
// dashboard is open in — which no amount of bridging can solve.
const AutofillExtensionCard = () => {
  const [code, setCode] = useState("");
  const [expiresIn, setExpiresIn] = useState(0);
  const [loading, setLoading] = useState(false);
  const [detected, setDetected] = useState(false);
  const [linked, setLinked] = useState(false);

  useEffect(() => {
    if (!expiresIn) return;
    const t = setInterval(() => setExpiresIn((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [expiresIn]);

  // Is the extension in THIS browser, and is it already connected? Decides
  // whether the one-click path is even offered.
  useEffect(() => {
    let cancelled = false;
    if (!isExtensionInstalled()) return undefined;
    pingExtension().then((r) => {
      if (cancelled) return;
      setDetected(r.installed);
      setLinked(r.linked);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /** One click: mint a code, hand it to the extension, never show it. */
  const connect = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/autofill/link/code");
      const result = await pairExtension(data.code);
      if (result.ok) {
        setLinked(true);
        setCode("");
        setExpiresIn(0);
        toast.success("Extension connected");
      } else {
        toast.error(describeFailure(result.reason));
      }
    } catch (e) {
      toast.error(e.response?.data?.error || "Failed to connect (an active plan is required).");
    } finally {
      setLoading(false);
    }
  };

  /** The fallback: show a code to type into an extension in another browser. */
  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/autofill/link/code");
      setCode(data.code);
      setExpiresIn(data.expiresInSeconds || 600);
      toast.success("Link code generated");
    } catch (e) {
      toast.error(
        e.response?.data?.error || "Failed to generate code (an active plan is required)."
      );
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard?.writeText(code);
    toast.success("Copied");
  };

  const mmss = `${Math.floor(expiresIn / 60)}:${String(expiresIn % 60).padStart(2, "0")}`;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-4">
        <Puzzle className="text-purple-400" size={20} />
        <h2 className="text-lg font-semibold text-white">Autofill Extension</h2>
      </div>

      {linked ? (
        <div className="flex items-start gap-2 text-sm text-white/70">
          <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-400" size={16} />
          <p>
            Connected in this browser. Open a job application and the extension will offer to fill
            it.
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs text-white/50 mb-4 leading-relaxed">
            {detected
              ? "The extension is installed in this browser. One click connects it to your account — there is nothing to copy."
              : "Install the Outmail Autofill extension, then connect it here to fill job applications from your profile."}
          </p>

          {detected ? (
            <button
              onClick={connect}
              disabled={loading}
              className="w-full py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 transition-colors disabled:bg-purple-800"
            >
              {loading ? "Connecting…" : "Connect extension"}
            </button>
          ) : null}

          {code && expiresIn > 0 ? (
            <div className="space-y-3 mt-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="font-mono text-lg tracking-widest text-white">{code}</span>
                <button
                  onClick={copy}
                  className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                  title="Copy code"
                >
                  <Copy size={16} />
                </button>
              </div>
              <p className="text-[11px] text-white/40">
                Expires in {mmss}. In the extension popup, choose{" "}
                <strong>Enter a code instead</strong> and paste it.
              </p>
              <button
                onClick={generate}
                disabled={loading}
                className="text-xs text-purple-300 hover:underline flex items-center gap-1"
              >
                <RefreshCw size={12} /> Generate a new code
              </button>
            </div>
          ) : (
            <button
              onClick={generate}
              disabled={loading}
              className={
                detected
                  ? "mt-3 text-xs text-purple-300 hover:underline"
                  : "w-full py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 transition-colors disabled:bg-purple-800"
              }
            >
              {detected
                ? "The extension is in another browser — show me a code"
                : loading
                  ? "Generating…"
                  : "Generate Link Code"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default AutofillExtensionCard;
