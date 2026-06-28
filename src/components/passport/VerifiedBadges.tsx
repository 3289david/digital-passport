"use client";

import { CheckIcon } from "@/components/icons/PlatformIcons";

interface Badge {
  label: string;
  icon: React.ReactNode;
  earned: boolean;
}

interface VerifiedBadgesProps {
  badges: Badge[];
}

export function VerifiedBadges({ badges }: VerifiedBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          style={{
            background: badge.earned ? "#4361ee18" : "#1c203588",
            border: badge.earned ? "1px solid #4361ee55" : "1px solid #1c2035",
            color: badge.earned ? "#e8eaf4" : "#4a506a",
            opacity: badge.earned ? 1 : 0.5,
          }}
        >
          <span
            style={{ color: badge.earned ? "#4361ee" : "#4a506a" }}
            className="shrink-0"
          >
            {badge.icon}
          </span>
          {badge.label}
          {badge.earned && (
            <span style={{ color: "#10b981" }}>
              <CheckIcon size={12} />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
