"use client";

export function PrintButton({ username }: { username: string }) {
  return (
    <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
      <button
        onClick={() => window.print()}
        className="px-4 py-2 rounded-lg text-sm font-medium"
        style={{ background: "#4361ee", color: "#fff" }}
      >
        Print / Save PDF
      </button>
      <a
        href={`/${username}`}
        className="px-4 py-2 rounded-lg text-sm font-medium"
        style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4" }}
      >
        Back
      </a>
    </div>
  );
}
