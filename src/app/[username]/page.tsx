import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { auth } from "@/auth";
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
import {
  PassportLogoIcon, GitHubIcon, GitLabIcon, NpmIcon, DockerIcon,
  PyPIIcon, HuggingFaceIcon, VercelIcon, CloudflareIcon, StackOverflowIcon,
  XIcon, DiscordIcon, CratesIcon, ShieldIcon, StarIcon, CheckIcon, KeyIcon,
} from "@/components/icons/PlatformIcons";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const passport = await db.passport.findUnique({
    where: { username: username.toLowerCase() },
    select: { displayName: true, title: true, bio: true },
  });
  if (!passport) return { title: "Not Found" };
  return {
    title: `${passport.displayName ?? username} — Digital Passport`,
    description: passport.bio ?? `${passport.displayName ?? username}'s verified developer passport`,
  };
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  github: <GitHubIcon size={14} />,
  gitlab: <GitLabIcon size={14} />,
  npm: <NpmIcon size={14} />,
  docker: <DockerIcon size={14} />,
  pypi: <PyPIIcon size={14} />,
  crates: <CratesIcon size={14} />,
  huggingface: <HuggingFaceIcon size={14} />,
  vercel: <VercelIcon size={14} />,
  cloudflare: <CloudflareIcon size={14} />,
  stackoverflow: <StackOverflowIcon size={14} />,
  x: <XIcon size={14} />,
  discord: <DiscordIcon size={14} />,
};

const PLATFORM_COLORS: Record<string, string> = {
  github: "#e8eaf4", gitlab: "#fc6d26", npm: "#cb3837", docker: "#2496ed",
  pypi: "#3775a9", crates: "#dea584", huggingface: "#ff9d00", vercel: "#e8eaf4",
  cloudflare: "#f48120", stackoverflow: "#f58025", x: "#e8eaf4", discord: "#5865f2",
};

const BADGE_ICONS: Record<string, React.ReactNode> = {
  oss_maintainer: <StarIcon size={12} />,
  security_expert: <ShieldIcon size={12} />,
  top_reviewer: <CheckIcon size={12} />,
  "1000_commits": <CheckIcon size={12} />,
  "50_releases": <CheckIcon size={12} />,
  rust_expert: <span className="text-[10px] font-bold">Rs</span>,
  ai_builder: <span className="text-[10px] font-bold">AI</span>,
  oss_sponsor: <StarIcon size={12} />,
  bug_hunter: <ShieldIcon size={12} />,
  docs_master: <CheckIcon size={12} />,
};

const VERIFICATION_ICONS: Record<string, React.ReactNode> = {
  email: <span className="text-[10px]">@</span>,
  github: <GitHubIcon size={12} />,
  google: <span className="text-[10px] font-bold">G</span>,
  domain: <span className="text-[10px]">www</span>,
  ssh_key: <KeyIcon size={12} />,
  gpg_key: <KeyIcon size={12} />,
  wallet: <span className="text-[10px]">ETH</span>,
  gov_id: <span className="text-[10px]">ID</span>,
  company_email: <span className="text-[10px]">Biz</span>,
  school_email: <span className="text-[10px]">Edu</span>,
};

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-xs uppercase tracking-widest" style={{ color: "#8b92a8" }}>{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

export default async function PassportPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const session = await auth();

  const passport = await db.passport.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      connections: { where: { public: true }, orderBy: { platform: "asc" } },
      projects: { where: { featured: true }, orderBy: { stars: "desc" }, take: 6 },
      packages: { orderBy: { downloads: "desc" } },
      skills: { orderBy: { score: "desc" } },
      badges: { orderBy: [{ earned: "desc" }, { label: "asc" }] },
      verifications: true,
      experiences: { orderBy: [{ year: "asc" }, { order: "asc" }] },
      securityChecks: true,
      contributionYears: { orderBy: { year: "asc" } },
      visasReceived: {
        where: { active: true },
        include: { organization: { select: { name: true, slug: true, logoUrl: true, verified: true } } },
        orderBy: { issuedAt: "desc" },
      },
    },
  });

  // Check if this slug is a team org instead of a user passport
  if (!passport) {
    const org = await db.organization.findUnique({
      where: { slug: username.toLowerCase() },
      include: {
        teamPassport: {
          include: {
            members: {
              include: {
                passport: {
                  select: { username: true, displayName: true, title: true, trustScore: true, skills: { orderBy: { score: "desc" }, take: 3 } },
                },
              },
            },
          },
        },
      },
    });
    if (!org) notFound();
    return <TeamPassportPage org={org} />;
  }

  const githubConn = passport.connections.find((c) => c.platform === "github");
  const meta = githubConn?.metadata as { languages?: { name: string; percent: number; color: string }[]; totalStars?: number; totalForks?: number; followers?: number; publicRepos?: number } | null;
  const languages = meta?.languages ?? [];
  const isOwner = session?.user?.id && passport.userId === session.user.id;

  const contributions = passport.contributionYears.map((cy) => ({
    year: cy.year,
    weeks: cy.weeks as number[],
  }));

  const stats = {
    projects: passport.projects.length,
    packages: passport.packages.length,
    stars: meta?.totalStars ?? 0,
    followers: meta?.followers ?? 0,
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b" style={{ borderColor: "#1c2035" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <PassportLogoIcon size={26} />
            <span className="font-semibold text-sm hidden sm:block" style={{ color: "#e8eaf4" }}>Digital Passport</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs mono" style={{ color: "#4a506a" }}>p.krl.kr/{passport.username}</span>
            {isOwner ? (
              <Link href="/dashboard" className="text-xs px-3 py-1.5 rounded-lg" style={{ background: "#4361ee", color: "#fff" }}>
                Edit passport
              </Link>
            ) : (
              <Link href={`/${passport.username}/print`} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#8b92a8" }}>
                Print / PDF
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-20 pb-20">
        <div className="grid lg:grid-cols-[320px,1fr] gap-6 mt-6">

          {/* ── Left sidebar ── */}
          <aside className="flex flex-col gap-4">

            {/* Identity */}
            <div className="card p-6 flex flex-col items-center gap-4 text-center">
              <div className="rounded-2xl flex items-center justify-center text-3xl font-bold"
                style={{ width: 80, height: 80, background: "linear-gradient(135deg,#4361ee,#7b2ff7)", color: "#fff" }}>
                {(passport.displayName ?? passport.username)[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: "#e8eaf4" }}>{passport.displayName ?? passport.username}</h1>
                {passport.title && <p className="text-sm mt-0.5" style={{ color: "#8b92a8" }}>{passport.title}</p>}
                {passport.available && (
                  <div className="inline-flex items-center gap-1.5 mt-2 text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "#10b98118", color: "#10b981", border: "1px solid #10b98140" }}>
                    <div className="rounded-full" style={{ width: 5, height: 5, background: "#10b981" }} />
                    {passport.availabilityNote ?? "Open to opportunities"}
                  </div>
                )}
              </div>
              {passport.bio && <p className="text-sm leading-relaxed" style={{ color: "#8b92a8" }}>{passport.bio}</p>}

              <div className="flex flex-col gap-2 w-full text-sm">
                {passport.location && (
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#4a506a" }}>Location</span>
                    <span style={{ color: "#e8eaf4" }}>{passport.location}</span>
                  </div>
                )}
                {passport.website && (
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#4a506a" }}>Website</span>
                    <a href={passport.website} target="_blank" rel="noopener noreferrer" className="text-sm truncate max-w-[160px] hover:underline" style={{ color: "#4361ee" }}>{passport.website.replace(/^https?:\/\//, "")}</a>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span style={{ color: "#4a506a" }}>Passport ID</span>
                  <span className="mono text-xs" style={{ color: "#4a506a" }}>{passport.passportNumber.slice(0, 12)}</span>
                </div>
                {passport.lastSyncedAt && (
                  <div className="flex items-center justify-between">
                    <span style={{ color: "#4a506a" }}>Last synced</span>
                    <span className="text-xs" style={{ color: "#4a506a" }}>{new Date(passport.lastSyncedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Social links */}
              {passport.twitterHandle && (
                <a href={`https://x.com/${passport.twitterHandle.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs" style={{ color: "#8b92a8" }}>
                  <XIcon size={12} />
                  {passport.twitterHandle}
                </a>
              )}
            </div>

            {/* Trust Score */}
            <div className="card p-5 flex flex-col items-center gap-3">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#8b92a8" }}>Trust Score</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#4361ee18", color: "#4361ee" }}>AI-computed</span>
              </div>
              <TrustScore score={passport.trustScore} />
              <p className="text-xs text-center" style={{ color: "#4a506a" }}>
                Based on code quality, security response, contributions, and maintenance.
              </p>
            </div>

            {/* Stats */}
            {(stats.stars > 0 || stats.followers > 0) && (
              <div className="card p-4">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Stars", value: stats.stars > 0 ? (stats.stars >= 1000 ? `${(stats.stars/1000).toFixed(1)}K` : String(stats.stars)) : null },
                    { label: "Followers", value: stats.followers > 0 ? (stats.followers >= 1000 ? `${(stats.followers/1000).toFixed(1)}K` : String(stats.followers)) : null },
                    { label: "Packages", value: stats.packages > 0 ? String(stats.packages) : null },
                  ].filter((s) => s.value !== null).map(({ label, value }) => (
                    <div key={label} className="rounded-lg p-2 text-center" style={{ background: "#131520" }}>
                      <div className="font-bold mono text-sm" style={{ color: "#e8eaf4" }}>{value}</div>
                      <div className="text-xs" style={{ color: "#4a506a" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connected platforms */}
            {passport.connections.length > 0 && (
              <div className="card p-4 flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#8b92a8" }}>Connected</span>
                {passport.connections.map((c) => (
                  <div key={c.platform} className="flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-lg shrink-0"
                      style={{ width: 28, height: 28, background: "#131520", color: PLATFORM_COLORS[c.platform] ?? "#8b92a8" }}>
                      {PLATFORM_ICONS[c.platform] ?? <span className="text-xs">{c.platform[0].toUpperCase()}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium capitalize" style={{ color: "#e8eaf4" }}>{c.platform}</div>
                      <div className="text-xs mono truncate" style={{ color: "#4a506a" }}>{c.handle}</div>
                    </div>
                    {c.verified && <CheckIcon size={12} />}
                  </div>
                ))}
              </div>
            )}

            {/* Identity Verification */}
            {passport.verifications.length > 0 && (
              <div className="card p-4 flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#8b92a8" }}>Identity Verification</span>
                <IdentityVerification items={passport.verifications.map((v) => ({
                  label: v.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
                  verified: v.verified,
                  level: v.level as "basic" | "advanced" | "elite",
                  icon: VERIFICATION_ICONS[v.type] ?? <span className="text-[10px]">{v.type[0].toUpperCase()}</span>,
                }))} />
              </div>
            )}

            {/* Developer Visas */}
            {passport.visasReceived.length > 0 && (
              <div className="card p-4 flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#8b92a8" }}>Developer Visas</span>
                {passport.visasReceived.map((visa) => (
                  <div key={visa.id} className="rounded-lg p-3 flex flex-col gap-1"
                    style={{ background: "#131520", border: "1px solid #f0b42930" }}>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full" style={{ width: 6, height: 6, background: "#f0b429" }} />
                      <span className="text-xs font-semibold" style={{ color: "#f0b429" }}>{visa.organization.name}</span>
                      {visa.organization.verified && (
                        <CheckIcon size={10} />
                      )}
                    </div>
                    <span className="text-sm" style={{ color: "#e8eaf4" }}>{visa.title}</span>
                    {visa.description && <span className="text-xs" style={{ color: "#4a506a" }}>{visa.description}</span>}
                    <span className="text-xs" style={{ color: "#4a506a" }}>Issued {new Date(visa.issuedAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}

          </aside>

          {/* ── Main content ── */}
          <main className="flex flex-col gap-6">

            {/* Skill Genome */}
            {passport.skills.length > 0 && (
              <div className="card p-5">
                <Section title="Skill Genome">
                  <SkillGenome skills={passport.skills.map((s) => ({ ...s, color: s.color ?? undefined, category: s.category ?? undefined }))} />
                </Section>
              </div>
            )}

            {/* Open Source DNA */}
            {languages.length > 0 && (
              <div className="card p-5">
                <Section title="Open Source DNA">
                  <OpenSourceDNA languages={languages} />
                </Section>
              </div>
            )}

            {/* Contribution Timeline */}
            {contributions.length > 0 && (
              <div className="card p-5">
                <Section title="Contribution Timeline">
                  <ContributionTimeline data={contributions} />
                </Section>
              </div>
            )}

            {/* Experience */}
            {passport.experiences.length > 0 && (
              <div className="card p-5">
                <Section title="Experience Graph">
                  <ExperienceGraph entries={passport.experiences.map((e) => ({
                    year: e.year,
                    title: e.title,
                    description: e.description ?? undefined,
                    type: e.type as "project" | "company" | "milestone" | "education",
                  }))} />
                </Section>
              </div>
            )}

            {/* Projects */}
            {passport.projects.length > 0 && (
              <div className="card p-5">
                <Section title="Project Passport" action={
                  <span className="text-xs mono" style={{ color: "#4a506a" }}>{passport.projects.length} featured</span>
                }>
                  <div className="grid md:grid-cols-2 gap-3">
                    {passport.projects.map((p) => (
                      <ProjectCard
                        key={p.id}
                        name={p.fullName ?? p.name}
                        description={p.description ?? ""}
                        stars={p.stars}
                        downloads={p.downloads ?? undefined}
                        language={p.language ?? "Unknown"}
                        languageColor={p.languageColor ?? "#8b92a8"}
                        license={p.license ?? undefined}
                        healthScore={p.healthScore}
                        contributors={p.contributors}
                        started={p.startedAt ?? ""}
                        url={p.url ?? undefined}
                      />
                    ))}
                  </div>
                </Section>
              </div>
            )}

            {/* Packages */}
            {passport.packages.length > 0 && (
              <div className="card p-5">
                <Section title="Package Portfolio">
                  <PackagePortfolio packages={passport.packages.map((p) => ({
                    name: p.name,
                    registry: p.registry as "npm" | "pypi" | "docker" | "crates",
                    version: p.version ?? "",
                    downloads: p.downloads,
                  }))} />
                </Section>
              </div>
            )}

            {/* Security */}
            {passport.securityChecks.length > 0 && (
              <div className="card p-5">
                <Section title="Security Profile">
                  <SecurityProfile
                    items={passport.securityChecks.map((c) => ({
                      label: c.label,
                      status: c.status as "pass" | "warn" | "fail" | "unknown",
                      detail: c.detail ?? undefined,
                    }))}
                    score={passport.securityScore}
                  />
                </Section>
              </div>
            )}

            {/* Badges */}
            {passport.badges.length > 0 && (
              <div className="card p-5">
                <Section title="Verified Badges">
                  <VerifiedBadges badges={passport.badges.map((b) => ({
                    label: b.label,
                    icon: BADGE_ICONS[b.type] ?? <CheckIcon size={12} />,
                    earned: b.earned,
                  }))} />
                </Section>
              </div>
            )}

            {/* API block */}
            <div className="rounded-xl p-5 flex flex-col gap-3" style={{ background: "#0d0f18", border: "1px solid #1c2035" }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#8b92a8" }}>Passport API</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#10b98118", color: "#10b981" }}>Public</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {[
                  `GET https://api.p.krl.kr/v1/${passport.username}`,
                  `GET https://api.p.krl.kr/v1/${passport.username}/trust`,
                  `GET https://api.p.krl.kr/v1/${passport.username}/skills`,
                  `GET https://api.p.krl.kr/v1/${passport.username}/projects`,
                ].map((ep) => (
                  <div key={ep} className="rounded px-3 py-2 text-xs mono" style={{ background: "#131520", color: "#4361ee" }}>{ep}</div>
                ))}
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

// ── Team Passport (renders when slug matches an org, not a user) ─────────────

type OrgWithTeam = Awaited<ReturnType<typeof db.organization.findUnique>> & {
  teamPassport: {
    name: string; description: string | null; trustScore: number; velocity: number; healthScore: number;
    members: {
      role: string;
      passport: { username: string; displayName: string | null; title: string | null; trustScore: number; skills: { name: string; score: number; color: string | null }[] };
    }[];
  } | null;
};

function TeamPassportPage({ org }: { org: OrgWithTeam }) {
  const tp = org.teamPassport;
  const avgTrust = tp && tp.members.length > 0
    ? Math.round(tp.members.reduce((s, m) => s + m.passport.trustScore, 0) / tp.members.length)
    : 0;
  const displayTrust = tp?.trustScore || avgTrust;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b" style={{ borderColor: "#1c2035" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <PassportLogoIcon size={26} />
            <span className="font-semibold text-sm hidden sm:block" style={{ color: "#e8eaf4" }}>Digital Passport</span>
          </Link>
          <span className="text-xs mono" style={{ color: "#4a506a" }}>p.krl.kr/{org.slug} · Team</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        {/* Team header */}
        <div className="card p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="rounded-2xl flex items-center justify-center text-3xl font-bold shrink-0"
              style={{ width: 72, height: 72, background: "linear-gradient(135deg,#4361ee,#10b981)", color: "#fff" }}>
              {org.name[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold" style={{ color: "#e8eaf4" }}>{org.name}</h1>
                {org.verified && <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#10b98118", color: "#10b981" }}>Verified Org</span>}
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#4361ee18", color: "#4361ee" }}>Team Passport</span>
              </div>
              {org.description && <p className="text-sm mb-4" style={{ color: "#8b92a8" }}>{org.description}</p>}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold mono" style={{ color: "#4361ee" }}>{displayTrust}</div>
                  <div className="text-xs" style={{ color: "#4a506a" }}>Avg Trust</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mono" style={{ color: "#10b981" }}>{tp?.members.length ?? 0}</div>
                  <div className="text-xs" style={{ color: "#4a506a" }}>Members</div>
                </div>
                {tp?.healthScore != null && tp.healthScore > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold mono" style={{ color: "#f59e0b" }}>{tp.healthScore}</div>
                    <div className="text-xs" style={{ color: "#4a506a" }}>Health</div>
                  </div>
                )}
                {org.website && (
                  <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: "#4361ee" }}>
                    {org.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Members grid */}
        {tp && tp.members.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#8b92a8" }}>
              Team Members ({tp.members.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tp.members.map((m) => (
                <Link key={m.passport.username} href={`/${m.passport.username}`} className="card p-4 flex flex-col gap-3 hover:border-[#4361ee44] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ width: 36, height: 36, background: "linear-gradient(135deg,#4361ee,#7b2ff7)", color: "#fff" }}>
                      {(m.passport.displayName ?? m.passport.username)[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm" style={{ color: "#e8eaf4" }}>{m.passport.displayName ?? m.passport.username}</div>
                      {m.passport.title && <div className="text-xs" style={{ color: "#4a506a" }}>{m.passport.title}</div>}
                    </div>
                    <div className="ml-auto">
                      <span className="text-xs px-1.5 py-0.5 rounded capitalize" style={{ background: "#4361ee18", color: "#4361ee" }}>{m.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5 flex-wrap">
                      {m.passport.skills.slice(0, 3).map((s) => (
                        <span key={s.name} className="text-xs px-2 py-0.5 rounded" style={{ background: `${s.color ?? "#4361ee"}18`, color: s.color ?? "#4361ee" }}>{s.name}</span>
                      ))}
                    </div>
                    <span className="text-xs mono font-semibold" style={{ color: "#4361ee" }}>{m.passport.trustScore}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {!tp && (
          <div className="card p-12 text-center">
            <p style={{ color: "#4a506a" }}>This organization has no Team Passport yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
