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
    select: { displayName: true, title: true, bio: true, trustScore: true },
  });
  if (!passport) return { title: "Not Found" };
  return {
    title: `${passport.displayName ?? username} — Digital Passport`,
    description: passport.bio ?? `${passport.displayName ?? username}'s verified developer identity · Trust Score ${passport.trustScore}/1000`,
  };
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  github: <GitHubIcon size={13} />, gitlab: <GitLabIcon size={13} />, npm: <NpmIcon size={13} />,
  docker: <DockerIcon size={13} />, pypi: <PyPIIcon size={13} />, crates: <CratesIcon size={13} />,
  huggingface: <HuggingFaceIcon size={13} />, vercel: <VercelIcon size={13} />,
  cloudflare: <CloudflareIcon size={13} />, stackoverflow: <StackOverflowIcon size={13} />,
  x: <XIcon size={13} />, discord: <DiscordIcon size={13} />,
};

const PLATFORM_COLORS: Record<string, string> = {
  github: "#e8eaf4", gitlab: "#fc6d26", npm: "#cb3837", docker: "#2496ed",
  pypi: "#3775a9", crates: "#dea584", huggingface: "#ff9d00", vercel: "#e8eaf4",
  cloudflare: "#f48120", stackoverflow: "#f58025", x: "#e8eaf4", discord: "#5865f2",
};

const BADGE_ICONS: Record<string, React.ReactNode> = {
  oss_maintainer: <StarIcon size={11} />, security_expert: <ShieldIcon size={11} />,
  top_reviewer: <CheckIcon size={11} />, "1000_commits": <CheckIcon size={11} />,
  "50_releases": <CheckIcon size={11} />, rust_expert: <span className="text-[9px] font-bold">Rs</span>,
  ai_builder: <span className="text-[9px] font-bold">AI</span>,
  oss_sponsor: <StarIcon size={11} />, bug_hunter: <ShieldIcon size={11} />,
  docs_master: <CheckIcon size={11} />,
};

const VERIFICATION_ICONS: Record<string, React.ReactNode> = {
  email: <span className="text-[10px]">@</span>, github: <GitHubIcon size={11} />,
  google: <span className="text-[9px] font-bold">G</span>, domain: <span className="text-[9px]">www</span>,
  ssh_key: <KeyIcon size={11} />, gpg_key: <KeyIcon size={11} />,
  wallet: <span className="text-[9px]">ETH</span>, gov_id: <span className="text-[9px]">ID</span>,
  company_email: <span className="text-[9px]">Biz</span>, school_email: <span className="text-[9px]">Edu</span>,
};

function trustLevel(score: number) {
  if (score >= 950) return { label: "Diamond", color: "#67e8f9", bg: "#67e8f912", glow: "#67e8f9" };
  if (score >= 800) return { label: "Platinum", color: "#a78bfa", bg: "#a78bfa12", glow: "#a78bfa" };
  if (score >= 650) return { label: "Gold", color: "#f0b429", bg: "#f0b42912", glow: "#f0b429" };
  if (score >= 500) return { label: "Silver", color: "#94a3b8", bg: "#94a3b812", glow: "#94a3b8" };
  if (score >= 300) return { label: "Bronze", color: "#cd7f32", bg: "#cd7f3212", glow: "#cd7f32" };
  return { label: "Starter", color: "#8b92a8", bg: "#8b92a812", glow: "#8b92a8" };
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function Section({ title, children, badge }: { title: string; children: React.ReactNode; badge?: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#4a506a" }}>{title}</h2>
        {badge}
      </div>
      {children}
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 py-2.5 px-3">
      <span className="text-base font-bold mono leading-none" style={{ color: color ?? "#e8eaf4" }}>{value}</span>
      <span className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: "#4a506a" }}>{label}</span>
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
  const meta = githubConn?.metadata as {
    languages?: { name: string; percent: number; color: string }[];
    totalStars?: number; totalForks?: number; followers?: number; publicRepos?: number;
  } | null;

  const languages = meta?.languages ?? [];
  const isOwner = !!(session?.user?.id && passport.userId === session.user.id);
  const contributions = passport.contributionYears.map((cy) => ({ year: cy.year, weeks: cy.weeks as number[] }));
  const totalDownloads = passport.packages.reduce((s, p) => s + p.downloads, 0);
  const totalStars = meta?.totalStars ?? 0;
  const followers = meta?.followers ?? 0;
  const publicRepos = meta?.publicRepos ?? 0;
  const level = trustLevel(passport.trustScore);
  const name = passport.displayName ?? passport.username;
  const joinYear = new Date(passport.createdAt).getFullYear();
  const yearsActive = Math.max(0, new Date().getFullYear() - joinYear);
  const earnedBadges = passport.badges.filter((b) => b.earned).length;
  const verifiedCount = passport.verifications.filter((v) => v.verified).length;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>

      {/* ── Sticky nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b" style={{ borderColor: "#1c2035" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <PassportLogoIcon size={24} />
            <span className="font-bold text-sm hidden sm:block" style={{ color: "#e8eaf4" }}>Digital Passport</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs mono hidden md:block" style={{ color: "#4a506a" }}>p.krl.kr/{passport.username}</span>
            {isOwner && (
              <Link href="/dashboard" className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: "#4361ee", color: "#fff" }}>
                Edit passport
              </Link>
            )}
            {!isOwner && passport.available && (
              <a href={passport.website ?? "#"} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: "#10b981", color: "#fff" }}>
                Hire me
              </a>
            )}
            <Link href={`/${passport.username}/print`} className="text-xs px-3 py-1.5 rounded-lg hidden sm:block" style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#8b92a8" }}>
              PDF
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <div className="mt-4 flex flex-col gap-3">

          {/* ── HERO CARD ── */}
          <div className="card overflow-hidden">
            <div style={{ height: 2, background: `linear-gradient(90deg, ${level.color}, #4361ee, #7b2ff7)` }} />

            <div className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-5">

                {/* Avatar + level */}
                <div className="shrink-0 flex sm:flex-col items-center gap-3">
                  {passport.avatarUrl ? (
                    <img src={passport.avatarUrl} alt={name} className="rounded-xl object-cover" style={{ width: 80, height: 80 }} />
                  ) : (
                    <div className="rounded-xl flex items-center justify-center text-3xl font-black" style={{ width: 80, height: 80, background: "linear-gradient(135deg,#4361ee,#7b2ff7)", color: "#fff" }}>
                      {name[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: level.bg, color: level.color, border: `1px solid ${level.color}25` }}>
                    {level.label}
                  </span>
                </div>

                {/* Identity block */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold leading-tight" style={{ color: "#e8eaf4" }}>{name}</h1>
                    {passport.available && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "#10b98112", color: "#10b981", border: "1px solid #10b98125" }}>
                        <span className="rounded-full animate-pulse shrink-0" style={{ width: 4, height: 4, background: "#10b981", display: "inline-block" }} />
                        {passport.availabilityNote ?? "Open to work"}
                      </span>
                    )}
                  </div>

                  {passport.title && (
                    <p className="text-sm mb-2" style={{ color: "#8b92a8" }}>{passport.title}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] mb-2.5" style={{ color: "#4a506a" }}>
                    {passport.location && (
                      <span className="flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {passport.location}
                      </span>
                    )}
                    {passport.website && (
                      <a href={passport.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline" style={{ color: "#4361ee" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                        {passport.website.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                    {passport.twitterHandle && (
                      <a href={`https://x.com/${passport.twitterHandle.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline" style={{ color: "#8b92a8" }}>
                        <XIcon size={10} />
                        {passport.twitterHandle}
                      </a>
                    )}
                    {yearsActive > 0 && <span>{yearsActive}y active</span>}
                  </div>

                  {passport.bio && (
                    <p className="text-xs leading-relaxed mb-3" style={{ color: "#8b92a8", maxWidth: 480 }}>{passport.bio}</p>
                  )}

                  {passport.connections.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {passport.connections.map((c) => (
                        <span key={c.platform} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]" style={{ background: "#131520", border: "1px solid #1c2035" }}>
                          <span style={{ color: PLATFORM_COLORS[c.platform] ?? "#8b92a8" }}>{PLATFORM_ICONS[c.platform] ?? c.platform[0].toUpperCase()}</span>
                          <span className="mono" style={{ color: "#8b92a8" }}>{c.handle}</span>
                          {c.verified && <span style={{ color: "#10b981" }}><CheckIcon size={8} /></span>}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Trust Score */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <TrustScore score={passport.trustScore} />
                  <span className="text-xs mono font-bold" style={{ color: "#e8eaf4" }}>{passport.trustScore}<span style={{ color: "#4a506a" }}>/1000</span></span>
                </div>
              </div>

              {/* Stats ribbon */}
              {(totalStars > 0 || followers > 0 || totalDownloads > 0 || passport.packages.length > 0 || publicRepos > 0) && (
                <div className="flex flex-wrap mt-4 pt-4 divide-x" style={{ borderTop: "1px solid #1c2035", borderColor: "#1c2035" }}>
                  {totalStars > 0 && <StatBox label="Stars" value={fmt(totalStars)} color="#f0b429" />}
                  {followers > 0 && <StatBox label="Followers" value={fmt(followers)} color="#4361ee" />}
                  {totalDownloads > 0 && <StatBox label="Downloads" value={fmt(totalDownloads)} color="#10b981" />}
                  {passport.packages.length > 0 && <StatBox label="Packages" value={passport.packages.length} color="#7b2ff7" />}
                  {publicRepos > 0 && <StatBox label="Repos" value={publicRepos} />}
                  {earnedBadges > 0 && <StatBox label="Badges" value={earnedBadges} color="#f59e0b" />}
                  {verifiedCount > 0 && <StatBox label="Verified" value={verifiedCount} color="#10b981" />}
                  {yearsActive > 0 && <StatBox label="Years" value={`${yearsActive}y`} />}
                </div>
              )}
            </div>
          </div>

          {/* Passport doc strip */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-[10px] mono" style={{ color: "#4a506a" }}>
            <span>DGTL PASSPORT</span>
            <span style={{ color: "#1c2035" }}>·</span>
            <span>{passport.passportNumber.slice(0, 12).toUpperCase()}</span>
            <span style={{ color: "#1c2035" }}>·</span>
            <span>ISSUED {new Date(passport.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short" }).toUpperCase()}</span>
            {passport.lastSyncedAt && <><span style={{ color: "#1c2035" }}>·</span><span>SYNCED {new Date(passport.lastSyncedAt).toLocaleDateString()}</span></>}
            <span style={{ color: "#1c2035" }}>·</span>
            <span style={{ color: "#10b981" }}>ACTIVE</span>
          </div>

          {/* ── 2-column body ── */}
          <div className="grid lg:grid-cols-[280px_1fr] gap-4">

            {/* ── SIDEBAR ── */}
            <aside className="flex flex-col gap-3">

              {/* Passport document card */}
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <PassportLogoIcon size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#4a506a" }}>Digital Passport</span>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Holder", value: passport.username },
                    { label: "Doc No", value: passport.passportNumber.slice(0, 10) },
                    { label: "Issued", value: new Date(passport.createdAt).toLocaleDateString() },
                    { label: "Status", value: "Active", valueColor: "#10b981" },
                    { label: "Level", value: level.label, valueColor: level.color },
                    { label: "Verifications", value: `${verifiedCount} confirmed` },
                  ].map(({ label, value, valueColor }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-[11px]" style={{ color: "#4a506a" }}>{label}</span>
                      <span className="text-[11px] mono" style={{ color: valueColor ?? "#8b92a8" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Genome */}
              {passport.skills.length > 0 && (
                <div className="card p-4">
                  <Section title="Skill Genome">
                    <SkillGenome skills={passport.skills.map((s) => ({ ...s, color: s.color ?? undefined, category: s.category ?? undefined }))} />
                  </Section>
                </div>
              )}

              {/* Verified Badges */}
              {passport.badges.length > 0 && (
                <div className="card p-4">
                  <Section title="Badges" badge={
                    earnedBadges > 0
                      ? <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#f0b42915", color: "#f0b429" }}>{earnedBadges} earned</span>
                      : undefined
                  }>
                    <VerifiedBadges badges={passport.badges.map((b) => ({
                      label: b.label,
                      icon: BADGE_ICONS[b.type] ?? <CheckIcon size={11} />,
                      earned: b.earned,
                    }))} />
                  </Section>
                </div>
              )}

              {/* Identity Verification */}
              {passport.verifications.length > 0 && (
                <div className="card p-4">
                  <Section title="Identity" badge={
                    verifiedCount > 0
                      ? <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "#10b98115", color: "#10b981" }}>{verifiedCount} verified</span>
                      : undefined
                  }>
                    <IdentityVerification items={passport.verifications.map((v) => ({
                      label: v.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
                      verified: v.verified,
                      level: v.level as "basic" | "advanced" | "elite",
                      icon: VERIFICATION_ICONS[v.type] ?? <span className="text-[10px]">{v.type[0].toUpperCase()}</span>,
                    }))} />
                  </Section>
                </div>
              )}

              {/* Developer Visas */}
              {passport.visasReceived.length > 0 && (
                <div className="card p-4">
                  <Section title="Developer Visas">
                    <div className="flex flex-col gap-2">
                      {passport.visasReceived.map((visa) => (
                        <div key={visa.id} className="rounded-lg p-3 flex flex-col gap-1" style={{ background: "#131520", border: "1px solid #f0b42920" }}>
                          <div className="flex items-center gap-1.5">
                            <div className="rounded-full shrink-0" style={{ width: 5, height: 5, background: "#f0b429" }} />
                            <span className="text-[10px] font-semibold" style={{ color: "#f0b429" }}>{visa.organization.name}</span>
                            {visa.organization.verified && <CheckIcon size={9} />}
                          </div>
                          <span className="text-xs font-medium" style={{ color: "#e8eaf4" }}>{visa.title}</span>
                          {visa.description && <span className="text-[10px]" style={{ color: "#4a506a" }}>{visa.description}</span>}
                          <span className="text-[10px]" style={{ color: "#4a506a" }}>Issued {new Date(visa.issuedAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </Section>
                </div>
              )}
            </aside>

            {/* ── MAIN ── */}
            <main className="flex flex-col gap-3">

              {/* Contribution Timeline */}
              {contributions.length > 0 && (
                <div className="card p-4">
                  <Section title="Contribution Timeline">
                    <ContributionTimeline data={contributions} />
                  </Section>
                </div>
              )}

              {/* Open Source DNA */}
              {languages.length > 0 && (
                <div className="card p-4">
                  <Section title="Open Source DNA">
                    <OpenSourceDNA languages={languages} />
                  </Section>
                </div>
              )}

              {/* Featured Projects */}
              {passport.projects.length > 0 && (
                <div className="card p-4">
                  <Section title="Projects" badge={
                    <span className="text-[10px] mono" style={{ color: "#4a506a" }}>{passport.projects.length} featured</span>
                  }>
                    <div className="grid md:grid-cols-2 gap-2.5">
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

              {/* Package Portfolio */}
              {passport.packages.length > 0 && (
                <div className="card p-4">
                  <Section title="Packages" badge={
                    totalDownloads > 0
                      ? <span className="text-[10px] mono px-1.5 py-0.5 rounded" style={{ background: "#10b98115", color: "#10b981" }}>{fmt(totalDownloads)} dl</span>
                      : undefined
                  }>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(["npm", "pypi", "crates", "docker", "maven", "gem", "other"] as const).map((reg) => {
                        const count = passport.packages.filter((p) => p.registry === reg).length;
                        if (!count) return null;
                        const dl = passport.packages.filter((p) => p.registry === reg).reduce((s, p) => s + p.downloads, 0);
                        return (
                          <div key={reg} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]" style={{ background: "#131520", border: "1px solid #1c2035" }}>
                            <span style={{ color: "#8b92a8" }}>{reg}</span>
                            <span className="mono" style={{ color: "#4a506a" }}>{count}</span>
                            {dl > 0 && <span style={{ color: "#10b981" }}>· {fmt(dl)}</span>}
                          </div>
                        );
                      })}
                    </div>
                    <PackagePortfolio packages={passport.packages.map((p) => ({
                      name: p.name,
                      registry: p.registry as "npm" | "pypi" | "docker" | "crates",
                      version: p.version ?? "",
                      downloads: p.downloads,
                    }))} />
                  </Section>
                </div>
              )}

              {/* Experience */}
              {passport.experiences.length > 0 && (
                <div className="card p-4">
                  <Section title="Experience">
                    <ExperienceGraph entries={passport.experiences.map((e) => ({
                      year: e.year, title: e.title,
                      description: e.description ?? undefined,
                      type: e.type as "project" | "company" | "milestone" | "education",
                    }))} />
                  </Section>
                </div>
              )}

              {/* Security Profile */}
              {passport.securityChecks.length > 0 && (
                <div className="card p-4">
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

            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Team Passport ────────────────────────────────────────────────────────────

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
