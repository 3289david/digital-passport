# Digital Passport

**p.krl.kr** — Verified developer identity. One URL. Everything about you.

A production-grade platform that aggregates your developer activity from GitHub, npm, Docker Hub, PyPI, and more into a single trusted profile with an AI-computed Trust Score, verified credentials, and a shareable personal site.

---

## Features

- **Passport Page** (`/username`) — Public profile with Trust Score, Skill Genome, project portfolio, package stats, badges, timeline, and Developer Visas
- **Personal Site** (`/username/site`) — 4 themes: Minimal, Terminal, Card, Portfolio
- **Print/PDF** (`/username/print`) — Clean print-optimized layout for saving as PDF
- **Team Passports** (`/teamname`) — Organization profiles with member grid and aggregated trust score
- **Trust Score** — Real computation from GitHub activity: commit patterns, project quality, community impact, package downloads, security posture, verification level, account longevity
- **Developer Visa** — Endorsements from organizations (companies, communities) issued to your passport
- **Dashboard** — Edit every field on your passport: profile, experience, skills, projects, platforms, site config, API keys
- **REST API** (`/api/v1`) — Public API with optional API key for higher rate limits

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Auth | Auth.js v5 (NextAuth) with Prisma adapter |
| Database | PostgreSQL via Prisma ORM |
| GitHub API | Octokit REST |
| Validation | Zod |
| Fonts | Geist Sans + Geist Mono |

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (Neon, Supabase, Vercel Postgres, or local)
- GitHub OAuth App
- Google OAuth App (optional)

### 1. Clone and install

```bash
git clone https://github.com/3289david/digital-passport.git
cd digital-passport
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/digitalpassport"

# Auth.js (generate with: openssl rand -base64 32)
AUTH_SECRET="your-secret-here"

# GitHub OAuth (https://github.com/settings/developers)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Google OAuth (https://console.cloud.google.com)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Set up the database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers) → OAuth Apps → New OAuth App
2. Set Homepage URL to your domain (or `http://localhost:3000` for local dev)
3. Set Callback URL to `http://localhost:3000/api/auth/callback/github` (or your domain)
4. Copy Client ID and Client Secret to `.env`

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add Authorized Redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Client Secret to `.env`

---

## API Reference

All endpoints are public (no auth required). Include `X-API-Key: your_key` for higher rate limits.

Base URL: `https://p.krl.kr/api/v1`

### Passport

```
GET /api/v1/{username}           Full passport data
GET /api/v1/{username}/trust     Trust score with history
GET /api/v1/{username}/skills    Skill list with scores
GET /api/v1/{username}/projects  Featured projects
GET /api/v1/{username}/packages  Published packages
GET /api/v1/{username}/badges    Earned badges
GET /api/v1/{username}/timeline  Experience timeline
```

### Teams

```
GET /api/v1/teams/{slug}         Team passport with members
```

### Example response

```json
{
  "success": true,
  "data": {
    "username": "danu",
    "displayName": "Dan",
    "trustScore": 742,
    "title": "Full Stack Developer",
    "skills": [...],
    "projects": [...],
    "badges": [...]
  }
}
```

---

## Trust Score

The Trust Score (0–1000) is computed from 7 components:

| Component | Max | What it measures |
|---|---|---|
| Commit Activity | 150 | Active repos vs. total repos ratio |
| Project Quality | 200 | Stars, forks, recently maintained count |
| Community Impact | 150 | Followers, forks received, repo count |
| Packages | 150 | Log-scale total package downloads |
| Security | 150 | 2FA, CI/CD topics on repos |
| Verification | 100 | None / Basic / Advanced / Elite |
| Longevity | 100 | Years since account creation × 14 |

Scores update each time you sync your passport from the dashboard.

---

## URL Structure

| URL | Content |
|---|---|
| `/` | Landing page |
| `/login` | Sign in with GitHub or Google |
| `/onboarding` | Claim username + connect GitHub |
| `/dashboard` | Edit your passport |
| `/{username}` | Public passport (user or team) |
| `/{username}/site` | Personal site (4 themes) |
| `/{username}/print` | Print/PDF layout |

---

## Deployment

### Vercel (recommended)

```bash
npm run build   # verify build
vercel          # deploy
```

Set the same environment variables in Vercel's dashboard. For the database, use Neon (free tier available) or Vercel Postgres.

### Self-hosted

```bash
npm run build
npm start
```

Use a reverse proxy (Nginx, Caddy) in front of port 3000.

---

## Developer Visas

Organizations can issue Visas (endorsed badges) to developer passports. To enable this:

1. Create an Organization entry in the database with a verified owner
2. The org owner can issue Visas via `POST /api/visa` with the recipient's username and a title/description
3. Visas appear on the recipient's passport under "Developer Visas"

---

## Project Structure

```
src/
  app/
    [username]/          Public passport, site, print pages
    api/v1/[username]/   REST API endpoints
    api/passport/        Dashboard mutations (sync, update, connect)
    api/visa/            Developer Visa issuance
    dashboard/           Owner dashboard
    login/               Auth pages
    onboarding/          Username claim + GitHub connect
  auth.ts                NextAuth v5 config
  components/
    dashboard/           Dashboard tab panels
    icons/               SVG icon components
  lib/
    db.ts                Prisma singleton
    github.ts            GitHub API fetching (Octokit)
    trust-score.ts       Trust score computation
    sync.ts              Passport sync logic
    api-helpers.ts       Response helpers + CORS
prisma/
  schema.prisma          Full database schema
```

---

## License

MIT
