import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  // Create a demo user
  const user = await db.user.upsert({
    where: { email: "john.doe@example.com" },
    update: {},
    create: {
      email: "john.doe@example.com",
      name: "John Doe",
      emailVerified: new Date(),
    },
  });

  // Create the passport
  const passport = await db.passport.upsert({
    where: { username: "johndoe" },
    update: {},
    create: {
      userId: user.id,
      username: "johndoe",
      displayName: "John Doe",
      title: "Full Stack Engineer",
      bio: "Building open-source tools and distributed systems. Passionate about developer experience, Rust, and TypeScript. 10+ years shipping production code.",
      location: "San Francisco, CA",
      website: "https://johndoe.dev",
      twitterHandle: "@johndoe",
      available: true,
      availabilityNote: "Open to senior roles",
      trustScore: 947,
      securityScore: 91,
      lastSyncedAt: new Date(),
      syncStatus: "done",
    },
  });

  // Connected accounts
  const connections = [
    { platform: "github", handle: "johndoe", url: "https://github.com/johndoe", verified: true, metadata: {
      languages: [
        { name: "TypeScript", percent: 38, color: "#3178c6" },
        { name: "Rust", percent: 22, color: "#dea584" },
        { name: "Go", percent: 18, color: "#00add8" },
        { name: "Python", percent: 12, color: "#3572a5" },
        { name: "C++", percent: 6, color: "#f34b7d" },
        { name: "Other", percent: 4, color: "#8b92a8" },
      ],
      totalStars: 9200,
      totalForks: 1400,
      followers: 3800,
      publicRepos: 87,
    }},
    { platform: "npm", handle: "johndoe", url: "https://www.npmjs.com/~johndoe", verified: true },
    { platform: "docker", handle: "johndoe", url: "https://hub.docker.com/u/johndoe", verified: true },
    { platform: "stackoverflow", handle: "john-doe", url: "https://stackoverflow.com/users/johndoe", verified: false },
  ];

  for (const conn of connections) {
    await db.connectedAccount.upsert({
      where: { passportId_platform: { passportId: passport.id, platform: conn.platform } },
      update: {},
      create: { passportId: passport.id, ...conn, public: true },
    });
  }

  // Skills
  const skills = [
    { name: "TypeScript", score: 96, color: "#3178c6", category: "language" },
    { name: "Rust", score: 89, color: "#dea584", category: "language" },
    { name: "Go", score: 84, color: "#00add8", category: "language" },
    { name: "React", score: 92, color: "#61dafb", category: "framework" },
    { name: "Next.js", score: 90, color: "#e8eaf4", category: "framework" },
    { name: "PostgreSQL", score: 85, color: "#336791", category: "domain" },
    { name: "Docker", score: 82, color: "#2496ed", category: "tool" },
    { name: "Kubernetes", score: 74, color: "#326ce5", category: "tool" },
    { name: "GraphQL", score: 78, color: "#e10098", category: "domain" },
    { name: "Python", score: 76, color: "#3572a5", category: "language" },
  ];

  for (const skill of skills) {
    await db.skill.upsert({
      where: { passportId_name: { passportId: passport.id, name: skill.name } },
      update: {},
      create: { passportId: passport.id, ...skill },
    });
  }

  // Projects
  const projects = [
    { externalId: "p1", platform: "github", name: "turboqueue", fullName: "johndoe/turboqueue", description: "High-performance message queue in Rust — 1M+ msgs/sec with zero dependencies", stars: 3200, forks: 241, language: "Rust", languageColor: "#dea584", license: "MIT", healthScore: 96, contributors: 28, startedAt: "2022", featured: true },
    { externalId: "p2", platform: "github", name: "gotype", fullName: "johndoe/gotype", description: "Runtime type inference and validation library for Go — 12k weekly downloads", stars: 1800, forks: 134, language: "Go", languageColor: "#00add8", license: "Apache-2.0", healthScore: 91, contributors: 14, startedAt: "2021", featured: true },
    { externalId: "p3", platform: "github", name: "ts-contracts", fullName: "johndoe/ts-contracts", description: "Design-by-contract library for TypeScript with zero runtime overhead", stars: 2100, forks: 189, language: "TypeScript", languageColor: "#3178c6", license: "MIT", healthScore: 94, contributors: 21, startedAt: "2020", featured: true },
    { externalId: "p4", platform: "github", name: "pgmigrate", fullName: "johndoe/pgmigrate", description: "Safe, zero-downtime PostgreSQL migration runner with rollback support", stars: 980, forks: 87, language: "Go", languageColor: "#00add8", license: "MIT", healthScore: 88, contributors: 9, startedAt: "2023", featured: true },
    { externalId: "p5", platform: "github", name: "recoil-persist", fullName: "johndoe/recoil-persist", description: "Persist and rehydrate Recoil atoms with pluggable storage backends", stars: 740, forks: 68, language: "TypeScript", languageColor: "#3178c6", license: "MIT", healthScore: 82, contributors: 6, startedAt: "2021", featured: true },
    { externalId: "p6", platform: "github", name: "wasm-runtime", fullName: "johndoe/wasm-runtime", description: "Lightweight WebAssembly runtime embedding for Rust applications", stars: 420, forks: 39, language: "Rust", languageColor: "#dea584", license: "MIT", healthScore: 79, contributors: 4, startedAt: "2023", featured: true },
  ];

  for (const project of projects) {
    await db.project.upsert({
      where: { passportId_platform_externalId: { passportId: passport.id, platform: project.platform, externalId: project.externalId } },
      update: {},
      create: { passportId: passport.id, ...project },
    });
  }

  // Packages
  const packages = [
    { name: "ts-contracts", registry: "npm", version: "3.2.1", downloads: 124000, description: "Design-by-contract for TypeScript", url: "https://npmjs.com/package/ts-contracts" },
    { name: "recoil-persist", registry: "npm", version: "5.0.0", downloads: 89000, description: "Persist Recoil state", url: "https://npmjs.com/package/recoil-persist" },
    { name: "turboqueue", registry: "crates", version: "0.9.2", downloads: 42000, description: "High-perf message queue", url: "https://crates.io/crates/turboqueue" },
    { name: "pgmigrate", registry: "docker", version: "2.1.0", downloads: 31000, description: "PostgreSQL migration runner", url: "https://hub.docker.com/r/johndoe/pgmigrate" },
    { name: "gotype", registry: "docker", version: "1.3.0", downloads: 18000, description: "Go runtime type library", url: "https://hub.docker.com/r/johndoe/gotype" },
  ];

  for (const pkg of packages) {
    await db.package.upsert({
      where: { passportId_registry_name: { passportId: passport.id, registry: pkg.registry, name: pkg.name } },
      update: {},
      create: { passportId: passport.id, ...pkg },
    });
  }

  // Badges
  const badges = [
    { type: "oss_maintainer", label: "OSS Maintainer", earned: true, earnedAt: new Date("2021-06-01") },
    { type: "1000_commits", label: "1000+ Commits", earned: true, earnedAt: new Date("2020-11-15") },
    { type: "top_reviewer", label: "Top Reviewer", earned: true, earnedAt: new Date("2022-03-10") },
    { type: "rust_expert", label: "Rust Expert", earned: true, earnedAt: new Date("2022-09-01") },
    { type: "security_expert", label: "Security Expert", earned: true, earnedAt: new Date("2023-01-20") },
    { type: "ai_builder", label: "AI Builder", earned: false },
    { type: "oss_sponsor", label: "OSS Sponsor", earned: false },
    { type: "bug_hunter", label: "Bug Hunter", earned: true, earnedAt: new Date("2021-08-05") },
    { type: "docs_master", label: "Docs Master", earned: false },
    { type: "100_releases", label: "100+ Releases", earned: false },
  ];

  for (const badge of badges) {
    await db.badge.upsert({
      where: { passportId_type: { passportId: passport.id, type: badge.type } },
      update: {},
      create: { passportId: passport.id, ...badge },
    });
  }

  // Verifications
  const verifications = [
    { type: "email", level: "basic", verified: true, verifiedAt: new Date("2020-01-01") },
    { type: "github", level: "advanced", verified: true, verifiedAt: new Date("2020-01-15") },
    { type: "google", level: "advanced", verified: true, verifiedAt: new Date("2020-01-20") },
    { type: "domain", level: "advanced", verified: true, verifiedAt: new Date("2021-03-10") },
    { type: "ssh_key", level: "elite", verified: true, verifiedAt: new Date("2021-06-01") },
    { type: "gpg_key", level: "elite", verified: true, verifiedAt: new Date("2021-06-01") },
    { type: "company_email", level: "elite", verified: false },
    { type: "gov_id", level: "elite", verified: false },
    { type: "wallet", level: "elite", verified: false },
    { type: "school_email", level: "advanced", verified: false },
  ];

  for (const v of verifications) {
    await db.verification.upsert({
      where: { passportId_type: { passportId: passport.id, type: v.type } },
      update: {},
      create: { passportId: passport.id, ...v },
    });
  }

  // Experience
  const experiences = [
    { year: "2015", title: "Started open source journey — first npm package", type: "milestone", order: 0 },
    { year: "2016", title: "Senior Engineer at Acme Corp", description: "Led backend rewrite from PHP to Go, 10x throughput improvement", type: "company", order: 1 },
    { year: "2018", title: "Launched ts-contracts", description: "Reached 50k weekly npm downloads within 6 months", type: "project", order: 2 },
    { year: "2020", title: "Staff Engineer at StartupCo", description: "Built real-time data pipeline processing 2M events/day", type: "company", order: 3 },
    { year: "2021", title: "turboqueue hits 1k GitHub stars", type: "milestone", order: 4 },
    { year: "2022", title: "Independent contractor", description: "Architecture consulting for 4 Series B/C startups", type: "company", order: 5 },
    { year: "2023", title: "pgmigrate reaches 1k stars", type: "milestone", order: 6 },
    { year: "2024", title: "OSS full-time", description: "Funded by GitHub Sponsors and OSS grants", type: "milestone", order: 7 },
  ];

  for (const [i, exp] of experiences.entries()) {
    await db.experience.create({
      data: { passportId: passport.id, ...exp, order: i },
    }).catch(() => {});
  }

  // Security checks
  const securityChecks = [
    { label: "2FA enabled on GitHub", status: "pass", detail: "TOTP hardware key" },
    { label: "GPG-signed commits", status: "pass", detail: "100% of commits signed" },
    { label: "No leaked secrets in history", status: "pass", detail: "Scanned 87 repositories" },
    { label: "Dependency audit", status: "warn", detail: "2 moderate advisories in dev deps" },
    { label: "SSH key rotation", status: "pass", detail: "Last rotated 3 months ago" },
    { label: "Branch protection rules", status: "pass", detail: "All public repos protected" },
    { label: "Verified email on all platforms", status: "pass" },
    { label: "Security policy (SECURITY.md)", status: "warn", detail: "Missing in 4 repositories" },
  ];

  for (const check of securityChecks) {
    await db.securityCheck.upsert({
      where: { passportId_label: { passportId: passport.id, label: check.label } },
      update: {},
      create: { passportId: passport.id, ...check },
    });
  }

  // Contribution years
  function generateWeeks(avgPerWeek: number): number[] {
    return Array.from({ length: 52 }, () => Math.max(0, Math.round(avgPerWeek + (Math.random() - 0.5) * avgPerWeek * 1.4)));
  }

  const years = [
    { year: 2019, avg: 6 },
    { year: 2020, avg: 12 },
    { year: 2021, avg: 18 },
    { year: 2022, avg: 22 },
    { year: 2023, avg: 28 },
    { year: 2024, avg: 24 },
  ];

  for (const { year, avg } of years) {
    await db.contributionYear.upsert({
      where: { passportId_year: { passportId: passport.id, year } },
      update: {},
      create: { passportId: passport.id, year, weeks: generateWeeks(avg) },
    });
  }

  console.log("Seeded johndoe demo passport successfully.");
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
