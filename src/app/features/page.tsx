import Link from "next/link";
import { AppNav } from "@/components/AppNav";

const FEATURES = [
  {
    title: "Trust Score",
    description: "AI-computed trust rating based on code quality, maintenance history, community contributions, and security response time.",
    color: "#4361ee",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4" strokeWidth="2"/></svg>,
    points: ["Code quality analysis across all repos", "Security CVE response time", "Issue and PR resolution rate", "Commit consistency over time"],
  },
  {
    title: "Skill Genome",
    description: "Your real skill profile derived from actual code, not a self-reported list. Computed from language usage, framework patterns, and architecture decisions.",
    color: "#10b981",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    points: ["Language proficiency scores", "Framework and library expertise", "Domain coverage mapping", "Year-over-year skill growth"],
  },
  {
    title: "Identity Verification",
    description: "Multi-layer identity verification from email to domain ownership to cryptographic keys.",
    color: "#7b2ff7",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    points: ["OAuth via GitHub and Google", "DNS domain verification", "SSH and GPG key linking", "Corporate and academic email"],
  },
  {
    title: "Project Passport",
    description: "Every project gets its own health score, maintenance velocity, contributor graph, and dependency audit.",
    color: "#f59e0b",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
    points: ["0–100 health score per project", "Release cadence tracking", "Dependency vulnerability audit", "Contributor network graph"],
  },
  {
    title: "Security Profile",
    description: "Automatic analysis of CVE response time, secret exposure history, dependency hygiene, and supply chain risks.",
    color: "#ef4444",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/></svg>,
    points: ["Secret leak detection across history", "CVE response tracking", "License compliance check", "Supply chain security score"],
  },
  {
    title: "Open Source DNA",
    description: "Visual breakdown of your language ecosystem, contribution patterns, and project influence over time.",
    color: "#06b6d4",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
    points: ["Language distribution chart", "Ecosystem and framework mapping", "GitHub-style contribution timeline", "Impact graph across OSS"],
  },
  {
    title: "Package Portfolio",
    description: "Auto-linked packages from npm, PyPI, crates.io, Docker Hub and more with download stats and version history.",
    color: "#ec4899",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>,
    points: ["npm, PyPI, crates.io, Maven", "Docker Hub image tracking", "Total download analytics", "Version release history"],
  },
  {
    title: "AI Resume",
    description: "One click generates a tailored resume, cover letter, and portfolio page directly from your live passport data.",
    color: "#84cc16",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    points: ["Auto-generated PDF resume", "Role-tailored cover letter", "Portfolio site builder", "ATS-optimized formatting"],
  },
  {
    title: "Developer Visa",
    description: "Companies issue verified endorsements — Google Visa, Cloudflare Visa, Mozilla Visa — permanently attached to your passport.",
    color: "#f0b429",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
    points: ["Corporate endorsements from orgs", "Verified org badges", "Exclusive program access proofs", "Skill certification by companies"],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <AppNav minimal />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{ color: "#e8eaf4" }}>Features</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#8b92a8" }}>
            A living, verified record of your work — auto-updated, AI-analyzed, and cryptographically provable.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="card p-8 flex flex-col md:flex-row gap-8 items-start">
              <div className="flex items-center gap-4 md:flex-col md:items-start md:w-48 shrink-0">
                <div className="rounded-xl p-3" style={{ background: `${f.color}18`, color: f.color }}>
                  {f.icon}
                </div>
                <h2 className="text-lg font-bold" style={{ color: "#e8eaf4" }}>{f.title}</h2>
              </div>
              <div className="flex-1">
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#8b92a8" }}>{f.description}</p>
                <ul className="grid grid-cols-2 gap-2">
                  {f.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2 text-xs" style={{ color: "#4a506a" }}>
                      <div className="rounded-full shrink-0" style={{ width: 4, height: 4, background: f.color }} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-4xl font-bold mono shrink-0 hidden md:block" style={{ color: "#1c2035" }}>
                {String(i + 1).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
