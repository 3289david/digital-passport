"use client";

import { StarIcon, GitHubIcon } from "@/components/icons/PlatformIcons";
import { formatNumber } from "@/lib/utils";

interface ProjectCardProps {
  name: string;
  description: string;
  stars: number;
  downloads?: number;
  language: string;
  languageColor: string;
  license?: string;
  healthScore: number;
  contributors: number;
  started: string;
  url?: string;
}

export function ProjectCard({
  name,
  description,
  stars,
  downloads,
  language,
  languageColor,
  license,
  healthScore,
  contributors,
  started,
  url,
}: ProjectCardProps) {
  const healthColor =
    healthScore >= 80
      ? "#10b981"
      : healthScore >= 60
      ? "#4361ee"
      : healthScore >= 40
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div
      className="card p-4 flex flex-col gap-3 hover:border-[#4361ee44] transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="font-semibold mono text-sm truncate"
              style={{ color: "#e8eaf4" }}
            >
              {name}
            </span>
            {license && (
              <span
                className="text-xs px-1.5 py-0.5 rounded shrink-0"
                style={{ background: "#1c2035", color: "#4a506a" }}
              >
                {license}
              </span>
            )}
          </div>
          <p
            className="text-xs mt-1 line-clamp-2"
            style={{ color: "#8b92a8" }}
          >
            {description}
          </p>
        </div>
        <div
          className="flex flex-col items-center shrink-0"
          style={{ minWidth: 44 }}
        >
          <span className="text-xs" style={{ color: "#4a506a" }}>
            Health
          </span>
          <span
            className="text-lg font-bold mono leading-tight"
            style={{ color: healthColor }}
          >
            {healthScore}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs" style={{ color: "#8b92a8" }}>
        <div className="flex items-center gap-1">
          <div
            className="rounded-full"
            style={{ width: 8, height: 8, background: languageColor }}
          />
          <span>{language}</span>
        </div>
        <div className="flex items-center gap-1">
          <StarIcon size={12} />
          <span>{formatNumber(stars)}</span>
        </div>
        {downloads !== undefined && (
          <div className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{formatNumber(downloads)}</span>
          </div>
        )}
        <span className="ml-auto" style={{ color: "#4a506a" }}>
          {contributors} contributors
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs mono" style={{ color: "#4a506a" }}>
          Since {started}
        </span>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs hover:text-[#4361ee] transition-colors"
            style={{ color: "#8b92a8" }}
          >
            <GitHubIcon size={12} />
            View
          </a>
        )}
      </div>
    </div>
  );
}
