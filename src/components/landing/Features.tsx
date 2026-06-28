"use client";

const FEATURES = [
  {
    title: "Trust Score",
    description: "AI-computed trust rating based on code quality, maintenance history, and community contributions.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4" strokeWidth="2"/></svg>,
    color: "#4361ee",
  },
  {
    title: "Skill Genome",
    description: "Your real skill profile derived from actual project code — not self-reported, not guesswork.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    color: "#10b981",
  },
  {
    title: "Identity Verification",
    description: "Multi-layer verification from email to domain ownership to GPG keys.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    color: "#7b2ff7",
  },
  {
    title: "Project Passport",
    description: "Every project gets its own passport — health score, release cadence, and dependency audit.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
    color: "#f59e0b",
  },
  {
    title: "Security Profile",
    description: "Automatic analysis of CVE response, secret exposure history, and supply chain risks.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/></svg>,
    color: "#ef4444",
  },
  {
    title: "Open Source DNA",
    description: "Visual breakdown of your language ecosystem and contribution patterns over time.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
    color: "#06b6d4",
  },
  {
    title: "Package Portfolio",
    description: "Auto-linked packages from npm, PyPI, crates.io, Docker Hub and more with download stats.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>,
    color: "#ec4899",
  },
  {
    title: "AI Resume",
    description: "One click generates a tailored resume, cover letter, and portfolio from your live passport data.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    color: "#84cc16",
  },
  {
    title: "Developer Visa",
    description: "Companies issue verified endorsements — Google Visa, Cloudflare Visa, Mozilla Visa.",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
    color: "#f0b429",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-3" style={{ color: "#e8eaf4" }}>
            Everything in one passport
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "#8b92a8" }}>
            A living, verified record of your work — auto-updated, AI-analyzed, and cryptographically provable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="card p-5 flex items-start gap-4 hover:border-[#4361ee44] transition-colors"
            >
              <div
                className="rounded-lg p-2 shrink-0 mt-0.5"
                style={{ background: `${feature.color}15`, color: feature.color }}
              >
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: "#e8eaf4" }}>
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "#8b92a8" }}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
