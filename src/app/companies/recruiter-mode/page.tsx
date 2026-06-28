import Link from "next/link";
import { PassportLogoIcon } from "@/components/icons/PlatformIcons";

const FEATURES = [
  { title: "Verified skill search", description: "Search by verified languages, frameworks, and tools — not self-reported keywords." },
  { title: "Trust Score filter", description: "Filter candidates by minimum Trust Score, code quality, and security hygiene." },
  { title: "Contribution timeline", description: "See a candidate's real activity over time, not a snapshot resume." },
  { title: "Open source history", description: "Explore public contributions, maintained projects, and package ecosystem presence." },
  { title: "Security profile", description: "Instantly see if a candidate follows secure coding practices and responds to CVEs." },
  { title: "Saved searches", description: "Save your ideal candidate profile and get notified when new matches appear." },
];

export default function RecruiterModePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b" style={{ borderColor: "#1c2035" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <PassportLogoIcon size={28} />
            <span className="font-semibold text-sm" style={{ color: "#e8eaf4" }}>Digital Passport</span>
          </Link>
          <Link href="/contact" className="text-sm font-medium px-4 py-1.5 rounded-full" style={{ background: "#4361ee", color: "#fff" }}>
            Contact sales
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#4361ee" }}>For Companies</span>
        </div>
        <h1 className="text-5xl font-bold mb-4" style={{ color: "#e8eaf4" }}>Recruiter Mode</h1>
        <p className="text-lg mb-12 max-w-2xl" style={{ color: "#8b92a8" }}>
          Stop reading resumes. Search verified developer passports by real skills, real output, and real trust scores.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-5">
              <h3 className="font-semibold text-sm mb-2" style={{ color: "#e8eaf4" }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#8b92a8" }}>{f.description}</p>
            </div>
          ))}
        </div>

        <div className="card p-8 text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#e8eaf4" }}>Join the waitlist</h2>
          <p className="text-sm mb-6" style={{ color: "#8b92a8" }}>Recruiter Mode is in private beta. Contact us to get early access.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm" style={{ background: "#4361ee", color: "#fff" }}>
            Get early access
          </Link>
        </div>
      </div>
    </div>
  );
}
