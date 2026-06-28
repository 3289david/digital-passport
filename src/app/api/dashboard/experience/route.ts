import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { ok, err } from "@/lib/api-helpers";

const schema = z.object({
  year: z.string().regex(/^\d{4}$/),
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  type: z.enum(["project", "company", "milestone", "education"]),
  order: z.number().int().optional(),
  url: z.string().url().optional().or(z.literal("")),
});

async function getPassport(userId: string) {
  return db.passport.findUnique({ where: { userId } });
}

export async function GET(_req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);
  const passport = await getPassport(session.user.id);
  if (!passport) return err("No passport found");
  const items = await db.experience.findMany({
    where: { passportId: passport.id },
    orderBy: [{ year: "asc" }, { order: "asc" }],
  });
  return ok({ items });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);
  const passport = await getPassport(session.user.id);
  if (!passport) return err("No passport found");

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const item = await db.experience.create({ data: { ...parsed.data, passportId: passport.id } });
  return ok({ item }, 201);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);
  const passport = await getPassport(session.user.id);
  if (!passport) return err("No passport found");

  const { id, ...data } = await req.json();
  const parsed = schema.safeParse(data);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  // verify ownership
  const item = await db.experience.findFirst({ where: { id, passportId: passport.id } });
  if (!item) return err("Not found", 404);

  const updated = await db.experience.update({ where: { id }, data: parsed.data });
  return ok({ item: updated });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);
  const passport = await getPassport(session.user.id);
  if (!passport) return err("No passport found");

  const { id } = await req.json();
  const item = await db.experience.findFirst({ where: { id, passportId: passport.id } });
  if (!item) return err("Not found", 404);

  await db.experience.delete({ where: { id } });
  return ok({ deleted: true });
}
