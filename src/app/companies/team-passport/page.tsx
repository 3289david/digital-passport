import Link from "next/link";
import { AppNav } from "@/components/AppNav";

export default function TeamPassportPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <AppNav minimal />

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#10b981" }}>For Companies</span>
        </div>
        <h1 className="text-5xl font-bold mb-4" style={{ color: "#e8eaf4" }}>Team Passport</h1>
        <p className="text-lg mb-12 max-w-2xl" style={{ color: "#8b92a8" }}>
          A collective passport for your engineering team. Showcase your organization's aggregate skills, open source contributions, and trust profile.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {[
            { title: "Aggregate Trust Score", desc: "Your team's average trust score computed across all member passports." },
            { title: "Collective Skill Map", desc: "A combined skill genome showing the team's coverage across languages and domains." },
            { title: "Open source presence", desc: "Total contributions, maintained packages, and starred projects across the whole team." },
            { title: "Team velocity", desc: "Commits per week, release frequency, and review turnaround time across your org." },
            { title: "Public page at p.krl.kr/your-org", desc: "A shareable team passport page for recruiting, partner trust, and public credibility." },
            { title: "Member directory", desc: "List all team members with their individual passport links and top skills." },
          ].map((f) => (
            <div key={f.title} className="card p-5">
              <h3 className="font-semibold text-sm mb-2" style={{ color: "#e8eaf4" }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#8b92a8" }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="card p-8 text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#e8eaf4" }}>Create a team passport</h2>
          <p className="text-sm mb-6" style={{ color: "#8b92a8" }}>Available on Enterprise. Contact us to get set up.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm" style={{ background: "#10b981", color: "#07080d" }}>
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}
