"use client";
import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  ClipboardList, User, MapPin, Link as LinkIcon, ShieldCheck, Settings2,
  Briefcase, GraduationCap, Sparkles, Save, RefreshCw, Plus, Trash2, Lock, Info,
} from "lucide-react";

// The full autofill profile the browser extension fills from. Reads/writes
// /api/autofill/profile (the extension syncs the same record). Editing lives
// here (web) so the extension stays thin.
const EMPTY = {
  identity: { firstName: "", lastName: "", fullName: "" },
  contact: { email: "", phone: "" },
  address: { line1: "", city: "", state: "", country: "", postalCode: "" },
  links: { linkedin: "", github: "", portfolio: "", website: "" },
  workAuth: { authorizedToWork: "", requiresSponsorship: "" },
  preferences: { desiredSalary: "", noticePeriod: "", startDate: "", willingToRelocate: false, remotePreference: "" },
  skills: [],
  experience: [],
  education: [],
  demographics: { gender: "", race: "", ethnicity: "", veteranStatus: "", disabilityStatus: "" },
  customQA: {},
};

const Card = ({ icon: Icon, title, color = "text-purple-400", right, children }) => (
  <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20">
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <Icon className={color} size={22} />
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {right}
    </div>
    {children}
  </div>
);

const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-3 rounded-lg border border-gray-600 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 rounded-lg border border-gray-600 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-[#0f172a]">{o.label}</option>
      ))}
    </select>
  </div>
);

const YES_NO = [
  { value: "", label: "—" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];
const REMOTE = [
  { value: "", label: "—" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
  { value: "any", label: "Any" },
];

const AutofillDataTab = () => {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completeness, setCompleteness] = useState(0);
  const [showEeo, setShowEeo] = useState(false);
  const [gated, setGated] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get("/api/autofill/profile");
      setData({ ...EMPTY, ...(res.data || {}), address: { ...EMPTY.address, ...(res.data?.address || {}) } });
      setCompleteness(Math.round((res.completeness || 0) * 100));
    } catch (e) {
      if (e.response?.status === 403) setGated(true);
      else toast.error("Could not load your autofill data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // nested setters
  const setField = (section, key, value) =>
    setData((d) => ({ ...d, [section]: { ...d[section], [key]: value } }));
  const setArr = (section, i, key, value) =>
    setData((d) => ({ ...d, [section]: d[section].map((it, idx) => (idx === i ? { ...it, [key]: value } : it)) }));
  const addItem = (section, tpl) => setData((d) => ({ ...d, [section]: [...d[section], tpl] }));
  const removeItem = (section, i) => setData((d) => ({ ...d, [section]: d[section].filter((_, idx) => idx !== i) }));

  const buildFields = () => {
    const f = {};
    const put = (path, v) => { f[path] = v; };
    for (const [sec, obj] of Object.entries({
      identity: data.identity, contact: data.contact, address: data.address,
      links: data.links, workAuth: data.workAuth, preferences: data.preferences,
      demographics: data.demographics,
    })) {
      for (const [k, v] of Object.entries(obj)) put(`${sec}.${k}`, v);
    }
    f.skills = data.skills;
    f.experience = data.experience;
    f.education = data.education;
    return f;
  };

  const save = async () => {
    setSaving(true);
    try {
      const { data: res } = await api.put("/api/autofill/profile", { fields: buildFields() });
      setCompleteness(Math.round((res.completeness || 0) * 100));
      toast.success("Autofill data saved");
    } catch (e) {
      toast.error(e.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const rebuild = async () => {
    setSaving(true);
    try {
      await api.post("/api/autofill/profile/rebuild");
      await load();
      toast.success("Rebuilt from your résumé");
    } catch (e) {
      toast.error(e.response?.data?.error || "Rebuild failed");
    } finally {
      setSaving(false);
    }
  };

  if (gated) {
    return (
      <div className="p-4 sm:p-8 max-w-3xl mx-auto font-syne">
        <div className="bg-white/10 border border-white/20 rounded-2xl p-10 text-center">
          <Lock className="mx-auto text-purple-400 mb-4" size={32} />
          <h2 className="text-xl font-bold text-white mb-2">Autofill is a premium feature</h2>
          <p className="text-white/50 text-sm">Upgrade your plan to build your autofill profile and use the browser extension.</p>
        </div>
      </div>
    );
  }

  const skillsText = (data.skills || []).join(", ");

  return (
    <div className="p-4 sm:p-6 font-syne">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 mt-4 text-white flex items-center gap-3">
            <ClipboardList className="text-purple-400" size={26} /> Autofill Data
          </h1>
          <p className="text-white/60 text-sm">
            One profile the Outmail browser extension fills every job application from. Derived from your résumé — review and complete it.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={rebuild}
            disabled={saving || loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 text-white/80 text-sm font-semibold hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} /> Rebuild from résumé
          </button>
          <button
            onClick={save}
            disabled={saving || loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all disabled:opacity-50"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Completeness */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/50">Profile completeness</span>
          <span className="text-xs font-bold text-purple-300">{completeness}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500" style={{ width: `${completeness}%` }} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-6">
          <Card icon={User} title="Personal">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="First Name" value={data.identity.firstName} onChange={(v) => setField("identity", "firstName", v)} placeholder="Jane" />
              <Input label="Last Name" value={data.identity.lastName} onChange={(v) => setField("identity", "lastName", v)} placeholder="Doe" />
              <Input label="Email" value={data.contact.email} onChange={(v) => setField("contact", "email", v)} placeholder="jane@example.com" />
              <Input label="Phone" value={data.contact.phone} onChange={(v) => setField("contact", "phone", v)} placeholder="+91 XXXXX XXXXX" />
            </div>
          </Card>

          <Card icon={MapPin} title="Location" color="text-blue-400">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Address line" value={data.address.line1} onChange={(v) => setField("address", "line1", v)} placeholder="Street / area" />
              <Input label="City" value={data.address.city} onChange={(v) => setField("address", "city", v)} placeholder="Bangalore" />
              <Input label="State" value={data.address.state} onChange={(v) => setField("address", "state", v)} placeholder="Karnataka" />
              <Input label="Country" value={data.address.country} onChange={(v) => setField("address", "country", v)} placeholder="IN / US / AU …" />
              <Input label="Postal code" value={data.address.postalCode} onChange={(v) => setField("address", "postalCode", v)} placeholder="560001" />
            </div>
          </Card>

          <Card icon={LinkIcon} title="Links" color="text-emerald-400">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="LinkedIn" value={data.links.linkedin} onChange={(v) => setField("links", "linkedin", v)} placeholder="linkedin.com/in/…" />
              <Input label="GitHub" value={data.links.github} onChange={(v) => setField("links", "github", v)} placeholder="github.com/…" />
              <Input label="Portfolio" value={data.links.portfolio} onChange={(v) => setField("links", "portfolio", v)} placeholder="https://…" />
              <Input label="Website" value={data.links.website} onChange={(v) => setField("links", "website", v)} placeholder="https://…" />
            </div>
          </Card>

          <Card icon={ShieldCheck} title="Work Authorization" color="text-yellow-400">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Authorized to work" value={data.workAuth.authorizedToWork} onChange={(v) => setField("workAuth", "authorizedToWork", v)} options={YES_NO} />
              <Select label="Requires visa sponsorship" value={data.workAuth.requiresSponsorship} onChange={(v) => setField("workAuth", "requiresSponsorship", v)} options={YES_NO} />
            </div>
          </Card>

          <Card icon={Settings2} title="Job Preferences" color="text-pink-400">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Desired salary" value={data.preferences.desiredSalary} onChange={(v) => setField("preferences", "desiredSalary", v)} placeholder="e.g. 1200000" />
              <Input label="Notice period" value={data.preferences.noticePeriod} onChange={(v) => setField("preferences", "noticePeriod", v)} placeholder="e.g. 30 days" />
              <Input label="Earliest start date" value={data.preferences.startDate} onChange={(v) => setField("preferences", "startDate", v)} placeholder="YYYY-MM-DD or 'Immediate'" />
              <Select label="Remote preference" value={data.preferences.remotePreference} onChange={(v) => setField("preferences", "remotePreference", v)} options={REMOTE} />
              <div className="flex items-center gap-3 mt-2">
                <input id="relocate" type="checkbox" checked={!!data.preferences.willingToRelocate}
                  onChange={(e) => setField("preferences", "willingToRelocate", e.target.checked)}
                  className="w-4 h-4 accent-purple-500 cursor-pointer" />
                <label htmlFor="relocate" className="text-sm text-gray-300 cursor-pointer">Willing to relocate</label>
              </div>
            </div>
          </Card>

          <Card icon={Briefcase} title="Experience" color="text-purple-400"
            right={<button onClick={() => addItem("experience", { company: "", title: "", startDate: "", endDate: "", description: "" })}
              className="flex items-center gap-1.5 text-xs font-semibold text-purple-300 hover:text-purple-200"><Plus size={14} /> Add</button>}>
            {data.experience.length === 0 && <p className="text-white/30 text-sm">No experience yet.</p>}
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 relative">
                  <button onClick={() => removeItem("experience", i)} className="absolute top-3 right-3 text-red-400/60 hover:text-red-400"><Trash2 size={15} /></button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Company" value={exp.company} onChange={(v) => setArr("experience", i, "company", v)} />
                    <Input label="Title" value={exp.title} onChange={(v) => setArr("experience", i, "title", v)} />
                    <Input label="Start" value={exp.startDate} onChange={(v) => setArr("experience", i, "startDate", v)} placeholder="YYYY-MM" />
                    <Input label="End" value={exp.endDate} onChange={(v) => setArr("experience", i, "endDate", v)} placeholder="YYYY-MM or blank if current" />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea rows="2" value={exp.description ?? ""} onChange={(e) => setArr("experience", i, "description", e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-600 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card icon={GraduationCap} title="Education" color="text-blue-400"
            right={<button onClick={() => addItem("education", { degree: "", institution: "", field: "", startDate: "", endDate: "" })}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-300 hover:text-blue-200"><Plus size={14} /> Add</button>}>
            {data.education.length === 0 && <p className="text-white/30 text-sm">No education yet.</p>}
            <div className="space-y-4">
              {data.education.map((ed, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 relative">
                  <button onClick={() => removeItem("education", i)} className="absolute top-3 right-3 text-red-400/60 hover:text-red-400"><Trash2 size={15} /></button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Degree" value={ed.degree} onChange={(v) => setArr("education", i, "degree", v)} />
                    <Input label="Institution" value={ed.institution} onChange={(v) => setArr("education", i, "institution", v)} />
                    <Input label="Field of study" value={ed.field} onChange={(v) => setArr("education", i, "field", v)} />
                    <Input label="Graduation" value={ed.endDate} onChange={(v) => setArr("education", i, "endDate", v)} placeholder="YYYY" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card icon={Sparkles} title="Skills" color="text-emerald-400">
            <label className="block text-sm font-medium text-gray-300 mb-1">Comma-separated</label>
            <textarea rows="2" value={skillsText}
              onChange={(e) => setData((d) => ({ ...d, skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))}
              placeholder="Python, React, SQL, …"
              className="w-full p-3 rounded-lg border border-gray-600 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
          </Card>

          {/* Demographics — opt-in */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <button onClick={() => setShowEeo((s) => !s)} className="w-full flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <Info className="text-white/40" size={18} />
                <div>
                  <h2 className="text-base font-semibold text-white">Demographics / EEO (optional)</h2>
                  <p className="text-xs text-white/40 mt-0.5">Only filled if you provide it AND enable the opt-in toggle in the extension. Never derived from your résumé.</p>
                </div>
              </div>
              <span className="text-white/40 text-sm">{showEeo ? "Hide" : "Show"}</span>
            </button>
            {showEeo && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                <Input label="Gender" value={data.demographics.gender} onChange={(v) => setField("demographics", "gender", v)} />
                <Input label="Race" value={data.demographics.race} onChange={(v) => setField("demographics", "race", v)} />
                <Input label="Ethnicity" value={data.demographics.ethnicity} onChange={(v) => setField("demographics", "ethnicity", v)} />
                <Input label="Veteran status" value={data.demographics.veteranStatus} onChange={(v) => setField("demographics", "veteranStatus", v)} />
                <Input label="Disability status" value={data.demographics.disabilityStatus} onChange={(v) => setField("demographics", "disabilityStatus", v)} />
              </div>
            )}
          </div>

          <div className="flex justify-end pb-10">
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 px-8 py-3 rounded-lg font-semibold shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all disabled:opacity-50">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutofillDataTab;
