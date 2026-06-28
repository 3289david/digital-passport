"use client";

import { useState } from "react";
import { GitHubIcon, GitLabIcon, NpmIcon, DockerIcon, PyPIIcon, HuggingFaceIcon, VercelIcon, CloudflareIcon, StackOverflowIcon, XIcon, DiscordIcon, CratesIcon } from "@/components/icons/PlatformIcons";

const PLATFORMS = [
  { id: "github", label: "GitHub", icon: <GitHubIcon size={18} />, color: "#e8eaf4", placeholder: "your-username" },
  { id: "gitlab", label: "GitLab", icon: <GitLabIcon size={18} />, color: "#fc6d26", placeholder: "your-username" },
  { id: "npm", label: "npm", icon: <NpmIcon size={18} />, color: "#cb3837", placeholder: "your-npm-username" },
  { id: "docker", label: "Docker Hub", icon: <DockerIcon size={18} />, color: "#2496ed", placeholder: "your-dockerhub-username" },
  { id: "pypi", label: "PyPI", icon: <PyPIIcon size={18} />, color: "#3775a9", placeholder: "your-pypi-username" },
  { id: "crates", label: "crates.io", icon: <CratesIcon size={18} />, color: "#dea584", placeholder: "your-crates-username" },
  { id: "huggingface", label: "Hugging Face", icon: <HuggingFaceIcon size={18} />, color: "#ff9d00", placeholder: "your-hf-username" },
  { id: "vercel", label: "Vercel", icon: <VercelIcon size={18} />, color: "#e8eaf4", placeholder: "your-vercel-username" },
  { id: "cloudflare", label: "Cloudflare", icon: <CloudflareIcon size={18} />, color: "#f48120", placeholder: "your-cloudflare-username" },
  { id: "stackoverflow", label: "Stack Overflow", icon: <StackOverflowIcon size={18} />, color: "#f58025", placeholder: "user-id" },
  { id: "x", label: "X / Twitter", icon: <XIcon size={18} />, color: "#e8eaf4", placeholder: "your-handle" },
  { id: "discord", label: "Discord", icon: <DiscordIcon size={18} />, color: "#5865f2", placeholder: "Server or profile link" },
];

export function PlatformsEditor({ connections }: { connections: { platform: string; handle: string; verified: boolean }[] }) {
  const connMap: Record<string, string> = {};
  for (const c of connections) connMap[c.platform] = c.handle;

  const [handles, setHandles] = useState<Record<string, string>>({ ...connMap });
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function save(platform: string) {
    const handle = handles[platform]?.trim();
    if (!handle) return;
    setSaving(platform);
    const res = await fetch("/api/passport/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, handle }),
    });
    if (res.ok) { setSaved(platform); setTimeout(() => setSaved(null), 2000); }
    setSaving(null);
  }

  async function remove(platform: string) {
    setSaving(platform);
    await fetch("/api/passport/connect", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform }),
    });
    setHandles((p) => { const n = { ...p }; delete n[platform]; return n; });
    setSaving(null);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "#e8eaf4" }}>Connected Platforms</h1>
        <p className="text-sm mt-0.5" style={{ color: "#4a506a" }}>Link your accounts to build a complete passport.</p>
      </div>

      <div className="flex flex-col gap-3">
        {PLATFORMS.map(({ id, label, icon, color, placeholder }) => {
          const connected = !!connMap[id];
          const current = handles[id] ?? "";
          return (
            <div key={id} className="card p-4 flex items-center gap-3">
              <div className="shrink-0" style={{ color }}>{icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium mb-1" style={{ color: "#e8eaf4" }}>{label}</div>
                <input
                  type="text"
                  value={current}
                  onChange={(e) => setHandles((p) => ({ ...p, [id]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs mono outline-none"
                  style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4" }}
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {connected && (
                  <div className="w-2 h-2 rounded-full" style={{ background: "#10b981" }} title="Connected" />
                )}
                <button
                  onClick={() => save(id)}
                  disabled={saving === id || !current.trim()}
                  className="text-xs px-3 py-1.5 rounded-lg disabled:opacity-40"
                  style={{ background: "#4361ee", color: "#fff" }}
                >
                  {saving === id ? "..." : saved === id ? "Saved" : "Save"}
                </button>
                {connected && (
                  <button
                    onClick={() => remove(id)}
                    className="text-xs px-2 py-1.5 rounded-lg"
                    style={{ background: "#ef444418", color: "#ef4444" }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
