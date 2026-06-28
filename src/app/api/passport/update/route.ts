import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { ok, err } from "@/lib/api-helpers";

const schema = z.object({
  displayName: z.string().max(60).optional(),
  title: z.string().max(80).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(80).optional(),
  website: z.string().url().optional().or(z.literal("")),
  twitterHandle: z.string().max(50).optional(),
  available: z.boolean().optional(),
  availabilityNote: z.string().max(120).optional(),
});

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  const passport = await db.passport.findUnique({ where: { userId: session.user.id } });
  if (!passport) return err("No passport found");

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const updated = await db.passport.update({
    where: { id: passport.id },
    data: parsed.data,
  });

  return ok({ passport: updated });
}
