import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const passport = await db.passport.findUnique({
    where: { username: username.toLowerCase() },
    include: { site: true },
  });
  if (!passport) return { title: "Not Found" };
  return {
    title: passport.site?.title ?? `${passport.displayName ?? username} — Developer`,
    description: passport.bio ?? undefined,
  };
}

export default async function DevSitePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const passport = await db.passport.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      site: true,
      skills: { orderBy: { score: "desc" }, take: 8 },
      projects: { where: { featured: true }, orderBy: { stars: "desc" }, take: 6 },
      badges: { where: { earned: true } },
      connections: { where: { public: true } },
    },
  });

  if (!passport) notFound();

  const site = passport.site;
  const theme = site?.theme ?? "minimal";
  const accent = site?.accentColor ?? "#4361ee";

  if (theme === "terminal") return <TerminalTheme passport={passport} site={site} accent={accent} />;
  if (theme === "card") return <CardTheme passport={passport} site={site} accent={accent} />;
  if (theme === "portfolio") return <PortfolioTheme passport={passport} site={site} accent={accent} />;
  return <MinimalTheme passport={passport} site={site} accent={accent} />;
}

type PassportData = Awaited<ReturnType<typeof db.passport.findUnique>> & {
  site: { theme: string; title: string | null; headline: string | null; ctaText: string | null; ctaUrl: string | null; showProjects: boolean; showSkills: boolean; showBadges: boolean; showContact: boolean; accentColor: string; customCss: string | null } | null;
  skills: { name: string; score: number; color: string | null }[];
  projects: { name: string; fullName: string | null; description: string | null; stars: number; language: string | null; languageColor: string | null; url: string | null; healthScore: number; license: string | null; contributors: number; startedAt: string | null; downloads: number | null }[];
  badges: { label: string }[];
  connections: { platform: string; handle: string; url: string | null }[];
};

function MinimalTheme({ passport, site, accent }: { passport: PassportData; site: PassportData["site"]; accent: string }) {
  const name = passport.displayName ?? passport.username;
  return (
    <div className="min-h-screen" style={{ background: "#07080d", color: "#e8eaf4" }}>
      {site?.customCss && <style>{site.customCss}</style>}

      {/* Nav */}
      <nav className="border-b" style={{ borderColor: "#1c2035" }}>
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold mono" style={{ color: accent }}>{passport.username}</span>
          <Link href={`/${passport.username}`} className="text-xs" style={{ color: "#4a506a" }}>
            View Passport
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-sm font-medium mb-4 mono" style={{ color: accent }}>Developer</p>
        <h1 className="text-5xl font-bold mb-4 leading-tight">{site?.title ?? name}</h1>
        <p className="text-xl mb-8 leading-relaxed" style={{ color: "#8b92a8" }}>
          {site?.headline ?? passport.bio ?? `${name} builds things.`}
        </p>
        <div className="flex flex-wrap gap-3">
          {site?.ctaText && site?.ctaUrl && (
            <a href={site.ctaUrl} className="px-6 py-3 rounded-xl font-semibold text-sm" style={{ background: accent, color: "#fff" }}>
              {site.ctaText}
            </a>
          )}
          <Link href={`/${passport.username}`} className="px-6 py-3 rounded-xl font-semibold text-sm" style={{ background: "#0d0f18", border: "1px solid #1c2035" }}>
            View Passport
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 pb-24 flex flex-col gap-16">
        {/* Skills */}
        {site?.showSkills !== false && passport.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#8b92a8" }}>Skills</h2>
            <div className="flex flex-col gap-3">
              {passport.skills.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="text-sm mono w-24 text-right shrink-0" style={{ color: "#8b92a8" }}>{s.name}</span>
                  <div className="flex-1 rounded-full" style={{ height: 5, background: "#1c2035" }}>
                    <div style={{ width: `${s.score}%`, height: "100%", background: s.color ?? accent, borderRadius: 999 }} />
                  </div>
                  <span className="text-xs mono w-8 shrink-0" style={{ color: s.color ?? accent }}>{s.score}%</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {site?.showProjects !== false && passport.projects.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#8b92a8" }}>Projects</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {passport.projects.map((p) => (
                <a key={p.name} href={p.url ?? "#"} target="_blank" rel="noopener noreferrer" className="block rounded-xl p-4 transition-colors" style={{ background: "#0d0f18", border: "1px solid #1c2035" }}>
                  <div className="font-semibold mono text-sm mb-1">{p.fullName ?? p.name}</div>
                  {p.description && <p className="text-xs mb-3 line-clamp-2" style={{ color: "#4a506a" }}>{p.description}</p>}
                  <div className="flex items-center gap-3 text-xs" style={{ color: "#4a506a" }}>
                    {p.language && <div className="flex items-center gap-1"><div className="rounded-full" style={{ width: 8, height: 8, background: p.languageColor ?? "#8b92a8" }} />{p.language}</div>}
                    <span>{p.stars} stars</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Badges */}
        {site?.showBadges !== false && passport.badges.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#8b92a8" }}>Badges</h2>
            <div className="flex flex-wrap gap-2">
              {passport.badges.map((b) => (
                <span key={b.label} className="text-xs px-3 py-1 rounded-full" style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}>
                  {b.label}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        {site?.showContact !== false && passport.connections.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#8b92a8" }}>Find me</h2>
            <div className="flex flex-wrap gap-3">
              {passport.connections.map((c) => (
                <a key={c.platform} href={c.url ?? `https://${c.platform}.com/${c.handle}`} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-2 rounded-lg capitalize" style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#8b92a8" }}>
                  {c.platform} / {c.handle}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function TerminalTheme({ passport, site, accent }: { passport: PassportData; site: PassportData["site"]; accent: string }) {
  const name = passport.displayName ?? passport.username;
  const green = "#10b981";
  return (
    <div className="min-h-screen font-mono" style={{ background: "#030507", color: green }}>
      {site?.customCss && <style>{site.customCss}</style>}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8" style={{ color: "#4a506a" }}>
          <span style={{ color: green }}>root@p.krl.kr</span>:<span style={{ color: "#4361ee" }}>~/{passport.username}</span>$ whoami
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: green }}>{site?.title ?? name}</h1>
        <p className="mb-8" style={{ color: "#4a506a" }}>{site?.headline ?? passport.bio ?? ""}</p>

        {site?.showSkills !== false && passport.skills.length > 0 && (
          <div className="mb-8">
            <div className="mb-3" style={{ color: "#4a506a" }}>$ <span style={{ color: green }}>cat skills.txt</span></div>
            {passport.skills.map((s) => (
              <div key={s.name} className="flex items-center gap-3 mb-1">
                <span className="w-24 text-right" style={{ color: "#4a506a" }}>{s.name}</span>
                <span style={{ color: green }}>{"█".repeat(Math.round(s.score / 10))}{"░".repeat(10 - Math.round(s.score / 10))}</span>
                <span style={{ color: "#4a506a" }}>{s.score}%</span>
              </div>
            ))}
          </div>
        )}

        {site?.showProjects !== false && passport.projects.length > 0 && (
          <div className="mb-8">
            <div className="mb-3" style={{ color: "#4a506a" }}>$ <span style={{ color: green }}>ls projects/</span></div>
            {passport.projects.map((p) => (
              <div key={p.name} className="mb-2">
                <a href={p.url ?? "#"} target="_blank" rel="noopener noreferrer" style={{ color: green }}>{p.fullName ?? p.name}</a>
                {p.description && <span style={{ color: "#4a506a" }}> — {p.description}</span>}
              </div>
            ))}
          </div>
        )}

        {site?.ctaText && site?.ctaUrl && (
          <div>
            <div className="mb-2" style={{ color: "#4a506a" }}>$ <span style={{ color: green }}>./contact.sh</span></div>
            <a href={site.ctaUrl} style={{ color: green }}>{site.ctaText}</a>
          </div>
        )}

        <div className="mt-12 text-sm" style={{ color: "#4a506a" }}>
          <Link href={`/${passport.username}`}>view full passport at p.krl.kr/{passport.username}</Link>
        </div>
      </div>
    </div>
  );
}

function CardTheme({ passport, site, accent }: { passport: PassportData; site: PassportData["site"]; accent: string }) {
  const name = passport.displayName ?? passport.username;
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#07080d" }}>
      {site?.customCss && <style>{site.customCss}</style>}
      <div className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center gap-5 text-center"
        style={{ background: "#0d0f18", border: "1px solid #1c2035", boxShadow: `0 0 60px ${accent}22` }}>
        <div className="rounded-2xl flex items-center justify-center text-3xl font-bold"
          style={{ width: 72, height: 72, background: `linear-gradient(135deg, ${accent}, #7b2ff7)`, color: "#fff" }}>
          {name[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#e8eaf4" }}>{site?.title ?? name}</h1>
          {passport.title && <p className="text-sm mt-1" style={{ color: "#8b92a8" }}>{passport.title}</p>}
          {passport.available && (
            <div className="inline-flex items-center gap-1 mt-2 text-xs px-2 py-0.5 rounded-full"
              style={{ background: "#10b98118", color: "#10b981", border: "1px solid #10b98140" }}>
              Open to work
            </div>
          )}
        </div>
        {passport.bio && <p className="text-sm leading-relaxed" style={{ color: "#8b92a8" }}>{passport.bio}</p>}
        {site?.showSkills !== false && passport.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-center">
            {passport.skills.slice(0, 6).map((s) => (
              <span key={s.name} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${s.color ?? accent}18`, color: s.color ?? accent, border: `1px solid ${s.color ?? accent}30` }}>{s.name}</span>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-2 w-full">
          {site?.ctaText && site?.ctaUrl && (
            <a href={site.ctaUrl} className="w-full py-3 rounded-xl font-semibold text-sm text-center" style={{ background: accent, color: "#fff" }}>{site.ctaText}</a>
          )}
          <Link href={`/${passport.username}`} className="w-full py-3 rounded-xl font-semibold text-sm text-center" style={{ background: "#131520", border: "1px solid #1c2035", color: "#e8eaf4" }}>
            View Passport
          </Link>
        </div>
        <div className="flex gap-4">
          {passport.connections.slice(0, 4).map((c) => (
            <a key={c.platform} href={c.url ?? "#"} target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: "#4a506a" }}>
              {c.platform}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function PortfolioTheme({ passport, site, accent }: { passport: PassportData; site: PassportData["site"]; accent: string }) {
  const name = passport.displayName ?? passport.username;
  return (
    <div className="min-h-screen" style={{ background: "#07080d", color: "#e8eaf4" }}>
      {site?.customCss && <style>{site.customCss}</style>}
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: 480, borderBottom: "1px solid #1c2035" }}>
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 50%, ${accent}22 0%, transparent 60%)` }} />
        <div className="relative max-w-5xl mx-auto px-6 py-32 flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: accent }}>Developer Portfolio</span>
          <h1 className="text-6xl font-bold leading-tight">{site?.title ?? name}</h1>
          <p className="text-xl max-w-2xl leading-relaxed" style={{ color: "#8b92a8" }}>
            {site?.headline ?? passport.bio ?? `${name} builds things.`}
          </p>
          <div className="flex gap-3 flex-wrap">
            {site?.ctaText && site?.ctaUrl && (
              <a href={site.ctaUrl} className="px-8 py-3 rounded-xl font-semibold" style={{ background: accent, color: "#fff" }}>{site.ctaText}</a>
            )}
            <Link href={`/${passport.username}`} className="px-8 py-3 rounded-xl font-semibold" style={{ background: "transparent", border: "1px solid #1c2035" }}>
              Passport
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20 flex flex-col gap-20">
        {site?.showProjects !== false && passport.projects.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-2">Projects</h2>
            <p className="mb-8" style={{ color: "#8b92a8" }}>Selected work</p>
            <div className="grid md:grid-cols-3 gap-4">
              {passport.projects.map((p) => (
                <a key={p.name} href={p.url ?? "#"} target="_blank" rel="noopener noreferrer" className="block rounded-xl p-5 transition-all hover:border-[#4361ee44]" style={{ background: "#0d0f18", border: "1px solid #1c2035" }}>
                  <div className="font-bold mono mb-2">{p.name}</div>
                  {p.description && <p className="text-sm line-clamp-3 mb-4" style={{ color: "#4a506a" }}>{p.description}</p>}
                  <div className="flex items-center gap-3 text-xs" style={{ color: "#4a506a" }}>
                    {p.language && <span>{p.language}</span>}
                    <span>{p.stars} stars</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {site?.showSkills !== false && passport.skills.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8">Skills</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {passport.skills.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="text-sm w-28 shrink-0 text-right" style={{ color: "#8b92a8" }}>{s.name}</span>
                  <div className="flex-1 rounded-full" style={{ height: 6, background: "#1c2035" }}>
                    <div style={{ width: `${s.score}%`, height: "100%", background: s.color ?? accent, borderRadius: 999 }} />
                  </div>
                  <span className="text-sm mono w-8 shrink-0" style={{ color: s.color ?? accent }}>{s.score}%</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {site?.showContact !== false && (
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-4">Get in touch</h2>
            {site?.ctaText && site?.ctaUrl && (
              <a href={site.ctaUrl} className="inline-block px-8 py-3 rounded-xl font-semibold" style={{ background: accent, color: "#fff" }}>{site.ctaText}</a>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
