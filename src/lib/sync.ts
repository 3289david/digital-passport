"use server";

import { db } from "@/lib/db";
import { fetchGitHubStats, getLanguageColor } from "@/lib/github";
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
    // Get the GitHub connection
    const githubConn = await db.connectedAccount.findFirst({
      where: { passportId, platform: "github" },
    });

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
    const stats = await fetchGitHubStats(githubConn.handle, githubConn.accessToken ?? undefined);

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
        where: {
          passportId_platform_externalId: {
            passportId,
            platform: "github",
            externalId: String(repo.id),
          },
        },
        update: {
          name: repo.name,
          fullName: repo.fullName,
          description: repo.description,
          url: repo.url,
          stars: repo.stars,
          forks: repo.forks,
          watchers: repo.watchers,
          openIssues: repo.openIssues,
          language: repo.language,
          languageColor: repo.language ? getLanguageColor(repo.language) : null,
          license: repo.license,
          healthScore: computeHealthScore(repo),
          isArchived: repo.isArchived,
          pushedAt: repo.pushedAt ? new Date(repo.pushedAt) : null,
        },
        create: {
          passportId,
          platform: "github",
          externalId: String(repo.id),
          name: repo.name,
          fullName: repo.fullName,
          description: repo.description,
          url: repo.url,
          stars: repo.stars,
          forks: repo.forks,
          watchers: repo.watchers,
          openIssues: repo.openIssues,
          language: repo.language,
          languageColor: repo.language ? getLanguageColor(repo.language) : null,
          license: repo.license,
          healthScore: computeHealthScore(repo),
          isArchived: repo.isArchived,
          isFork: repo.isFork,
          startedAt: String(new Date(repo.createdAt).getFullYear()),
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

    // Store language distribution as metadata on connected account
    await db.connectedAccount.update({
      where: { passportId_platform: { passportId, platform: "github" } },
      data: {
        metadata: JSON.parse(JSON.stringify({
          totalStars: stats.totalStars,
          totalForks: stats.totalForks,
          publicRepos: stats.publicRepos,
          followers: stats.followers,
          languages,
        })),
      },
    });

    // Auto-mark GitHub as verified
    await db.verification.upsert({
      where: { passportId_type: { passportId, type: "github" } },
      update: { verified: true, verifiedAt: new Date() },
      create: {
        passportId,
        type: "github",
        level: "basic",
        verified: true,
        verifiedAt: new Date(),
      },
    });

    // Update badges
    await updateBadges(passportId, stats, breakdown.total);

    // Log trust score history
    await db.trustScoreLog.create({
      data: {
        passportId,
        score: breakdown.total,
        breakdown: {
          commitActivity: breakdown.commitActivity,
          projectQuality: breakdown.projectQuality,
          community: breakdown.community,
          packages: breakdown.packages,
          security: breakdown.security,
          verification: breakdown.verification,
          longevity: breakdown.longevity,
        },
      },
    });

    // Update passport
    await db.passport.update({
      where: { id: passportId },
      data: {
        trustScore: breakdown.total,
        displayName: stats.name || undefined,
        bio: stats.bio || undefined,
        location: stats.location || undefined,
        website: stats.blog || undefined,
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

async function updateBadges(passportId: string, stats: { repos: { stars: number; isFork: boolean }[]; totalStars: number }, trustScore: number) {
  const totalStars = stats.totalStars;
  const ownRepos = stats.repos.filter((r) => !r.isFork);

  const badgeDefs = [
    { type: "oss_maintainer", label: "OSS Maintainer", earned: ownRepos.length >= 3 },
    { type: "top_reviewer", label: "Top Reviewer", earned: trustScore >= 700 },
    { type: "security_expert", label: "Security Expert", earned: false },
    { type: "1000_commits", label: "1000 Commits", earned: trustScore >= 600 },
    { type: "50_releases", label: "50 Releases", earned: ownRepos.length >= 10 },
    { type: "bug_hunter", label: "Bug Hunter", earned: false },
    { type: "docs_master", label: "Documentation Master", earned: false },
    { type: "oss_sponsor", label: "OSS Sponsor", earned: false },
    { type: "ai_builder", label: "AI Builder", earned: false },
  ];

  for (const badge of badgeDefs) {
    await db.badge.upsert({
      where: { passportId_type: { passportId, type: badge.type } },
      update: { earned: badge.earned, earnedAt: badge.earned ? new Date() : null },
      create: {
        passportId,
        type: badge.type,
        label: badge.label,
        earned: badge.earned,
        earnedAt: badge.earned ? new Date() : null,
      },
    });
  }
}
