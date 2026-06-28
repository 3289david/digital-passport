"use client";

import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24" style={{ borderTop: "1px solid #1c2035" }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div
          className="rounded-2xl p-12 relative overflow-hidden"
          style={{
            background: "#0d0f18",
            border: "1px solid #1c2035",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(67,97,238,0.2) 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-6"
              style={{
                background: "#4361ee18",
                border: "1px solid #4361ee40",
                color: "#4361ee",
              }}
            >
              Free during beta
            </div>
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: "#e8eaf4" }}
            >
              Build your passport today
            </h2>
            <p
              className="text-lg mb-8 max-w-xl mx-auto"
              style={{ color: "#8b92a8" }}
            >
              Join developers who have replaced static resumes with living,
              verified proof of their work.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/danu"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all"
                style={{ background: "#4361ee", color: "#fff" }}
              >
                View example passport
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all"
                style={{
                  background: "transparent",
                  color: "#e8eaf4",
                  border: "1px solid #1c2035",
                }}
              >
                Learn more
              </Link>
            </div>

            <div
              className="flex items-center justify-center gap-6 mt-10 pt-8"
              style={{ borderTop: "1px solid #1c2035" }}
            >
              {[
                { value: "10K+", label: "Developers" },
                { value: "200+", label: "Companies recruiting" },
                { value: "50M+", label: "Contributions indexed" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div
                    className="text-2xl font-bold mono"
                    style={{ color: "#4361ee" }}
                  >
                    {value}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#4a506a" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
