"use client";

import Link from "next/link";
import { PassportLogoIcon } from "@/components/icons/PlatformIcons";

const PRODUCT_LINKS = [
  { label: "Features", href: "/features" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Integrations", href: "/integrations" },
  { label: "API", href: "/api-docs" },
  { label: "Pricing", href: "/pricing" },
];

const COMPANY_LINKS = [
  { label: "Recruiter Mode", href: "/companies/recruiter-mode" },
  { label: "Developer Visa", href: "/companies/developer-visa" },
  { label: "Team Passport", href: "/companies/team-passport" },
  { label: "API Access", href: "/companies/api-access" },
  { label: "Enterprise", href: "/companies/enterprise" },
];

const RESOURCE_LINKS = [
  { label: "Documentation", href: "/docs" },
  { label: "API Reference", href: "/docs/api" },
  { label: "Blog", href: "/blog" },
  { label: "Changelog", href: "/changelog" },
  { label: "Status", href: "/status" },
];

export function Footer() {
  return (
    <footer className="py-12" style={{ borderTop: "1px solid #1c2035" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <PassportLogoIcon size={24} />
              <span className="font-semibold text-sm" style={{ color: "#e8eaf4" }}>
                Digital Passport
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#4a506a" }}>
              The verified developer identity platform. One URL, all your work.
            </p>
            <p className="text-xs mt-3 mono" style={{ color: "#4a506a" }}>p.krl.kr</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#8b92a8" }}>
              Product
            </h4>
            <ul className="flex flex-col gap-2">
              {PRODUCT_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm transition-colors hover:text-[#4361ee]" style={{ color: "#4a506a" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#8b92a8" }}>
              For Companies
            </h4>
            <ul className="flex flex-col gap-2">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm transition-colors hover:text-[#4361ee]" style={{ color: "#4a506a" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#8b92a8" }}>
              Resources
            </h4>
            <ul className="flex flex-col gap-2">
              {RESOURCE_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm transition-colors hover:text-[#4361ee]" style={{ color: "#4a506a" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid #1c2035" }}
        >
          <p className="text-xs" style={{ color: "#4a506a" }}>
            © 2026 Digital Passport. Built for developers.
          </p>
          <div className="flex items-center gap-4">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Contact", href: "/contact" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="text-xs transition-colors hover:text-[#4361ee]" style={{ color: "#4a506a" }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
