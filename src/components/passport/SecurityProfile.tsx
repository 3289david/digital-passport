"use client";

interface SecurityItem {
  label: string;
  status: "pass" | "warn" | "fail" | "unknown";
  detail?: string;
}

interface SecurityProfileProps {
  items: SecurityItem[];
  score: number;
}

const STATUS_CONFIG = {
  pass: { color: "#10b981", bg: "#10b98118", label: "Pass" },
  warn: { color: "#f59e0b", bg: "#f59e0b18", label: "Warn" },
  fail: { color: "#ef4444", bg: "#ef444418", label: "Fail" },
  unknown: { color: "#4a506a", bg: "#1c203588", label: "N/A" },
};

function StatusDot({ status }: { status: SecurityItem["status"] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="rounded-full"
        style={{
          width: 7,
          height: 7,
          background: cfg.color,
          boxShadow: `0 0 6px ${cfg.color}88`,
        }}
      />
      <span className="text-xs mono" style={{ color: cfg.color }}>
        {cfg.label}
      </span>
    </div>
  );
}

export function SecurityProfile({ items, score }: SecurityProfileProps) {
  const passCount = items.filter((i) => i.status === "pass").length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm" style={{ color: "#8b92a8" }}>
          {passCount}/{items.length} checks passed
        </span>
        <span
          className="text-sm font-semibold mono"
          style={{
            color: score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444",
          }}
        >
          Score: {score}/100
        </span>
      </div>
      <div
        className="rounded-full overflow-hidden"
        style={{ height: 4, background: "#1c2035" }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            background:
              score >= 80
                ? "#10b981"
                : score >= 50
                ? "#f59e0b"
                : "#ef4444",
            transition: "width 1s ease",
            borderRadius: 999,
          }}
        />
      </div>
      <div className="flex flex-col gap-2 mt-1">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-lg px-3 py-2"
            style={{ background: "#0d0f18", border: "1px solid #141726" }}
          >
            <div>
              <span className="text-sm" style={{ color: "#e8eaf4" }}>
                {item.label}
              </span>
              {item.detail && (
                <p className="text-xs mt-0.5" style={{ color: "#4a506a" }}>
                  {item.detail}
                </p>
              )}
            </div>
            <StatusDot status={item.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
