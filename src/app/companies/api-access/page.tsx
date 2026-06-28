import Link from "next/link";
import { PassportLogoIcon } from "@/components/icons/PlatformIcons";

const ENDPOINTS = [
  { method: "GET", path: "/v1/:username", desc: "Full passport data for a developer" },
  { method: "GET", path: "/v1/:username/trust", desc: "Trust Score and breakdown" },
  { method: "GET", path: "/v1/:username/skills", desc: "Skill Genome with scores" },
  { method: "GET", path: "/v1/:username/projects", desc: "Featured projects list" },
  { method: "GET", path: "/v1/:username/packages", desc: "Published package portfolio" },
  { method: "GET", path: "/v1/:username/badges", desc: "Earned and unearned badges" },
  { method: "GET", path: "/v1/:username/timeline", desc: "Contribution timeline data" },
  { method: "GET", path: "/v1/teams/:slug", desc: "Team passport for an organization" },
];

export default function ApiAccessPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b" style={{ borderColor: "#1c2035" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <PassportLogoIcon size={28} />
            <span className="font-semibold text-sm" style={{ color: "#e8eaf4" }}>Digital Passport</span>
          </Link>
          <Link href="/docs/api" className="text-sm font-medium px-4 py-1.5 rounded-full" style={{ background: "#4361ee", color: "#fff" }}>
            API Docs
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#06b6d4" }}>For Companies</span>
        </div>
        <h1 className="text-5xl font-bold mb-4" style={{ color: "#e8eaf4" }}>API Access</h1>
        <p className="text-lg mb-12 max-w-2xl" style={{ color: "#8b92a8" }}>
          Integrate verified developer identity into your own products. Our REST API exposes every piece of passport data as structured JSON.
        </p>

        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm" style={{ color: "#e8eaf4" }}>Available endpoints</h2>
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: "#10b98118", color: "#10b981" }}>REST · JSON</span>
          </div>
          <div className="flex flex-col gap-2">
            {ENDPOINTS.map((ep) => (
              <div key={ep.path} className="flex items-center gap-3 rounded-lg px-4 py-3" style={{ background: "#131520" }}>
                <span className="text-xs mono font-semibold shrink-0" style={{ color: "#10b981", width: 36 }}>{ep.method}</span>
                <span className="text-xs mono flex-1" style={{ color: "#4361ee" }}>api.p.krl.kr{ep.path}</span>
                <span className="text-xs hidden md:block" style={{ color: "#4a506a" }}>{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            { plan: "Free", limit: "100 req/day", color: "#8b92a8" },
            { plan: "Pro", limit: "1,000 req/day", color: "#4361ee" },
            { plan: "Enterprise", limit: "Unlimited", color: "#f0b429" },
          ].map((tier) => (
            <div key={tier.plan} className="card p-5 text-center">
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: tier.color }}>{tier.plan}</div>
              <div className="text-2xl font-bold mono mb-1" style={{ color: "#e8eaf4" }}>{tier.limit}</div>
              <div className="text-xs" style={{ color: "#4a506a" }}>API calls</div>
            </div>
          ))}
        </div>

        <div className="card p-8 text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#e8eaf4" }}>Ready to integrate?</h2>
          <p className="text-sm mb-6" style={{ color: "#8b92a8" }}>Read the full API docs or contact us for enterprise access.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/docs/api" className="px-6 py-2.5 rounded-xl font-semibold text-sm" style={{ background: "#4361ee", color: "#fff" }}>
              Read the docs
            </Link>
            <Link href="/contact" className="px-6 py-2.5 rounded-xl font-semibold text-sm" style={{ background: "#131520", color: "#e8eaf4", border: "1px solid #1c2035" }}>
              Contact sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
