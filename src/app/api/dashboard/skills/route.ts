import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { ok, err } from "@/lib/api-helpers";

const schema = z.object({
  name: z.string().min(1).max(40),
  score: z.number().int().min(0).max(100),
  color: z.string().optional(),
  category: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);
  const passport = await db.passport.findUnique({ where: { userId: session.user.id } });
  if (!passport) return err("No passport found");

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const skill = await db.skill.upsert({
    where: { passportId_name: { passportId: passport.id, name: parsed.data.name } },
    update: parsed.data,
    create: { passportId: passport.id, ...parsed.data },
  });
  return ok({ skill });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);
  const passport = await db.passport.findUnique({ where: { userId: session.user.id } });
  if (!passport) return err("No passport found");

  const { name } = await req.json();
  await db.skill.deleteMany({ where: { passportId: passport.id, name } });
  return ok({ deleted: true });
}
