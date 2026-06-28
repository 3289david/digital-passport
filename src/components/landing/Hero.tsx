"use client";

import Link from "next/link";
import { TrustScore } from "@/components/passport/TrustScore";
import { GitHubIcon, GitLabIcon, NpmIcon, DockerIcon } from "@/components/icons/PlatformIcons";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-14 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(67,97,238,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(28,32,53,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(28,32,53,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div className="flex flex-col gap-6">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium self-start"
              style={{
                background: "#4361ee18",
                border: "1px solid #4361ee40",
                color: "#4361ee",
              }}
            >
              <div
                className="rounded-full animate-pulse"
                style={{ width: 6, height: 6, background: "#10b981" }}
              />
              Now in public beta
            </div>

            <h1
              className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
              style={{ color: "#e8eaf4" }}
            >
              Your developer
              <br />
              identity,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #4361ee, #7b2ff7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                verified.
              </span>
            </h1>

            <p className="text-lg leading-relaxed" style={{ color: "#8b92a8" }}>
              One passport across every platform you build on. More powerful
              than GitHub. More objective than LinkedIn. More alive than a
              resume.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/johndoe"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ background: "#4361ee", color: "#fff" }}
              >
                View Demo Passport
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: "#0d0f18",
                  color: "#e8eaf4",
                  border: "1px solid #1c2035",
                }}
              >
                Explore features
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-2">
              {[
                { icon: <GitHubIcon size={16} />, label: "GitHub" },
                { icon: <GitLabIcon size={16} />, label: "GitLab" },
                { icon: <NpmIcon size={16} />, label: "npm" },
                { icon: <DockerIcon size={16} />, label: "Docker" },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5"
                  style={{ color: "#4a506a" }}
                >
                  {icon}
                  <span className="text-xs">{label}</span>
                </div>
              ))}
              <span className="text-xs" style={{ color: "#4a506a" }}>
                +20 more
              </span>
            </div>
          </div>

          {/* Right: Passport card mockup */}
          <div className="flex justify-center lg:justify-end">
            <PassportCardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function PassportCardMockup() {
  return (
    <div
      className="relative w-80"
      style={{ perspective: "1000px" }}
    >
      {/* Shadow/depth layers */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #4361ee22, #7b2ff722)",
          transform: "translate(8px, 8px)",
          filter: "blur(20px)",
        }}
      />

      {/* Main card */}
      <div
        className="relative rounded-2xl p-6 flex flex-col gap-5"
        style={{
          background: "#0d0f18",
          border: "1px solid #1c2035",
          boxShadow: "0 0 60px rgba(67,97,238,0.12)",
        }}
      >
        {/* Card header */}
        <div
          className="flex items-center justify-between pb-4 border-b"
          style={{ borderColor: "#1c2035" }}
        >
          <div>
            <div className="text-xs font-medium mb-0.5" style={{ color: "#4a506a" }}>
              DIGITAL PASSPORT
            </div>
            <div
              className="text-xs mono"
              style={{ color: "#4361ee" }}
            >
              dev://johndoe
            </div>
          </div>
          <div
            className="text-xs font-bold tracking-widest px-2 py-1 rounded"
            style={{
              background: "#4361ee18",
              color: "#4361ee",
              border: "1px solid #4361ee30",
            }}
          >
            VERIFIED
          </div>
        </div>

        {/* Identity */}
        <div className="flex items-center gap-4">
          <div
            className="rounded-xl flex items-center justify-center text-xl font-bold shrink-0"
            style={{
              width: 56,
              height: 56,
              background: "linear-gradient(135deg, #4361ee, #7b2ff7)",
              color: "#fff",
            }}
          >
            J
          </div>
          <div>
            <div className="font-bold text-lg" style={{ color: "#e8eaf4" }}>
              John Doe
            </div>
            <div className="text-sm" style={{ color: "#8b92a8" }}>
              Full Stack Engineer
            </div>
            <div className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "#10b981" }}>
              <div className="rounded-full" style={{ width: 5, height: 5, background: "#10b981" }} />
              Available
            </div>
          </div>
        </div>

        {/* Trust Score */}
        <div
          className="rounded-xl p-4 flex items-center justify-between"
          style={{ background: "#131520", border: "1px solid #1c2035" }}
        >
          <div>
            <div className="text-xs font-medium mb-1" style={{ color: "#4a506a" }}>
              TRUST SCORE
            </div>
            <div
              className="text-4xl font-bold mono"
              style={{ color: "#4361ee" }}
            >
              962
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#10b981" }}>
              Elite — Top 2%
            </div>
          </div>
          <TrustScore score={962} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Commits", value: "12.4K" },
            { label: "Stars", value: "8.2K" },
            { label: "Packages", value: "32" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg p-2 text-center"
              style={{ background: "#131520", border: "1px solid #1c2035" }}
            >
              <div className="text-sm font-bold mono" style={{ color: "#e8eaf4" }}>
                {value}
              </div>
              <div className="text-xs" style={{ color: "#4a506a" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Platform icons */}
        <div className="flex items-center gap-2">
          {[
            { icon: <GitHubIcon size={14} />, color: "#e8eaf4" },
            { icon: <GitLabIcon size={14} />, color: "#fc6d26" },
            { icon: <NpmIcon size={14} />, color: "#cb3837" },
            { icon: <DockerIcon size={14} />, color: "#2496ed" },
          ].map(({ icon, color }, i) => (
            <div
              key={i}
              className="flex items-center justify-center rounded-lg"
              style={{
                width: 28,
                height: 28,
                background: "#131520",
                border: "1px solid #1c2035",
                color,
              }}
            >
              {icon}
            </div>
          ))}
          <span className="text-xs ml-1" style={{ color: "#4a506a" }}>
            +18 connected
          </span>
        </div>

        {/* Passport ID footer */}
        <div
          className="pt-3 border-t flex items-center justify-between"
          style={{ borderColor: "#1c2035" }}
        >
          <span className="text-xs mono" style={{ color: "#4a506a" }}>
            p.krl.kr/johndoe
          </span>
          <span
            className="text-xs mono px-2 py-0.5 rounded"
            style={{ background: "#131520", color: "#4a506a" }}
          >
            PID-2024-001
          </span>
        </div>
      </div>
    </div>
  );
}
