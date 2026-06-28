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

  // Auto-fetch packages when npm or crates.io is connected (fire-and-forget)
  if (platform === "npm" || platform === "crates") {
    const passportId = passport.id;
    (async () => {
      try {
        if (platform === "npm") {
          const { fetchNpmPackages } = await import("@/lib/packages-fetch");
          const pkgs = await fetchNpmPackages(handle);
          for (const pkg of pkgs) {
            await db.package.upsert({
              where: { passportId_registry_name: { passportId, registry: "npm", name: pkg.name } },
              update: { version: pkg.version, downloads: pkg.downloads, description: pkg.description, url: pkg.url },
              create: { passportId, registry: "npm", name: pkg.name, version: pkg.version, downloads: pkg.downloads, description: pkg.description, url: pkg.url },
            });
          }
        } else {
          const { fetchCratesPackages } = await import("@/lib/packages-fetch");
          const pkgs = await fetchCratesPackages(handle);
          for (const pkg of pkgs) {
            await db.package.upsert({
              where: { passportId_registry_name: { passportId, registry: "crates", name: pkg.name } },
              update: { version: pkg.version, downloads: pkg.downloads, description: pkg.description, url: pkg.url },
              create: { passportId, registry: "crates", name: pkg.name, version: pkg.version, downloads: pkg.downloads, description: pkg.description, url: pkg.url },
            });
          }
        }
      } catch {}
    })();
  }

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
