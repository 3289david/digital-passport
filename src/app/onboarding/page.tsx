"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PassportLogoIcon, GitHubIcon, CheckIcon } from "@/components/icons/PlatformIcons";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [checking, setChecking] = useState(false);
  const [usernameOk, setUsernameOk] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState("");
  const [githubHandle, setGithubHandle] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  async function checkUsername(val: string) {
    setUsername(val);
    setUsernameOk(null);
    setUsernameError("");
    if (val.length < 3) return;
    if (!/^[a-z0-9_-]+$/.test(val)) {
      setUsernameError("Only lowercase letters, numbers, - and _");
      return;
    }
    setChecking(true);
    try {
      const res = await fetch(`/api/v1/${val}`);
      setUsernameOk(res.status === 404);
      if (res.status !== 404) setUsernameError("Username is already taken");
    } finally {
      setChecking(false);
    }
  }

  async function claimUsername() {
    setClaiming(true);
    setClaimError("");
    try {
      const res = await fetch("/api/passport/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (!data.success) {
        setClaimError(data.error);
        return;
      }
      setGithubHandle(data.data?.githubHandle ?? null);
      setStep(2);
    } catch {
      setClaimError("Something went wrong");
    } finally {
      setClaiming(false);
    }
  }

  async function syncAndContinue() {
    setSyncing(true);
    try {
      await fetch("/api/passport/sync", { method: "POST" });
    } finally {
      setSyncing(false);
    }
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(67,97,238,0.1) 0%, transparent 60%)" }}
      />

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center gap-3 mb-8">
          <PassportLogoIcon size={44} />
          <h1 className="text-2xl font-bold" style={{ color: "#e8eaf4" }}>
            {step === 1 ? "Claim your Passport ID" : "GitHub connected"}
          </h1>
          <div className="flex items-center gap-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className="rounded-full transition-all"
                style={{
                  width: s === step ? 24 : 8,
                  height: 8,
                  background: s <= step ? "#4361ee" : "#1c2035",
                }}
              />
            ))}
          </div>
        </div>

        <div className="card p-8 flex flex-col gap-5">
          {step === 1 && (
            <>
              <p className="text-sm" style={{ color: "#8b92a8" }}>
                Choose your unique handle. Your passport will be at{" "}
                <span className="mono" style={{ color: "#4361ee" }}>
                  p.krl.kr/{username || "yourname"}
                </span>
              </p>

              <div className="flex flex-col gap-2">
                <div className="relative">
                  <span
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-sm mono"
                    style={{ color: "#4a506a" }}
                  >
                    p.krl.kr/
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => checkUsername(e.target.value.toLowerCase())}
                    placeholder="yourname"
                    maxLength={32}
                    className="w-full pl-24 pr-10 py-3 rounded-xl text-sm mono outline-none transition-all"
                    style={{
                      background: "#0d0f18",
                      border: `1px solid ${usernameError ? "#ef4444" : usernameOk ? "#10b981" : "#1c2035"}`,
                      color: "#e8eaf4",
                    }}
                  />
                  {checking && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a506a" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                        <path d="M12 2a10 10 0 0 1 10 10" />
                      </svg>
                    </div>
                  )}
                  {!checking && usernameOk === true && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#10b981" }}>
                      <CheckIcon size={16} />
                    </span>
                  )}
                </div>
                {usernameError && <p className="text-xs" style={{ color: "#ef4444" }}>{usernameError}</p>}
                {usernameOk && <p className="text-xs" style={{ color: "#10b981" }}>Available</p>}
              </div>

              {claimError && <p className="text-sm" style={{ color: "#ef4444" }}>{claimError}</p>}

              <button
                onClick={claimUsername}
                disabled={!usernameOk || claiming}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40"
                style={{ background: "#4361ee", color: "#fff" }}
              >
                {claiming ? "Setting up passport..." : "Claim Passport"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              {githubHandle ? (
                <div className="flex items-center gap-3 rounded-xl p-4" style={{ background: "#10b98110", border: "1px solid #10b98130" }}>
                  <GitHubIcon size={20} />
                  <div className="flex-1">
                    <div className="text-sm font-medium" style={{ color: "#e8eaf4" }}>GitHub auto-linked</div>
                    <div className="text-xs mono" style={{ color: "#10b981" }}>@{githubHandle}</div>
                  </div>
                  <CheckIcon size={16} />
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-xl p-4" style={{ background: "#131520", border: "1px solid #1c2035" }}>
                  <GitHubIcon size={20} />
                  <div className="flex-1">
                    <div className="text-sm font-medium" style={{ color: "#e8eaf4" }}>GitHub</div>
                    <div className="text-xs" style={{ color: "#4a506a" }}>Add your handle in Platforms after setup</div>
                  </div>
                </div>
              )}

              <p className="text-sm leading-relaxed" style={{ color: "#8b92a8" }}>
                {githubHandle
                  ? "Your GitHub account is linked. Click below to sync your repos, compute your Trust Score, and build your Skill Genome."
                  : "You can connect platforms any time from your dashboard to sync repos and compute your Trust Score."}
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={syncAndContinue}
                  disabled={syncing}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                  style={{ background: "#4361ee", color: "#fff" }}
                >
                  {syncing ? (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/>
                      </svg>
                      Starting sync...
                    </>
                  ) : (
                    <>{githubHandle ? "Sync GitHub and open dashboard" : "Go to dashboard"}</>
                  )}
                </button>
                {githubHandle && (
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full py-2 text-sm transition-all"
                    style={{ color: "#4a506a" }}
                  >
                    Skip sync for now
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
