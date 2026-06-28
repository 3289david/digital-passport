import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PrintButton } from "@/components/PrintButton";

export default async function PrintPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const passport = await db.passport.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      skills: { orderBy: { score: "desc" }, take: 10 },
      projects: { where: { featured: true }, orderBy: { stars: "desc" }, take: 6 },
      packages: { orderBy: { downloads: "desc" }, take: 8 },
      badges: { where: { earned: true } },
      connections: { where: { public: true } },
      experiences: { orderBy: [{ year: "asc" }, { order: "asc" }] },
      visasReceived: { where: { active: true }, include: { organization: true } },
    },
  });

  if (!passport) notFound();

  const name = passport.displayName ?? passport.username;
  const totalDownloads = passport.packages.reduce((s, p) => s + p.downloads, 0);
  const totalStars = passport.projects.reduce((s, p) => s + p.stars, 0);

  return (
    <>
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          a { color: inherit !important; text-decoration: none !important; }
          @page { margin: 15mm; }
        }
        body { font-family: 'Geist', 'Inter', system-ui, sans-serif; }
      `}</style>

      {/* Print button (hidden when printing) */}
      <PrintButton username={passport.username} />

      {/* Print layout */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 32px", color: "#111", background: "#fff", minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #111", paddingBottom: 16, marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: -1 }}>{name}</h1>
            {passport.title && <p style={{ fontSize: 16, color: "#555", margin: "4px 0 0" }}>{passport.title}</p>}
            {passport.location && <p style={{ fontSize: 13, color: "#777", margin: "4px 0 0" }}>{passport.location}</p>}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: "#555" }}>p.krl.kr/{passport.username}</div>
            {passport.website && <div style={{ fontSize: 13, color: "#555" }}>{passport.website.replace(/^https?:\/\//, "")}</div>}
            <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>Trust Score: <strong style={{ color: "#4361ee" }}>{passport.trustScore}/1000</strong></div>
            {passport.connections.filter((c) => ["github", "x"].includes(c.platform)).map((c) => (
              <div key={c.platform} style={{ fontSize: 12, color: "#999" }}>{c.platform}: {c.handle}</div>
            ))}
          </div>
        </div>

        {/* Bio */}
        {passport.bio && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "#333", margin: 0 }}>{passport.bio}</p>
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: "flex", gap: 24, marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid #eee" }}>
          {[
            { label: "Trust Score", value: `${passport.trustScore}/1000` },
            { label: "Projects", value: passport.projects.length },
            { label: "Stars", value: totalStars >= 1000 ? `${(totalStars/1000).toFixed(1)}K` : totalStars },
            { label: "Packages", value: passport.packages.length },
            { label: "Downloads", value: totalDownloads >= 1000000 ? `${(totalDownloads/1000000).toFixed(1)}M` : totalDownloads >= 1000 ? `${(totalDownloads/1000).toFixed(0)}K` : totalDownloads },
          ].filter((s) => Number(s.value) !== 0 || typeof s.value === "string").map(({ label, value }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#4361ee" }}>{value}</div>
              <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Two column */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div>
            {/* Skills */}
            {passport.skills.length > 0 && (
              <section style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#999", margin: "0 0 10px" }}>Skills</h2>
                {passport.skills.map((s) => (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 13, width: 90, textAlign: "right", color: "#555" }}>{s.name}</span>
                    <div style={{ flex: 1, height: 4, background: "#f0f0f0", borderRadius: 999 }}>
                      <div style={{ width: `${s.score}%`, height: "100%", background: s.color ?? "#4361ee", borderRadius: 999 }} />
                    </div>
                    <span style={{ fontSize: 12, color: "#999", width: 32 }}>{s.score}%</span>
                  </div>
                ))}
              </section>
            )}

            {/* Badges */}
            {passport.badges.length > 0 && (
              <section style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#999", margin: "0 0 10px" }}>Verified Badges</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {passport.badges.map((b) => (
                    <span key={b.label} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: "#f0f4ff", color: "#4361ee", border: "1px solid #c7d2fe" }}>{b.label}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Visas */}
            {passport.visasReceived.length > 0 && (
              <section style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#999", margin: "0 0 10px" }}>Developer Visas</h2>
                {passport.visasReceived.map((v) => (
                  <div key={v.id} style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{v.title}</div>
                    <div style={{ fontSize: 12, color: "#999" }}>Issued by {v.organization.name} · {new Date(v.issuedAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </section>
            )}
          </div>

          <div>
            {/* Experience */}
            {passport.experiences.length > 0 && (
              <section style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#999", margin: "0 0 10px" }}>Experience</h2>
                {passport.experiences.map((e, i) => (
                  <div key={i} style={{ marginBottom: 10, paddingLeft: 12, borderLeft: "2px solid #e5e7eb" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#4361ee" }}>{e.year}</span>
                      <span style={{ fontSize: 11, color: "#999", textTransform: "capitalize" }}>{e.type}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{e.title}</div>
                    {e.description && <div style={{ fontSize: 12, color: "#777" }}>{e.description}</div>}
                  </div>
                ))}
              </section>
            )}

            {/* Projects */}
            {passport.projects.length > 0 && (
              <section>
                <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#999", margin: "0 0 10px" }}>Projects</h2>
                {passport.projects.map((p) => (
                  <div key={p.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{p.fullName ?? p.name}</span>
                      <span style={{ fontSize: 12, color: "#4361ee" }}>{p.stars} stars</span>
                    </div>
                    {p.description && <div style={{ fontSize: 12, color: "#777" }}>{p.description}</div>}
                    {p.language && <span style={{ fontSize: 11, color: "#999" }}>{p.language}</span>}
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 32, paddingTop: 12, borderTop: "1px solid #eee", display: "flex", justifyContent: "space-between", fontSize: 11, color: "#bbb" }}>
          <span>Generated from Digital Passport — p.krl.kr/{passport.username}</span>
          <span>Passport #{passport.passportNumber.slice(0, 12)}</span>
        </div>
      </div>
    </>
  );
}
