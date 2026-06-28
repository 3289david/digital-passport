"use client";

import Link from "next/link";
import { PassportLogoIcon } from "@/components/icons/PlatformIcons";

export function Nav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 glass border-b"
      style={{ borderColor: "#1c2035" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <PassportLogoIcon size={28} />
          <span className="font-semibold text-sm tracking-tight" style={{ color: "#e8eaf4" }}>
            Digital Passport
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/features"
            className="text-sm transition-colors hidden md:block"
            style={{ color: "#8b92a8" }}
          >
            Features
          </Link>
          <Link
            href="/integrations"
            className="text-sm transition-colors hidden md:block"
            style={{ color: "#8b92a8" }}
          >
            Integrations
          </Link>
          <Link
            href="/pricing"
            className="text-sm transition-colors hidden md:block"
            style={{ color: "#8b92a8" }}
          >
            Pricing
          </Link>
          <Link
            href="/johndoe"
            className="text-sm transition-colors hidden md:block"
            style={{ color: "#8b92a8" }}
          >
            Demo
          </Link>
          <Link
            href="/johndoe"
            className="text-sm font-medium px-4 py-1.5 rounded-full transition-all"
            style={{ background: "#4361ee", color: "#fff" }}
          >
            View Demo
          </Link>
        </div>
      </div>
    </nav>
  );
}
