"use client";

import { CheckIcon } from "@/components/icons/PlatformIcons";

interface VerificationItem {
  label: string;
  verified: boolean;
  level: "basic" | "advanced" | "elite";
  icon: React.ReactNode;
}

interface IdentityVerificationProps {
  items: VerificationItem[];
}

const LEVEL_COLOR = {
  basic: "#4361ee",
  advanced: "#10b981",
  elite: "#f0b429",
};

export function IdentityVerification({ items }: IdentityVerificationProps) {
  const grouped = {
    basic: items.filter((i) => i.level === "basic"),
    advanced: items.filter((i) => i.level === "advanced"),
    elite: items.filter((i) => i.level === "elite"),
  };

  const levelLabels = {
    basic: "Basic",
    advanced: "Advanced",
    elite: "Elite",
  };

  return (
    <div className="flex flex-col gap-4">
      {(["basic", "advanced", "elite"] as const).map((level) => {
        const levelItems = grouped[level];
        if (levelItems.length === 0) return null;
        const color = LEVEL_COLOR[level];
        return (
          <div key={level}>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="h-px flex-1"
                style={{ background: `${color}33` }}
              />
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color }}
              >
                {levelLabels[level]}
              </span>
              <div
                className="h-px flex-1"
                style={{ background: `${color}33` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {levelItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5"
                  style={{
                    background: item.verified ? `${color}10` : "#0d0f18",
                    border: `1px solid ${item.verified ? color + "30" : "#141726"}`,
                  }}
                >
                  <span
                    style={{ color: item.verified ? color : "#4a506a" }}
                  >
                    {item.icon}
                  </span>
                  <span
                    className="text-xs flex-1 truncate"
                    style={{
                      color: item.verified ? "#e8eaf4" : "#4a506a",
                    }}
                  >
                    {item.label}
                  </span>
                  {item.verified && (
                    <span style={{ color: "#10b981" }}>
                      <CheckIcon size={12} />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
