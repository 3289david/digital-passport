"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  fullName: string | null;
  stars: number;
  language: string | null;
  languageColor: string | null;
  featured: boolean;
  description: string | null;
  healthScore: number;
  contributors: number;
  startedAt: string | null;
  license: string | null;
  downloads: number | null;
  url: string | null;
  platform?: string;
}

const EMPTY_FORM = { name: "", description: "", url: "", language: "", stars: "" };

export function ProjectsEditor({ projects: initial }: { projects: Project[] }) {
  const [items, setItems] = useState(initial);
  const [saving, setSaving] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState("");

  function setField(k: keyof typeof EMPTY_FORM, v: string) { setForm((p) => ({ ...p, [k]: v })); setFormError(""); }

  async function toggleFeatured(id: string, featured: boolean) {
    setSaving(id);
    const res = await fetch("/api/dashboard/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, featured }),
    });
    const data = await res.json();
    if (data.success) setItems((p) => p.map((pr) => pr.id === id ? { ...pr, featured } : pr));
    setSaving(null);
  }

  async function addProject() {
    if (!form.name.trim()) { setFormError("Name is required"); return; }
    setFormSaving(true);
    setFormError("");
    try {
      const res = await fetch("/api/dashboard/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description || null,
          url: form.url || null,
          language: form.language || null,
          stars: parseInt(form.stars) || 0,
        }),
      });
      const data = await res.json();
      if (!data.success) { setFormError(data.error); return; }
      setItems((p) => [data.data.project, ...p]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } finally {
      setFormSaving(false);
    }
  }

  async function deleteProject(id: string) {
    setDeleting(id);
    await fetch("/api/dashboard/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setItems((p) => p.filter((pr) => pr.id !== id));
    setDeleting(null);
  }

  const featured = items.filter((p) => p.featured);
  const rest = items.filter((p) => !p.featured);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#e8eaf4" }}>Projects</h1>
          <p className="text-sm mt-0.5" style={{ color: "#4a506a" }}>
            Star to feature on your passport. GitHub projects sync automatically; add manual ones below.
          </p>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setFormError(""); setForm(EMPTY_FORM); }}
          className="text-sm px-3 py-1.5 rounded-lg font-medium"
          style={{ background: "#4361ee", color: "#fff" }}
        >
          + Add project
        </button>
      </div>

      {/* Manual add form */}
      {showForm && (
        <div className="card p-5 flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8b92a8" }}>ADD PROJECT MANUALLY</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name *" value={form.name} onChange={(v) => setField("name", v)} placeholder="my-project" />
            <Field label="Language" value={form.language} onChange={(v) => setField("language", v)} placeholder="Rust" />
            <Field label="Stars" value={form.stars} onChange={(v) => setField("stars", v)} placeholder="0" type="number" />
            <Field label="URL" value={form.url} onChange={(v) => setField("url", v)} placeholder="https://github.com/you/project" />
          </div>
          <Field label="Description" value={form.description} onChange={(v) => setField("description", v)} placeholder="What this project does" />
          {formError && <p className="text-xs" style={{ color: "#ef4444" }}>{formError}</p>}
          <div className="flex gap-2">
            <button onClick={addProject} disabled={formSaving} className="text-sm px-4 py-2 rounded-lg font-medium disabled:opacity-40" style={{ background: "#4361ee", color: "#fff" }}>
              {formSaving ? "Saving..." : "Add"}
            </button>
            <button onClick={() => setShowForm(false)} className="text-sm px-4 py-2 rounded-lg" style={{ color: "#4a506a" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {featured.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#10b981" }}>
            Featured ({featured.length})
          </h2>
          {featured.map((p) => (
            <ProjectRow key={p.id} project={p} onToggle={toggleFeatured} onDelete={deleteProject} saving={saving === p.id} deleting={deleting === p.id} />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8b92a8" }}>
          All Projects ({items.length})
        </h2>
        {items.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-sm" style={{ color: "#4a506a" }}>No projects yet. Sync GitHub or add one manually above.</p>
          </div>
        )}
        {rest.map((p) => (
          <ProjectRow key={p.id} project={p} onToggle={toggleFeatured} onDelete={deleteProject} saving={saving === p.id} deleting={deleting === p.id} />
        ))}
      </div>
    </div>
  );
}

function ProjectRow({ project: p, onToggle, onDelete, saving, deleting }: {
  project: Project;
  onToggle: (id: string, f: boolean) => void;
  onDelete: (id: string) => void;
  saving: boolean;
  deleting: boolean;
}) {
  return (
    <div
      className="card p-3 flex items-center gap-3"
      style={{ borderColor: p.featured ? "#4361ee44" : "#1c2035" }}
    >
      <button
        onClick={() => onToggle(p.id, !p.featured)}
        disabled={saving}
        className="shrink-0 transition-colors"
        style={{ color: p.featured ? "#f0b429" : "#4a506a" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={p.featured ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium mono truncate" style={{ color: "#e8eaf4" }}>{p.fullName ?? p.name}</span>
          {p.license && <span className="text-xs px-1.5 py-0.5 rounded shrink-0" style={{ background: "#1c2035", color: "#4a506a" }}>{p.license}</span>}
          {p.platform === "manual" && <span className="text-xs px-1.5 py-0.5 rounded shrink-0" style={{ background: "#7b2ff718", color: "#7b2ff7" }}>manual</span>}
        </div>
        {p.description && <p className="text-xs mt-0.5 truncate" style={{ color: "#4a506a" }}>{p.description}</p>}
      </div>

      <div className="flex items-center gap-3 text-xs shrink-0" style={{ color: "#4a506a" }}>
        {p.language && (
          <div className="flex items-center gap-1">
            <div className="rounded-full" style={{ width: 8, height: 8, background: p.languageColor ?? "#8b92a8" }} />
            {p.language}
          </div>
        )}
        <div className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          {formatNumber(p.stars)}
        </div>
        {p.platform !== "manual" && (
          <span className="mono" style={{ color: p.healthScore >= 80 ? "#10b981" : p.healthScore >= 60 ? "#4361ee" : "#f59e0b" }}>
            {p.healthScore}
          </span>
        )}
        {p.url && (
          <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: "#4a506a" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        )}
        <button
          onClick={() => onDelete(p.id)}
          disabled={deleting}
          className="text-xs px-2 py-0.5 rounded disabled:opacity-40"
          style={{ background: "#ef444415", color: "#ef4444" }}
        >
          {deleting ? "..." : "Del"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs" style={{ color: "#8b92a8" }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4" }} />
    </div>
  );
}
