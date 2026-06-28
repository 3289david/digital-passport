import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export function ok(data: unknown, status = 200) {
  return NextResponse.json(
    { success: true, data },
    {
      status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
      },
    }
  );
}

export function err(message: string, status = 400) {
  return NextResponse.json(
    { success: false, error: message },
    {
      status,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}

export function notFound(resource = "Resource") {
  return err(`${resource} not found`, 404);
}

export async function resolvePassport(username: string) {
  return db.passport.findUnique({
    where: { username: username.toLowerCase() },
  });
}

export async function validateApiKey(key: string | null) {
  if (!key) return null;
  const apiKey = await db.apiKey.findUnique({
    where: { key },
    include: { passport: true },
  });
  if (!apiKey || !apiKey.active) return null;
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return null;

  await db.apiKey.update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } });
  return apiKey;
}
