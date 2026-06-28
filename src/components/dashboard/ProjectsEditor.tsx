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
}

export function ProjectsEditor({ projects }: { projects: Project[] }) {
  const [items, setItems] = useState(projects);
  const [saving, setSaving] = useState<string | null>(null);

  async function toggleFeatured(id: string, featured: boolean) {
    setSaving(id);
    const res = await fetch("/api/dashboard/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, featured }),
    });
    const data = await res.json();
    if (data.success) {
      setItems((p) => p.map((pr) => pr.id === id ? { ...pr, featured } : pr));
    }
    setSaving(null);
  }

  const featured = items.filter((p) => p.featured);
  const rest = items.filter((p) => !p.featured);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "#e8eaf4" }}>Projects</h1>
        <p className="text-sm mt-0.5" style={{ color: "#4a506a" }}>
          Star featured projects to show them first on your public passport. Projects are synced from GitHub.
        </p>
      </div>

      {featured.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#10b981" }}>
            Featured ({featured.length})
          </h2>
          {featured.map((p) => <ProjectRow key={p.id} project={p} onToggle={toggleFeatured} saving={saving === p.id} />)}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8b92a8" }}>
          All Projects ({items.length})
        </h2>
        {items.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-sm" style={{ color: "#4a506a" }}>No projects synced yet. Sync your GitHub account.</p>
          </div>
        )}
        {rest.map((p) => <ProjectRow key={p.id} project={p} onToggle={toggleFeatured} saving={saving === p.id} />)}
      </div>
    </div>
  );
}

function ProjectRow({ project: p, onToggle, saving }: { project: Project; onToggle: (id: string, f: boolean) => void; saving: boolean }) {
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
        <span
          className="mono"
          style={{ color: p.healthScore >= 80 ? "#10b981" : p.healthScore >= 60 ? "#4361ee" : "#f59e0b" }}
        >
          {p.healthScore}
        </span>
        {p.url && (
          <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: "#4a506a" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        )}
      </div>
    </div>
  );
}
