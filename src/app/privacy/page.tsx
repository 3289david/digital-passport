import Link from "next/link";
import { AppNav } from "@/components/AppNav";

const SECTIONS = [
  {
    title: "What we collect",
    content: "We collect data you explicitly connect: GitHub profile, repositories, contribution history, npm packages, and other platform data you authorize. We also collect basic account info (email, name) provided by your OAuth provider.",
  },
  {
    title: "How we use it",
    content: "Your data is used to compute your Trust Score, Skill Genome, and passport profile. We do not sell your data. We do not use it for advertising. Aggregated, anonymized statistics may be used to improve our models.",
  },
  {
    title: "What is public",
    content: "Your passport page is public by default. You control which connected accounts are visible. Your email is never public. You can set your passport to private at any time from your dashboard.",
  },
  {
    title: "Data retention",
    content: "If you delete your account, all your data is permanently deleted within 30 days. Cached platform data (e.g., GitHub stats) is removed immediately on deletion request.",
  },
  {
    title: "Third parties",
    content: "We use GitHub OAuth and Google OAuth for sign-in. We use a managed PostgreSQL database for storage. No analytics or advertising third parties have access to your data.",
  },
  {
    title: "Contact",
    content: "For privacy questions, email privacy@p.krl.kr or use the contact form below.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <AppNav minimal />

      <div className="max-w-2xl mx-auto px-6 pt-28 pb-24">
        <h1 className="text-5xl font-bold mb-2" style={{ color: "#e8eaf4" }}>Privacy Policy</h1>
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
