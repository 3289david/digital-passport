"use client";

import {
  GitHubIcon,
  GitLabIcon,
  NpmIcon,
  DockerIcon,
  PyPIIcon,
  HuggingFaceIcon,
  VercelIcon,
  CloudflareIcon,
  StackOverflowIcon,
  AppStoreIcon,
  GooglePlayIcon,
  XIcon,
  DiscordIcon,
  CratesIcon,
  NetlifyIcon,
} from "@/components/icons/PlatformIcons";

const PLATFORMS = [
  { icon: <GitHubIcon size={22} />, name: "GitHub", color: "#e8eaf4", category: "Code" },
  { icon: <GitLabIcon size={22} />, name: "GitLab", color: "#fc6d26", category: "Code" },
  { icon: <NpmIcon size={22} />, name: "npm", color: "#cb3837", category: "Packages" },
  { icon: <PyPIIcon size={22} />, name: "PyPI", color: "#3775a9", category: "Packages" },
  { icon: <CratesIcon size={22} />, name: "crates.io", color: "#dea584", category: "Packages" },
  { icon: <DockerIcon size={22} />, name: "Docker Hub", color: "#2496ed", category: "Containers" },
  { icon: <HuggingFaceIcon size={22} />, name: "Hugging Face", color: "#ff9d00", category: "AI" },
  { icon: <VercelIcon size={22} />, name: "Vercel", color: "#e8eaf4", category: "Cloud" },
  { icon: <CloudflareIcon size={22} />, name: "Cloudflare", color: "#f48120", category: "Cloud" },
  { icon: <NetlifyIcon size={22} />, name: "Netlify", color: "#00c7b7", category: "Cloud" },
  { icon: <StackOverflowIcon size={22} />, name: "Stack Overflow", color: "#f58025", category: "Community" },
  { icon: <XIcon size={22} />, name: "X / Twitter", color: "#e8eaf4", category: "Social" },
  { icon: <DiscordIcon size={22} />, name: "Discord", color: "#5865f2", category: "Community" },
  { icon: <AppStoreIcon size={22} />, name: "App Store", color: "#007aff", category: "Mobile" },
  { icon: <GooglePlayIcon size={22} />, name: "Google Play", color: "#34a853", category: "Mobile" },
];

const CATEGORIES = ["Code", "Packages", "Containers", "AI", "Cloud", "Community", "Social", "Mobile"];

export function Platforms() {
  return (
    <section id="platforms" className="py-24" style={{ borderTop: "1px solid #1c2035" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4" style={{ color: "#e8eaf4" }}>
            Connected everywhere you build
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#8b92a8" }}>
            Link accounts once. Digital Passport pulls your activity, packages,
            and contributions automatically — always up to date.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-12">
          {PLATFORMS.map(({ icon, name, color }) => (
            <div
              key={name}
              className="card p-3 flex flex-col items-center gap-2 hover:border-[#4361ee44] transition-colors group"
            >
              <div style={{ color }} className="transition-transform group-hover:scale-110">
                {icon}
              </div>
              <span className="text-xs text-center" style={{ color: "#4a506a" }}>
                {name}
              </span>
            </div>
          ))}
          <div
            className="card p-3 flex flex-col items-center gap-2 justify-center"
            style={{ borderStyle: "dashed" }}
          >
            <span className="text-xl" style={{ color: "#4a506a" }}>+</span>
            <span className="text-xs text-center" style={{ color: "#4a506a" }}>
              More soon
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              className="text-xs px-3 py-1 rounded-full"
              style={{ background: "#0d0f18", color: "#4a506a", border: "1px solid #1c2035" }}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
