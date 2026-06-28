import Link from "next/link";
import { PassportLogoIcon } from "@/components/icons/PlatformIcons";

export default function ContactPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b" style={{ borderColor: "#1c2035" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <PassportLogoIcon size={28} />
            <span className="font-semibold text-sm" style={{ color: "#e8eaf4" }}>Digital Passport</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pt-28 pb-24">
        <h1 className="text-5xl font-bold mb-4" style={{ color: "#e8eaf4" }}>Contact</h1>
        <p className="text-lg mb-12" style={{ color: "#8b92a8" }}>
          Questions, feedback, enterprise inquiries, or just want to say hi?
        </p>

        <div className="flex flex-col gap-4 mb-10">
          {[
            { label: "General", email: "hello@p.krl.kr", desc: "Questions about Digital Passport" },
            { label: "Enterprise & Sales", email: "sales@p.krl.kr", desc: "Team Passport, Developer Visa, API access" },
            { label: "Privacy", email: "privacy@p.krl.kr", desc: "Data requests and privacy questions" },
            { label: "Security", email: "security@p.krl.kr", desc: "Report a vulnerability" },
          ].map((c) => (
            <div key={c.label} className="card p-5 flex items-center gap-5">
              <div className="flex-1">
                <div className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#4a506a" }}>{c.label}</div>
                <div className="font-medium text-sm" style={{ color: "#e8eaf4" }}>{c.desc}</div>
              </div>
              <a
                href={`mailto:${c.email}`}
                className="text-sm font-medium shrink-0"
                style={{ color: "#4361ee" }}
              >
                {c.email}
              </a>
            </div>
          ))}
        </div>

        <div className="card p-8 text-center">
          <p className="text-sm mb-1" style={{ color: "#8b92a8" }}>Response time</p>
          <p className="text-xs" style={{ color: "#4a506a" }}>We typically reply within 24 hours on business days. Enterprise inquiries get priority response.</p>
        </div>
      </div>
    </div>
  );
}
