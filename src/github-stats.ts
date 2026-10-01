interface GitHubRepository {
  description: string | null;
  stargazers_count: number;
  subscribers_count: number;
  updated_at: string;
}

interface GitHubCommit {
  sha: string;
}

interface RepositoryStats {
  commits: number;
  description: string;
  stars: number;
  watchers: number;
  updated: string;
}

interface CachedStats {
  cachedAt: number;
  repositories: Record<string, RepositoryStats>;
}

const statsStorageKey = "resume-hub-github-stats";
const cacheTtl = 5 * 60 * 1000;
const apiBase = "https://api.github.com/repos/";

function getCachedStats(): Record<string, RepositoryStats> | null {
  try {
    const cached = window.localStorage.getItem(statsStorageKey);
    if (!cached) return null;

    const parsed = JSON.parse(cached) as CachedStats;
    if (Date.now() - parsed.cachedAt > cacheTtl) return null;
    return parsed.repositories;
  } catch {
    return null;
  }
}

function saveCachedStats(repositories: Record<string, RepositoryStats>): void {
  try {
    const cached: CachedStats = { cachedAt: Date.now(), repositories };
    window.localStorage.setItem(statsStorageKey, JSON.stringify(cached));
  } catch {
    // Stats remain usable for this page if storage is unavailable.
  }
}

function getCommitCount(linkHeader: string | null, commits: GitHubCommit[]): number {
  const lastPage = linkHeader?.match(/[?&]page=(\d+)>;\s*rel="last"/);
  return lastPage ? Number(lastPage[1]) : commits.length;
}

async function fetchRepositoryStats(repository: string): Promise<RepositoryStats> {
  const [repositoryResponse, commitsResponse] = await Promise.all([
    fetch(`${apiBase}${repository}`, { headers: { Accept: "application/vnd.github+json" } }),
    fetch(`${apiBase}${repository}/commits?per_page=1`, {
      headers: { Accept: "application/vnd.github+json" },
    }),
  ]);

  if (!repositoryResponse.ok || !commitsResponse.ok) {
    throw new Error(`Unable to load stats for ${repository}`);
  }

  const repo = (await repositoryResponse.json()) as GitHubRepository;
  const commits = (await commitsResponse.json()) as GitHubCommit[];

  return {
    commits: getCommitCount(commitsResponse.headers.get("Link"), commits),
    description: repo.description ?? "No description available.",
    stars: repo.stargazers_count,
    watchers: repo.subscribers_count,
    updated: new Date(repo.updated_at).toLocaleDateString(),
  };
}

function displayStats(card: HTMLElement, stats: RepositoryStats): void {
  const description = document.createElement("p");
  description.className = "project-stats";
  description.textContent = stats.description;

  const summary = document.createElement("p");
  summary.className = "project-stats";
  summary.textContent =
    `${stats.commits.toLocaleString()} commits · Updated ${stats.updated} · ` +
    `${stats.stars.toLocaleString()} stars · ${stats.watchers.toLocaleString()} watchers`;

  card.append(description, summary);
}

async function initializeGitHubStats(): Promise<void> {
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".project-card[data-id]"));
  if (cards.length === 0) return;

  const repositories = getCachedStats() ?? {};
  const missingRepositories = [...new Set(
    cards
      .map((card) => card.dataset.id)
      .filter((repository): repository is string => Boolean(repository && !repositories[repository])),
  )];

  const results = await Promise.allSettled(
    missingRepositories.map(async (repository) => [repository, await fetchRepositoryStats(repository)] as const),
  );

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      repositories[result.value[0]] = result.value[1];
    }
  });

  if (results.some((result) => result.status === "fulfilled")) {
    saveCachedStats(repositories);
  }

  cards.forEach((card) => {
    const repository = card.dataset.id;
    if (repository && repositories[repository]) {
      displayStats(card, repositories[repository]);
    }
  });
}

void initializeGitHubStats();
