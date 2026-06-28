import Link from "next/link";
import { PassportLogoIcon } from "@/components/icons/PlatformIcons";

export default function ApiPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b" style={{ borderColor: "#1c2035" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <PassportLogoIcon size={28} />
            <span className="font-semibold text-sm" style={{ color: "#e8eaf4" }}>Digital Passport</span>
          </Link>
          <Link href="/docs/api" className="text-sm font-medium px-4 py-1.5 rounded-full" style={{ background: "#4361ee", color: "#fff" }}>
            Full Reference
          </Link>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        <h1 className="text-5xl font-bold mb-4" style={{ color: "#e8eaf4" }}>API</h1>
        <p className="text-lg mb-10" style={{ color: "#8b92a8" }}>
          The Digital Passport public API lets you read any passport programmatically. All responses are JSON. No auth required for public data.
        </p>
        <div className="card p-6 mb-6">
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#8b92a8" }}>Base URL</div>
          <div className="rounded-lg px-4 py-3 mono text-sm" style={{ background: "#131520", color: "#4361ee" }}>
            https://api.p.krl.kr/v1
          </div>
        </div>
        <div className="card p-6 mb-6">
          <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#8b92a8" }}>Quick example</div>
          <div className="rounded-lg p-4 mono text-xs overflow-x-auto" style={{ background: "#131520", color: "#e8eaf4" }}>
            <span style={{ color: "#10b981" }}>GET</span>{" "}
            <span style={{ color: "#4361ee" }}>https://api.p.krl.kr/v1/johndoe</span>
            <br /><br />
            <span style={{ color: "#4a506a" }}>{"{"}</span><br />
            {"  "}<span style={{ color: "#7b2ff7" }}>"username"</span><span style={{ color: "#4a506a" }}>:</span> <span style={{ color: "#10b981" }}>"johndoe"</span><span style={{ color: "#4a506a" }}>,</span><br />
            {"  "}<span style={{ color: "#7b2ff7" }}>"displayName"</span><span style={{ color: "#4a506a" }}>:</span> <span style={{ color: "#10b981" }}>"John Doe"</span><span style={{ color: "#4a506a" }}>,</span><br />
            {"  "}<span style={{ color: "#7b2ff7" }}>"trustScore"</span><span style={{ color: "#4a506a" }}>:</span> <span style={{ color: "#f59e0b" }}>947</span><span style={{ color: "#4a506a" }}>,</span><br />
            {"  "}<span style={{ color: "#7b2ff7" }}>"title"</span><span style={{ color: "#4a506a" }}>:</span> <span style={{ color: "#10b981" }}>"Full Stack Engineer"</span><span style={{ color: "#4a506a" }}>,</span><br />
            {"  "}<span style={{ color: "#4a506a" }}>...</span><br />
            <span style={{ color: "#4a506a" }}>{"}"}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/docs/api" className="px-6 py-2.5 rounded-xl font-semibold text-sm" style={{ background: "#4361ee", color: "#fff" }}>
            Full API Reference
          </Link>
          <Link href="/companies/api-access" className="px-6 py-2.5 rounded-xl font-semibold text-sm" style={{ background: "#131520", color: "#e8eaf4", border: "1px solid #1c2035" }}>
            Rate limits & plans
          </Link>
        </div>
      </div>
    </div>
  );
}
