import React, { useState, useEffect } from "react";
import { SlidersHorizontal, ChevronDown, ChevronUp, Check, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

const COUNTRIES = [
  { code: "US", label: "United States" },
  { code: "IN", label: "India" },
  { code: "GB", label: "United Kingdom" },
  { code: "AU", label: "Australia" },
  { code: "NZ", label: "New Zealand" },
  { code: "CA", label: "Canada" },
];
const REMOTE_OPTS = ["any", "remote", "hybrid", "onsite"];

// OUT-36: job-hunt intent + preferences. Reads/writes the candidate profile
// (GET/PUT /api/profile, OUT-23); saving re-runs matching, so we notify the
// parent feed to refresh.
const JobPreferences = ({ onSaved }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [intentText, setIntentText] = useState("");
  const [country, setCountry] = useState("");
  const [remotePref, setRemotePref] = useState("any");
  const [minSalary, setMinSalary] = useState("");
  const [targetRoles, setTargetRoles] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/profile");
        setIntentText(data.intentText || "");
        setCountry((data.countries || [])[0] || "");
        setRemotePref(data.remotePref || "any");
        setMinSalary(data.minSalary ?? "");
        setTargetRoles((data.targetRoles || []).join(", "));
      } catch (e) {
        console.error("Failed to load profile:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/api/profile", {
        intentText,
        countries: country ? [country] : [],
        remotePref,
        minSalary: minSalary === "" ? null : Number(minSalary),
        targetRoles: targetRoles.split(",").map((r) => r.trim()).filter(Boolean),
      });
      setSavedAt(Date.now());
      if (onSaved) onSaved();
    } catch (e) {
      console.error("Failed to save preferences:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 mb-6 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <SlidersHorizontal size={18} className="text-purple-400" />
          <span className="text-sm font-bold text-white">What are you looking for?</span>
          <span className="text-white/30 text-xs hidden sm:inline">— tune your matches</span>
        </div>
        {open ? <ChevronUp size={18} className="text-white/40" /> : <ChevronDown size={18} className="text-white/40" />}
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
          {loading ? (
            <div className="flex items-center gap-2 text-white/40 text-sm py-4">
              <Loader2 size={16} className="animate-spin" /> Loading your preferences…
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                  Job-hunt intent
                </label>
                <textarea
                  value={intentText}
                  onChange={(e) => setIntentText(e.target.value)}
                  rows={3}
                  placeholder="e.g. Backend / ML engineer roles at early-stage startups; open to remote. Pivoting from frontend."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-purple-500/50"
                />
                <p className="text-white/25 text-[11px] mt-1.5">Tells matching what you want next — weighted alongside your resume.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Primary country of job search</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option value="" className="bg-[#1a1a1a]">Select your country…</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#1a1a1a]">{c.label} ({c.code})</option>
                  ))}
                </select>
                <p className="text-white/25 text-[11px] mt-1.5">You'll only see openings in this country.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Work style</label>
                  <select
                    value={remotePref}
                    onChange={(e) => setRemotePref(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 capitalize"
                  >
                    {REMOTE_OPTS.map((o) => (
                      <option key={o} value={o} className="bg-[#1a1a1a] capitalize">{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Min salary (annual)</label>
                  <input
                    type="number"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    placeholder="e.g. 1500000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Target roles (comma-separated)</label>
                <input
                  value={targetRoles}
                  onChange={(e) => setTargetRoles(e.target.value)}
                  placeholder="e.g. Backend Engineer, ML Engineer"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all active:scale-95"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  {saving ? "Saving…" : "Save & refresh matches"}
                </button>
                {savedAt && !saving && <span className="text-green-400 text-xs font-semibold">Saved ✓</span>}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default JobPreferences;
