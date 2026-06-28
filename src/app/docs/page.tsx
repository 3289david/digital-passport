import Link from "next/link";
import { AppNav } from "@/components/AppNav";

const SECTIONS = [
  { title: "Getting Started", links: [{ label: "Introduction", href: "/docs" }, { label: "Quick start", href: "/docs" }, { label: "Claiming your passport", href: "/how-it-works" }] },
  { title: "Integrations", links: [{ label: "Connecting GitHub", href: "/integrations" }, { label: "Connecting npm", href: "/integrations" }, { label: "All platforms", href: "/integrations" }] },
  { title: "API", links: [{ label: "API overview", href: "/api-docs" }, { label: "Authentication", href: "/docs/api" }, { label: "Full reference", href: "/docs/api" }] },
  { title: "For Companies", links: [{ label: "Developer Visa", href: "/companies/developer-visa" }, { label: "Team Passport", href: "/companies/team-passport" }, { label: "Enterprise", href: "/companies/enterprise" }] },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <AppNav minimal />

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <h1 className="text-5xl font-bold mb-4" style={{ color: "#e8eaf4" }}>Documentation</h1>
        <p className="text-lg mb-12" style={{ color: "#8b92a8" }}>
          Everything you need to set up, customize, and integrate your Digital Passport.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {SECTIONS.map((section) => (
            <div key={section.title} className="card p-6">
              <h2 className="font-semibold text-sm uppercase tracking-widest mb-4" style={{ color: "#8b92a8" }}>{section.title}</h2>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="flex items-center gap-2 text-sm transition-colors hover:text-[#4361ee]" style={{ color: "#e8eaf4" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 card p-6 flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm mb-1" style={{ color: "#e8eaf4" }}>Need help?</div>
            <p className="text-xs" style={{ color: "#4a506a" }}>Can't find what you're looking for? Reach out directly.</p>
          </div>
          <Link href="/contact" className="text-sm font-medium px-4 py-2 rounded-lg shrink-0" style={{ background: "#4361ee", color: "#fff" }}>
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
