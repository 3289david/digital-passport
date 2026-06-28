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

// ── Constants ──────────────────────────────────────────────────────────────────

const G = "#c9a84c"; // passport gold

const PLATFORM_ICONS_SM: Record<string, React.ReactNode> = {
  github: <GitHubIcon size={11} />, gitlab: <GitLabIcon size={11} />, npm: <NpmIcon size={11} />,
  docker: <DockerIcon size={11} />, pypi: <PyPIIcon size={11} />, crates: <CratesIcon size={11} />,
  huggingface: <HuggingFaceIcon size={11} />, vercel: <VercelIcon size={11} />,
  cloudflare: <CloudflareIcon size={11} />, stackoverflow: <StackOverflowIcon size={11} />,
  x: <XIcon size={11} />, discord: <DiscordIcon size={11} />,
};

const PLATFORM_ICONS_LG: Record<string, React.ReactNode> = {
  github: <GitHubIcon size={18} />, gitlab: <GitLabIcon size={18} />, npm: <NpmIcon size={18} />,
  docker: <DockerIcon size={18} />, pypi: <PyPIIcon size={18} />, crates: <CratesIcon size={18} />,
  huggingface: <HuggingFaceIcon size={18} />, vercel: <VercelIcon size={18} />,
  cloudflare: <CloudflareIcon size={18} />, stackoverflow: <StackOverflowIcon size={18} />,
  x: <XIcon size={18} />, discord: <DiscordIcon size={18} />,
};

const PLATFORM_COLORS: Record<string, string> = {
  github: "#e8eaf4", gitlab: "#fc6d26", npm: "#cb3837", docker: "#2496ed",
  pypi: "#3775a9", crates: "#dea584", huggingface: "#ff9d00", vercel: "#e8eaf4",
  cloudflare: "#f48120", stackoverflow: "#f58025", x: "#e8eaf4", discord: "#5865f2",
};

const BADGE_ICONS: Record<string, React.ReactNode> = {
  oss_maintainer: <StarIcon size={10} />, security_expert: <ShieldIcon size={10} />,
  top_reviewer: <CheckIcon size={10} />, "1000_commits": <CheckIcon size={10} />,
  "50_releases": <CheckIcon size={10} />, rust_expert: <span style={{ fontSize: 8, fontWeight: 900 }}>Rs</span>,
  ai_builder: <span style={{ fontSize: 8, fontWeight: 900 }}>AI</span>,
  oss_sponsor: <StarIcon size={10} />, bug_hunter: <ShieldIcon size={10} />,
  docs_master: <CheckIcon size={10} />,
};

const VERIFICATION_ICONS: Record<string, React.ReactNode> = {
  email: <span style={{ fontSize: 9 }}>@</span>, github: <GitHubIcon size={10} />,
  google: <span style={{ fontSize: 8, fontWeight: 700 }}>G</span>, domain: <span style={{ fontSize: 8 }}>www</span>,
  ssh_key: <KeyIcon size={10} />, gpg_key: <KeyIcon size={10} />,
  wallet: <span style={{ fontSize: 8 }}>ETH</span>, gov_id: <span style={{ fontSize: 8 }}>ID</span>,
  company_email: <span style={{ fontSize: 8 }}>Biz</span>, school_email: <span style={{ fontSize: 8 }}>Edu</span>,
};

const STAMP_ROTATIONS = [-12, 7, -5, 14, -9, 6, -14, 10, -3, 11];
const BADGE_ROTATIONS = [-3, 2, -1, 3, -2, 1, -3, 2];

// ── Helpers ────────────────────────────────────────────────────────────────────

function trustLevel(score: number) {
  if (score >= 950) return { label: "DIAMOND", color: "#67e8f9", bg: "#67e8f910" };
  if (score >= 800) return { label: "PLATINUM", color: "#a78bfa", bg: "#a78bfa10" };
  if (score >= 650) return { label: "GOLD", color: G, bg: `${G}10` };
  if (score >= 500) return { label: "SILVER", color: "#94a3b8", bg: "#94a3b810" };
  if (score >= 300) return { label: "BRONZE", color: "#cd7f32", bg: "#cd7f3210" };
  return { label: "STARTER", color: "#8b92a8", bg: "#8b92a810" };
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function mrzLine1(username: string, displayName: string): string {
  const clean = (displayName || username).toUpperCase().replace(/[^A-Z ]/g, "").replace(/ /g, "<");
  return `P<DGTL${clean}`.slice(0, 44).padEnd(44, "<");
}

function mrzLine2(docNum: string, issueDate: Date, trustScore: number): string {
  const doc = docNum.replace(/-/g, "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 9).padEnd(9, "<");
  const yr = issueDate.getFullYear().toString().slice(2);
  const mo = (issueDate.getMonth() + 1).toString().padStart(2, "0");
  const dy = issueDate.getDate().toString().padStart(2, "0");
  const dob = `${yr}${mo}${dy}`;
  const score = trustScore.toString().padStart(4, "0");
  return `${doc}7${dob}3${score}${dob}<<<<<<7`.slice(0, 44);
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function PassportSection({
  title, pageNum, children, badge,
}: {
  title: string; pageNum: string; children: React.ReactNode; badge?: React.ReactNode;
}) {
  return (
    <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #1c2035", background: "#090b13" }}>
      <div style={{
        borderBottom: `1px solid ${G}18`, padding: "6px 16px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: `${G}06`,
      }}>
        <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.3em", color: `${G}70`, fontFamily: "monospace" }}>
          {title}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {badge}
          <span style={{ fontSize: 8, color: "#1c2035", fontFamily: "monospace" }}>{pageNum}</span>
        </div>
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}

function DataField({ label, value, color, large }: { label: string; value: string; color?: string; large?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <span style={{ fontSize: 8, letterSpacing: "0.15em", color: `${G}60`, fontFamily: "monospace", fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: large ? 17 : 12, fontWeight: large ? 800 : 500, color: color ?? "#e8eaf4", letterSpacing: large ? "0.05em" : "0.02em" }}>{value}</span>
    </div>
  );
}

function StatPill({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 14px", gap: 2 }}>
      <span style={{ fontSize: 14, fontWeight: 800, fontFamily: "monospace", color: color ?? "#e8eaf4", lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 8, letterSpacing: "0.15em", color: `${G}55`, fontFamily: "monospace" }}>{label}</span>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

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
  const issueDate = new Date(passport.createdAt);

  return (
    <div style={{ minHeight: "100vh", background: "#07080d" }}>

      {/* ── Slim nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        borderBottom: `1px solid ${G}20`,
        background: "rgba(7,8,13,0.92)", backdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 48, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <PassportLogoIcon size={22} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#e8eaf4", letterSpacing: "0.05em" }}>DIGITAL PASSPORT</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 10, fontFamily: "monospace", color: "#4a506a" }}>p.krl.kr/{passport.username}</span>
            {isOwner && (
              <Link href="/dashboard" style={{ fontSize: 11, padding: "4px 12px", borderRadius: 6, background: "#4361ee", color: "#fff", textDecoration: "none", fontWeight: 600 }}>
                Edit
              </Link>
            )}
            {!isOwner && passport.available && (
              <a href={passport.website ?? "#"} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, padding: "4px 12px", borderRadius: 6, background: "#10b981", color: "#fff", textDecoration: "none", fontWeight: 600 }}>
                Hire me
              </a>
            )}
            <Link href={`/${passport.username}/print`} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, border: "1px solid #1c2035", color: "#8b92a8", textDecoration: "none" }}>
              PDF
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "68px 16px 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* BIO DATA PAGE                                                     */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <div style={{ padding: 4, borderRadius: 14, border: `1px solid ${G}35`, background: `${G}06` }}>
            <div style={{ borderRadius: 10, border: `1px solid ${G}20`, overflow: "hidden", background: "#090b13" }}>

              {/* Passport header bar */}
              <div style={{
                padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
                borderBottom: `1px solid ${G}20`,
                background: `linear-gradient(135deg, ${G}0a 0%, transparent 60%)`,
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.4em", color: G, fontFamily: "monospace" }}>DIGITAL PASSPORT</span>
                  <span style={{ fontSize: 7, letterSpacing: "0.25em", color: `${G}50`, fontFamily: "monospace" }}>REPUBLIC OF OPEN SOURCE</span>
                </div>
                <PassportLogoIcon size={28} />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                  <span style={{ fontSize: 7, letterSpacing: "0.2em", color: `${G}50`, fontFamily: "monospace" }}>TRUST CLASS</span>
                  <span style={{ fontSize: 13, fontWeight: 900, color: level.color, fontFamily: "monospace", letterSpacing: "0.1em" }}>{level.label}</span>
                </div>
              </div>

              {/* Bio data content */}
              <div style={{ padding: "20px", display: "flex", gap: 20, flexWrap: "wrap" }}>

                {/* Photo column */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  {/* Photo with passport-style border */}
                  <div style={{ padding: 3, border: `1px solid ${G}40`, borderRadius: 6 }}>
                    {passport.avatarUrl ? (
                      <img
                        src={passport.avatarUrl} alt={name}
                        style={{ width: 90, height: 110, objectFit: "cover", borderRadius: 4, display: "block" }}
                      />
                    ) : (
                      <div style={{
                        width: 90, height: 110, borderRadius: 4,
                        background: "linear-gradient(135deg,#4361ee,#7b2ff7)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 36, fontWeight: 900, color: "#fff",
                      }}>
                        {name[0].toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Trust seal */}
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%",
                    border: `2px solid ${level.color}40`,
                    background: level.bg,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1,
                  }}>
                    <span style={{ fontSize: 6, letterSpacing: "0.12em", color: level.color, fontFamily: "monospace", fontWeight: 700 }}>TRUST</span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: level.color, fontFamily: "monospace", lineHeight: 1 }}>{passport.trustScore}</span>
                    <span style={{ fontSize: 6, color: `${level.color}70`, fontFamily: "monospace" }}>/1000</span>
                  </div>

                  {/* Availability */}
                  {passport.available && (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", animation: "pulse 2s infinite" }} />
                        <span style={{ fontSize: 8, color: "#10b981", letterSpacing: "0.12em", fontFamily: "monospace", fontWeight: 700 }}>AVAILABLE</span>
                      </div>
                      {passport.availabilityNote && (
                        <span style={{ fontSize: 7, color: "#4a506a", display: "block", marginTop: 2 }}>{passport.availabilityNote}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Data fields */}
                <div style={{ flex: 1, minWidth: 220, display: "flex", flexDirection: "column", gap: 0 }}>

                  <DataField label="SURNAME / NAME OF HOLDER" value={name} large />

                  <div style={{ height: 1, background: `${G}18`, margin: "10px 0" }} />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px" }}>
                    {passport.title && <DataField label="TITLE / DESIGNATION" value={passport.title} />}
                    {passport.location && <DataField label="PLACE OF RESIDENCE" value={passport.location} />}
                    <DataField label="DATE OF ISSUE" value={issueDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()} />
                    <DataField label="DOCUMENT NO." value={passport.passportNumber.slice(0, 12).toUpperCase()} />
                    <DataField label="YEARS ACTIVE" value={yearsActive > 0 ? `${yearsActive} YRS` : "< 1 YR"} />
                    <DataField label="STATUS" value="VALID INDEFINITELY" color="#10b981" />
                  </div>

                  {passport.bio && (
                    <>
                      <div style={{ height: 1, background: `${G}18`, margin: "10px 0" }} />
                      <DataField label="PERSONAL STATEMENT" value={passport.bio} />
                    </>
                  )}

                  {/* Links row */}
                  <div style={{ height: 1, background: `${G}18`, margin: "10px 0" }} />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
                    {passport.website && (
                      <a href={passport.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: "#4361ee", textDecoration: "none", letterSpacing: "0.02em" }}>
                        {passport.website.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                    {passport.twitterHandle && (
                      <a href={`https://x.com/${passport.twitterHandle.replace("@", "")}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: "#8b92a8", textDecoration: "none" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <XIcon size={9} /> {passport.twitterHandle}
                        </span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Trust meter (right column) */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  <TrustScore score={passport.trustScore} />
                  <span style={{ fontSize: 8, letterSpacing: "0.15em", color: `${G}50`, fontFamily: "monospace" }}>SECURITY RATING</span>
                </div>
              </div>

              {/* Platform visa stamps */}
              {passport.connections.length > 0 && (
                <div style={{
                  borderTop: `1px solid ${G}15`, padding: "16px 20px",
                  display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center",
                  background: `${G}04`,
                }}>
                  <span style={{ fontSize: 7, letterSpacing: "0.25em", color: `${G}40`, fontFamily: "monospace", fontWeight: 700, alignSelf: "flex-start", paddingTop: 4 }}>
                    CONNECTED PLATFORMS
                  </span>
                  {passport.connections.map((c, i) => {
                    const rot = STAMP_ROTATIONS[i % STAMP_ROTATIONS.length];
                    const col = PLATFORM_COLORS[c.platform] ?? "#8b92a8";
                    return (
                      <div key={c.platform} style={{
                        width: 76, height: 76, borderRadius: "50%",
                        border: `2px dashed ${col}55`,
                        background: `${col}08`,
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                        transform: `rotate(${rot}deg)`,
                        flexShrink: 0,
                        position: "relative",
                      }}>
                        <span style={{ color: col }}>{PLATFORM_ICONS_LG[c.platform] ?? c.platform[0]}</span>
                        <span style={{ fontSize: 7, fontWeight: 800, letterSpacing: "0.15em", color: col, fontFamily: "monospace" }}>
                          {c.platform.toUpperCase()}
                        </span>
                        {c.verified && (
                          <span style={{ fontSize: 6, color: "#10b981", letterSpacing: "0.1em", fontFamily: "monospace" }}>VERIFIED</span>
                        )}
                        <span style={{ fontSize: 7, color: "#4a506a", fontFamily: "monospace", maxWidth: 60, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "center" }}>
                          {c.handle}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Stats strip */}
              {(totalStars > 0 || followers > 0 || totalDownloads > 0 || publicRepos > 0) && (
                <div style={{
                  borderTop: `1px solid ${G}15`,
                  display: "flex", flexWrap: "wrap",
                  background: "#070810",
                }}>
                  {totalStars > 0 && <StatPill label="STARS" value={fmt(totalStars)} color="#f0b429" />}
                  {followers > 0 && <StatPill label="FOLLOWERS" value={fmt(followers)} color="#4361ee" />}
                  {totalDownloads > 0 && <StatPill label="DOWNLOADS" value={fmt(totalDownloads)} color="#10b981" />}
                  {passport.packages.length > 0 && <StatPill label="PACKAGES" value={passport.packages.length} color="#7b2ff7" />}
                  {publicRepos > 0 && <StatPill label="REPOS" value={publicRepos} color={`${G}cc`} />}
                  {earnedBadges > 0 && <StatPill label="BADGES" value={earnedBadges} color="#f59e0b" />}
                  {verifiedCount > 0 && <StatPill label="VERIFIED" value={verifiedCount} color="#10b981" />}
                  {yearsActive > 0 && <StatPill label="YEARS" value={`${yearsActive}y`} color={`${G}80`} />}
                </div>
              )}

              {/* MRZ — Machine Readable Zone */}
              <div style={{
                background: "#05060e", borderTop: `1px solid ${G}18`,
                padding: "10px 20px",
              }}>
                <div style={{ fontSize: 10, fontFamily: "monospace", color: "#1e2540", letterSpacing: "0.18em", lineHeight: 2, userSelect: "none" }}>
                  {mrzLine1(passport.username, name)}
                </div>
                <div style={{ fontSize: 10, fontFamily: "monospace", color: "#1e2540", letterSpacing: "0.18em", lineHeight: 1, userSelect: "none" }}>
                  {mrzLine2(passport.passportNumber, issueDate, passport.trustScore)}
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* TWO-COLUMN BODY                                                   */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 10 }} className="passport-grid">

            {/* ── SIDEBAR ── */}
            <aside style={{ display: "flex", flexDirection: "column", gap: 10 }}>

              {/* Skill Genome */}
              {passport.skills.length > 0 && (
                <PassportSection title="COMPETENCIES · SKILL GENOME" pageNum="P.02">
                  <SkillGenome skills={passport.skills.map((s) => ({ ...s, color: s.color ?? undefined, category: s.category ?? undefined }))} />
                </PassportSection>
              )}

              {/* Badges as rubber stamps */}
              {passport.badges.length > 0 && (
                <PassportSection
                  title="MERIT STAMPS · ACHIEVEMENTS"
                  pageNum="P.03"
                  badge={
                    earnedBadges > 0
                      ? <span style={{ fontSize: 8, padding: "1px 6px", borderRadius: 3, background: "#f0b42918", color: "#f0b429", fontFamily: "monospace" }}>{earnedBadges} EARNED</span>
                      : undefined
                  }
                >
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "4px 0" }}>
                    {passport.badges.map((b, i) => {
                      const rot = b.earned ? BADGE_ROTATIONS[i % BADGE_ROTATIONS.length] : 0;
                      return (
                        <div
                          key={b.type}
                          style={{
                            padding: "3px 7px",
                            border: `2px solid ${b.earned ? "#f0b429" : "#1c2035"}`,
                            borderRadius: 3,
                            transform: `rotate(${rot}deg)`,
                            opacity: b.earned ? 1 : 0.2,
                            color: b.earned ? "#f0b429" : "#4a506a",
                            fontSize: 8, fontWeight: 800, letterSpacing: "0.12em",
                            textTransform: "uppercase", fontFamily: "monospace",
                            display: "flex", alignItems: "center", gap: 4,
                            background: b.earned ? "#f0b42908" : "transparent",
                            boxShadow: b.earned ? "0 0 0 1px #f0b42918 inset" : "none",
                          }}
                        >
                          {b.earned && BADGE_ICONS[b.type]}
                          {b.label}
                        </div>
                      );
                    })}
                  </div>
                </PassportSection>
              )}

              {/* Identity verification */}
              {passport.verifications.length > 0 && (
                <PassportSection
                  title="IDENTITY VERIFICATION"
                  pageNum="P.04"
                  badge={
                    verifiedCount > 0
                      ? <span style={{ fontSize: 8, padding: "1px 6px", borderRadius: 3, background: "#10b98118", color: "#10b981", fontFamily: "monospace" }}>{verifiedCount} CONFIRMED</span>
                      : undefined
                  }
                >
                  <IdentityVerification items={passport.verifications.map((v) => ({
                    label: v.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
                    verified: v.verified,
                    level: v.level as "basic" | "advanced" | "elite",
                    icon: VERIFICATION_ICONS[v.type] ?? <span style={{ fontSize: 9 }}>{v.type[0].toUpperCase()}</span>,
                  }))} />
                </PassportSection>
              )}

              {/* Developer Visas */}
              {passport.visasReceived.length > 0 && (
                <PassportSection title="DEVELOPER VISAS · ENDORSEMENTS" pageNum="P.05">
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {passport.visasReceived.map((visa) => (
                      <div key={visa.id} style={{
                        padding: "10px 12px", borderRadius: 8,
                        border: `1px solid ${G}25`,
                        background: `${G}06`,
                        display: "flex", flexDirection: "column", gap: 3,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: G, flexShrink: 0 }} />
                          <span style={{ fontSize: 9, fontWeight: 700, color: G, letterSpacing: "0.1em", fontFamily: "monospace" }}>{visa.organization.name}</span>
                          {visa.organization.verified && <CheckIcon size={9} />}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#e8eaf4" }}>{visa.title}</span>
                        {visa.description && <span style={{ fontSize: 10, color: "#4a506a" }}>{visa.description}</span>}
                        <span style={{ fontSize: 8, color: `${G}50`, fontFamily: "monospace" }}>
                          ISSUED {new Date(visa.issuedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </PassportSection>
              )}

              {/* Passport document details */}
              <div style={{
                borderRadius: 10, border: `1px dashed ${G}25`, padding: "12px 14px",
                background: "#05060e",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <PassportLogoIcon size={12} />
                  <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.3em", color: `${G}55`, fontFamily: "monospace" }}>DOCUMENT INFO</span>
                </div>
                {[
                  { label: "HOLDER", value: passport.username },
                  { label: "DOC NO.", value: passport.passportNumber.slice(0, 10).toUpperCase() },
                  { label: "ISSUED", value: issueDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase() },
                  { label: "STATUS", value: "ACTIVE", vc: "#10b981" },
                  { label: "CLASS", value: level.label, vc: level.color },
                  { label: "VERIFICATIONS", value: `${verifiedCount} CONFIRMED` },
                ].map(({ label, value, vc }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0", borderBottom: `1px solid ${G}10` }}>
                    <span style={{ fontSize: 8, color: `${G}40`, fontFamily: "monospace", letterSpacing: "0.1em" }}>{label}</span>
                    <span style={{ fontSize: 9, fontFamily: "monospace", color: vc ?? "#8b92a8", fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
            </aside>

            {/* ── MAIN ── */}
            <main style={{ display: "flex", flexDirection: "column", gap: 10 }}>

              {/* Contribution History */}
              {contributions.length > 0 && (
                <PassportSection title="CONTRIBUTION HISTORY · TRAVEL LOG" pageNum="P.06">
                  <ContributionTimeline data={contributions} />
                </PassportSection>
              )}

              {/* Open Source DNA */}
              {languages.length > 0 && (
                <PassportSection title="OPEN SOURCE DNA · LANGUAGE PROFILE" pageNum="P.07">
                  <OpenSourceDNA languages={languages} />
                </PassportSection>
              )}

              {/* Projects */}
              {passport.projects.length > 0 && (
                <PassportSection
                  title="PROJECT PASSPORT · ENDORSED WORKS"
                  pageNum="P.08"
                  badge={<span style={{ fontSize: 8, fontFamily: "monospace", color: `${G}55` }}>{passport.projects.length} FEATURED</span>}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
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
                </PassportSection>
              )}

              {/* Packages */}
              {passport.packages.length > 0 && (
                <PassportSection
                  title="REGISTERED ARTIFACTS · PACKAGES"
                  pageNum="P.09"
                  badge={
                    totalDownloads > 0
                      ? <span style={{ fontSize: 8, fontFamily: "monospace", color: "#10b981", padding: "1px 6px", borderRadius: 3, background: "#10b98118" }}>{fmt(totalDownloads)} DL</span>
                      : undefined
                  }
                >
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                    {(["npm", "pypi", "crates", "docker", "maven", "gem", "other"] as const).map((reg) => {
                      const count = passport.packages.filter((p) => p.registry === reg).length;
                      if (!count) return null;
                      const dl = passport.packages.filter((p) => p.registry === reg).reduce((s, p) => s + p.downloads, 0);
                      return (
                        <div key={reg} style={{
                          display: "flex", alignItems: "center", gap: 4,
                          padding: "2px 8px", borderRadius: 4,
                          border: `1px solid ${G}20`,
                          background: `${G}06`,
                          fontSize: 8, fontFamily: "monospace",
                        }}>
                          <span style={{ color: `${G}80` }}>{reg.toUpperCase()}</span>
                          <span style={{ color: "#4a506a" }}>{count}</span>
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
                </PassportSection>
              )}

              {/* Experience */}
              {passport.experiences.length > 0 && (
                <PassportSection title="CAREER RECORD · EXPERIENCE" pageNum="P.10">
                  <ExperienceGraph entries={passport.experiences.map((e) => ({
                    year: e.year, title: e.title,
                    description: e.description ?? undefined,
                    type: e.type as "project" | "company" | "milestone" | "education",
                  }))} />
                </PassportSection>
              )}

              {/* Security */}
              {passport.securityChecks.length > 0 && (
                <PassportSection title="SECURITY CLEARANCE · PROFILE" pageNum="P.11">
                  <SecurityProfile
                    items={passport.securityChecks.map((c) => ({
                      label: c.label,
                      status: c.status as "pass" | "warn" | "fail" | "unknown",
                      detail: c.detail ?? undefined,
                    }))}
                    score={passport.securityScore}
                  />
                </PassportSection>
              )}

              {/* Footer strip */}
              <div style={{
                display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 12px",
                padding: "8px 4px", fontSize: 8, fontFamily: "monospace", color: "#1c2035",
                letterSpacing: "0.15em",
              }}>
                <span>DGTL PASSPORT</span>
                <span>·</span>
                <span>{passport.passportNumber.slice(0, 12).toUpperCase()}</span>
                <span>·</span>
                <span>ISSUED {issueDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase()}</span>
                {passport.lastSyncedAt && <><span>·</span><span>SYNCED {new Date(passport.lastSyncedAt).toLocaleDateString()}</span></>}
                <span>·</span>
                <span style={{ color: "#10b981" }}>ACTIVE</span>
              </div>
            </main>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .passport-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ── Team Passport ─────────────────────────────────────────────────────────────

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
