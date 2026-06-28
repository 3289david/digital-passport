import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PassportLogoIcon } from "@/components/icons/PlatformIcons";

interface AppNavProps {
  /** Links to show in the center. Defaults to landing nav links. */
  links?: { label: string; href: string }[];
  /** Hide the center nav links (e.g. on inner pages). */
  minimal?: boolean;
}

export async function AppNav({ links, minimal }: AppNavProps) {
  const session = await auth();
  const userId = session?.user?.id;

  let username: string | null = null;
  if (userId) {
    const passport = await db.passport.findUnique({
      where: { userId },
      select: { username: true },
    });
    username = passport?.username ?? null;
  }

  const navLinks = links ?? [
    { label: "Features", href: "/features" },
    { label: "Integrations", href: "/integrations" },
    { label: "Pricing", href: "/pricing" },
    { label: "Demo", href: "/johndoe" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 glass border-b"
      style={{ borderColor: "#1c2035" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <PassportLogoIcon size={28} />
          <span className="font-semibold text-sm tracking-tight" style={{ color: "#e8eaf4" }}>
            Digital Passport
          </span>
        </Link>

        {!minimal && (
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-sm transition-colors"
                style={{ color: "#8b92a8" }}
              >
                {label}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          {session ? (
            <>
              {username && (
                <Link
                  href={`/${username}`}
                  className="text-sm transition-colors hidden sm:block"
                  style={{ color: "#8b92a8" }}
                >
                  My Passport
                </Link>
              )}
              <Link
                href="/dashboard"
                className="text-sm font-medium px-4 py-1.5 rounded-full transition-all"
                style={{ background: "#4361ee", color: "#fff" }}
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm transition-colors hidden sm:block"
                style={{ color: "#8b92a8" }}
              >
                Sign in
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium px-4 py-1.5 rounded-full transition-all"
                style={{ background: "#4361ee", color: "#fff" }}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
