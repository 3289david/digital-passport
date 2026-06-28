"use client";

import { useState } from "react";

interface ProfileEditorProps {
  passport: {
    displayName: string | null;
    title: string | null;
    bio: string | null;
    location: string | null;
    website: string | null;
    twitterHandle: string | null;
    available: boolean;
    availabilityNote: string | null;
  };
}

export function ProfileEditor({ passport }: ProfileEditorProps) {
  const [form, setForm] = useState({
    displayName: passport.displayName ?? "",
    title: passport.title ?? "",
    bio: passport.bio ?? "",
    location: passport.location ?? "",
    website: passport.website ?? "",
    twitterHandle: passport.twitterHandle ?? "",
    available: passport.available,
    availabilityNote: passport.availabilityNote ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set(key: keyof typeof form, val: string | boolean) {
    setForm((p) => ({ ...p, [key]: val }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/passport/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) setError(data.error);
      else setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#e8eaf4" }}>Edit Profile</h1>
          <p className="text-sm mt-0.5" style={{ color: "#4a506a" }}>All fields are visible on your public passport</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
          style={{ background: "#4361ee", color: "#fff" }}
        >
          {saving ? "Saving..." : saved ? "Saved" : "Save changes"}
        </button>
      </div>

      {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}

      <div className="card p-6 flex flex-col gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Display Name" value={form.displayName} onChange={(v) => set("displayName", v)} placeholder="Your full name" maxLength={60} />
          <Field label="Title / Role" value={form.title} onChange={(v) => set("title", v)} placeholder="Backend Engineer" maxLength={80} />
          <Field label="Location" value={form.location} onChange={(v) => set("location", v)} placeholder="Seoul, South Korea" maxLength={80} />
          <Field label="Website" value={form.website} onChange={(v) => set("website", v)} placeholder="https://yoursite.com" maxLength={200} />
          <Field label="X / Twitter" value={form.twitterHandle} onChange={(v) => set("twitterHandle", v)} placeholder="@handle" maxLength={50} />
        </div>

        <div>
          <label className="text-xs font-medium uppercase tracking-wider block mb-1.5" style={{ color: "#8b92a8" }}>
            Bio <span className="normal-case font-normal ml-1" style={{ color: "#4a506a" }}>{form.bio.length}/500</span>
          </label>
          <textarea
            value={form.bio}
            onChange={(e) => set("bio", e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Short bio shown on your passport..."
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
            style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4" }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "#8b92a8" }}>Availability</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => set("available", !form.available)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: form.available ? "#10b98118" : "#0d0f18",
                border: `1px solid ${form.available ? "#10b98140" : "#1c2035"}`,
                color: form.available ? "#10b981" : "#4a506a",
              }}
            >
              <div className="rounded-full" style={{ width: 6, height: 6, background: form.available ? "#10b981" : "#4a506a" }} />
              {form.available ? "Available" : "Not available"}
            </button>
          </div>
          {form.available && (
            <Field
              label="Availability note"
              value={form.availabilityNote}
              onChange={(v) => set("availabilityNote", v)}
              placeholder="Open to senior backend roles"
              maxLength={120}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "#8b92a8" }}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="px-3 py-2.5 rounded-xl text-sm outline-none"
        style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4" }}
      />
    </div>
  );
}
