import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { ok, err } from "@/lib/api-helpers";

const schema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-z0-9_-]+$/, "Only lowercase letters, numbers, hyphens and underscores"),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message);

  const { username } = parsed.data;

  const RESERVED = ["admin", "api", "login", "logout", "signup", "dashboard", "onboarding", "settings", "teams", "visa", "recruiter", "about", "blog", "docs", "status", "help", "support"];
  if (RESERVED.includes(username)) return err("This username is reserved");

  const existing = await db.passport.findUnique({ where: { userId: session.user.id } });
  if (existing) return err("You already have a passport");

  const taken = await db.passport.findUnique({ where: { username } });
  if (taken) return err("Username is already taken");

  const passport = await db.passport.create({
    data: {
      userId: session.user.id,
      username,
      displayName: session.user.name,
      syncStatus: "pending",
    },
  });

  // Seed default badges
  const BADGE_DEFS = [
    { type: "oss_maintainer", label: "OSS Maintainer" },
    { type: "security_expert", label: "Security Expert" },
    { type: "top_reviewer", label: "Top Reviewer" },
    { type: "1000_commits", label: "1000 Commits" },
    { type: "50_releases", label: "50 Releases" },
    { type: "bug_hunter", label: "Bug Hunter" },
    { type: "docs_master", label: "Documentation Master" },
    { type: "oss_sponsor", label: "OSS Sponsor" },
    { type: "ai_builder", label: "AI Builder" },
    { type: "rust_expert", label: "Rust Expert" },
  ];
  await db.badge.createMany({ data: BADGE_DEFS.map((b) => ({ ...b, passportId: passport.id })) });

  // Seed default verifications
  await db.verification.upsert({
    where: { passportId_type: { passportId: passport.id, type: "email" } },
    update: { verified: !!session.user.email, verifiedAt: session.user.email ? new Date() : null },
    create: { passportId: passport.id, type: "email", level: "basic", verified: !!session.user.email, verifiedAt: session.user.email ? new Date() : null },
  });

  // Create default site
  await db.passportSite.create({ data: { passportId: passport.id } });

  // Auto-link GitHub if signed in with GitHub OAuth
  let githubHandle: string | null = null;
  try {
    const githubAccount = await db.account.findFirst({
      where: { userId: session.user.id, provider: "github" },
      select: { access_token: true },
    });
    if (githubAccount?.access_token) {
      const ghResp = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${githubAccount.access_token}`,
          "User-Agent": "digital-passport/1.0",
          Accept: "application/vnd.github+json",
        },
      });
      if (ghResp.ok) {
        const ghUser = await ghResp.json();
        githubHandle = ghUser.login as string;
        await db.connectedAccount.upsert({
          where: { passportId_platform: { passportId: passport.id, platform: "github" } },
          update: { handle: githubHandle, verified: true },
          create: { passportId: passport.id, platform: "github", handle: githubHandle, verified: true, public: true },
        });
        await db.verification.upsert({
          where: { passportId_type: { passportId: passport.id, type: "github" } },
          update: { verified: true, verifiedAt: new Date() },
          create: { passportId: passport.id, type: "github", level: "basic", verified: true, verifiedAt: new Date() },
        });
      }
    }
  } catch {
    // Non-fatal: GitHub auto-link failed, user can connect manually
  }

  return ok({ username: passport.username, passportId: passport.id, githubHandle }, 201);
}
