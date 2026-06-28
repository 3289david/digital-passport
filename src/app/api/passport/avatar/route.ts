import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { ok, err } from "@/lib/api-helpers";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return err("Unauthorized", 401);

  const passport = await db.passport.findUnique({ where: { userId: session.user.id } });
  if (!passport) return err("No passport found");

  const formData = await req.formData();
  const file = formData.get("avatar") as File | null;
  if (!file) return err("No file provided");

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif"];
  if (!allowedTypes.includes(file.type)) return err("Invalid file type. Use JPEG, PNG, GIF, WebP, or AVIF.");

  if (file.size > 2 * 1024 * 1024) return err("File too large. Maximum size is 2MB.");

  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "avatars");
  await mkdir(uploadsDir, { recursive: true });

  const filename = `${session.user.id}.${ext}`;
  const filepath = path.join(uploadsDir, filename);
  await writeFile(filepath, buffer);

  const avatarUrl = `/uploads/avatars/${filename}?t=${Date.now()}`;
  await db.passport.update({
    where: { id: passport.id },
    data: { avatarUrl },
  });

  return ok({ avatarUrl });
}
