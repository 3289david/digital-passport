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
      trustLogs: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!passport) return notFound("Passport");

  const latest = passport.trustLogs[0];

  return ok({
    username: passport.username,
    score: passport.trustScore,
    breakdown: latest?.breakdown ?? null,
    history: passport.trustLogs.map((l) => ({ score: l.score, date: l.createdAt })),
    label:
      passport.trustScore >= 900
        ? "Elite"
        : passport.trustScore >= 700
        ? "Trusted"
        : passport.trustScore >= 500
        ? "Verified"
        : "New",
    percentile:
      passport.trustScore >= 950
        ? "Top 1%"
        : passport.trustScore >= 900
        ? "Top 2%"
        : passport.trustScore >= 800
        ? "Top 10%"
        : passport.trustScore >= 600
        ? "Top 25%"
        : null,
  });
}

export async function OPTIONS() {
  return ok(null);
}
