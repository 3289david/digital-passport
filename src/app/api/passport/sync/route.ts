import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { syncPassport } from "@/lib/sync";
import { ok, err } from "@/lib/api-helpers";

export async function POST(_req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  const passport = await db.passport.findUnique({ where: { userId: session.user.id } });
  if (!passport) return err("No passport found");

  if (passport.syncStatus === "syncing") return err("Sync already in progress");

  // Kick off sync asynchronously (fire and forget for now; in prod use a queue)
  syncPassport(passport.id).catch(console.error);

  return ok({ message: "Sync started", passportId: passport.id });
}
