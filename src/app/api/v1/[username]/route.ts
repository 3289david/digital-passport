import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, notFound } from "@/lib/api-helpers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const passport = await db.passport.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      connections: { where: { public: true }, select: { platform: true, handle: true, url: true, verified: true, metadata: true } },
      projects: { where: { featured: true }, orderBy: { stars: "desc" }, take: 6 },
      packages: { orderBy: { downloads: "desc" }, take: 10 },
      skills: { orderBy: { score: "desc" } },
      badges: { where: { earned: true } },
      verifications: { where: { verified: true }, select: { type: true, level: true } },
      experiences: { orderBy: [{ year: "asc" }, { order: "asc" }] },
      visasReceived: {
        where: { active: true },
        include: { organization: { select: { name: true, slug: true, logoUrl: true, verified: true } } },
      },
      site: true,
    },
  });

  if (!passport) return notFound("Passport");

  const githubMeta = passport.connections.find((c) => c.platform === "github");

  return ok({
    id: passport.passportNumber,
    username: passport.username,
    displayName: passport.displayName,
    title: passport.title,
    bio: passport.bio,
    location: passport.location,
    website: passport.website,
    available: passport.available,
    availabilityNote: passport.availabilityNote,
    trustScore: passport.trustScore,
    securityScore: passport.securityScore,
    lastSyncedAt: passport.lastSyncedAt,
    connections: passport.connections,
    skills: passport.skills,
    badges: passport.badges.map((b) => ({ type: b.type, label: b.label, earnedAt: b.earnedAt })),
    verifications: passport.verifications,
    experiences: passport.experiences,
    projects: passport.projects,
    packages: passport.packages,
    visas: passport.visasReceived,
    languages: (githubMeta?.metadata as { languages?: unknown })?.languages ?? [],
    passportUrl: `https://p.krl.kr/${passport.username}`,
    siteUrl: `https://p.krl.kr/${passport.username}/site`,
    createdAt: passport.createdAt,
  });
}

export async function OPTIONS() {
  return ok(null);
}
