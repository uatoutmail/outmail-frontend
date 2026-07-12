"use client";
import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Puzzle, Copy, RefreshCw } from "lucide-react";

// Generates a one-time code the user pastes into the Outmail Autofiller browser
// extension to link it to their account (OUT-40 / OUT-48).
const AutofillExtensionCard = () => {
  const [code, setCode] = useState("");
  const [expiresIn, setExpiresIn] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!expiresIn) return;
    const t = setInterval(() => setExpiresIn((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [expiresIn]);

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/autofill/link/code");
      setCode(data.code);
      setExpiresIn(data.expiresInSeconds || 600);
      toast.success("Link code generated");
    } catch (e) {
      toast.error(e.response?.data?.error || "Failed to generate code (an active plan is required).");
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
      <p className="text-xs text-white/50 mb-4 leading-relaxed">
        Install the Outmail Autofiller browser extension, then paste a link code
        to sync your résumé profile for one-click job-application autofill.
      </p>

      {code && expiresIn > 0 ? (
        <div className="space-y-3">
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
            Expires in {mmss}. In the extension popup, paste it → <strong>Link Account</strong>.
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
          className="w-full py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 transition-colors disabled:bg-purple-800"
        >
          {loading ? "Generating…" : "Generate Link Code"}
        </button>
      )}
    </div>
  );
};

export default AutofillExtensionCard;
