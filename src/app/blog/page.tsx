import Link from "next/link";
import { PassportLogoIcon } from "@/components/icons/PlatformIcons";

const POSTS = [
  {
    date: "Jun 20, 2026",
    title: "Introducing Digital Passport: Verified Developer Identity",
    excerpt: "We're launching Digital Passport — a living, verified identity for developers that goes far beyond a GitHub profile or LinkedIn page.",
    tag: "Announcement",
    tagColor: "#4361ee",
  },
  {
    date: "Jun 15, 2026",
    title: "How we compute the Trust Score",
    excerpt: "A deep dive into the AI pipeline behind Trust Score: code quality signals, security response time, contribution consistency, and community reputation.",
    tag: "Engineering",
    tagColor: "#10b981",
  },
  {
    date: "Jun 10, 2026",
    title: "Developer Visa: A new way for companies to endorse developers",
    excerpt: "Certifications expire, resume lines fade — but a Developer Visa on your passport is permanent and publicly verifiable.",
    tag: "Product",
    tagColor: "#7b2ff7",
  },
  {
    date: "Jun 5, 2026",
    title: "Why we built on Next.js 16 and Prisma",
    excerpt: "Our tech choices for the Digital Passport platform — App Router, Turbopack, pg adapter, and why we skipped ORMs with auto-migration.",
    tag: "Engineering",
    tagColor: "#10b981",
  },
];

export default function BlogPage() {
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

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        <h1 className="text-5xl font-bold mb-4" style={{ color: "#e8eaf4" }}>Blog</h1>
        <p className="text-lg mb-12" style={{ color: "#8b92a8" }}>
          Product updates, engineering deep dives, and thoughts on developer identity.
        </p>

        <div className="flex flex-col gap-6">
          {POSTS.map((post) => (
            <article key={post.title} className="card p-6 hover:border-[#4361ee44] transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: `${post.tagColor}18`, color: post.tagColor }}>
                  {post.tag}
                </span>
                <span className="text-xs" style={{ color: "#4a506a" }}>{post.date}</span>
              </div>
              <h2 className="font-bold text-lg mb-2 leading-snug" style={{ color: "#e8eaf4" }}>{post.title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: "#8b92a8" }}>{post.excerpt}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium" style={{ color: "#4361ee" }}>
                Read more
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
