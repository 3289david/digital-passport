import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ok, err } from "@/lib/api-helpers";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);
  const passport = await db.passport.findUnique({ where: { userId: session.user.id } });
  if (!passport) return err("No passport found");

  const { id, featured, description, language, languageColor } = await req.json();
  const project = await db.project.findFirst({ where: { id, passportId: passport.id } });
  if (!project) return err("Not found", 404);

  const updated = await db.project.update({
    where: { id },
    data: {
      ...(featured !== undefined && { featured }),
      ...(description !== undefined && { description }),
      ...(language !== undefined && { language }),
      ...(languageColor !== undefined && { languageColor }),
    },
  });
  return ok({ project: updated });
}
