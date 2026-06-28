import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, notFound } from "@/lib/api-helpers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const org = await db.organization.findUnique({
    where: { slug: slug.toLowerCase() },
    include: {
      teamPassport: {
        include: {
          members: {
            include: {
              passport: {
                select: {
                  username: true,
                  displayName: true,
                  title: true,
                  trustScore: true,
                  skills: { orderBy: { score: "desc" }, take: 3 },
                  badges: { where: { earned: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!org || !org.teamPassport) return notFound("Team Passport");

  const tp = org.teamPassport;
  const avgTrust = Math.round(
    tp.members.reduce((s, m) => s + m.passport.trustScore, 0) /
      Math.max(tp.members.length, 1)
  );

  return ok({
    organization: {
      name: org.name,
      slug: org.slug,
      description: org.description,
      website: org.website,
      logoUrl: org.logoUrl,
      verified: org.verified,
    },
    team: {
      name: tp.name,
      description: tp.description,
      trustScore: tp.trustScore || avgTrust,
      velocity: tp.velocity,
      healthScore: tp.healthScore,
      memberCount: tp.members.length,
    },
    members: tp.members.map((m) => ({
      username: m.passport.username,
      displayName: m.passport.displayName,
      title: m.passport.title,
      role: m.role,
      trustScore: m.passport.trustScore,
      topSkills: m.passport.skills,
      badges: m.passport.badges.length,
      passportUrl: `https://p.krl.kr/${m.passport.username}`,
    })),
  });
}

export async function OPTIONS() {
  return ok(null);
}
