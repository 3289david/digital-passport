"use client";

import { useState } from "react";

interface ApiKey { id: string; name: string; key: string; lastUsedAt: Date | null; createdAt: Date; }

export function ApiKeysPanel({ apiKeys: initial, username }: { apiKeys: ApiKey[]; username: string }) {
  const [keys, setKeys] = useState(initial);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function create() {
    if (!name.trim()) return;
    setCreating(true);
    const res = await fetch("/api/dashboard/apikeys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    const data = await res.json();
    if (data.success) {
      setNewKey(data.data.key);
      setKeys((p) => [data.data.apiKey, ...p]);
      setName("");
    }
    setCreating(false);
  }

  async function revoke(id: string) {
    await fetch("/api/dashboard/apikeys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setKeys((p) => p.filter((k) => k.id !== id));
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  }

  const BASE_URL = "https://api.p.krl.kr/v1";

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "#e8eaf4" }}>API Keys</h1>
        <p className="text-sm mt-0.5" style={{ color: "#4a506a" }}>
          Use the Passport API to integrate your data elsewhere.
        </p>
      </div>

      {/* API reference */}
      <div className="card p-5 flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8b92a8" }}>API REFERENCE</h2>
        <div className="flex flex-col gap-1.5">
          {[
            `GET ${BASE_URL}/${username}`,
            `GET ${BASE_URL}/${username}/trust`,
            `GET ${BASE_URL}/${username}/skills`,
            `GET ${BASE_URL}/${username}/projects`,
            `GET ${BASE_URL}/${username}/packages`,
            `GET ${BASE_URL}/${username}/badges`,
            `GET ${BASE_URL}/${username}/timeline`,
          ].map((endpoint) => (
            <div key={endpoint} className="flex items-center gap-2">
              <div className="flex-1 rounded px-3 py-2 text-xs mono overflow-x-auto" style={{ background: "#131520", color: "#4361ee" }}>
                {endpoint}
              </div>
              <button onClick={() => copy(endpoint)} className="text-xs px-2 py-1.5 rounded shrink-0" style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#4a506a" }}>
                {copied === endpoint ? "Copied" : "Copy"}
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs" style={{ color: "#4a506a" }}>
          Public endpoints require no key. Include <span className="mono" style={{ color: "#e8eaf4" }}>X-API-Key: your_key</span> for higher rate limits.
        </p>
      </div>

      {/* Create key */}
      <div className="card p-5 flex flex-col gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8b92a8" }}>CREATE API KEY</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Key name (e.g. My Portfolio)"
            maxLength={60}
            className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4" }}
          />
          <button onClick={create} disabled={creating || !name.trim()} className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40" style={{ background: "#4361ee", color: "#fff" }}>
            {creating ? "Creating..." : "Create"}
          </button>
        </div>

        {newKey && (
          <div className="rounded-xl p-4 flex flex-col gap-2" style={{ background: "#10b98115", border: "1px solid #10b98140" }}>
            <p className="text-xs" style={{ color: "#10b981" }}>Key created. Copy it now — it will not be shown again.</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs mono px-3 py-2 rounded" style={{ background: "#0d0f18", color: "#e8eaf4" }}>{newKey}</code>
              <button onClick={() => copy(newKey)} className="text-xs px-3 py-2 rounded" style={{ background: "#4361ee", color: "#fff" }}>
                {copied === newKey ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Existing keys */}
      {keys.length > 0 && (
        <div className="card p-5 flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8b92a8" }}>ACTIVE KEYS ({keys.length})</h2>
          {keys.map((k) => (
            <div key={k.id} className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5" style={{ background: "#0d0f18", border: "1px solid #141726" }}>
              <div>
                <div className="text-sm font-medium" style={{ color: "#e8eaf4" }}>{k.name}</div>
                <div className="text-xs mono mt-0.5" style={{ color: "#4a506a" }}>
                  {k.key.slice(0, 8)}••••••••{k.key.slice(-4)}
                  {k.lastUsedAt && ` · Last used ${new Date(k.lastUsedAt).toLocaleDateString()}`}
                </div>
              </div>
              <button onClick={() => revoke(k.id)} className="text-xs px-2 py-1 rounded shrink-0" style={{ background: "#ef444418", color: "#ef4444" }}>
                Revoke
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
