import type { GitHubStats, GitHubRepo } from "./github";

export interface TrustBreakdown {
  commitActivity: number;   // max 150
  projectQuality: number;   // max 200
  community: number;        // max 150
  packages: number;         // max 150
  security: number;         // max 150
  verification: number;     // max 100
  longevity: number;        // max 100
  total: number;            // max 1000
}

export interface ComputedSkill {
  name: string;
  score: number;
  color?: string;
}

export interface ComputedLanguage {
  name: string;
  percent: number;
  color: string;
}

const LANG_COLORS: Record<string, string> = {
  Rust: "#dea584", Go: "#00add8", Python: "#3776ab", TypeScript: "#3178c6",
  JavaScript: "#f7df1e", Java: "#b07219", "C++": "#f34b7d", C: "#555555",
  Kotlin: "#a97bff", Swift: "#f05138", Ruby: "#701516", PHP: "#4f5d95",
  Dart: "#00b4ab", Scala: "#c22d40", Elixir: "#6e4a7e", Shell: "#89e051",
  HTML: "#e34c26", CSS: "#563d7c", Zig: "#ec915c", "C#": "#178600",
};

export function computeTrustScore(
  stats: GitHubStats,
  packageDownloads: number = 0,
  verificationLevel: "none" | "basic" | "advanced" | "elite" = "none",
  hasApiKey: boolean = false,
): TrustBreakdown {
  // 1. Commit Activity (max 150) — approximated from repo push dates + count
  const activeRepos = stats.repos.filter((r) => {
    if (!r.pushedAt) return false;
    const monthsAgo = (Date.now() - new Date(r.pushedAt).getTime()) / (30 * 86400000);
    return monthsAgo < 12;
  });
  const commitActivity = Math.min(
    150,
    Math.round(
      (activeRepos.length / Math.max(stats.publicRepos, 1)) * 80 +
      Math.min(stats.publicRepos, 50) * 1.4
    )
  );

  // 2. Project Quality (max 200) — stars, forks, maintained projects
  const qualityRepos = stats.repos.filter((r) => !r.isFork && !r.isArchived);
  const starScore = Math.min(100, Math.log10(stats.totalStars + 1) * 30);
  const forkScore = Math.min(50, Math.log10(stats.totalForks + 1) * 20);
  const maintainedScore = Math.min(50, qualityRepos.length * 3);
  const projectQuality = Math.round(starScore + forkScore + maintainedScore);

  // 3. Community (max 150) — followers, public repos, forks received
  const followerScore = Math.min(75, Math.log10(stats.followers + 1) * 25);
  const repoScore = Math.min(50, stats.publicRepos * 0.8);
  const forkReceivedScore = Math.min(25, Math.log10(stats.totalForks + 1) * 10);
  const community = Math.round(followerScore + repoScore + forkReceivedScore);

  // 4. Packages (max 150) — download counts across registries
  const packages = Math.min(150, Math.round(Math.log10(packageDownloads + 1) * 30));

  // 5. Security (max 150) — placeholder (real: CVE API, dependabot, secret scanning)
  const reposWithCi = qualityRepos.filter((r) =>
    r.topics.some((t) => ["ci", "cd", "actions", "testing", "tests"].includes(t))
  ).length;
  const securityBase = 60;
  const securityBonus = Math.min(90, reposWithCi * 10 + (stats.publicRepos > 10 ? 20 : 0));
  const security = securityBase + securityBonus;

  // 6. Verification level (max 100)
  const verificationMap = { none: 0, basic: 40, advanced: 75, elite: 100 };
  const verification = verificationMap[verificationLevel];

  // 7. Longevity (max 100) — years since first repo
  const joinYear = new Date(stats.createdAt).getFullYear();
  const yearsActive = Math.max(0, new Date().getFullYear() - joinYear);
  const longevity = Math.min(100, yearsActive * 14);

  const total = Math.min(
    1000,
    commitActivity + projectQuality + community + packages + security + verification + longevity
  );

  return {
    commitActivity,
    projectQuality,
    community,
    packages,
    security,
    verification,
    longevity,
    total,
  };
}

export function computeSkills(
  stats: GitHubStats
): ComputedSkill[] {
  const totalBytes = Object.values(stats.languages).reduce((s, b) => s + b, 0);
  if (totalBytes === 0) return [];

  // Convert language bytes to skill score (0–100)
  const skills: ComputedSkill[] = Object.entries(stats.languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, bytes]) => ({
      name,
      score: Math.round(Math.min(99, 40 + (bytes / totalBytes) * 60)),
      color: LANG_COLORS[name],
    }));

  // Bonus domain skills based on repo topics
  const topics = stats.repos.flatMap((r) => r.topics);
  const topicCounts: Record<string, number> = {};
  for (const t of topics) topicCounts[t] = (topicCounts[t] ?? 0) + 1;

  const domainSkills: Array<{ key: string; label: string; score: number }> = [
    { key: "security", label: "Security", score: 0 },
    { key: "networking", label: "Networking", score: 0 },
    { key: "machine-learning", label: "AI / ML", score: 0 },
    { key: "devops", label: "DevOps", score: 0 },
    { key: "blockchain", label: "Web3", score: 0 },
  ];

  for (const d of domainSkills) {
    const count = Object.entries(topicCounts)
      .filter(([k]) => k.includes(d.key) || k.includes(d.key.split("-")[0]))
      .reduce((s, [, v]) => s + v, 0);
    d.score = Math.min(95, count * 15 + 20);
  }

  const relevantDomains = domainSkills.filter((d) => d.score > 25);
  for (const d of relevantDomains) {
    skills.push({ name: d.label, score: d.score });
  }

  return skills.slice(0, 10).sort((a, b) => b.score - a.score);
}

export function computeLanguages(stats: GitHubStats): ComputedLanguage[] {
  const total = Object.values(stats.languages).reduce((s, b) => s + b, 0);
  if (total === 0) return [];

  return Object.entries(stats.languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, bytes]) => ({
      name,
      percent: Math.round((bytes / total) * 100),
      color: LANG_COLORS[name] ?? "#8b92a8",
    }));
}

export function computeHealthScore(repo: GitHubRepo): number {
  let score = 50;
  // Has description
  if (repo.description) score += 10;
  // Has license
  if (repo.license) score += 10;
  // Recently pushed
  if (repo.pushedAt) {
    const daysAgo = (Date.now() - new Date(repo.pushedAt).getTime()) / 86400000;
    if (daysAgo < 30) score += 15;
    else if (daysAgo < 90) score += 10;
    else if (daysAgo < 365) score += 5;
  }
  // Stars signal quality
  score += Math.min(10, Math.floor(Math.log10(repo.stars + 1) * 5));
  // Low open issues (relative to stars) is healthy
  if (repo.stars > 0 && repo.openIssues / repo.stars < 0.1) score += 5;

  return Math.min(100, score);
}
