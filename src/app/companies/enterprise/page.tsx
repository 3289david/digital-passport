import Link from "next/link";
import { AppNav } from "@/components/AppNav";

const FEATURES = [
  { title: "Unlimited API access", desc: "No rate limits. Integrate passport data into your ATS, HR tools, or internal platforms." },
  { title: "SSO / SAML", desc: "Connect your company's identity provider for seamless employee access." },
  { title: "Developer Visa issuance", desc: "Issue and manage verified endorsements for developers in your ecosystem or certification programs." },
  { title: "Team Passport", desc: "A collective passport for your engineering org with aggregate scores and skill maps." },
  { title: "Recruiter Mode", desc: "Full search and filter access across all public developer passports." },
  { title: "Custom integrations", desc: "We'll work with your team to connect internal systems, HR tools, and proprietary platforms." },
  { title: "SLA guarantee", desc: "99.9% uptime SLA with dedicated support and incident response." },
  { title: "Audit log", desc: "Full audit trail of all API calls, visa issuances, and team changes." },
];

export default function EnterprisePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <AppNav minimal />

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#7b2ff7" }}>For Companies</span>
        </div>
        <h1 className="text-5xl font-bold mb-4" style={{ color: "#e8eaf4" }}>Enterprise</h1>
        <p className="text-lg mb-12 max-w-2xl" style={{ color: "#8b92a8" }}>
          For organizations that need verified developer identity at scale — from hiring to certification to ecosystem trust.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-5">
              <h3 className="font-semibold text-sm mb-2" style={{ color: "#e8eaf4" }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#8b92a8" }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="card p-10 text-center" style={{ border: "1px solid #7b2ff730" }}>
          <h2 className="text-3xl font-bold mb-3" style={{ color: "#e8eaf4" }}>Let's talk</h2>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: "#8b92a8" }}>
            Tell us about your use case and we'll put together a custom plan. No commitment required.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm" style={{ background: "#7b2ff7", color: "#fff" }}>
            Contact sales →
          </Link>
        </div>
      </div>
    </div>
  );
}
