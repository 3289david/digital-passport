import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, notFound } from "@/lib/api-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const featured = req.nextUrl.searchParams.get("featured") === "true";

  const passport = await db.passport.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      projects: {
        where: featured ? { featured: true } : {},
        orderBy: { stars: "desc" },
        take: featured ? 6 : 50,
      },
    },
  });
  if (!passport) return notFound("Passport");
  return ok({ username: passport.username, projects: passport.projects });
}

export async function OPTIONS() {
  return ok(null);
}
