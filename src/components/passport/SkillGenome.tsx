"use client";

interface Skill {
  name: string;
  score: number;
  color?: string;
}

interface SkillGenomeProps {
  skills: Skill[];
}

const DEFAULT_COLORS = [
  "#4361ee",
  "#10b981",
  "#7b2ff7",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

export function SkillGenome({ skills }: SkillGenomeProps) {
  return (
    <div className="flex flex-col gap-3">
      {skills.map((skill, i) => {
        const color = skill.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
        return (
          <div key={skill.name} className="flex items-center gap-3">
            <span
              className="text-sm font-medium mono w-24 shrink-0 text-right"
              style={{ color: "#8b92a8" }}
            >
              {skill.name}
            </span>
            <div
              className="flex-1 rounded-full overflow-hidden"
              style={{ height: 6, background: "#1c2035" }}
            >
              <div
                style={{
                  width: `${skill.score}%`,
                  height: "100%",
                  background: color,
                  boxShadow: `0 0 8px ${color}66`,
                  transition: "width 1s ease",
                  borderRadius: 999,
                }}
              />
            </div>
            <span
              className="text-sm font-semibold mono w-10 shrink-0"
              style={{ color }}
            >
              {skill.score}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
