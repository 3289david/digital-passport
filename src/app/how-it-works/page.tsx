import Link from "next/link";
import { PassportLogoIcon } from "@/components/icons/PlatformIcons";

const STEPS = [
  {
    step: "01",
    title: "Sign in with GitHub or Google",
    description: "No forms, no passwords. Sign in with your existing OAuth account. We only request read-only access to your public data.",
    color: "#4361ee",
  },
  {
    step: "02",
    title: "Claim your Passport ID",
    description: "Choose your unique handle. Your passport will live at p.krl.kr/yourname — a permanent, shareable URL for your developer identity.",
    color: "#7b2ff7",
  },
  {
    step: "03",
    title: "Connect your platforms",
    description: "Link GitHub, npm, Docker Hub, PyPI, crates.io, and 15+ more platforms. Each connection is verified and publicly attestable.",
    color: "#10b981",
  },
  {
    step: "04",
    title: "We sync and analyze",
    description: "Our pipeline indexes your repositories, packages, contributions, and activity. The Trust Score and Skill Genome are computed automatically.",
    color: "#f59e0b",
  },
  {
    step: "05",
    title: "Share your passport",
    description: "Your passport is live. Share the URL, embed the badge, generate a PDF resume, or access your data via the public API.",
    color: "#ec4899",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b" style={{ borderColor: "#1c2035" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <PassportLogoIcon size={28} />
            <span className="font-semibold text-sm" style={{ color: "#e8eaf4" }}>Digital Passport</span>
          </Link>
          <Link href="/johndoe" className="text-sm font-medium px-4 py-1.5 rounded-full" style={{ background: "#4361ee", color: "#fff" }}>
            View Demo
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{ color: "#e8eaf4" }}>How it works</h1>
          <p className="text-lg" style={{ color: "#8b92a8" }}>
            From zero to verified developer identity in under five minutes.
          </p>
        </div>

        <div className="flex flex-col gap-4 relative">
          <div className="absolute left-[27px] top-0 bottom-0 w-px" style={{ background: "#1c2035" }} />
          {STEPS.map((step) => (
            <div key={step.step} className="flex gap-6 items-start">
              <div
                className="rounded-full flex items-center justify-center font-bold text-xs mono shrink-0 z-10"
                style={{ width: 56, height: 56, background: `${step.color}18`, color: step.color, border: `1px solid ${step.color}30` }}
              >
                {step.step}
              </div>
              <div className="card p-6 flex-1">
                <h2 className="font-bold text-base mb-2" style={{ color: "#e8eaf4" }}>{step.title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: "#8b92a8" }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/johndoe"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm"
            style={{ background: "#4361ee", color: "#fff" }}
          >
            See a live example
          </Link>
        </div>
      </div>
    </div>
  );
}
