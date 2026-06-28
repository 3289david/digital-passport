"use client";

import { useState } from "react";

interface Skill { id: string; name: string; score: number; color: string | null; }

const PRESET_COLORS = ["#4361ee","#10b981","#7b2ff7","#f59e0b","#ef4444","#06b6d4","#ec4899","#84cc16","#dea584","#00add8","#3776ab","#3178c6"];

export function SkillsEditor({ skills: initial }: { skills: Skill[] }) {
  const [skills, setSkills] = useState(initial);
  const [name, setName] = useState("");
  const [score, setScore] = useState(75);
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [saving, setSaving] = useState(false);

  async function add() {
    if (!name.trim()) return;
    setSaving(true);
    const res = await fetch("/api/dashboard/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), score, color }),
    });
    const data = await res.json();
    if (data.success) {
      setSkills((p) => {
        const existing = p.findIndex((s) => s.name === name.trim());
        if (existing >= 0) { const n = [...p]; n[existing] = data.data.skill; return n.sort((a,b) => b.score - a.score); }
        return [...p, data.data.skill].sort((a, b) => b.score - a.score);
      });
      setName("");
      setScore(75);
    }
    setSaving(false);
  }

  async function remove(skillName: string) {
    await fetch("/api/dashboard/skills", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: skillName }),
    });
    setSkills((p) => p.filter((s) => s.name !== skillName));
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "#e8eaf4" }}>Skill Genome</h1>
        <p className="text-sm mt-0.5" style={{ color: "#4a506a" }}>Skills are auto-computed from GitHub but you can add or override them.</p>
      </div>

      <div className="card p-5 flex flex-col gap-4">
        <h2 className="text-sm font-semibold" style={{ color: "#8b92a8" }}>ADD / UPDATE SKILL</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: "#8b92a8" }}>Skill name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rust" maxLength={40} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ background: "#0d0f18", border: "1px solid #1c2035", color: "#e8eaf4", width: 160 }} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: "#8b92a8" }}>Score: {score}%</label>
            <input type="range" min={1} max={100} value={score} onChange={(e) => setScore(Number(e.target.value))} className="w-36" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: "#8b92a8" }}>Color</label>
            <div className="flex gap-1 flex-wrap" style={{ width: 160 }}>
              {PRESET_COLORS.map((c) => (
                <button key={c} onClick={() => setColor(c)} className="rounded-full transition-transform hover:scale-110" style={{ width: 18, height: 18, background: c, outline: color === c ? `2px solid ${c}` : "none", outlineOffset: 2 }} />
              ))}
            </div>
          </div>
          <button onClick={add} disabled={saving || !name.trim()} className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40" style={{ background: "#4361ee", color: "#fff" }}>
            {saving ? "Saving..." : "Add / Update"}
          </button>
        </div>
      </div>

      <div className="card p-5 flex flex-col gap-3">
        <h2 className="text-sm font-semibold" style={{ color: "#8b92a8" }}>YOUR SKILLS ({skills.length})</h2>
        {skills.length === 0 && <p className="text-sm" style={{ color: "#4a506a" }}>No skills yet. Sync GitHub or add manually above.</p>}
        {skills.map((skill) => (
          <div key={skill.id} className="flex items-center gap-3">
            <span className="text-xs mono w-28 shrink-0 text-right" style={{ color: "#8b92a8" }}>{skill.name}</span>
            <div className="flex-1 rounded-full overflow-hidden" style={{ height: 6, background: "#1c2035" }}>
              <div style={{ width: `${skill.score}%`, height: "100%", background: skill.color ?? "#4361ee", borderRadius: 999, boxShadow: `0 0 8px ${skill.color ?? "#4361ee"}66` }} />
            </div>
            <span className="text-xs mono w-10 shrink-0" style={{ color: skill.color ?? "#4361ee" }}>{skill.score}%</span>
            <button onClick={() => remove(skill.name)} className="text-xs px-2 py-0.5 rounded transition-colors" style={{ color: "#ef4444", background: "#ef444415" }}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
