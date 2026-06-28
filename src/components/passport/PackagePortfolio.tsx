"use client";

import { NpmIcon, PyPIIcon, DockerIcon } from "@/components/icons/PlatformIcons";
import { formatNumber } from "@/lib/utils";

type Registry = "npm" | "pypi" | "docker" | "crates";

interface Package {
  name: string;
  registry: Registry;
  version: string;
  downloads: number;
  description?: string;
}

const REGISTRY_CONFIG: Record<
  Registry,
  { icon: React.ReactNode; color: string; label: string }
> = {
  npm: {
    icon: <NpmIcon size={14} />,
    color: "#cb3837",
    label: "npm",
  },
  pypi: {
    icon: <PyPIIcon size={14} />,
    color: "#3775a9",
    label: "PyPI",
  },
  docker: {
    icon: <DockerIcon size={14} />,
    color: "#2496ed",
    label: "Docker",
  },
  crates: {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L1.605 6v12L12 24l10.395-6V6L12 0zm6 16.59c0 .705-.403 1.346-1.04 1.65l-4.2 2.1a1.85 1.85 0 01-1.52 0l-4.2-2.1A1.85 1.85 0 016 16.59V7.41c0-.705.403-1.346 1.04-1.65l4.2-2.1a1.85 1.85 0 011.52 0l4.2 2.1c.637.304 1.04.945 1.04 1.65v9.18z" />
      </svg>
    ),
    color: "#dea584",
    label: "crates.io",
  },
};

interface PackagePortfolioProps {
  packages: Package[];
}

export function PackagePortfolio({ packages }: PackagePortfolioProps) {
  const byRegistry = packages.reduce<Record<Registry, Package[]>>(
    (acc, pkg) => {
      if (!acc[pkg.registry]) acc[pkg.registry] = [];
      acc[pkg.registry].push(pkg);
      return acc;
    },
    {} as Record<Registry, Package[]>
  );

  return (
    <div className="flex flex-col gap-4">
      {(Object.entries(byRegistry) as [Registry, Package[]][]).map(
        ([registry, pkgs]) => {
          const cfg = REGISTRY_CONFIG[registry];
          return (
            <div key={registry}>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: cfg.color }}>{cfg.icon}</span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: cfg.color }}
                >
                  {cfg.label}
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{ background: `${cfg.color}18`, color: cfg.color }}
                >
                  {pkgs.length}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {pkgs.map((pkg) => (
                  <div
                    key={pkg.name}
                    className="flex items-center justify-between rounded-lg px-3 py-2"
                    style={{
                      background: "#0d0f18",
                      border: "1px solid #141726",
                    }}
                  >
                    <div>
                      <span
                        className="text-sm mono font-medium"
                        style={{ color: "#e8eaf4" }}
                      >
                        {pkg.name}
                      </span>
                      <span
                        className="ml-2 text-xs mono"
                        style={{ color: "#4a506a" }}
                      >
                        v{pkg.version}
                      </span>
                    </div>
                    <span className="text-xs mono" style={{ color: "#8b92a8" }}>
                      {formatNumber(pkg.downloads)} dl
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}
