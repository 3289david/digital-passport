"use client";

import { useState } from "react";
import Link from "next/link";
import { TrustScore } from "@/components/passport/TrustScore";
import { PassportLogoIcon, GitHubIcon, CheckIcon, ShieldIcon } from "@/components/icons/PlatformIcons";
import { ProfileEditor } from "./ProfileEditor";
import { ExperienceEditor } from "./ExperienceEditor";
import { SkillsEditor } from "./SkillsEditor";
import { ProjectsEditor } from "./ProjectsEditor";
import { PlatformsEditor } from "./PlatformsEditor";
import { SiteEditor } from "./SiteEditor";
import { ApiKeysPanel } from "./ApiKeysPanel";
import { signOut } from "next-auth/react";

type Tab = "overview" | "profile" | "experience" | "skills" | "projects" | "platforms" | "site" | "api";

interface DashboardClientProps {
  passport: {
    id: string;
    username: string;
    displayName: string | null;
    title: string | null;
    bio: string | null;
    location: string | null;
    website: string | null;
    twitterHandle: string | null;
    available: boolean;
    availabilityNote: string | null;
    trustScore: number;
    securityScore: number;
    syncStatus: string | null;
    lastSyncedAt: Date | null;
    passportNumber: string;
    connections: { platform: string; handle: string; verified: boolean }[];
    projects: { id: string; name: string; fullName: string | null; stars: number; language: string | null; languageColor: string | null; featured: boolean; description: string | null; healthScore: number; contributors: number; startedAt: string | null; license: string | null; downloads: number | null; url: string | null }[];
    packages: { id: string; name: string; registry: string; version: string | null; downloads: number }[];
    skills: { id: string; name: string; score: number; color: string | null }[];
    badges: { type: string; label: string; earned: boolean; earnedAt: Date | null }[];
    verifications: { type: string; level: string; verified: boolean }[];
    experiences: { id: string; year: string; title: string; description: string | null; type: string; order: number; url: string | null }[];
    site: { theme: string; title: string | null; headline: string | null; ctaText: string | null; ctaUrl: string | null; showProjects: boolean; showSkills: boolean; showBadges: boolean; showContact: boolean; accentColor: string } | null;
    apiKeys: { id: string; name: string; key: string; lastUsedAt: Date | null; createdAt: Date }[];
    trustLogs: { breakdown: unknown }[];
  };
  user: { name?: string | null; email?: string | null; image?: string | null };
}

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { id: "profile", label: "Profile", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { id: "experience", label: "Experience", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
  { id: "skills", label: "Skills", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
  { id: "projects", label: "Projects", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg> },
  { id: "platforms", label: "Platforms", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> },
  { id: "site", label: "My Site", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg> },
  { id: "api", label: "API Keys", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/></svg> },
];

export function DashboardClient({ passport, user }: DashboardClientProps) {
  const [tab, setTab] = useState<Tab>("overview");
  const [syncing, setSyncing] = useState(false);

  async function triggerSync() {
    setSyncing(true);
    try {
      await fetch("/api/passport/sync", { method: "POST" });
      setTimeout(() => window.location.reload(), 3000);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Top nav */}
      <nav className="sticky top-0 z-50 glass border-b" style={{ borderColor: "#1c2035" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <PassportLogoIcon size={26} />
              <span className="font-semibold text-sm hidden sm:block" style={{ color: "#e8eaf4" }}>Digital Passport</span>
            </Link>
            <Link href={`/${passport.username}`} target="_blank" className="text-xs mono transition-colors hover:text-[#4361ee]" style={{ color: "#4a506a" }}>
              p.krl.kr/{passport.username}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {passport.syncStatus === "syncing" ? (
              <span className="text-xs flex items-center gap-1.5" style={{ color: "#f59e0b" }}>
                <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10"/>
                </svg>
                Syncing...
              </span>
            ) : (
              <button
                onClick={triggerSync}
                disabled={syncing}
                className="text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-40"
                style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#8b92a8" }}
              >
                {syncing ? "Starting sync..." : "Sync now"}
              </button>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#4a506a" }}
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[220px,1fr] gap-6">
          {/* Sidebar */}
          <aside className="flex flex-col gap-2">
            {/* User card */}
            <div className="card p-4 flex flex-col items-center gap-3 text-center mb-2">
              {user.image ? (
                <img src={user.image} alt={user.name ?? ""} className="w-14 h-14 rounded-xl object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold" style={{ background: "linear-gradient(135deg,#4361ee,#7b2ff7)", color: "#fff" }}>
                  {(passport.displayName ?? user.name ?? "?")[0].toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-semibold text-sm" style={{ color: "#e8eaf4" }}>{passport.displayName ?? user.name}</div>
                <div className="text-xs mono mt-0.5" style={{ color: "#4a506a" }}>{passport.username}</div>
              </div>
              <TrustScore score={passport.trustScore} />
            </div>

            {/* Sync status */}
            {passport.lastSyncedAt && (
              <div className="text-xs text-center mb-2" style={{ color: "#4a506a" }}>
                Last synced: {new Date(passport.lastSyncedAt).toLocaleDateString()}
              </div>
            )}

            {/* Tabs */}
            <nav className="flex flex-col gap-0.5">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition-all"
                  style={{
                    background: tab === t.id ? "#4361ee18" : "transparent",
                    color: tab === t.id ? "#4361ee" : "#8b92a8",
                    border: tab === t.id ? "1px solid #4361ee30" : "1px solid transparent",
                  }}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </nav>

            {/* Quick links */}
            <div className="mt-4 flex flex-col gap-1.5">
              <Link href={`/${passport.username}`} target="_blank" className="text-xs flex items-center gap-1.5 transition-colors hover:text-[#4361ee]" style={{ color: "#4a506a" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                View public passport
              </Link>
              <Link href={`/${passport.username}/site`} target="_blank" className="text-xs flex items-center gap-1.5 transition-colors hover:text-[#4361ee]" style={{ color: "#4a506a" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                View my site
              </Link>
              <Link href={`/${passport.username}/print`} target="_blank" className="text-xs flex items-center gap-1.5 transition-colors hover:text-[#4361ee]" style={{ color: "#4a506a" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Print / PDF resume
              </Link>
            </div>
          </aside>

          {/* Main */}
          <main>
            {tab === "overview" && <OverviewTab passport={passport} onSync={triggerSync} syncing={syncing} />}
            {tab === "profile" && <ProfileEditor passport={passport} />}
            {tab === "experience" && <ExperienceEditor experiences={passport.experiences} />}
            {tab === "skills" && <SkillsEditor skills={passport.skills} />}
            {tab === "projects" && <ProjectsEditor projects={passport.projects} />}
            {tab === "platforms" && <PlatformsEditor connections={passport.connections} />}
            {tab === "site" && <SiteEditor site={passport.site} username={passport.username} />}
            {tab === "api" && <ApiKeysPanel apiKeys={passport.apiKeys} username={passport.username} />}
          </main>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ passport, onSync, syncing }: { passport: DashboardClientProps["passport"]; onSync: () => void; syncing: boolean }) {
  const breakdown = (passport.trustLogs[0]?.breakdown ?? {}) as Record<string, number>;
  const earnedBadges = passport.badges.filter((b) => b.earned);
  const verifiedCount = passport.verifications.filter((v) => v.verified).length;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "#e8eaf4" }}>Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: "#4a506a" }}>Manage your digital passport</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Trust Score", value: passport.trustScore, color: "#4361ee", sub: "/ 1000" },
          { label: "Projects", value: passport.projects.length, color: "#10b981", sub: "synced" },
          { label: "Packages", value: passport.packages.length, color: "#7b2ff7", sub: "registries" },
          { label: "Badges", value: earnedBadges.length, color: "#f59e0b", sub: `/ ${passport.badges.length} earned` },
        ].map(({ label, value, color, sub }) => (
          <div key={label} className="card p-4">
            <div className="text-xs mb-1" style={{ color: "#4a506a" }}>{label}</div>
            <div className="text-2xl font-bold mono" style={{ color }}>{value}</div>
            <div className="text-xs mt-0.5" style={{ color: "#4a506a" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Trust breakdown */}
      {Object.keys(breakdown).length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-sm mb-4" style={{ color: "#8b92a8" }}>TRUST SCORE BREAKDOWN</h2>
          <div className="flex flex-col gap-3">
            {[
              { key: "commitActivity", label: "Commit Activity", max: 150 },
              { key: "projectQuality", label: "Project Quality", max: 200 },
              { key: "community", label: "Community", max: 150 },
              { key: "packages", label: "Packages", max: 150 },
              { key: "security", label: "Security", max: 150 },
              { key: "verification", label: "Identity Verification", max: 100 },
              { key: "longevity", label: "Longevity", max: 100 },
            ].map(({ key, label, max }) => {
              const val = breakdown[key] ?? 0;
              return (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-xs w-40 shrink-0" style={{ color: "#8b92a8" }}>{label}</span>
                  <div className="flex-1 rounded-full overflow-hidden" style={{ height: 5, background: "#1c2035" }}>
                    <div style={{ width: `${(val / max) * 100}%`, height: "100%", background: "#4361ee", borderRadius: 999 }} />
                  </div>
                  <span className="text-xs mono w-14 text-right shrink-0" style={{ color: "#e8eaf4" }}>
                    {val} / {max}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Verification status */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-sm" style={{ color: "#8b92a8" }}>IDENTITY VERIFICATION</h2>
          <span className="text-xs mono" style={{ color: "#4361ee" }}>{verifiedCount} verified</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {passport.verifications.map((v) => (
            <div key={v.type} className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: v.verified ? "#10b98110" : "#0d0f18", border: `1px solid ${v.verified ? "#10b98130" : "#141726"}` }}>
              <div className="rounded-full" style={{ width: 6, height: 6, background: v.verified ? "#10b981" : "#4a506a" }} />
              <span className="text-xs capitalize" style={{ color: v.verified ? "#e8eaf4" : "#4a506a" }}>{v.type.replace("_", " ")}</span>
              {v.verified && <CheckIcon size={10} />}
            </div>
          ))}
        </div>
      </div>

      {/* Sync card */}
      <div className="card p-5 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-sm" style={{ color: "#e8eaf4" }}>Sync passport data</h2>
          <p className="text-xs mt-0.5" style={{ color: "#4a506a" }}>
            {passport.lastSyncedAt
              ? `Last synced ${new Date(passport.lastSyncedAt).toLocaleString()}`
              : "Never synced — connect GitHub first"}
          </p>
        </div>
        <button
          onClick={onSync}
          disabled={syncing || passport.syncStatus === "syncing"}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
          style={{ background: "#4361ee", color: "#fff" }}
        >
          {passport.syncStatus === "syncing" ? "Syncing..." : "Sync now"}
        </button>
      </div>
    </div>
  );
}
