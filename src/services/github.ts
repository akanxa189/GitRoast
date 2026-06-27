import axios from 'axios';
import type { GitHubData, RoastError } from '../types';

interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

interface GitHubRepo {
  name: string;
  stargazers_count: number;
  language: string | null;
  pushed_at: string;
  description: string | null;
}

function inferHasProfilePic(user: GitHubUser): boolean {
  const daysSinceCreation =
    (new Date(user.updated_at).getTime() - new Date(user.created_at).getTime()) /
    (1000 * 60 * 60 * 24);
  return daysSinceCreation > 1 || Boolean(user.bio);
}

async function repoHasReadme(owner: string, repo: string): Promise<boolean> {
  try {
    await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      { validateStatus: (s) => s === 200 },
    );
    return true;
  } catch {
    return false;
  }
}

function getMostUsedLanguages(repos: GitHubRepo[]): string[] {
  const counts: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([lang]) => lang);
}

function parseGitHubError(error: unknown): RoastError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const remaining = error.response?.headers?.['x-ratelimit-remaining'];

    if (status === 404) {
      return {
        type: 'not_found',
        message: `GitHub user not found. Double-check that username — even your alt account won't save you.`,
      };
    }

    if (status === 403 || remaining === '0') {
      return {
        type: 'rate_limit',
        message: `GitHub API rate limit hit (60 requests/hour without auth). Take a coffee break and try again in a bit. ☕`,
      };
    }

    if (error.code === 'ERR_NETWORK') {
      return {
        type: 'network',
        message: 'Network error — check your connection and try again.',
      };
    }
  }

  return {
    type: 'unknown',
    message: 'Something went wrong fetching GitHub data. The repos remain unroasted... for now.',
  };
}

export async function fetchGitHubData(username: string): Promise<GitHubData> {
  const cleanUsername = username.trim().replace(/^@/, '');

  if (!cleanUsername) {
    throw {
      type: 'not_found' as const,
      message: 'Please enter a GitHub username.',
    };
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      axios.get<GitHubUser>(`https://api.github.com/users/${cleanUsername}`),
      axios.get<GitHubRepo[]>(
        `https://api.github.com/users/${cleanUsername}/repos?sort=stars&per_page=10`,
      ),
    ]);

    const user = userRes.data;
    const repos = reposRes.data;

    const readmeResults = await Promise.all(
      repos.map((repo) => repoHasReadme(cleanUsername, repo.name)),
    );
    const readme_count = readmeResults.filter(Boolean).length;

    const total_stars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
    const last_push_date =
      repos.length > 0
        ? repos.reduce((latest, r) =>
            new Date(r.pushed_at) > new Date(latest) ? r.pushed_at : latest,
          repos[0].pushed_at)
        : null;

    const top_repo =
      repos.length > 0
        ? {
            name: repos[0].name,
            stars: repos[0].stargazers_count,
            language: repos[0].language,
          }
        : null;

    return {
      name: user.name ?? user.login,
      username: user.login,
      bio: user.bio ?? 'No bio. Mysterious... or just lazy.',
      followers: user.followers,
      following: user.following,
      public_repos: user.public_repos,
      total_stars,
      most_used_languages: getMostUsedLanguages(repos),
      last_push_date,
      has_profile_pic: inferHasProfilePic(user),
      readme_count,
      repo_names: repos.map((r) => r.name),
      top_repo,
      avatar_url: user.avatar_url,
    };
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'type' in error &&
      'message' in error
    ) {
      throw error;
    }
    throw parseGitHubError(error);
  }
}

export function getDaysSinceLastCommit(lastPushDate: string | null): number | null {
  if (!lastPushDate) return null;
  const diff = Date.now() - new Date(lastPushDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getCommitConsistencyRating(days: number | null): {
  label: string;
  emoji: string;
} {
  if (days === null) return { label: 'Ghost Mode', emoji: '👻' };
  if (days < 7) return { label: 'On Fire', emoji: '🔥' };
  if (days < 30) return { label: 'Active', emoji: '⚡' };
  if (days < 90) return { label: 'Hibernating', emoji: '🐻' };
  return { label: 'Git Archaeologist', emoji: '🏛️' };
}
