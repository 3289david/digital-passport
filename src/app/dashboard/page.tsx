import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const passport = await db.passport.findUnique({
    where: { userId: session.user.id },
    include: {
      connections: true,
      projects: { orderBy: { stars: "desc" } },
      packages: { orderBy: { downloads: "desc" } },
      skills: { orderBy: { score: "desc" } },
      badges: true,
      verifications: true,
      experiences: { orderBy: [{ year: "asc" }, { order: "asc" }] },
      site: true,
      apiKeys: { where: { active: true }, orderBy: { createdAt: "desc" } },
      trustLogs: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!passport) redirect("/onboarding");

  return (
    <DashboardClient
      passport={passport as Parameters<typeof DashboardClient>[0]["passport"]}
      user={{ name: session.user.name, email: session.user.email, image: session.user.image }}
    />
  );
}
