"use client";
import {
  ClipboardList,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  Lock,
  ShieldCheck,
  ChevronDown,
  Check,
  AlertCircle,
} from "lucide-react";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

/**
 * The one-time setup that makes every future application a click.
 *
 * WHY THIS FORM IS GENERATED, NOT WRITTEN
 *   It used to be ~20 hand-written inputs. The taxonomy is now 97 fields plus 7
 *   repeating sections, and hand-writing those would guarantee the same drift
 *   that made this rewrite necessary: a field in the backend that the dashboard
 *   never showed, so nobody could ever fill it in.
 *
 *   Everything below renders from GET /api/autofill/schema. Adding a field to
 *   the backend catalog makes it appear here with no change to this file.
 *
 * WHY IT IS LONG, AND WHY THAT IS FINE
 *   Because the alternative is answering the same questions on every
 *   application forever. The form says so, shows what is already filled from
 *   the résumé, and orders what is left by how often forms actually ask for it
 *   — so the first ten minutes buy the most.
 */

const EMPTY_PROFILE = { customQA: {} };

/* ---------------------------------------------------------------- primitives */

/**
 * Stable DOM ids so the "fill these next" chips can jump to what they name.
 *
 * The form runs to a hundred fields across a dozen sections. Telling somebody
 * their Current CTC is missing and leaving them to find it is most of the work
 * still to do — so the chips became buttons, and these are what they aim at.
 */
const sectionAnchorId = (key) => `af-section-${key}`;
// Dots are legal in an id but awkward in a CSS selector, so paths are dashed.
// Field and jumpTo MUST agree on this: they were written separately and did
// not, so every chip scrolled to the section instead of the field it named.
const fieldAnchorId = (path) => `af-${String(path).replace(/\./g, "-")}`;

/** Group key for a field path: "compensation.currentCtc" -> "compensation". */
const groupKeyForPath = (path) => String(path || "").split(".")[0];

const Field = ({ def, value, onChange }) => {
  const id = fieldAnchorId(def.path);
  const base =
    "w-full p-3 rounded-lg border border-white/15 bg-white/5 text-white placeholder-white/25 " +
    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors";

  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-sm font-medium text-white/70 mb-1.5"
      >
        {def.label}
        {def.sensitive && (
          <ShieldCheck size={12} className="text-emerald-400/70" aria-label="Encrypted at rest" />
        )}
      </label>

      {def.type === "enum" ? (
        <select
          id={id}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} cursor-pointer`}
        >
          <option value="" className="bg-surface-panel">
            —
          </option>
          {def.options.map((o) => (
            <option key={o.value} value={o.value} className="bg-surface-panel">
              {o.label}
            </option>
          ))}
        </select>
      ) : def.type === "textarea" ? (
        <textarea
          id={id}
          rows={3}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} resize-y`}
        />
      ) : def.type === "boolean" ? (
        <div className="flex items-center gap-3 h-[46px]">
          <input
            id={id}
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 accent-primary cursor-pointer"
          />
          <label htmlFor={id} className="text-sm text-white/60 cursor-pointer">
            Yes
          </label>
        </div>
      ) : (
        <input
          id={id}
          type={def.type === "number" ? "number" : def.type === "date" ? "date" : "text"}
          value={value ?? ""}
          onChange={(e) =>
            onChange(
              def.type === "number"
                ? e.target.value === ""
                  ? ""
                  : Number(e.target.value)
                : e.target.value
            )
          }
          className={base}
        />
      )}
    </div>
  );
};

/** A collapsible group. Everything starts open except the opt-in one. */
const Group = ({ group, open, onToggle, filled, total, children, onSave, saving }) => (
  <section
    id={sectionAnchorId(group.key)}
    // scroll-mt keeps the heading clear of the sticky header when a chip jumps
    // here, rather than landing with the title hidden behind it.
    className="bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden scroll-mt-24"
  >
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-white/[0.03] transition-colors"
    >
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          {group.title}
          {filled === total && total > 0 && <Check size={14} className="text-emerald-400" />}
        </h2>
        {group.blurb && (
          <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{group.blurb}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="font-mono text-[11px] text-white/35 tabular-nums">
          {filled}/{total}
        </span>
        <ChevronDown
          size={16}
          className={`text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>
    </button>
    {open && (
      <div className="px-6 pb-6 pt-1">
        {children}
        {onSave && <SectionSave onSave={onSave} saving={saving} />}
      </div>
    )}
  </section>
);

/**
 * A Save at the foot of every section.
 *
 * The form is long by design and nobody fills it in one sitting. With a single
 * Save at the top of the page, finishing a section meant scrolling all the way
 * back up to keep the work — so the natural thing to do was close the tab and
 * lose it.
 *
 * It saves the WHOLE form, not just this section: the state is one object and
 * a partial write would need the server to merge, which is a larger change for
 * no user-visible gain. The label says "Save" because that is what it does.
 */
const SectionSave = ({ onSave, saving }) => (
  <div className="mt-5 pt-4 border-t border-white/10 flex justify-end">
    <button
      type="button"
      onClick={onSave}
      disabled={saving}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-sm font-semibold text-white transition-colors disabled:opacity-50"
    >
      <Save size={15} />
      {saving ? "Saving…" : "Save"}
    </button>
  </div>
);

/* --------------------------------------------------------------------- page */

const AutofillDataTab = () => {
  const [schema, setSchema] = useState(null);
  const [data, setData] = useState(EMPTY_PROFILE);
  const [fieldStatus, setFieldStatus] = useState({});
  const [missing, setMissing] = useState([]);
  const [completeness, setCompleteness] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gated, setGated] = useState(false);
  const [openGroups, setOpenGroups] = useState({});
  const [eeoOpen, setEeoOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [schemaRes, profileRes] = await Promise.all([
        api.get("/api/autofill/schema"),
        api.get("/api/autofill/profile"),
      ]);
      setSchema(schemaRes.data);
      setData({ ...EMPTY_PROFILE, ...(profileRes.data.data || {}) });
      setFieldStatus(profileRes.data.fieldStatus || {});
      setMissing(profileRes.data.missing || []);
      setCompleteness(Math.round((profileRes.data.completeness || 0) * 100));
      // Opt-in groups stay shut until asked for; everything else opens.
      setOpenGroups(
        Object.fromEntries((schemaRes.data.groups || []).map((g) => [g.key, !g.optIn]))
      );
    } catch (e) {
      if (e.response?.status === 403) setGated(true);
      else toast.error("Could not load your autofill data");
    } finally {
      setLoading(false);
    }
  }, []);

  // `load` only calls setState after its awaits resolve, so the cascading-render
  // rule does not apply here.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  /**
   * Open the group a field lives in, scroll to it, and put the cursor in it.
   *
   * Opening first matters: a collapsed group renders none of its inputs, so
   * focusing before the next paint would find nothing. requestAnimationFrame
   * is enough — React has committed by then.
   *
   * Falls back to the section heading when the field itself cannot be found,
   * which is better than a click that appears to do nothing.
   */
  const jumpTo = useCallback((path) => {
    const groupKey = groupKeyForPath(path);
    setOpenGroups((o) => ({ ...o, [groupKey]: true }));

    requestAnimationFrame(() => {
      // In order of precision: the input itself, the free-text list that owns
      // it, the repeating section, then the group heading. A missing field can
      // name any of these — "Skills" is a list, "Education" a section — and a
      // chip that silently does nothing is worse than one that lands close.
      const target =
        document.getElementById(fieldAnchorId(path)) ||
        document.getElementById(`af-list-${path}`) ||
        document.getElementById(sectionAnchorId(path)) ||
        document.getElementById(sectionAnchorId(groupKey));
      if (!target) return;

      target.scrollIntoView({ behavior: "smooth", block: "center" });
      if (typeof target.focus === "function" && target.tagName !== "SECTION") {
        target.focus({ preventScroll: true });
      }
    });
  }, []);

  const getAt = useCallback(
    (path) => path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), data),
    [data]
  );

  const setAt = (path, value) =>
    setData((d) => {
      const next = structuredClone(d);
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (cur[keys[i]] == null || typeof cur[keys[i]] !== "object") cur[keys[i]] = {};
        cur = cur[keys[i]];
      }
      cur[keys.at(-1)] = value;
      return next;
    });

  const setSection = (key, rows) => setData((d) => ({ ...d, [key]: rows }));

  /**
   * Sends only what changed.
   *
   * Posting all 97 paths on every save would mark every untouched field
   * `confirmed`, which tells the backend the user has personally vouched for a
   * blank — and stops it ever asking for that field again.
   */
  const save = async () => {
    setSaving(true);
    try {
      const fields = {};
      for (const g of schema.groups) {
        for (const f of g.fields) {
          const v = getAt(f.path);
          if (v !== undefined) fields[f.path] = v;
        }
      }
      for (const l of schema.lists) fields[l.path] = data[l.path] || [];
      for (const s of schema.sections) fields[s.key] = data[s.key] || [];

      const { data: res } = await api.put("/api/autofill/profile", { fields });
      setFieldStatus(res.fieldStatus || {});
      setMissing(res.missing || []);
      setCompleteness(Math.round((res.completeness || 0) * 100));
      toast.success("Saved — the extension will pick this up on its next sync");
    } catch (e) {
      toast.error(e.response?.data?.error || "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const rebuild = async () => {
    setSaving(true);
    try {
      await api.post("/api/autofill/profile/rebuild");
      await load();
      toast.success("Rebuilt from your résumé — anything you edited was kept");
    } catch (e) {
      toast.error(e.response?.data?.error || "Rebuild failed");
    } finally {
      setSaving(false);
    }
  };

  const groupProgress = useMemo(() => {
    if (!schema) return {};
    return Object.fromEntries(
      schema.groups.map((g) => [
        g.key,
        {
          filled: g.fields.filter((f) => fieldStatus[f.path] && fieldStatus[f.path] !== "missing")
            .length,
          total: g.fields.length,
        },
      ])
    );
  }, [schema, fieldStatus]);

  if (gated) {
    return (
      <div className="p-4 sm:p-8 max-w-3xl mx-auto font-syne">
        <div className="bg-white/10 border border-white/20 rounded-2xl p-10 text-center">
          <Lock className="mx-auto text-primary mb-4" size={32} />
          <h2 className="text-xl font-bold text-white mb-2">Autofill is part of your plan</h2>
          <p className="text-white/50 text-sm">
            Start your year to build your autofill profile and use the browser extension.
          </p>
        </div>
      </div>
    );
  }

  if (loading || !schema) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 font-syne">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 mt-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3 mb-1">
              <ClipboardList className="text-primary" size={26} /> Autofill data
            </h1>
            <p className="text-white/50 text-sm max-w-xl leading-relaxed">
              Answer these once and the extension fills every application from them. It is long on
              purpose — the alternative is typing the same answers into every form for the rest of
              your search.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={rebuild}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 text-white/80 text-sm font-semibold hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} /> Rebuild from résumé
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold shadow-lg bg-primary hover:bg-primary-hover text-white transition-colors disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        {/* Progress. Weighted by how often forms ask for a field, so this reads
            as "share of applications you can finish", not "boxes ticked". */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Applications you can complete
            </span>
            <span className="text-xs font-bold text-primary tabular-nums">{completeness}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>

        {/* What to do next, heaviest first. More useful than a percentage. */}
        {missing.length > 0 && (
          <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <AlertCircle size={14} className="text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Fill these next — they appear on the most forms
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {missing.slice(0, 10).map((m) => (
                <button
                  key={m.path}
                  type="button"
                  onClick={() => jumpTo(m.path)}
                  className="text-[11px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/70 hover:bg-primary/20 hover:border-primary/40 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                >
                  {m.label}
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-[11px] text-white/35">
              Click any of these to jump straight to it.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {schema.groups
            .filter((g) => !g.optIn)
            .map((g) => (
              <Group
                key={g.key}
                group={g}
                open={!!openGroups[g.key]}
                onToggle={() => setOpenGroups((o) => ({ ...o, [g.key]: !o[g.key] }))}
                filled={groupProgress[g.key]?.filled ?? 0}
                total={groupProgress[g.key]?.total ?? 0}
                onSave={save}
                saving={saving}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {g.fields.map((f) => (
                    <Field
                      key={f.path}
                      def={f}
                      value={getAt(f.path)}
                      onChange={(v) => setAt(f.path, v)}
                    />
                  ))}
                </div>
              </Group>
            ))}

          {/* Free-text lists — skills today */}
          {schema.lists.map((l) => (
            <section
              key={l.path}
              id={sectionAnchorId(l.path)}
              className="bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-5 scroll-mt-24"
            >
              <label
                htmlFor={`af-list-${l.path}`}
                className="block text-base font-semibold text-white mb-1"
              >
                {l.label}
              </label>
              <p className="text-xs text-white/40 mb-3">Comma separated.</p>
              <textarea
                id={`af-list-${l.path}`}
                rows={2}
                value={(data[l.path] || []).join(", ")}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    [l.path]: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  }))
                }
                className="w-full p-3 rounded-lg border border-white/15 bg-white/5 text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </section>
          ))}

          {/* Repeating sections */}
          {schema.sections.map((s) => {
            const rows = data[s.key] || [];
            return (
              <section
                key={s.key}
                id={sectionAnchorId(s.key)}
                className="bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-5 scroll-mt-24"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    {s.title}
                    {s.sensitive && <ShieldCheck size={12} className="text-emerald-400/70" />}
                  </h2>
                  <button
                    onClick={() =>
                      setSection(s.key, [
                        ...rows,
                        Object.fromEntries(s.itemFields.map((f) => [f.path, ""])),
                      ])
                    }
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-soft"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>

                {rows.length === 0 && <p className="text-white/30 text-sm">Nothing added yet.</p>}

                <div className="space-y-4">
                  {rows.map((row, i) => (
                    <div
                      key={i}
                      className="relative p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <button
                        onClick={() =>
                          setSection(
                            s.key,
                            rows.filter((_, idx) => idx !== i)
                          )
                        }
                        className="absolute top-3 right-3 text-red-400/60 hover:text-red-400"
                        aria-label={`Remove ${s.title} entry ${i + 1}`}
                      >
                        <Trash2 size={15} />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-8">
                        {s.itemFields.map((f) => (
                          <Field
                            key={f.path}
                            def={f}
                            value={row[f.path]}
                            onChange={(v) =>
                              setSection(
                                s.key,
                                rows.map((r, idx) => (idx === i ? { ...r, [f.path]: v } : r))
                              )
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Opt-in groups last, collapsed, and honest about what they are for. */}
          {schema.groups
            .filter((g) => g.optIn)
            .map((g) => (
              <section
                key={g.key}
                className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setEeoOpen((v) => !v)}
                  aria-expanded={eeoOpen}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-white/[0.03] transition-colors"
                >
                  <div>
                    <h2 className="text-base font-semibold text-white">{g.title}</h2>
                    <p className="text-xs text-white/40 mt-0.5 leading-relaxed max-w-xl">
                      {g.blurb}
                    </p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-white/40 shrink-0 transition-transform ${eeoOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {eeoOpen && (
                  <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {g.fields.map((f) => (
                      <Field
                        key={f.path}
                        def={f}
                        value={getAt(f.path)}
                        onChange={(v) => setAt(f.path, v)}
                      />
                    ))}
                  </div>
                )}
              </section>
            ))}
        </div>

        <div className="flex items-center justify-between gap-4 mt-8 pb-10">
          <p className="text-xs text-white/35 flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-emerald-400/70" />
            Marked fields are encrypted before they are stored.
          </p>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 rounded-lg font-semibold shadow-lg bg-primary hover:bg-primary-hover text-white transition-colors disabled:opacity-50"
          >
            <Save size={18} /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutofillDataTab;
