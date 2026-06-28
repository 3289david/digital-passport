import Link from "next/link";
import { TrustScore } from "@/components/passport/TrustScore";
import { SkillGenome } from "@/components/passport/SkillGenome";
import { ContributionTimeline } from "@/components/passport/ContributionTimeline";
import { OpenSourceDNA } from "@/components/passport/OpenSourceDNA";
import { ProjectCard } from "@/components/passport/ProjectCard";
import { VerifiedBadges } from "@/components/passport/VerifiedBadges";
import { SecurityProfile } from "@/components/passport/SecurityProfile";
import { PackagePortfolio } from "@/components/passport/PackagePortfolio";
import { IdentityVerification } from "@/components/passport/IdentityVerification";
import { ExperienceGraph } from "@/components/passport/ExperienceGraph";
import { PassportLogoIcon, GitHubIcon, GitLabIcon, NpmIcon, DockerIcon, ShieldIcon, KeyIcon, CheckIcon, StarIcon } from "@/components/icons/PlatformIcons";

// Demo data — in production this would be fetched from the DB
const PASSPORT_DATA = {
  username: "danu",
  displayName: "Danu",
  title: "Backend Engineer",
  bio: "Systems programmer building high-performance infrastructure. OSS maintainer, security researcher, and occasional speaker.",
  location: "Seoul, South Korea",
  available: true,
  availabilityNote: "Open to senior backend roles",
  experienceYears: "7 years",
  trustScore: 962,
  passportId: "PID-2024-001",
  joinedYear: 2019,

  stats: {
    commits: 12400,
    stars: 8200,
    packages: 32,
    followers: 3100,
    projects: 47,
    contributions: 2847,
  },

  skills: [
    { name: "Rust", score: 97 },
    { name: "Go", score: 91 },
    { name: "Networking", score: 89 },
    { name: "Security", score: 84 },
    { name: "Python", score: 78 },
    { name: "TypeScript", score: 71 },
    { name: "AI / ML", score: 65 },
    { name: "Frontend", score: 42 },
  ],

  languages: [
    { name: "Rust", percent: 38, color: "#dea584" },
    { name: "Go", percent: 24, color: "#00add8" },
    { name: "Python", percent: 18, color: "#3776ab" },
    { name: "TypeScript", percent: 12, color: "#3178c6" },
    { name: "C++", percent: 8, color: "#f34b7d" },
  ],

  contributions: [
    { year: 2022, weeks: Array.from({ length: 52 }, () => Math.floor(Math.random() * 8)) },
    { year: 2023, weeks: Array.from({ length: 52 }, () => Math.floor(Math.random() * 12)) },
    { year: 2024, weeks: Array.from({ length: 52 }, () => Math.floor(Math.random() * 15)) },
    { year: 2025, weeks: Array.from({ length: 52 }, () => Math.floor(Math.random() * 18)) },
    { year: 2026, weeks: Array.from({ length: 26 }, () => Math.floor(Math.random() * 20)) },
  ],

  projects: [
    {
      name: "rukkit",
      description: "High-performance Minecraft server framework written in Rust with zero-overhead plugin API.",
      stars: 4800,
      downloads: 120000,
      language: "Rust",
      languageColor: "#dea584",
      license: "MIT",
      healthScore: 95,
      contributors: 17,
      started: "2026",
      url: "https://github.com/danu/rukkit",
    },
    {
      name: "netweave",
      description: "Async networking library for Go with built-in TLS, mTLS, and service mesh support.",
      stars: 2100,
      downloads: 340000,
      language: "Go",
      languageColor: "#00add8",
      license: "Apache-2.0",
      healthScore: 91,
      contributors: 8,
      started: "2024",
    },
    {
      name: "vaultsec",
      description: "Zero-trust secrets manager with HSM support, audit logging, and Kubernetes integration.",
      stars: 980,
      language: "Rust",
      languageColor: "#dea584",
      license: "MIT",
      healthScore: 88,
      contributors: 5,
      started: "2025",
    },
    {
      name: "proxyscout",
      description: "Distributed proxy health checker with geographic latency testing and alerting.",
      stars: 340,
      language: "Go",
      languageColor: "#00add8",
      license: "MIT",
      healthScore: 82,
      contributors: 3,
      started: "2023",
    },
  ],

  packages: [
    { name: "netweave", registry: "npm" as const, version: "2.4.1", downloads: 890000 },
    { name: "rukkit-api", registry: "npm" as const, version: "1.0.3", downloads: 210000 },
    { name: "vaultsec-client", registry: "npm" as const, version: "0.9.2", downloads: 45000 },
    { name: "netweave", registry: "pypi" as const, version: "2.4.0", downloads: 340000 },
    { name: "proxyscout", registry: "pypi" as const, version: "1.2.0", downloads: 78000 },
    { name: "danu/netweave", registry: "docker" as const, version: "2.4.1", downloads: 1200000 },
    { name: "danu/vaultsec", registry: "docker" as const, version: "1.0.0", downloads: 320000 },
  ],

  security: {
    score: 94,
    items: [
      { label: "CVE Response", status: "pass" as const, detail: "All CVEs resolved within 48 hours" },
      { label: "Secret Exposure", status: "pass" as const, detail: "No secrets detected in history" },
      { label: "Dependency Audit", status: "pass" as const, detail: "All critical deps up to date" },
      { label: "License Compliance", status: "pass" as const, detail: "Consistent MIT / Apache-2.0" },
      { label: "Supply Chain Score", status: "warn" as const, detail: "2 indirect deps need review" },
      { label: "2FA Enforcement", status: "pass" as const, detail: "Enabled on all linked accounts" },
    ],
  },

  badges: [
    { label: "OSS Maintainer", icon: <StarIcon size={12} />, earned: true },
    { label: "Security Expert", icon: <ShieldIcon size={12} />, earned: true },
    { label: "Rust Expert", icon: <span className="text-[10px] font-bold">Rs</span>, earned: true },
    { label: "1000 Commits", icon: <CheckIcon size={12} />, earned: true },
    { label: "50 Releases", icon: <CheckIcon size={12} />, earned: true },
    { label: "Top Reviewer", icon: <StarIcon size={12} />, earned: true },
    { label: "AI Builder", icon: <span className="text-[10px] font-bold">AI</span>, earned: false },
    { label: "OSS Sponsor", icon: <StarIcon size={12} />, earned: false },
    { label: "Documentation Master", icon: <CheckIcon size={12} />, earned: false },
    { label: "Bug Hunter", icon: <ShieldIcon size={12} />, earned: false },
  ],

  verification: [
    { label: "Email", verified: true, level: "basic" as const, icon: <span className="text-[10px]">@</span> },
    { label: "GitHub", verified: true, level: "basic" as const, icon: <GitHubIcon size={12} /> },
    { label: "GitLab", verified: true, level: "basic" as const, icon: <GitLabIcon size={12} /> },
    { label: "Google", verified: true, level: "basic" as const, icon: <span className="text-[10px] font-bold">G</span> },
    { label: "Domain (DNS)", verified: true, level: "advanced" as const, icon: <span className="text-[10px]">www</span> },
    { label: "SSH Key", verified: true, level: "advanced" as const, icon: <KeyIcon size={12} /> },
    { label: "GPG Key", verified: true, level: "advanced" as const, icon: <KeyIcon size={12} /> },
    { label: "Wallet", verified: false, level: "advanced" as const, icon: <span className="text-[10px]">ETH</span> },
    { label: "Government ID", verified: false, level: "elite" as const, icon: <span className="text-[10px]">ID</span> },
    { label: "Company Email", verified: false, level: "elite" as const, icon: <span className="text-[10px]">Biz</span> },
  ],

  experience: [
    { year: "2019", title: "First Open Source Project", description: "Minecraft plugin with 500+ downloads", type: "project" as const },
    { year: "2020", title: "Discord Bot Framework", description: "Rust-based framework adopted by 200+ servers", type: "project" as const },
    { year: "2021", title: "Security Research", description: "CVE-2021-XXXX responsible disclosure", type: "milestone" as const },
    { year: "2022", title: "Startup — CTO", description: "Co-founded infrastructure tooling startup", type: "company" as const },
    { year: "2023", title: "netweave released", description: "Go networking library, 340K PyPI downloads", type: "project" as const },
    { year: "2024", title: "vaultsec", description: "Zero-trust secrets manager for Kubernetes", type: "project" as const },
    { year: "2025", title: "Conference Speaker", description: "RustConf — \"Zero-overhead plugin systems\"", type: "milestone" as const },
    { year: "2026", title: "rukkit", description: "Rust Minecraft server framework — 120K downloads", type: "project" as const },
  ],

  connectedPlatforms: [
    { icon: <GitHubIcon size={14} />, label: "GitHub", color: "#e8eaf4", handle: "@danu" },
    { icon: <GitLabIcon size={14} />, label: "GitLab", color: "#fc6d26", handle: "@danu" },
    { icon: <NpmIcon size={14} />, label: "npm", color: "#cb3837", handle: "danu" },
    { icon: <DockerIcon size={14} />, label: "Docker", color: "#2496ed", handle: "danu" },
  ],
};

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-sm uppercase tracking-widest" style={{ color: "#8b92a8" }}>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function PassportPage({ params }: { params: Promise<{ username: string }> }) {
  const d = PASSPORT_DATA;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Top nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 glass border-b"
        style={{ borderColor: "#1c2035" }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <PassportLogoIcon size={26} />
            <span className="text-sm font-semibold" style={{ color: "#e8eaf4" }}>
              Digital Passport
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs mono" style={{ color: "#4a506a" }}>
              p.krl.kr/{d.username}
            </span>
            <button
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#8b92a8" }}
            >
              Share
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-20 pb-20">
        <div className="grid lg:grid-cols-[320px,1fr] gap-6 mt-6">

          {/* ── Left sidebar ── */}
          <aside className="flex flex-col gap-4">

            {/* Identity card */}
            <div className="card p-6 flex flex-col items-center gap-4 text-center">
              <div
                className="rounded-2xl flex items-center justify-center text-3xl font-bold"
                style={{
                  width: 80,
                  height: 80,
                  background: "linear-gradient(135deg, #4361ee, #7b2ff7)",
                  color: "#fff",
                }}
              >
                {d.displayName[0]}
              </div>

              <div>
                <h1 className="text-xl font-bold" style={{ color: "#e8eaf4" }}>
                  {d.displayName}
                </h1>
                <p className="text-sm mt-0.5" style={{ color: "#8b92a8" }}>
                  {d.title}
                </p>
                {d.available && (
                  <div
                    className="inline-flex items-center gap-1.5 mt-2 text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "#10b98118", color: "#10b981", border: "1px solid #10b98140" }}
                  >
                    <div className="rounded-full" style={{ width: 5, height: 5, background: "#10b981" }} />
                    {d.availabilityNote}
                  </div>
                )}
              </div>

              <p className="text-sm leading-relaxed" style={{ color: "#8b92a8" }}>
                {d.bio}
              </p>

              <div className="flex flex-col gap-2 w-full text-sm">
                <div className="flex items-center justify-between">
                  <span style={{ color: "#4a506a" }}>Location</span>
                  <span style={{ color: "#e8eaf4" }}>{d.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: "#4a506a" }}>Experience</span>
                  <span style={{ color: "#e8eaf4" }}>{d.experienceYears}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: "#4a506a" }}>Member since</span>
                  <span className="mono" style={{ color: "#e8eaf4" }}>{d.joinedYear}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: "#4a506a" }}>Passport ID</span>
                  <span className="mono text-xs" style={{ color: "#4a506a" }}>{d.passportId}</span>
                </div>
              </div>
            </div>

            {/* Trust Score */}
            <div className="card p-5 flex flex-col items-center gap-3">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#8b92a8" }}>
                  Trust Score
                </span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#4361ee18", color: "#4361ee" }}>
                  AI-computed
                </span>
              </div>
              <TrustScore score={d.trustScore} />
              <p className="text-xs text-center" style={{ color: "#4a506a" }}>
                Based on code quality, security response, community contributions, and project maintenance.
              </p>
            </div>

            {/* Quick stats */}
            <div className="card p-4">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Commits", value: `${(d.stats.commits / 1000).toFixed(1)}K` },
                  { label: "Stars", value: `${(d.stats.stars / 1000).toFixed(1)}K` },
                  { label: "Packages", value: d.stats.packages },
                  { label: "Followers", value: `${(d.stats.followers / 1000).toFixed(1)}K` },
                  { label: "Projects", value: d.stats.projects },
                  { label: "Contributions", value: d.stats.contributions },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-lg p-2 text-center"
                    style={{ background: "#131520" }}
                  >
                    <div className="font-bold mono text-sm" style={{ color: "#e8eaf4" }}>
                      {value}
                    </div>
                    <div className="text-xs" style={{ color: "#4a506a" }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected platforms */}
            <div className="card p-4 flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#8b92a8" }}>
                Connected Platforms
              </span>
              {d.connectedPlatforms.map(({ icon, label, color, handle }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center rounded-lg shrink-0"
                    style={{ width: 28, height: 28, background: "#131520", color }}
                  >
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium" style={{ color: "#e8eaf4" }}>{label}</div>
                    <div className="text-xs mono" style={{ color: "#4a506a" }}>{handle}</div>
                  </div>
                  <CheckIcon size={12} />
                </div>
              ))}
              <button
                className="text-xs py-1.5 rounded-lg mt-1 transition-all"
                style={{ background: "#131520", color: "#4a506a", border: "1px solid #1c2035" }}
              >
                + 18 more connected
              </button>
            </div>

            {/* Identity Verification */}
            <div className="card p-4 flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#8b92a8" }}>
                Identity Verification
              </span>
              <IdentityVerification items={d.verification} />
            </div>

          </aside>

          {/* ── Main content ── */}
          <main className="flex flex-col gap-6">

            {/* Skill Genome */}
            <div className="card p-5 flex flex-col gap-4">
              <Section title="Skill Genome">
                <SkillGenome skills={d.skills} />
              </Section>
            </div>

            {/* Open Source DNA */}
            <div className="card p-5 flex flex-col gap-4">
              <Section title="Open Source DNA">
                <OpenSourceDNA languages={d.languages} />
              </Section>
            </div>

            {/* Contribution Timeline */}
            <div className="card p-5 flex flex-col gap-4">
              <Section title="Contribution Timeline">
                <ContributionTimeline data={d.contributions} />
              </Section>
            </div>

            {/* Experience Graph */}
            <div className="card p-5 flex flex-col gap-4">
              <Section title="Experience Graph">
                <ExperienceGraph entries={d.experience} />
              </Section>
            </div>

            {/* Projects */}
            <div className="card p-5 flex flex-col gap-4">
              <Section
                title="Project Passport"
                action={
                  <span className="text-xs mono" style={{ color: "#4a506a" }}>
                    {d.projects.length} projects
                  </span>
                }
              >
                <div className="grid md:grid-cols-2 gap-3">
                  {d.projects.map((project) => (
                    <ProjectCard key={project.name} {...project} />
                  ))}
                </div>
              </Section>
            </div>

            {/* Packages */}
            <div className="card p-5 flex flex-col gap-4">
              <Section title="Package Portfolio">
                <PackagePortfolio packages={d.packages} />
              </Section>
            </div>

            {/* Security */}
            <div className="card p-5 flex flex-col gap-4">
              <Section title="Security Profile">
                <SecurityProfile items={d.security.items} score={d.security.score} />
              </Section>
            </div>

            {/* Badges */}
            <div className="card p-5 flex flex-col gap-4">
              <Section title="Verified Badges">
                <VerifiedBadges badges={d.badges} />
              </Section>
            </div>

            {/* API block */}
            <div
              className="rounded-xl p-5 flex flex-col gap-3"
              style={{ background: "#0d0f18", border: "1px solid #1c2035" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#8b92a8" }}>
                  Passport API
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ background: "#10b98118", color: "#10b981" }}
                >
                  Public
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {[
                  `GET https://api.p.krl.kr/v1/${d.username}`,
                  `GET https://api.p.krl.kr/v1/${d.username}/trust`,
                  `GET https://api.p.krl.kr/v1/${d.username}/skills`,
                  `GET https://api.p.krl.kr/v1/${d.username}/projects`,
                ].map((endpoint) => (
                  <div
                    key={endpoint}
                    className="rounded px-3 py-2 text-xs mono"
                    style={{ background: "#131520", color: "#4361ee" }}
                  >
                    {endpoint}
                  </div>
                ))}
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
