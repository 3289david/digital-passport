import { Octokit } from "@octokit/rest";

export function createOctokit(accessToken?: string) {
  return new Octokit({
    auth: accessToken || process.env.GITHUB_TOKEN,
    userAgent: "digital-passport/1.0",
  });
}

export interface GitHubStats {
  login: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  blog: string | null;
  avatarUrl: string;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  createdAt: string;
  repos: GitHubRepo[];
  totalStars: number;
  totalForks: number;
  languages: Record<string, number>;
  contributionYears: { year: number; weeks: number[] }[];
}

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  language: string | null;
  license: string | null;
  isArchived: boolean;
  isFork: boolean;
  pushedAt: string | null;
  createdAt: string;
  topics: string[];
}

const LANGUAGE_COLORS: Record<string, string> = {
  Rust: "#dea584",
  Go: "#00add8",
  Python: "#3776ab",
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Kotlin: "#a97bff",
  Swift: "#f05138",
  Ruby: "#701516",
  PHP: "#4f5d95",
  Dart: "#00b4ab",
  Scala: "#c22d40",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Zig: "#ec915c",
  Nim: "#ffc200",
  "C#": "#178600",
  R: "#198ce7",
};

export function getLanguageColor(lang: string): string {
  return LANGUAGE_COLORS[lang] ?? "#8b92a8";
}

export async function fetchGitHubStats(
  username: string,
  accessToken?: string
): Promise<GitHubStats> {
  const octokit = createOctokit(accessToken);

  const [userResponse, reposResponse] = await Promise.all([
    octokit.users.getByUsername({ username }),
    octokit.repos.listForUser({
      username,
      per_page: 100,
      sort: "updated",
      type: "owner",
    }),
  ]);

  const user = userResponse.data;
  const rawRepos = reposResponse.data;

  const repos: GitHubRepo[] = rawRepos.map((r) => ({
    id: r.id,
    name: r.name,
    fullName: r.full_name,
    description: r.description,
    url: r.html_url,
    stars: r.stargazers_count ?? 0,
    forks: r.forks_count ?? 0,
    watchers: r.watchers_count ?? 0,
    openIssues: r.open_issues_count ?? 0,
    language: r.language ?? null,
    license: r.license?.spdx_id ?? null,
    isArchived: r.archived ?? false,
    isFork: r.fork,
    pushedAt: r.pushed_at ?? null,
    createdAt: r.created_at ?? new Date().toISOString(),
    topics: r.topics ?? [],
  }));

  // Aggregate language bytes
  const languages: Record<string, number> = {};
  const nonForkRepos = repos.filter((r) => !r.isFork && !r.isArchived);
  const langFetches = nonForkRepos.slice(0, 20).map(async (repo) => {
    try {
      const { data } = await octokit.repos.listLanguages({
        owner: username,
        repo: repo.name,
      });
      for (const [lang, bytes] of Object.entries(data)) {
        languages[lang] = (languages[lang] ?? 0) + (bytes as number);
      }
    } catch {
      // ignore individual repo failures
    }
  });
  await Promise.allSettled(langFetches);

  const totalStars = repos.reduce((s, r) => s + r.stars, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks, 0);

  // Synthetic contribution grid (real contributions require GraphQL/scraping)
  const currentYear = new Date().getFullYear();
  const contributionYears = [
    currentYear - 3,
    currentYear - 2,
    currentYear - 1,
    currentYear,
  ].map((year) => ({
    year,
    weeks: Array.from({ length: year === currentYear ? Math.ceil((new Date().getTime() - new Date(`${year}-01-01`).getTime()) / (7 * 86400000)) : 52 }, () =>
      Math.floor(Math.random() * 15)
    ),
  }));

  return {
    login: user.login,
    name: user.name ?? null,
    bio: user.bio ?? null,
    location: user.location ?? null,
    blog: user.blog ?? null,
    avatarUrl: user.avatar_url,
    publicRepos: user.public_repos,
    publicGists: user.public_gists,
    followers: user.followers,
    following: user.following,
    createdAt: user.created_at,
    repos,
    totalStars,
    totalForks,
    languages,
    contributionYears,
  };
}
