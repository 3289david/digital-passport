import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Developer Visas | Digital Passport" };

export default async function VisaPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const passport = await db.passport.findUnique({
    where: { userId: session.user.id },
    include: {
      visasReceived: {
        where: { active: true },
        include: { organization: { select: { name: true, slug: true, logoUrl: true, verified: true } } },
        orderBy: { issuedAt: "desc" },
      },
    },
  });

  if (!passport) redirect("/onboarding");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "32px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Developer Visas</h1>
            <p style={{ color: "var(--text-secondary)", margin: "6px 0 0", fontSize: 14 }}>
              Endorsements issued to your passport by verified organizations.
            </p>
          </div>
          <Link href="/dashboard" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none", padding: "6px 14px", border: "1px solid var(--border)", borderRadius: 8 }}>
            Dashboard
          </Link>
        </div>

        {passport.visasReceived.length === 0 ? (
          <div className="card" style={{ padding: "48px 32px", textAlign: "center" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ margin: "0 auto 16px" }}>
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>No visas yet. Visas are issued by organizations that endorse your work.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {passport.visasReceived.map((visa) => (
              <div key={visa.id} className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 16 }}>
                {/* Org logo or fallback */}
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--bg-elevated)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {visa.organization.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={visa.organization.logoUrl} alt={visa.organization.name} style={{ width: 28, height: 28, objectFit: "contain" }} />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>{visa.title}</span>
                    {visa.organization.verified && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#4361ee">
                        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )}
                  </div>

                  <div style={{ fontSize: 13, color: "var(--text-secondary)", margin: "4px 0" }}>
                    Issued by{" "}
                    <Link href={`/${visa.organization.slug}`} style={{ color: "var(--accent)", textDecoration: "none" }}>
                      {visa.organization.name}
                    </Link>
                    {" · "}
                    {new Date(visa.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </div>

                  {visa.description && (
                    <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "8px 0 0", lineHeight: 1.6 }}>{visa.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="card" style={{ padding: "20px 24px", marginTop: 24 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>How Visas Work</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>
            Developer Visas are endorsements issued directly to your passport by verified organizations — companies, open source communities, bootcamps, or other groups. They appear on your public profile and signal that a specific org has vetted and endorsed your work. Organizations issue them via their Team Passport dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
