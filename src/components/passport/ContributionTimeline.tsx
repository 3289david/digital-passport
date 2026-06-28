"use client";

interface ContributionTimelineProps {
  data: { year: number; weeks: number[] }[];
}

function getColor(value: number): string {
  if (value === 0) return "#1c2035";
  if (value < 3) return "#4361ee33";
  if (value < 6) return "#4361ee66";
  if (value < 10) return "#4361eeaa";
  return "#4361ee";
}

export function ContributionTimeline({ data }: ContributionTimelineProps) {
  return (
    <div className="flex flex-col gap-4">
      {data.map(({ year, weeks }) => (
        <div key={year} className="flex items-center gap-3">
          <span
            className="text-xs font-medium mono w-10 shrink-0"
            style={{ color: "#8b92a8" }}
          >
            {year}
          </span>
          <div className="flex gap-0.5 flex-wrap">
            {weeks.map((val, i) => (
              <div
                key={i}
                title={`Week ${i + 1}: ${val} contributions`}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: getColor(val),
                  transition: "transform 0.1s",
                  cursor: "default",
                }}
                className="hover:scale-110"
              />
            ))}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs" style={{ color: "#4a506a" }}>
          Less
        </span>
        {[0, 2, 5, 8, 12].map((v) => (
          <div
            key={v}
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: getColor(v),
            }}
          />
        ))}
        <span className="text-xs" style={{ color: "#4a506a" }}>
          More
        </span>
      </div>
    </div>
  );
}
