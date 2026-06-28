"use client";

const STEPS = [
  {
    number: "01",
    title: "Claim your Passport ID",
    description:
      "Choose your unique developer handle. Your passport lives at p.krl.kr/yourhandle — one URL, forever yours.",
    color: "#4361ee",
  },
  {
    number: "02",
    title: "Connect your platforms",
    description:
      "Link GitHub, GitLab, npm, Docker Hub, and any other platform in minutes. OAuth connections are read-only and revocable at any time.",
    color: "#7b2ff7",
  },
  {
    number: "03",
    title: "Verify your identity",
    description:
      "Progress through verification tiers — from email to domain ownership to GPG keys. Each tier unlocks higher trust levels.",
    color: "#10b981",
  },
  {
    number: "04",
    title: "AI analyzes your work",
    description:
      "Our models scan your repositories, packages, and activity to compute your Trust Score, Skill Genome, and Security Profile automatically.",
    color: "#f59e0b",
  },
  {
    number: "05",
    title: "Share your Passport",
    description:
      "Send recruiters your Passport URL. Embed a trust badge. Use the API. Or generate an AI resume in one click — always based on live data.",
    color: "#ef4444",
  },
];

export function HowItWorks() {
  return (
    <section
      className="py-24"
      style={{ borderTop: "1px solid #1c2035" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: "#e8eaf4" }}>
            How it works
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#8b92a8" }}>
            Set up in minutes. Updated automatically. Trusted everywhere.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div
            className="absolute left-8 top-0 bottom-0 w-px hidden md:block"
            style={{ background: "linear-gradient(to bottom, #4361ee, #ef4444)" }}
          />

          <div className="flex flex-col gap-10">
            {STEPS.map((step, i) => (
              <div key={step.number} className="flex gap-6 items-start">
                <div
                  className="relative flex items-center justify-center shrink-0 rounded-full font-bold mono text-sm z-10"
                  style={{
                    width: 40,
                    height: 40,
                    background: step.color,
                    color: "#fff",
                    boxShadow: `0 0 16px ${step.color}44`,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  className="card p-5 flex-1"
                  style={{ borderLeft: `2px solid ${step.color}44` }}
                >
                  <div
                    className="text-xs mono font-semibold mb-1"
                    style={{ color: step.color }}
                  >
                    Step {step.number}
                  </div>
                  <h3 className="font-semibold mb-2" style={{ color: "#e8eaf4" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#8b92a8" }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
