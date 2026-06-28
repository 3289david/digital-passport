import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { ok, err, notFound } from "@/lib/api-helpers";

const issueSchema = z.object({
  recipientUsername: z.string().min(1),
  organizationSlug: z.string().min(1),
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  expiresAt: z.string().datetime().optional(),
});

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (!username) return err("username query param required");

  const passport = await db.passport.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      visasReceived: {
        where: { active: true },
        include: {
          organization: { select: { name: true, slug: true, logoUrl: true, verified: true, website: true } },
        },
        orderBy: { issuedAt: "desc" },
      },
    },
  });

  if (!passport) return notFound("Passport");
  return ok({ visas: passport.visasReceived });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  const parsed = issueSchema.safeParse(await req.json());
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { recipientUsername, organizationSlug, title, description, expiresAt } = parsed.data;

  const org = await db.organization.findUnique({ where: { slug: organizationSlug } });
  if (!org) return notFound("Organization");

  // Only org owner can issue visas
  if (org.ownerId !== session.user.id) return err("Forbidden — only the organization owner can issue visas", 403);

  const recipient = await db.passport.findUnique({ where: { username: recipientUsername } });
  if (!recipient) return notFound("Recipient passport");

  const visa = await db.developerVisa.create({
    data: {
      organizationId: org.id,
      passportId: recipient.id,
      title,
      description,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  return ok({ visa }, 201);
}
