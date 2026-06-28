"use client";

import { useState, useRef } from "react";

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
    avatarUrl?: string | null;
  };
  userImage?: string | null;
}

export function ProfileEditor({ passport, userImage }: ProfileEditorProps) {
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
  const [avatarSrc, setAvatarSrc] = useState<string | null>(passport.avatarUrl ?? userImage ?? null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

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

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    setAvatarError("");
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const res = await fetch("/api/passport/avatar", { method: "POST", body: fd });
      const data = await res.json();
      if (data.data?.avatarUrl) {
        setAvatarSrc(data.data.avatarUrl);
      } else {
        setAvatarError(data.error ?? "Upload failed");
      }
    } catch {
      setAvatarError("Upload failed");
    } finally {
      setAvatarUploading(false);
    }
  }

  const initials = (form.displayName || "?")[0].toUpperCase();

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

      {/* Avatar */}
      <div className="card p-5 flex items-center gap-5">
        <div className="relative">
          {avatarSrc ? (
            <img src={avatarSrc} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold" style={{ background: "linear-gradient(135deg,#4361ee,#7b2ff7)", color: "#fff" }}>
              {initials}
            </div>
          )}
          {avatarUploading && (
            <div className="absolute inset-0 rounded-2xl flex items-center justify-center" style={{ background: "#00000080" }}>
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/>
                <path d="M12 2a10 10 0 0 1 10 10"/>
              </svg>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium mb-2" style={{ color: "#e8eaf4" }}>Profile photo</p>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={avatarUploading}
            className="text-xs px-3 py-1.5 rounded-lg disabled:opacity-40"
            style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#8b92a8" }}
          >
            {avatarUploading ? "Uploading..." : "Change photo"}
          </button>
          <p className="text-xs mt-1.5" style={{ color: "#4a506a" }}>JPEG, PNG, WebP or GIF · max 2MB</p>
          {avatarError && <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{avatarError}</p>}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/avif" className="hidden" onChange={handleAvatarChange} />
        </div>
      </div>

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
