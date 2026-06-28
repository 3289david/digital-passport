"use client";

import { useState } from "react";

type EntryType = "project" | "company" | "milestone" | "education";

interface ExperienceEntry {
  id: string;
  year: string;
  title: string;
  description: string | null;
  type: string;
  order: number;
  url: string | null;
}

const TYPE_OPTIONS: { value: EntryType; label: string; color: string }[] = [
  { value: "project", label: "Project", color: "#4361ee" },
  { value: "company", label: "Company", color: "#10b981" },
  { value: "milestone", label: "Milestone", color: "#f0b429" },
  { value: "education", label: "Education", color: "#7b2ff7" },
];

export function ExperienceEditor({ experiences }: { experiences: ExperienceEntry[] }) {
  const [items, setItems] = useState(experiences);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ year: String(new Date().getFullYear()), title: "", description: "", type: "project" as EntryType, url: "" });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<typeof form & { id: string } | null>(null);

  async function addEntry() {
    setSaving(true);
    const res = await fetch("/api/dashboard/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setItems((p) => [...p, data.data.item].sort((a, b) => a.year.localeCompare(b.year)));
      setForm({ year: String(new Date().getFullYear()), title: "", description: "", type: "project", url: "" });
      setAdding(false);
    }
    setSaving(false);
  }

  async function deleteEntry(id: string) {
    await fetch("/api/dashboard/experience", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setItems((p) => p.filter((e) => e.id !== id));
  }

  async function saveEdit() {
    if (!editForm) return;
    setSaving(true);
    const res = await fetch("/api/dashboard/experience", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const data = await res.json();
    if (data.success) {
      setItems((p) => p.map((e) => e.id === editForm.id ? data.data.item : e));
      setEditingId(null);
      setEditForm(null);
    }
    setSaving(false);
  }

  const TYPE_COLOR: Record<string, string> = { project: "#4361ee", company: "#10b981", milestone: "#f0b429", education: "#7b2ff7" };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#e8eaf4" }}>Experience Timeline</h1>
          <p className="text-sm mt-0.5" style={{ color: "#4a506a" }}>Add projects, companies, milestones, and education</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: "#4361ee", color: "#fff" }}
        >
          + Add entry
        </button>
      </div>

      {adding && (
        <div className="card p-5 flex flex-col gap-4">
          <h3 className="text-sm font-semibold" style={{ color: "#e8eaf4" }}>New entry</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs" style={{ color: "#8b92a8" }}>Year</label>
              <input type="text" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} maxLength={4} className="px-3 py-2 rounded-lg text-sm outline-none mono" style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4" }} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs" style={{ color: "#8b92a8" }}>Type</label>
              <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as EntryType }))} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4" }}>
                {TYPE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: "#8b92a8" }}>Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Project name, company, etc." maxLength={120} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4" }} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: "#8b92a8" }}>Description (optional)</label>
            <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} maxLength={500} rows={2} className="px-3 py-2 rounded-lg text-sm outline-none resize-none" style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4" }} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: "#8b92a8" }}>URL (optional)</label>
            <input type="url" value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} placeholder="https://..." className="px-3 py-2 rounded-lg text-sm outline-none mono" style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4" }} />
          </div>
          <div className="flex gap-2">
            <button onClick={addEntry} disabled={saving || !form.title || !form.year} className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40" style={{ background: "#4361ee", color: "#fff" }}>
              {saving ? "Adding..." : "Add"}
            </button>
            <button onClick={() => setAdding(false)} className="px-4 py-2 rounded-lg text-sm" style={{ color: "#4a506a", background: "#0d0f18", border: "1px solid #1c2035" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {items.length === 0 && !adding && (
          <div className="card p-8 text-center">
            <p className="text-sm" style={{ color: "#4a506a" }}>No experience entries yet. Add your first one above.</p>
          </div>
        )}
        {items.map((entry) => {
          const color = TYPE_COLOR[entry.type] ?? "#4a506a";
          const isEditing = editingId === entry.id;
          return (
            <div key={entry.id} className="card p-4">
              {isEditing && editForm ? (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={editForm.year} onChange={(e) => setEditForm((p) => p && ({ ...p, year: e.target.value }))} className="px-3 py-2 rounded-lg text-sm outline-none mono" style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4" }} />
                    <select value={editForm.type} onChange={(e) => setEditForm((p) => p && ({ ...p, type: e.target.value as EntryType }))} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4" }}>
                      {TYPE_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <input type="text" value={editForm.title} onChange={(e) => setEditForm((p) => p && ({ ...p, title: e.target.value }))} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4" }} />
                  <textarea value={editForm.description} onChange={(e) => setEditForm((p) => p && ({ ...p, description: e.target.value }))} rows={2} className="px-3 py-2 rounded-lg text-sm outline-none resize-none" style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4" }} />
                  <input type="url" value={editForm.url} onChange={(e) => setEditForm((p) => p && ({ ...p, url: e.target.value }))} placeholder="URL..." className="px-3 py-2 rounded-lg text-sm outline-none mono" style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4" }} />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} disabled={saving} className="px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-40" style={{ background: "#4361ee", color: "#fff" }}>Save</button>
                    <button onClick={() => { setEditingId(null); setEditForm(null); }} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: "#4a506a" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="rounded-full mt-1.5 shrink-0" style={{ width: 8, height: 8, background: color, boxShadow: `0 0 6px ${color}88` }} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs mono font-semibold" style={{ color }}>{entry.year}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded capitalize" style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>{entry.type}</span>
                      </div>
                      <div className="text-sm font-medium mt-0.5" style={{ color: "#e8eaf4" }}>{entry.title}</div>
                      {entry.description && <div className="text-xs mt-0.5" style={{ color: "#4a506a" }}>{entry.description}</div>}
                      {entry.url && <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-xs underline mt-0.5 block" style={{ color: "#4361ee" }}>{entry.url}</a>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => { setEditingId(entry.id); setEditForm({ id: entry.id, year: entry.year, title: entry.title, description: entry.description ?? "", type: entry.type as EntryType, url: entry.url ?? "" }); }} className="text-xs px-2 py-1 rounded" style={{ color: "#8b92a8", background: "#131520" }}>Edit</button>
                    <button onClick={() => deleteEntry(entry.id)} className="text-xs px-2 py-1 rounded" style={{ color: "#ef4444", background: "#ef444418" }}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
