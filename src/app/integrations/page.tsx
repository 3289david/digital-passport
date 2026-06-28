import Link from "next/link";
import { AppNav } from "@/components/AppNav";
import { GitHubIcon, GitLabIcon, NpmIcon, DockerIcon, PyPIIcon, HuggingFaceIcon, VercelIcon, CloudflareIcon, StackOverflowIcon, CratesIcon } from "@/components/icons/PlatformIcons";

const INTEGRATIONS = [
  { name: "GitHub", description: "Repos, stars, commits, pull requests, contribution graph, language breakdown.", icon: <GitHubIcon size={24} />, color: "#e8eaf4", status: "live" },
  { name: "GitLab", description: "Projects, merge requests, CI pipelines, and contribution history.", icon: <GitLabIcon size={24} />, color: "#fc6d26", status: "live" },
  { name: "npm", description: "Published packages, weekly downloads, version history, and maintainer status.", icon: <NpmIcon size={24} />, color: "#cb3837", status: "live" },
  { name: "Docker Hub", description: "Public images, pull counts, and repository metadata.", icon: <DockerIcon size={24} />, color: "#2496ed", status: "live" },
  { name: "PyPI", description: "Python packages, release history, and download statistics.", icon: <PyPIIcon size={24} />, color: "#3775a9", status: "live" },
  { name: "crates.io", description: "Rust crates, version history, and crate download counts.", icon: <CratesIcon size={24} />, color: "#dea584", status: "live" },
  { name: "Hugging Face", description: "Models, datasets, spaces, and community contributions.", icon: <HuggingFaceIcon size={24} />, color: "#ff9d00", status: "live" },
  { name: "Vercel", description: "Deployments, project count, and team contributions.", icon: <VercelIcon size={24} />, color: "#e8eaf4", status: "coming" },
  { name: "Cloudflare", description: "Workers, Pages projects, and developer program membership.", icon: <CloudflareIcon size={24} />, color: "#f48120", status: "coming" },
  { name: "Stack Overflow", description: "Reputation, answer count, top tags, and gold badges.", icon: <StackOverflowIcon size={24} />, color: "#f58025", status: "coming" },
  { name: "Maven Central", description: "Java and Kotlin artifacts, download counts, and group IDs.", icon: null, color: "#c71a36", status: "coming" },
  { name: "RubyGems", description: "Gems published, total downloads, and version history.", icon: null, color: "#cc342d", status: "coming" },
];

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <AppNav minimal />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-24">
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold mb-4" style={{ color: "#e8eaf4" }}>Integrations</h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#8b92a8" }}>
            Connect every platform you build on. Digital Passport indexes and verifies your presence across the developer ecosystem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INTEGRATIONS.map((int) => (
            <div key={int.name} className="card p-5 flex items-start gap-4">
              <div
                className="rounded-xl flex items-center justify-center shrink-0"
                style={{ width: 44, height: 44, background: `${int.color}15`, color: int.color }}
              >
                {int.icon ?? <span className="text-sm font-bold">{int.name[0]}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm" style={{ color: "#e8eaf4" }}>{int.name}</span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      background: int.status === "live" ? "#10b98118" : "#4361ee18",
                      color: int.status === "live" ? "#10b981" : "#4361ee",
                    }}
                  >
                    {int.status === "live" ? "Live" : "Soon"}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#4a506a" }}>{int.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 card p-8 text-center">
          <p className="text-sm mb-2" style={{ color: "#8b92a8" }}>Missing a platform?</p>
          <p className="text-xs mb-4" style={{ color: "#4a506a" }}>We add new integrations every month based on community requests.</p>
          <Link href="/contact" className="text-sm font-medium" style={{ color: "#4361ee" }}>
            Request an integration →
          </Link>
        </div>
      </div>
    </div>
  );
}
