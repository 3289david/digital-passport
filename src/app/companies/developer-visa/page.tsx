import Link from "next/link";
import { AppNav } from "@/components/AppNav";

const EXAMPLES = [
  { org: "Cloudflare", title: "Cloudflare Certified Developer", color: "#f48120", description: "Issued to developers who have passed Cloudflare's Workers certification program." },
  { org: "Vercel", title: "Vercel Expert", color: "#e8eaf4", description: "Recognized contributors to the Vercel and Next.js ecosystem." },
  { org: "Mozilla", title: "Mozilla Open Source Contributor", color: "#ff6611", description: "Verified contributors to Firefox, MDN, or Mozilla Foundation projects." },
  { org: "HashiCorp", title: "Terraform Certified", color: "#7b42bc", description: "Developers who hold official HashiCorp Terraform certification." },
];

export default function DeveloperVisaPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <AppNav minimal />

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#f0b429" }}>For Companies</span>
        </div>
        <h1 className="text-5xl font-bold mb-4" style={{ color: "#e8eaf4" }}>Developer Visa</h1>
        <p className="text-lg mb-12 max-w-2xl" style={{ color: "#8b92a8" }}>
          Organizations issue permanent, cryptographically verified endorsements to developers. A visa on a passport can never be faked.
        </p>

        <div className="card p-6 mb-8">
          <h2 className="font-semibold mb-6" style={{ color: "#e8eaf4" }}>Example visas</h2>
          <div className="flex flex-col gap-4">
            {EXAMPLES.map((ex) => (
              <div key={ex.org} className="rounded-xl p-4 flex items-start gap-4" style={{ background: "#131520", border: `1px solid ${ex.color}20` }}>
                <div className="rounded-full shrink-0 mt-1" style={{ width: 8, height: 8, background: ex.color }} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold" style={{ color: ex.color }}>{ex.org}</span>
                  </div>
                  <div className="font-medium text-sm mb-1" style={{ color: "#e8eaf4" }}>{ex.title}</div>
                  <p className="text-xs" style={{ color: "#4a506a" }}>{ex.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            { title: "Permanent", desc: "A visa issued to a developer lives on their passport forever — visible to anyone who views it." },
            { title: "Verified", desc: "Visas are issued by the organization's verified account. They cannot be self-issued or faked." },
            { title: "Revocable", desc: "Organizations can revoke visas if credentials expire or the developer leaves a program." },
          ].map((item) => (
            <div key={item.title} className="card p-5">
              <h3 className="font-semibold text-sm mb-2" style={{ color: "#e8eaf4" }}>{item.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#8b92a8" }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="card p-8 text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "#e8eaf4" }}>Start issuing visas</h2>
          <p className="text-sm mb-6" style={{ color: "#8b92a8" }}>Contact us to set up a verified organization account.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm" style={{ background: "#f0b429", color: "#07080d" }}>
            Get started
          </Link>
        </div>
      </div>
    </div>
  );
}
