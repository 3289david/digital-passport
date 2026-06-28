"use client";

import { useState } from "react";
import { NpmIcon, DockerIcon, PyPIIcon, CratesIcon } from "@/components/icons/PlatformIcons";
import { formatNumber } from "@/lib/utils";

interface Package {
  id: string;
  name: string;
  registry: string;
  version: string | null;
  downloads: number;
  description?: string | null;
  url?: string | null;
}

const REGISTRIES = [
  { id: "npm", label: "npm", icon: <NpmIcon size={14} />, color: "#cb3837" },
  { id: "pypi", label: "PyPI", icon: <PyPIIcon size={14} />, color: "#3775a9" },
  { id: "crates", label: "crates.io", icon: <CratesIcon size={14} />, color: "#dea584" },
  { id: "docker", label: "Docker Hub", icon: <DockerIcon size={14} />, color: "#2496ed" },
  { id: "maven", label: "Maven", icon: null, color: "#c71a36" },
  { id: "gem", label: "RubyGems", icon: null, color: "#cc342d" },
  { id: "nuget", label: "NuGet", icon: null, color: "#004880" },
  { id: "other", label: "Other", icon: null, color: "#8b92a8" },
];

const EMPTY_FORM = { name: "", registry: "npm", version: "", downloads: "", description: "", url: "" };

export function PackagesEditor({ packages: initial }: { packages: Package[] }) {
  const [packages, setPackages] = useState(initial);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  function setField(key: keyof typeof EMPTY_FORM, val: string) {
    setForm((p) => ({ ...p, [key]: val }));
    setError("");
  }

  async function add() {
    if (!form.name.trim()) { setError("Package name is required"); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          registry: form.registry,
          version: form.version || null,
          downloads: parseInt(form.downloads) || 0,
          description: form.description || null,
          url: form.url || null,
        }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error); return; }
      setPackages((p) => {
        const existing = p.findIndex((pkg) => pkg.id === data.data.package.id);
        if (existing >= 0) { const n = [...p]; n[existing] = data.data.package; return n; }
        return [data.data.package, ...p];
      });
      setForm(EMPTY_FORM);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    setDeleting(id);
    await fetch("/api/dashboard/packages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPackages((p) => p.filter((pkg) => pkg.id !== id));
    setDeleting(null);
  }

  const registryMeta = (id: string) => REGISTRIES.find((r) => r.id === id) ?? REGISTRIES[REGISTRIES.length - 1];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "#e8eaf4" }}>Packages</h1>
        <p className="text-sm mt-0.5" style={{ color: "#4a506a" }}>Add packages you publish across registries. Used for Trust Score and public passport display.</p>
      </div>

      {/* Add form */}
      <div className="card p-5 flex flex-col gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8b92a8" }}>ADD PACKAGE</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: "#8b92a8" }}>Registry</label>
            <select
              value={form.registry}
              onChange={(e) => setField("registry", e.target.value)}
              className="px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4" }}
            >
              {REGISTRIES.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>
          <Field label="Package name" value={form.name} onChange={(v) => setField("name", v)} placeholder="my-package" />
          <Field label="Version" value={form.version} onChange={(v) => setField("version", v)} placeholder="1.0.0" />
          <Field label="Total downloads" value={form.downloads} onChange={(v) => setField("downloads", v)} placeholder="10000" type="number" />
        </div>
        <Field label="Description (optional)" value={form.description} onChange={(v) => setField("description", v)} placeholder="What this package does" />
        <Field label="URL (optional)" value={form.url} onChange={(v) => setField("url", v)} placeholder="https://npmjs.com/package/my-package" />
        {error && <p className="text-xs" style={{ color: "#ef4444" }}>{error}</p>}
        <button onClick={add} disabled={saving} className="px-4 py-2 rounded-lg text-sm font-medium self-start disabled:opacity-40" style={{ background: "#4361ee", color: "#fff" }}>
          {saving ? "Saving..." : "Add Package"}
        </button>
      </div>

      {/* List */}
      <div className="card p-5 flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8b92a8" }}>YOUR PACKAGES ({packages.length})</h2>
        {packages.length === 0 && (
          <p className="text-sm" style={{ color: "#4a506a" }}>No packages yet. Add them above or sync GitHub / npm.</p>
        )}
        {packages.map((pkg) => {
          const meta = registryMeta(pkg.registry);
          return (
            <div key={pkg.id} className="flex items-center gap-3 py-2" style={{ borderBottom: "1px solid #1c2035" }}>
              <div className="shrink-0 w-5 flex items-center justify-center" style={{ color: meta.color }}>
                {meta.icon ?? <span className="text-xs font-bold">{meta.label[0]}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium mono" style={{ color: "#e8eaf4" }}>{pkg.name}</span>
                  {pkg.version && <span className="text-xs mono" style={{ color: "#4a506a" }}>v{pkg.version}</span>}
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${meta.color}15`, color: meta.color }}>{meta.label}</span>
                </div>
                {pkg.description && <p className="text-xs mt-0.5 truncate" style={{ color: "#4a506a" }}>{pkg.description}</p>}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs mono" style={{ color: "#8b92a8" }}>{formatNumber(pkg.downloads)} dl</span>
                {pkg.url && (
                  <a href={pkg.url} target="_blank" rel="noopener noreferrer" style={{ color: "#4a506a" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                )}
                <button
                  onClick={() => remove(pkg.id)}
                  disabled={deleting === pkg.id}
                  className="text-xs px-2 py-0.5 rounded disabled:opacity-40"
                  style={{ background: "#ef444415", color: "#ef4444" }}
                >
                  {deleting === pkg.id ? "..." : "Remove"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs" style={{ color: "#8b92a8" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2 rounded-lg text-sm outline-none"
        style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4" }}
      />
    </div>
  );
}
