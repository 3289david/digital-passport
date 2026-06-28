import Link from "next/link";
import { PassportLogoIcon } from "@/components/icons/PlatformIcons";

const SECTIONS = [
  {
    title: "Acceptance",
    content: "By using Digital Passport (p.krl.kr), you agree to these Terms of Service. If you do not agree, do not use the service.",
  },
  {
    title: "Your account",
    content: "You are responsible for maintaining the security of your account. You must not share access credentials or allow others to use your passport. You must be 13 or older to create an account.",
  },
  {
    title: "Your data",
    content: "You retain ownership of all content in your passport. By connecting a platform, you grant us permission to read and display your public data from that platform. You can revoke access at any time.",
  },
  {
    title: "Acceptable use",
    content: "You may not use Digital Passport to misrepresent your identity, impersonate another developer, or manipulate your Trust Score through artificial means. Violations result in immediate account termination.",
  },
  {
    title: "Service availability",
    content: "We aim for 99.9% uptime but do not guarantee continuous availability. We may modify or discontinue features at any time. We will provide reasonable notice for breaking changes.",
  },
  {
    title: "Limitation of liability",
    content: "Digital Passport is provided as-is. We are not liable for errors in computed scores, data syncing delays, or decisions made by third parties based on your passport.",
  },
  {
    title: "Changes",
    content: "We may update these terms. Material changes will be communicated by email or in-app notification. Continued use after changes constitutes acceptance.",
  },
  {
    title: "Contact",
    content: "Questions about these terms? Email legal@p.krl.kr.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b" style={{ borderColor: "#1c2035" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <PassportLogoIcon size={28} />
            <span className="font-semibold text-sm" style={{ color: "#e8eaf4" }}>Digital Passport</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pt-28 pb-24">
        <h1 className="text-5xl font-bold mb-2" style={{ color: "#e8eaf4" }}>Terms of Service</h1>
        <p className="text-sm mb-12" style={{ color: "#4a506a" }}>Last updated June 28, 2026</p>

        <div className="flex flex-col gap-8">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="font-semibold text-base mb-3" style={{ color: "#e8eaf4" }}>{s.title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#8b92a8" }}>{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
