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
      experiences: { orderBy: [{ year: "asc" }, { order: "asc" }] },
      contributionYears: { orderBy: { year: "asc" } },
    },
  });
  if (!passport) return notFound("Passport");
  return ok({
    username: passport.username,
    experiences: passport.experiences,
    contributions: passport.contributionYears.map((cy) => ({
      year: cy.year,
      weeks: cy.weeks,
    })),
  });
}

export async function OPTIONS() {
  return ok(null);
}
