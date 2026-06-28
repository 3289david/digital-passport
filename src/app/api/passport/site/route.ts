import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { ok, err } from "@/lib/api-helpers";

const schema = z.object({
  theme: z.enum(["minimal", "terminal", "portfolio", "card"]).optional(),
  title: z.string().max(80).optional(),
  headline: z.string().max(200).optional(),
  ctaText: z.string().max(40).optional(),
  ctaUrl: z.string().url().optional().or(z.literal("")),
  showProjects: z.boolean().optional(),
  showSkills: z.boolean().optional(),
  showBadges: z.boolean().optional(),
  showContact: z.boolean().optional(),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  customCss: z.string().max(10000).optional(),
  customHtml: z.string().max(10000).optional(),
  customJs: z.string().max(10000).optional(),
});

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  const passport = await db.passport.findUnique({ where: { userId: session.user.id } });
  if (!passport) return err("No passport found");

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const site = await db.passportSite.upsert({
    where: { passportId: passport.id },
    update: parsed.data,
    create: { passportId: passport.id, ...parsed.data },
  });

  return ok({ site });
}
