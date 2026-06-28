import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { ok, err } from "@/lib/api-helpers";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  const passport = await db.passport.findUnique({ where: { userId: session.user.id } });
  if (!passport) return err("No passport found");

  const { name } = z.object({ name: z.string().min(1).max(60) }).parse(await req.json());

  const keyCount = await db.apiKey.count({ where: { passportId: passport.id, active: true } });
  if (keyCount >= 10) return err("Maximum 10 API keys allowed");

  const key = `dp_${randomBytes(24).toString("hex")}`;

  const apiKey = await db.apiKey.create({
    data: { passportId: passport.id, name, key },
  });

  return ok({ apiKey: { id: apiKey.id, name: apiKey.name, key: apiKey.key, lastUsedAt: null, createdAt: apiKey.createdAt }, key }, 201);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  const passport = await db.passport.findUnique({ where: { userId: session.user.id } });
  if (!passport) return err("No passport found");

  const { id } = await req.json();
  const apiKey = await db.apiKey.findFirst({ where: { id, passportId: passport.id } });
  if (!apiKey) return err("Not found", 404);

  await db.apiKey.update({ where: { id }, data: { active: false } });
  return ok({ revoked: true });
}
