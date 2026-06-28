import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { ok, err } from "@/lib/api-helpers";

const schema = z.object({
  platform: z.enum(["github", "gitlab", "npm", "docker", "pypi", "crates", "huggingface", "vercel", "cloudflare", "stackoverflow", "x", "discord"]),
  handle: z.string().min(1).max(100),
  url: z.string().url().optional(),
  accessToken: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  const passport = await db.passport.findUnique({ where: { userId: session.user.id } });
  if (!passport) return err("No passport found");

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { platform, handle, url, accessToken } = parsed.data;

  const connection = await db.connectedAccount.upsert({
    where: { passportId_platform: { passportId: passport.id, platform } },
    update: { handle, url, accessToken, verified: false },
    create: { passportId: passport.id, platform, handle, url, accessToken },
  });

  return ok({ connection });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  const passport = await db.passport.findUnique({ where: { userId: session.user.id } });
  if (!passport) return err("No passport found");

  const { platform } = await req.json();
  await db.connectedAccount.deleteMany({ where: { passportId: passport.id, platform } });

  return ok({ deleted: true });
}
