"use server";

import { db } from "@/lib/db";
import { fetchGitHubStats, getLanguageColor } from "@/lib/github";
import { fetchNpmPackages, fetchCratesPackages } from "@/lib/packages-fetch";
import {
  computeTrustScore,
  computeSkills,
  computeLanguages,
  computeHealthScore,
} from "@/lib/trust-score";

export async function syncPassport(passportId: string): Promise<void> {
  await db.passport.update({
    where: { id: passportId },
    data: { syncStatus: "syncing" },
  });

  try {
    // OAuth token lives in the Account table (PrismaAdapter stores it there, not in ConnectedAccount)
    const passportData = await db.passport.findUnique({
      where: { id: passportId },
      select: { userId: true, avatarUrl: true },
    });
    const oauthAccount = passportData
      ? await db.account.findFirst({ where: { userId: passportData.userId, provider: "github" }, select: { access_token: true } })
      : null;
    const accessToken = oauthAccount?.access_token ?? undefined;

    // Get the GitHub connection — auto-create it from OAuth if missing
    let githubConn = await db.connectedAccount.findFirst({
      where: { passportId, platform: "github" },
    });

    if (!githubConn && accessToken) {
      try {
        const ghResp = await fetch("https://api.github.com/user", {
          headers: { Authorization: `Bearer ${accessToken}`, "User-Agent": "digital-passport/1.0", Accept: "application/vnd.github+json" },
        });
        if (ghResp.ok) {
          const ghUser = await ghResp.json();
          githubConn = await db.connectedAccount.create({
            data: { passportId, platform: "github", handle: ghUser.login as string, verified: true, public: true },
          });
        }
      } catch {}
    }

    if (!githubConn) {
      await db.passport.update({
        where: { id: passportId },
        data: { syncStatus: "done", lastSyncedAt: new Date() },
      });
      return;
    }

    // Get existing package downloads for trust score
    const packages = await db.package.findMany({ where: { passportId } });
    const totalDownloads = packages.reduce((s, p) => s + p.downloads, 0);

    // Fetch GitHub data
    const stats = await fetchGitHubStats(githubConn.handle, accessToken ?? githubConn.accessToken ?? undefined);

    // Determine verification level
    const verifications = await db.verification.findMany({ where: { passportId, verified: true } });
    const hasElite = verifications.some((v) => v.level === "elite");
    const hasAdvanced = verifications.some((v) => v.level === "advanced");
    const hasBasic = verifications.some((v) => v.level === "basic");
    const verLevel = hasElite ? "elite" : hasAdvanced ? "advanced" : hasBasic ? "basic" : "none";

    // Compute scores
    const breakdown = computeTrustScore(stats, totalDownloads, verLevel);
    const skills = computeSkills(stats);
    const languages = computeLanguages(stats);

    // Upsert projects
    for (const repo of stats.repos.filter((r) => !r.isFork).slice(0, 50)) {
      await db.project.upsert({
        where: { passportId_platform_externalId: { passportId, platform: "github", externalId: String(repo.id) } },
        update: {
          name: repo.name, fullName: repo.fullName, description: repo.description, url: repo.url,
          stars: repo.stars, forks: repo.forks, watchers: repo.watchers, openIssues: repo.openIssues,
          language: repo.language, languageColor: repo.language ? getLanguageColor(repo.language) : null,
          license: repo.license, healthScore: computeHealthScore(repo), isArchived: repo.isArchived,
          pushedAt: repo.pushedAt ? new Date(repo.pushedAt) : null,
        },
        create: {
          passportId, platform: "github", externalId: String(repo.id),
          name: repo.name, fullName: repo.fullName, description: repo.description, url: repo.url,
          stars: repo.stars, forks: repo.forks, watchers: repo.watchers, openIssues: repo.openIssues,
          language: repo.language, languageColor: repo.language ? getLanguageColor(repo.language) : null,
          license: repo.license, healthScore: computeHealthScore(repo), isArchived: repo.isArchived,
          isFork: repo.isFork, startedAt: String(new Date(repo.createdAt).getFullYear()),
          pushedAt: repo.pushedAt ? new Date(repo.pushedAt) : null,
        },
      });
    }

    // Upsert skills
    for (const skill of skills) {
      await db.skill.upsert({
        where: { passportId_name: { passportId, name: skill.name } },
        update: { score: skill.score, color: skill.color },
        create: { passportId, name: skill.name, score: skill.score, color: skill.color },
      });
    }

    // Upsert contribution years
    for (const cy of stats.contributionYears) {
      await db.contributionYear.upsert({
        where: { passportId_year: { passportId, year: cy.year } },
        update: { weeks: cy.weeks },
        create: { passportId, year: cy.year, weeks: cy.weeks },
      });
    }

    // Store language distribution + stats as metadata on connected account
    await db.connectedAccount.update({
      where: { passportId_platform: { passportId, platform: "github" } },
      data: {
        metadata: JSON.parse(JSON.stringify({
          totalStars: stats.totalStars, totalForks: stats.totalForks,
          publicRepos: stats.publicRepos, followers: stats.followers, languages,
        })),
      },
    });

    // Auto-mark GitHub as verified
    await db.verification.upsert({
      where: { passportId_type: { passportId, type: "github" } },
      update: { verified: true, verifiedAt: new Date() },
      create: { passportId, type: "github", level: "basic", verified: true, verifiedAt: new Date() },
    });

    // Update badges
    await updateBadges(passportId, stats, breakdown.total);

    // Auto-fetch npm packages if npm is connected
    const npmConn = await db.connectedAccount.findFirst({ where: { passportId, platform: "npm" } });
    if (npmConn) {
      try {
        const npmPkgs = await fetchNpmPackages(npmConn.handle);
        for (const pkg of npmPkgs) {
          await db.package.upsert({
            where: { passportId_registry_name: { passportId, registry: "npm", name: pkg.name } },
            update: { version: pkg.version, downloads: pkg.downloads, description: pkg.description, url: pkg.url },
            create: { passportId, registry: "npm", name: pkg.name, version: pkg.version, downloads: pkg.downloads, description: pkg.description, url: pkg.url },
          });
        }
      } catch (e) { console.error("npm sync error:", e); }
    }

    // Auto-fetch crates.io packages if crates is connected
    const cratesConn = await db.connectedAccount.findFirst({ where: { passportId, platform: "crates" } });
    if (cratesConn) {
      try {
        const cratesPkgs = await fetchCratesPackages(cratesConn.handle);
        for (const pkg of cratesPkgs) {
          await db.package.upsert({
            where: { passportId_registry_name: { passportId, registry: "crates", name: pkg.name } },
            update: { version: pkg.version, downloads: pkg.downloads, description: pkg.description, url: pkg.url },
            create: { passportId, registry: "crates", name: pkg.name, version: pkg.version, downloads: pkg.downloads, description: pkg.description, url: pkg.url },
          });
        }
      } catch (e) { console.error("crates sync error:", e); }
    }

    // Re-compute packages total after syncing registries
    const allPackages = await db.package.findMany({ where: { passportId } });
    const newTotalDownloads = allPackages.reduce((s, p) => s + p.downloads, 0);
    const finalBreakdown = newTotalDownloads !== totalDownloads
      ? computeTrustScore(stats, newTotalDownloads, verLevel)
      : breakdown;

    // Log trust score history
    await db.trustScoreLog.create({
      data: {
        passportId,
        score: finalBreakdown.total,
        breakdown: {
          commitActivity: finalBreakdown.commitActivity, projectQuality: finalBreakdown.projectQuality,
          community: finalBreakdown.community, packages: finalBreakdown.packages,
          security: finalBreakdown.security, verification: finalBreakdown.verification,
          longevity: finalBreakdown.longevity,
        },
      },
    });

    // Update passport — store GitHub avatar if user hasn't uploaded their own
    await db.passport.update({
      where: { id: passportId },
      data: {
        trustScore: finalBreakdown.total,
        displayName: stats.name || undefined,
        bio: stats.bio || undefined,
        location: stats.location || undefined,
        website: stats.blog || undefined,
        ...(!passportData?.avatarUrl && { avatarUrl: stats.avatarUrl }),
        syncStatus: "done",
        lastSyncedAt: new Date(),
      },
    });
  } catch (err) {
    console.error("Sync error:", err);
    await db.passport.update({
      where: { id: passportId },
      data: { syncStatus: "error" },
    });
    throw err;
  }
}

async function updateBadges(
  passportId: string,
  stats: { repos: { stars: number; isFork: boolean; topics: string[] }[]; totalStars: number },
  trustScore: number
) {
  const ownRepos = stats.repos.filter((r) => !r.isFork);
  const hasRust = ownRepos.some((r) => r.topics?.includes("rust"));
  const hasAI = ownRepos.some((r) => r.topics?.some((t) => ["machine-learning", "ai", "deep-learning", "llm"].includes(t)));

  const badgeDefs = [
    { type: "oss_maintainer", label: "OSS Maintainer", earned: ownRepos.length >= 3 },
    { type: "top_reviewer", label: "Top Reviewer", earned: trustScore >= 700 },
    { type: "security_expert", label: "Security Expert", earned: trustScore >= 850 },
    { type: "1000_commits", label: "1000 Commits", earned: trustScore >= 600 },
    { type: "50_releases", label: "50 Releases", earned: ownRepos.length >= 10 },
    { type: "bug_hunter", label: "Bug Hunter", earned: stats.totalStars >= 500 },
    { type: "docs_master", label: "Documentation Master", earned: ownRepos.filter((r) => r.topics?.includes("documentation")).length >= 2 },
    { type: "oss_sponsor", label: "OSS Sponsor", earned: trustScore >= 900 },
    { type: "ai_builder", label: "AI Builder", earned: hasAI },
    { type: "rust_expert", label: "Rust Expert", earned: hasRust },
  ];

  for (const badge of badgeDefs) {
    await db.badge.upsert({
      where: { passportId_type: { passportId, type: badge.type } },
      update: { earned: badge.earned, earnedAt: badge.earned ? new Date() : null },
      create: { passportId, type: badge.type, label: badge.label, earned: badge.earned, earnedAt: badge.earned ? new Date() : null },
    });
  }
}
