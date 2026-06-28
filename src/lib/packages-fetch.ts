export interface FetchedPackage {
  name: string;
  version: string | null;
  description: string | null;
  downloads: number;
  url: string;
}

export async function fetchNpmPackages(username: string): Promise<FetchedPackage[]> {
  try {
    const searchRes = await fetch(
      `https://registry.npmjs.org/-/v1/search?text=maintainer:${encodeURIComponent(username)}&size=100`,
      { headers: { "User-Agent": "digital-passport/1.0" }, signal: AbortSignal.timeout(20000) }
    );
    if (!searchRes.ok) return [];
    const searchData = await searchRes.json() as { objects: { package: { name: string; version: string; description: string } }[] };
    if (!searchData.objects?.length) return [];

    const names = searchData.objects.map((o) => o.package.name).slice(0, 100);

    // npm bulk downloads API — comma-separated, up to 128 packages
    const dlRes = await fetch(
      `https://api.npmjs.org/downloads/point/last-year/${names.join(",")}`,
      { headers: { "User-Agent": "digital-passport/1.0" }, signal: AbortSignal.timeout(15000) }
    );
    // Response is either { downloads, package } for single or { pkgName: { downloads } } for multi
    const dlRaw = dlRes.ok ? await dlRes.json() : {};
    const dlData: Record<string, { downloads: number }> = names.length === 1
      ? { [names[0]]: dlRaw }
      : dlRaw as Record<string, { downloads: number }>;

    return searchData.objects.map((o) => ({
      name: o.package.name,
      version: o.package.version || null,
      description: o.package.description || null,
      downloads: dlData[o.package.name]?.downloads ?? 0,
      url: `https://www.npmjs.com/package/${o.package.name}`,
    }));
  } catch {
    return [];
  }
}

export async function fetchCratesPackages(username: string): Promise<FetchedPackage[]> {
  try {
    const userRes = await fetch(
      `https://crates.io/api/v1/users/${encodeURIComponent(username)}`,
      { headers: { "User-Agent": "digital-passport/1.0 (contact@p.krl.kr)" }, signal: AbortSignal.timeout(10000) }
    );
    if (!userRes.ok) return [];
    const userData = await userRes.json() as { user?: { id: number } };
    const userId = userData.user?.id;
    if (!userId) return [];

    const cratesRes = await fetch(
      `https://crates.io/api/v1/crates?user_id=${userId}&per_page=100&sort=downloads`,
      { headers: { "User-Agent": "digital-passport/1.0 (contact@p.krl.kr)" }, signal: AbortSignal.timeout(10000) }
    );
    if (!cratesRes.ok) return [];
    const cratesData = await cratesRes.json() as {
      crates?: { name: string; newest_version: string; description: string; downloads: number }[];
    };

    return (cratesData.crates ?? []).map((c) => ({
      name: c.name,
      version: c.newest_version || null,
      description: c.description || null,
      downloads: c.downloads || 0,
      url: `https://crates.io/crates/${c.name}`,
    }));
  } catch {
    return [];
  }
}
