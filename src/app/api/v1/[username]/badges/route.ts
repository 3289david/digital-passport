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
    include: { badges: { orderBy: { earnedAt: "desc" } } },
  });
  if (!passport) return notFound("Passport");
  return ok({ username: passport.username, badges: passport.badges });
}

export async function OPTIONS() {
  return ok(null);
}
