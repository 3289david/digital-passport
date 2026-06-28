import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ok, err } from "@/lib/api-helpers";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);
  const passport = await db.passport.findUnique({ where: { userId: session.user.id } });
  if (!passport) return err("No passport found");

  const packages = await db.package.findMany({ where: { passportId: passport.id }, orderBy: { downloads: "desc" } });
  return ok({ packages });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);
  const passport = await db.passport.findUnique({ where: { userId: session.user.id } });
  if (!passport) return err("No passport found");

  const { name, registry, version, downloads, description, url } = await req.json();
  if (!name?.trim()) return err("Package name is required");
  if (!registry) return err("Registry is required");

  const pkg = await db.package.upsert({
    where: { passportId_registry_name: { passportId: passport.id, registry, name: name.trim() } },
    update: { version: version || null, downloads: parseInt(String(downloads)) || 0, description: description || null, url: url || null },
    create: {
      passportId: passport.id,
      name: name.trim(),
      registry,
      version: version || null,
      downloads: parseInt(String(downloads)) || 0,
      description: description || null,
      url: url || null,
    },
  });
  return ok({ package: pkg }, 201);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);
  const passport = await db.passport.findUnique({ where: { userId: session.user.id } });
  if (!passport) return err("No passport found");

  const { id } = await req.json();
  const pkg = await db.package.findFirst({ where: { id, passportId: passport.id } });
  if (!pkg) return err("Not found", 404);

  await db.package.delete({ where: { id } });
  return ok({ deleted: true });
}
