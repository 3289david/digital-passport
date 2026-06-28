# Digital Passport

Verified developer identity platform. Domain: **p.krl.kr**

## What it is

A "living passport" that aggregates a developer's activity across every platform (GitHub, GitLab, npm, Docker Hub, PyPI, Hugging Face, etc.) into one verified, AI-analyzed identity. Think: GitHub profile + LinkedIn + resume, but objective, cryptographically verifiable, and auto-updated.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + CSS custom properties (no class-based dark mode toggle — always dark)
- **Icons:** Custom SVG components in `src/components/icons/PlatformIcons.tsx` — NO emoji
- **Fonts:** Geist Sans + Geist Mono (Next.js built-in)

## Commands

```bash
npm run dev     # Dev server at localhost:3000
npm run build   # Production build (Turbopack)
npm run start   # Serve production build
```

## Project Structure

```
src/
  app/
    layout.tsx          # Root layout, metadata, viewport
    globals.css         # Design system (CSS variables, card classes, animations)
    page.tsx            # Landing page
    [username]/
      page.tsx          # Passport profile page (demo data inline for now)
    icon.svg            # Favicon (SVG)
    apple-icon.svg      # Apple touch icon
  components/
    icons/
      PlatformIcons.tsx # All SVG icon components (GitHub, npm, Docker, etc.)
    landing/
      Nav.tsx           # Top navigation bar
      Hero.tsx          # Hero section with animated passport card mockup
      Features.tsx      # 9-feature grid
      HowItWorks.tsx    # 5-step onboarding flow
      Platforms.tsx     # Platform integration grid
      CTA.tsx           # Call to action section
      Footer.tsx        # Footer with links
    passport/
      TrustScore.tsx          # SVG circular trust score meter
      SkillGenome.tsx         # Horizontal skill bars
      ContributionTimeline.tsx # GitHub-style contribution grid
      OpenSourceDNA.tsx       # Language distribution bar + legend
      ProjectCard.tsx         # Individual project card
      VerifiedBadges.tsx      # Badge grid (earned/unearned states)
      SecurityProfile.tsx     # Security check list with pass/warn/fail
      PackagePortfolio.tsx    # Package list grouped by registry
      IdentityVerification.tsx # Tiered verification grid (basic/advanced/elite)
      ExperienceGraph.tsx     # Vertical timeline of career milestones
  lib/
    utils.ts            # cn() + formatNumber()
public/
  og-image.svg          # Open Graph / Twitter card image
  site.webmanifest      # PWA manifest
```

## Design System

All design tokens live in `globals.css` as CSS custom properties:

| Variable | Value | Use |
|---|---|---|
| `--bg` | `#07080d` | Page background |
| `--bg-surface` | `#0d0f18` | Card backgrounds |
| `--bg-elevated` | `#131520` | Elevated surfaces |
| `--border` | `#1c2035` | Card borders |
| `--accent` | `#4361ee` | Primary blue |
| `--green` | `#10b981` | Verified/success |
| `--text-primary` | `#e8eaf4` | Body text |
| `--text-secondary` | `#8b92a8` | Subdued text |
| `--text-muted` | `#4a506a` | Disabled / labels |

Utility classes defined in `globals.css`:
- `.card` — standard card surface with border
- `.card-elevated` — slightly lighter card
- `.glass` — frosted glass nav background
- `.mono` — monospace font
- `.text-gradient-accent` — blue-to-purple gradient text

## Key Design Decisions

- **Dark-only:** No light mode. The palette is always dark.
- **No emojis:** All icons are SVG components in PlatformIcons.tsx.
- **Tailwind for layout, CSS vars for color:** Tailwind handles spacing/grid/flex; color tokens come from CSS vars to keep the palette consistent.
- **Demo data inline:** The `[username]/page.tsx` profile page uses hardcoded `PASSPORT_DATA`. In production this would be fetched server-side from a DB/API.
- **Static landing, dynamic profiles:** The landing page is statically generated. Profile pages are server-rendered on demand.

## Future Work

- Auth (GitHub OAuth) for claiming a passport
- Backend API to ingest and index platform data
- Real-time Trust Score computation pipeline
- Recruiter Mode with search/filter
- Developer Visa (corporate endorsement) system
- Team Passport for open source orgs
- AI Resume generator
- Passport API (`api.p.krl.kr/v1/:username`)
