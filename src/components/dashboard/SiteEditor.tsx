"use client";

import { useState } from "react";
import Link from "next/link";

interface SiteConfig {
  theme: string;
  title: string | null;
  headline: string | null;
  ctaText: string | null;
  ctaUrl: string | null;
  showProjects: boolean;
  showSkills: boolean;
  showBadges: boolean;
  showContact: boolean;
  accentColor: string;
}

const THEMES = [
  { id: "minimal", label: "Minimal", description: "Clean, professional. Dark background, your work front and center." },
  { id: "terminal", label: "Terminal", description: "Green-on-black terminal aesthetic for the command-line crowd." },
  { id: "portfolio", label: "Portfolio", description: "Full portfolio layout with large hero and project showcase." },
  { id: "card", label: "Card", description: "Business card style — compact, shareable." },
];

export function SiteEditor({ site, username }: { site: SiteConfig | null; username: string }) {
  const [form, setForm] = useState<SiteConfig>({
    theme: site?.theme ?? "minimal",
    title: site?.title ?? "",
    headline: site?.headline ?? "",
    ctaText: site?.ctaText ?? "",
    ctaUrl: site?.ctaUrl ?? "",
    showProjects: site?.showProjects ?? true,
    showSkills: site?.showSkills ?? true,
    showBadges: site?.showBadges ?? true,
    showContact: site?.showContact ?? true,
    accentColor: site?.accentColor ?? "#4361ee",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof SiteConfig>(key: K, val: SiteConfig[K]) {
    setForm((p) => ({ ...p, [key]: val }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/passport/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) setSaved(true);
    setSaving(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#e8eaf4" }}>My Site</h1>
          <p className="text-sm mt-0.5" style={{ color: "#4a506a" }}>
            Your personal site at{" "}
            <span className="mono" style={{ color: "#4361ee" }}>p.krl.kr/{username}/site</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/${username}/site`} target="_blank" className="text-xs px-3 py-2 rounded-lg" style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#8b92a8" }}>
            Preview
          </Link>
          <button onClick={save} disabled={saving} className="text-sm px-4 py-2 rounded-lg font-medium disabled:opacity-40" style={{ background: "#4361ee", color: "#fff" }}>
            {saving ? "Saving..." : saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {/* Theme picker */}
      <div className="card p-5 flex flex-col gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8b92a8" }}>THEME</h2>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => set("theme", t.id)}
              className="rounded-xl p-4 text-left transition-all"
              style={{
                background: form.theme === t.id ? "#4361ee18" : "#0d0f18",
                border: `1px solid ${form.theme === t.id ? "#4361ee55" : "#1c2035"}`,
              }}
            >
              <div className="font-semibold text-sm mb-1" style={{ color: form.theme === t.id ? "#4361ee" : "#e8eaf4" }}>
                {t.label}
              </div>
              <div className="text-xs" style={{ color: "#4a506a" }}>{t.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="card p-5 flex flex-col gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8b92a8" }}>CONTENT</h2>
        <div className="flex flex-col gap-3">
          <Field label="Page title" value={form.title ?? ""} onChange={(v) => set("title", v)} placeholder={`${username}'s Dev Site`} />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: "#8b92a8" }}>Headline</label>
            <textarea value={form.headline ?? ""} onChange={(e) => set("headline", e.target.value)} rows={2} maxLength={200} placeholder="Short tagline shown on the hero..." className="px-3 py-2 rounded-lg text-sm outline-none resize-none" style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4" }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="CTA button text" value={form.ctaText ?? ""} onChange={(v) => set("ctaText", v)} placeholder="Hire me" />
            <Field label="CTA button URL" value={form.ctaUrl ?? ""} onChange={(v) => set("ctaUrl", v)} placeholder="mailto:you@email.com" />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="card p-5 flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8b92a8" }}>VISIBLE SECTIONS</h2>
        {[
          { key: "showProjects" as const, label: "Projects" },
          { key: "showSkills" as const, label: "Skills" },
          { key: "showBadges" as const, label: "Badges" },
          { key: "showContact" as const, label: "Contact info" },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center justify-between cursor-pointer">
            <span className="text-sm" style={{ color: "#e8eaf4" }}>{label}</span>
            <div
              onClick={() => set(key, !form[key])}
              className="rounded-full transition-all cursor-pointer relative"
              style={{ width: 40, height: 22, background: form[key] ? "#4361ee" : "#1c2035" }}
            >
              <div className="absolute top-1 rounded-full transition-all" style={{ width: 14, height: 14, background: "#fff", left: form[key] ? 23 : 3 }} />
            </div>
          </label>
        ))}
      </div>

      {/* Accent color */}
      <div className="card p-5 flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8b92a8" }}>ACCENT COLOR</h2>
        <div className="flex items-center gap-3">
          <input type="color" value={form.accentColor} onChange={(e) => set("accentColor", e.target.value)} className="rounded-lg cursor-pointer" style={{ width: 40, height: 36, background: "transparent", border: "none" }} />
          <span className="text-sm mono" style={{ color: "#e8eaf4" }}>{form.accentColor}</span>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs" style={{ color: "#8b92a8" }}>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4" }} />
    </div>
  );
}
