"use client";

interface LangStat {
  name: string;
  percent: number;
  color: string;
}

interface OpenSourceDNAProps {
  languages: LangStat[];
}

export function OpenSourceDNA({ languages }: OpenSourceDNAProps) {
  const total = languages.reduce((s, l) => s + l.percent, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex rounded-full overflow-hidden" style={{ height: 8 }}>
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{
              width: `${(lang.percent / total) * 100}%`,
              background: lang.color,
            }}
            title={`${lang.name}: ${lang.percent}%`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-2">
            <div
              className="rounded-full shrink-0"
              style={{ width: 8, height: 8, background: lang.color }}
            />
            <span className="text-sm mono" style={{ color: "#e8eaf4" }}>
              {lang.name}
            </span>
            <span className="text-sm ml-auto" style={{ color: "#4a506a" }}>
              {lang.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
