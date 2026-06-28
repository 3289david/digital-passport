"use client";

interface ExperienceEntry {
  year: string;
  title: string;
  description?: string;
  type: "project" | "company" | "milestone" | "education";
}

const TYPE_COLOR = {
  project: "#4361ee",
  company: "#10b981",
  milestone: "#f0b429",
  education: "#7b2ff7",
};

const TYPE_LABEL = {
  project: "Project",
  company: "Company",
  milestone: "Milestone",
  education: "Education",
};

interface ExperienceGraphProps {
  entries: ExperienceEntry[];
}

export function ExperienceGraph({ entries }: ExperienceGraphProps) {
  return (
    <div className="flex flex-col gap-0">
      {entries.map((entry, i) => {
        const color = TYPE_COLOR[entry.type];
        const isLast = i === entries.length - 1;
        return (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className="rounded-full shrink-0 mt-1"
                style={{
                  width: 10,
                  height: 10,
                  background: color,
                  boxShadow: `0 0 8px ${color}88`,
                }}
              />
              {!isLast && (
                <div
                  className="flex-1 w-px my-1"
                  style={{ background: "#1c2035", minHeight: 24 }}
                />
              )}
            </div>
            <div className={`flex flex-col gap-0.5 pb-4 ${isLast ? "pb-0" : ""}`}>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-semibold mono"
                  style={{ color }}
                >
                  {entry.year}
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    background: `${color}18`,
                    color,
                    border: `1px solid ${color}30`,
                  }}
                >
                  {TYPE_LABEL[entry.type]}
                </span>
              </div>
              <span className="text-sm font-medium" style={{ color: "#e8eaf4" }}>
                {entry.title}
              </span>
              {entry.description && (
                <span className="text-xs" style={{ color: "#4a506a" }}>
                  {entry.description}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
