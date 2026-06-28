"use client";

interface TrustScoreProps {
  score: number;
  maxScore?: number;
}

export function TrustScore({ score, maxScore = 1000 }: TrustScoreProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const percent = score / maxScore;
  const offset = circumference * (1 - percent);

  const color =
    score >= 900
      ? "#10b981"
      : score >= 700
      ? "#4361ee"
      : score >= 500
      ? "#f59e0b"
      : "#ef4444";

  const label =
    score >= 900
      ? "Elite"
      : score >= 700
      ? "Trusted"
      : score >= 500
      ? "Verified"
      : "New";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: 132, height: 132 }}>
        <svg width="132" height="132" viewBox="0 0 132 132">
          <circle
            cx="66"
            cy="66"
            r={radius}
            fill="none"
            stroke="#1c2035"
            strokeWidth="10"
          />
          <circle
            cx="66"
            cy="66"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 66 66)"
            style={{
              filter: `drop-shadow(0 0 8px ${color}66)`,
              transition: "stroke-dashoffset 1.2s ease",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold mono"
            style={{ color }}
          >
            {score}
          </span>
          <span className="text-xs font-medium" style={{ color: "#8b92a8" }}>
            / {maxScore}
          </span>
        </div>
      </div>
      <span
        className="text-xs font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
        style={{
          color,
          background: `${color}18`,
          border: `1px solid ${color}40`,
        }}
      >
        {label}
      </span>
    </div>
  );
}
