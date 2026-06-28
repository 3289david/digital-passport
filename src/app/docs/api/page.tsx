import Link from "next/link";
import { AppNav } from "@/components/AppNav";

const ENDPOINTS = [
  {
    method: "GET", path: "/v1/:username", title: "Get passport",
    desc: "Returns the full public passport for a developer.",
    response: `{\n  "username": "johndoe",\n  "displayName": "John Doe",\n  "title": "Full Stack Engineer",\n  "trustScore": 947,\n  "available": true,\n  "location": "San Francisco, CA"\n}`,
  },
  {
    method: "GET", path: "/v1/:username/trust", title: "Trust Score",
    desc: "Returns the Trust Score and its breakdown components.",
    response: `{\n  "score": 947,\n  "tier": "Elite",\n  "percentile": 98,\n  "breakdown": {\n    "commits": 94,\n    "quality": 91,\n    "community": 89,\n    "security": 93\n  }\n}`,
  },
  {
    method: "GET", path: "/v1/:username/skills", title: "Skills",
    desc: "Returns the computed Skill Genome.",
    response: `[\n  { "name": "TypeScript", "score": 96, "color": "#3178c6" },\n  { "name": "Rust", "score": 89, "color": "#dea584" },\n  { "name": "Go", "score": 84, "color": "#00add8" }\n]`,
  },
  {
    method: "GET", path: "/v1/:username/projects", title: "Projects",
    desc: "Returns featured projects with health scores and stats.",
    response: `[\n  {\n    "name": "turboqueue",\n    "stars": 3200,\n    "language": "Rust",\n    "healthScore": 96\n  }\n]`,
  },
];

export default function ApiReferencePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <AppNav minimal />

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        <h1 className="text-5xl font-bold mb-4" style={{ color: "#e8eaf4" }}>API Reference</h1>
        <p className="text-lg mb-4" style={{ color: "#8b92a8" }}>REST API. All responses are JSON. No auth required for public passport data.</p>
        <div className="rounded-lg px-4 py-3 mono text-sm mb-10" style={{ background: "#131520", color: "#4361ee" }}>
          Base URL: https://api.p.krl.kr
        </div>

        <div className="flex flex-col gap-8">
          {ENDPOINTS.map((ep) => (
            <div key={ep.path} className="card p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs mono font-bold px-2 py-0.5 rounded" style={{ background: "#10b98118", color: "#10b981" }}>{ep.method}</span>
                <span className="mono text-sm" style={{ color: "#e8eaf4" }}>{ep.path}</span>
              </div>
              <h3 className="font-semibold text-sm mb-2" style={{ color: "#e8eaf4" }}>{ep.title}</h3>
              <p className="text-xs mb-4" style={{ color: "#8b92a8" }}>{ep.desc}</p>
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#4a506a" }}>Example response</div>
              <pre className="rounded-lg p-4 text-xs mono overflow-x-auto" style={{ background: "#131520", color: "#4361ee" }}>
                {ep.response}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
