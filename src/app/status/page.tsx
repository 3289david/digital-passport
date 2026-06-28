import Link from "next/link";
import { PassportLogoIcon } from "@/components/icons/PlatformIcons";

const SERVICES = [
  { name: "Passport pages", status: "operational", uptime: "100%" },
  { name: "Auth (GitHub OAuth)", status: "operational", uptime: "99.98%" },
  { name: "Auth (Google OAuth)", status: "operational", uptime: "99.97%" },
  { name: "Trust Score pipeline", status: "operational", uptime: "99.9%" },
  { name: "Sync engine", status: "operational", uptime: "99.9%" },
  { name: "Public API (v1)", status: "operational", uptime: "99.99%" },
  { name: "Database", status: "operational", uptime: "99.99%" },
];

const STATUS_COLORS: Record<string, string> = {
  operational: "#10b981",
  degraded: "#f59e0b",
  outage: "#ef4444",
};

export default function StatusPage() {
  const allOperational = SERVICES.every((s) => s.status === "operational");

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
        <h1 className="text-5xl font-bold mb-6" style={{ color: "#e8eaf4" }}>Status</h1>

        <div
          className="rounded-2xl p-6 flex items-center gap-4 mb-10"
          style={{
            background: allOperational ? "#10b98110" : "#f59e0b10",
            border: `1px solid ${allOperational ? "#10b98130" : "#f59e0b30"}`,
          }}
        >
          <div className="rounded-full animate-pulse" style={{ width: 12, height: 12, background: allOperational ? "#10b981" : "#f59e0b" }} />
          <div>
            <div className="font-bold" style={{ color: "#e8eaf4" }}>
              {allOperational ? "All systems operational" : "Some systems degraded"}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#4a506a" }}>
              Last updated: {new Date().toUTCString()}
            </div>
          </div>
        </div>

        <div className="card overflow-hidden mb-10">
          {SERVICES.map((service, i) => (
            <div
              key={service.name}
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: i < SERVICES.length - 1 ? "1px solid #1c2035" : "none" }}
            >
              <span className="text-sm" style={{ color: "#e8eaf4" }}>{service.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-xs mono" style={{ color: "#4a506a" }}>{service.uptime} uptime</span>
                <div className="flex items-center gap-1.5">
                  <div className="rounded-full" style={{ width: 7, height: 7, background: STATUS_COLORS[service.status] }} />
                  <span className="text-xs capitalize" style={{ color: STATUS_COLORS[service.status] }}>{service.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-sm mb-2" style={{ color: "#e8eaf4" }}>Incident history</h2>
          <p className="text-sm" style={{ color: "#4a506a" }}>No incidents in the last 90 days.</p>
        </div>
      </div>
    </div>
  );
}
