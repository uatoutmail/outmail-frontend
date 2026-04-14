"use client";
import { useState, useEffect } from "react";
import TPOPageShell from "@/component/tpo/TPOPageShell";
import { Building2, Bell, Users, CreditCard, Shield, ChevronDown, Plus, Trash2, Check, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? "bg-purple-600" : "bg-gray-200"}`}
  >
    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
  </button>
);

const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
      <div className="p-2 bg-purple-50 rounded-lg">
        <Icon size={15} className="text-purple-600" />
      </div>
      <h2 className="text-sm font-bold text-gray-900">{title}</h2>
    </div>
    <div className="px-6 py-5 space-y-5">{children}</div>
  </div>
);

const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
    {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
    {children}
  </div>
);

const Input = ({ value, onChange, placeholder }) => (
  <input value={value} onChange={onChange} placeholder={placeholder} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white placeholder-gray-300" />
);

const SaveBtn = () => (
  <div className="flex justify-end pt-2">
    <button className="flex items-center gap-1.5 bg-purple-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-purple-700 transition">
      <Check size={12} /> Save Changes
    </button>
  </div>
);

export default function SettingsPage() {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [instName, setInstName] = useState("");
  const [batchYear, setBatchYear] = useState("2025");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");

  const [notifs, setNotifs] = useState({
    weeklyReport:   true,
    studentActivity:true,
    jobAlerts:      true,
    mentorUpdates:  false,
    platformUpdates:true,
  });
  const [members, setMembers] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [danger, setDanger] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/api/admin/settings");
        if (res.data.user) {
          const user = res.data.user;
          setAdminUser(user);
          setInstName(user.institution?.name || user.institute_name || "Institution Name");
          setLocation(user.institution?.location || user.location || "City, State");
          setEmail(user.email || "");
          
          setMembers([{
            name: user.display_name || "Admin",
            email: user.email,
            role: "Admin",
            avatar: (user.display_name || "A")[0].toUpperCase()
          }]);
        }
      } catch (err) {
        console.error("Failed to fetch admin settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <TPOPageShell title="Settings" subtitle="Manage your institution profile, team, and notification preferences">
        <div className="flex justify-center items-center h-64 text-gray-500">Loading settings...</div>
      </TPOPageShell>
    );
  }

  return (
    <TPOPageShell title="Settings" subtitle="Manage your institution profile, team, and notification preferences">
      <div className="space-y-6">

        {/* College Profile */}
        <Section icon={Building2} title="Institution Profile">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Institution Name">
              <Input value={instName} onChange={e => setInstName(e.target.value)} />
            </Field>
            <Field label="Batch Year">
              <Input value={batchYear} onChange={e => setBatchYear(e.target.value)} />
            </Field>
            <Field label="City / Location">
              <Input value={location} onChange={e => setLocation(e.target.value)} />
            </Field>
            <Field label="Primary Contact Email">
              <Input value={email} onChange={e => setEmail(e.target.value)} />
            </Field>
          </div>
          <Field label="Institution Logo" hint="Upload a PNG or SVG — max 500 KB. Shown in reports and student emails.">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-purple-100 border-2 border-dashed border-purple-300 flex items-center justify-center text-purple-600 font-bold text-lg overflow-hidden">
                {adminUser?.profile_picture ? (
                  <img src={adminUser.profile_picture} alt="logo" className="w-full h-full object-cover" />
                ) : (
                  (instName || "I")[0].toUpperCase()
                )}
              </div>
              <button className="text-xs font-semibold text-purple-600 border border-purple-200 px-4 py-2 rounded-lg hover:bg-purple-50 transition">
                Upload Logo
              </button>
            </div>
          </Field>
          <SaveBtn />
        </Section>

        {/* Notifications */}
        <Section icon={Bell} title="Notification Preferences">
          {[
            { key:"weeklyReport",    label:"Weekly Placement Report",   desc:"Summary email every Monday with placement metrics" },
            { key:"studentActivity", label:"Student Activity Alerts",   desc:"Notify when students are inactive for 7+ days" },
            { key:"jobAlerts",       label:"New Job Intelligence Alerts",desc:"Get notified when new high-priority jobs are added" },
            { key:"mentorUpdates",   label:"Mentor Session Updates",    desc:"Reminders and summaries for upcoming mentor sessions" },
            { key:"platformUpdates", label:"Platform Feature Updates",  desc:"Learn about new Outmail features and improvements" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
              <Toggle checked={notifs[key]} onChange={(v) => setNotifs(p => ({ ...p, [key]: v }))} />
            </div>
          ))}
          <SaveBtn />
        </Section>

        {/* Team Members */}
        <Section icon={Users} title="Team Members">
          <p className="text-xs text-gray-500">Admins and Co-TPOs can access all dashboard sections. Only Admins can change settings.</p>
          <div className="space-y-2 mt-1">
            {members.map((m) => (
              <div key={m.email} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-purple-200 text-purple-800 text-xs font-bold flex items-center justify-center flex-shrink-0">{m.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${m.role==="Admin"?"bg-purple-100 text-purple-700":"bg-gray-100 text-gray-600"}`}>{m.role}</span>
                  {m.role !== "Admin" && (
                    <button onClick={() => setMembers(ms => ms.filter(x => x.email !== m.email))} className="text-gray-400 hover:text-red-500 transition">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Input placeholder="colleague@college.ac.in" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
            <button
              onClick={() => { if (newEmail) { setMembers(ms => [...ms, { name: newEmail.split("@")[0], email: newEmail, role: "Co-TPO", avatar: newEmail[0].toUpperCase() }]); setNewEmail(""); }}}
              className="flex-shrink-0 flex items-center gap-1.5 bg-purple-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              <Plus size={12}/> Invite
            </button>
          </div>
        </Section>

        {/* Plan */}
        <Section icon={CreditCard} title="Subscription Plan">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-gray-900">Outmail Pro</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Active</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Up to 500 students · Unlimited jobs · All analytics · Priority support</p>
              <p className="text-xs text-gray-400 mt-2">Renews on <span className="text-gray-700 font-medium">1 Aug 2026</span></p>
            </div>
            <button className="text-xs font-semibold text-purple-600 border border-purple-200 px-4 py-2 rounded-lg hover:bg-purple-50 transition">
              Manage Plan
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {[["Students", "312 / 500"], ["Jobs Tracked", "Unlimited"], ["Support", "Priority (24h)"]].map(([k,v])=>(
              <div key={k} className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">{k}</p>
                <p className="text-sm font-bold text-gray-800">{v}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Security */}
        <Section icon={Shield} title="Security">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Two-Factor Authentication</p>
                <p className="text-xs text-gray-400 mt-0.5">Add an extra layer of security for admin logins</p>
              </div>
              <button className="text-xs font-semibold text-purple-600 border border-purple-200 px-4 py-2 rounded-lg hover:bg-purple-50 transition">Enable 2FA</button>
            </div>
            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Single Sign-On (SSO)</p>
                <p className="text-xs text-gray-400 mt-0.5">Connect your institution's Google Workspace or Azure AD</p>
              </div>
              <button className="text-xs font-semibold text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition">Configure</button>
            </div>
          </div>
        </Section>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-6 py-4 text-sm font-bold text-red-600"
            onClick={() => setDanger(d => !d)}
          >
            <span className="flex items-center gap-2"><AlertTriangle size={15}/> Danger Zone</span>
            <ChevronDown size={14} className={`transition-transform ${danger ? "rotate-180" : ""}`}/>
          </button>
          {danger && (
            <div className="px-6 pb-5 space-y-3 border-t border-red-100">
              <p className="text-xs text-gray-500 mt-4">These actions are irreversible. Please read carefully before proceeding.</p>
              <div className="flex items-center justify-between bg-red-50 rounded-xl px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Deactivate Account</p>
                  <p className="text-xs text-gray-500 mt-0.5">Pause all activity; data is retained for 90 days</p>
                </div>
                <button className="text-xs font-semibold text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 transition">Deactivate</button>
              </div>
              <div className="flex items-center justify-between bg-red-50 rounded-xl px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Delete All Data</p>
                  <p className="text-xs text-gray-500 mt-0.5">Permanently erase all student and placement data</p>
                </div>
                <button className="text-xs font-semibold text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 transition">Delete Data</button>
              </div>
            </div>
          )}
        </div>

      </div>
    </TPOPageShell>
  );
}
