import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { PassportLogoIcon, GitHubIcon } from "@/components/icons/PlatformIcons";

function GoogleSVG() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (session) {
    if (!session.user.username) redirect("/onboarding");
    redirect(`/dashboard`);
  }

  const callbackUrl = params.callbackUrl || "/dashboard";
  const error = params.error;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(67,97,238,0.12) 0%, transparent 60%)" }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <PassportLogoIcon size={48} />
          <div className="text-center">
            <h1 className="text-2xl font-bold" style={{ color: "#e8eaf4" }}>Digital Passport</h1>
            <p className="text-sm mt-1" style={{ color: "#8b92a8" }}>Your verified developer identity</p>
          </div>
        </div>

        {/* Card */}
        <div className="card p-8 flex flex-col gap-4">
          <div className="text-center mb-2">
            <h2 className="font-semibold" style={{ color: "#e8eaf4" }}>Sign in to continue</h2>
            <p className="text-sm mt-1" style={{ color: "#4a506a" }}>
              New here? An account will be created automatically.
            </p>
          </div>

          {error && (
            <div
              className="text-sm px-3 py-2 rounded-lg"
              style={{ background: "#ef444418", border: "1px solid #ef444440", color: "#ef4444" }}
            >
              {error === "OAuthAccountNotLinked"
                ? "This email is already linked to a different provider."
                : "Authentication failed. Please try again."}
            </div>
          )}

          {/* GitHub */}
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: callbackUrl });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all"
              style={{ background: "#e8eaf4", color: "#07080d" }}
            >
              <GitHubIcon size={18} />
              Continue with GitHub
            </button>
          </form>

          {/* Google */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: callbackUrl });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all"
              style={{ background: "#0d0f18", color: "#e8eaf4", border: "1px solid #1c2035" }}
            >
              <GoogleSVG />
              Continue with Google
            </button>
          </form>

          <p className="text-xs text-center mt-2" style={{ color: "#4a506a" }}>
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline" style={{ color: "#8b92a8" }}>Terms</a> and{" "}
            <a href="/privacy" className="underline" style={{ color: "#8b92a8" }}>Privacy Policy</a>.
          </p>
        </div>

        <p className="text-xs text-center mt-6" style={{ color: "#4a506a" }}>
          p.krl.kr — Verified Developer Identity
        </p>
      </div>
    </div>
  );
}
