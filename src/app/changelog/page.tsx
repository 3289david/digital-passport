import Link from "next/link";
import { AppNav } from "@/components/AppNav";

const ENTRIES = [
  {
    version: "v0.4.0",
    date: "Jun 28, 2026",
    type: "release",
    changes: [
      { kind: "new", text: "Developer Visa — organizations can now issue verified endorsements" },
      { kind: "new", text: "Team Passport — aggregate identity for engineering orgs" },
      { kind: "new", text: "API v1 — public REST endpoints for all passport data" },
      { kind: "improved", text: "Trust Score now includes security CVE response signal" },
    ],
  },
  {
    version: "v0.3.0",
    date: "Jun 15, 2026",
    type: "release",
    changes: [
      { kind: "new", text: "Package Portfolio — npm, PyPI, crates.io, Docker Hub" },
      { kind: "new", text: "Security Profile with 8 automated checks" },
      { kind: "new", text: "Print / PDF export for your passport" },
      { kind: "fixed", text: "Contribution Timeline rendering on small screens" },
    ],
  },
  {
    version: "v0.2.0",
    date: "Jun 5, 2026",
    type: "release",
    changes: [
      { kind: "new", text: "Skill Genome — computed from real repository code" },
      { kind: "new", text: "Open Source DNA language breakdown" },
      { kind: "new", text: "Experience Graph for career timeline" },
      { kind: "improved", text: "Onboarding flow reduced to 2 steps" },
    ],
  },
  {
    version: "v0.1.0",
    date: "May 28, 2026",
    type: "release",
    changes: [
      { kind: "new", text: "Initial launch — public beta" },
      { kind: "new", text: "GitHub OAuth + Google OAuth" },
      { kind: "new", text: "Trust Score (v1)" },
      { kind: "new", text: "Public passport at p.krl.kr/:username" },
    ],
  },
];

const KIND_COLORS: Record<string, string> = {
  new: "#10b981",
  improved: "#4361ee",
  fixed: "#f59e0b",
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <AppNav minimal />

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        <h1 className="text-5xl font-bold mb-4" style={{ color: "#e8eaf4" }}>Changelog</h1>
        <p className="text-lg mb-12" style={{ color: "#8b92a8" }}>
          Every change, fix, and new feature — in chronological order.
        </p>

        <div className="flex flex-col gap-8">
          {ENTRIES.map((entry) => (
            <div key={entry.version} className="flex gap-6">
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="rounded-full" style={{ width: 10, height: 10, background: "#4361ee" }} />
                <div className="flex-1 w-px" style={{ background: "#1c2035" }} />
              </div>
              <div className="card p-6 flex-1 mb-2">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-bold mono" style={{ color: "#4361ee" }}>{entry.version}</span>
                  <span className="text-xs" style={{ color: "#4a506a" }}>{entry.date}</span>
                </div>
                <ul className="flex flex-col gap-2">
                  {entry.changes.map((change, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span
                        className="text-xs font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                        style={{ background: `${KIND_COLORS[change.kind]}18`, color: KIND_COLORS[change.kind] }}
                      >
                        {change.kind}
                      </span>
                      <span style={{ color: "#8b92a8" }}>{change.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
