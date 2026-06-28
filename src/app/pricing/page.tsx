import Link from "next/link";
import { AppNav } from "@/components/AppNav";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything a developer needs to get started.",
    color: "#8b92a8",
    cta: "Get started free",
    href: "/johndoe",
    features: [
      "Public passport at p.krl.kr/you",
      "GitHub integration",
      "Trust Score (basic)",
      "Skill Genome",
      "Contribution Timeline",
      "5 featured projects",
      "3 connected platforms",
    ],
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For serious developers who want the full picture.",
    color: "#4361ee",
    cta: "Start free trial",
    href: "/johndoe",
    featured: true,
    features: [
      "Everything in Free",
      "All platform integrations",
      "Security Profile",
      "Package Portfolio",
      "Identity Verification (advanced)",
      "AI Resume generator",
      "API access (1k req/day)",
      "PDF export",
      "Custom domain",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "per seat",
    description: "For companies issuing Developer Visas and running Recruiter Mode.",
    color: "#f0b429",
    cta: "Contact sales",
    href: "/contact",
    features: [
      "Everything in Pro",
      "Developer Visa issuance",
      "Team Passport",
      "Recruiter Mode + search",
      "Bulk API access",
      "SSO / SAML",
      "SLA + dedicated support",
      "Custom integrations",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <AppNav minimal />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-24">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-6" style={{ background: "#10b98118", border: "1px solid #10b98140", color: "#10b981" }}>
            Free during beta
          </div>
          <h1 className="text-5xl font-bold mb-4" style={{ color: "#e8eaf4" }}>Simple pricing</h1>
          <p className="text-lg" style={{ color: "#8b92a8" }}>
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="card p-7 flex flex-col gap-5"
              style={plan.featured ? { border: `1px solid ${plan.color}60`, boxShadow: `0 0 30px ${plan.color}10` } : {}}
            >
              {plan.featured && (
                <div className="text-xs font-semibold px-2 py-0.5 rounded self-start" style={{ background: `${plan.color}18`, color: plan.color }}>
                  Most popular
                </div>
              )}
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: plan.color }}>{plan.name}</div>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className="text-4xl font-bold mono" style={{ color: "#e8eaf4" }}>{plan.price}</span>
                  <span className="text-sm mb-1" style={{ color: "#4a506a" }}>{plan.period}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#8b92a8" }}>{plan.description}</p>
              </div>

              <Link
                href={plan.href}
                className="w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={plan.featured ? { background: plan.color, color: "#fff" } : { background: "#131520", color: "#e8eaf4", border: "1px solid #1c2035" }}
              >
                {plan.cta}
              </Link>

              <ul className="flex flex-col gap-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "#8b92a8" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.5" className="shrink-0 mt-0.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 card p-8 text-center">
          <p className="text-sm font-medium mb-1" style={{ color: "#e8eaf4" }}>All plans are free during beta</p>
          <p className="text-xs" style={{ color: "#4a506a" }}>Pricing shown is for post-beta. Early users keep their plan at 50% off.</p>
        </div>
      </div>
    </div>
  );
}
