import axios from "axios";
import { env } from "../../config/env";
import { logger } from "../../utils/logger";

const GH = "https://api.github.com";

const ghHeaders = () => {
  const token = env.GITHUB_TOKEN || env.GITHUB_CLIENT_SECRET;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "CodePulse-App",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

function githubErrorMessage(err: unknown, username: string): string {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 404) {
      return `GitHub user "${username}" not found. Check your username in Settings.`;
    }
    if (err.response?.status === 403) {
      return "GitHub rate limit reached. Add GITHUB_TOKEN to backend/.env or try again later.";
    }
    return err.response?.data?.message ?? err.message;
  }
  return err instanceof Error ? err.message : "GitHub API error";
}

export const fetchGithubUser = async (username: string) => {
  try {
    const { data } = await axios.get(`${GH}/users/${username}`, {
      headers: ghHeaders(),
      timeout: 15_000,
    });
    return data;
  } catch (err) {
    throw new Error(githubErrorMessage(err, username));
  }
};

export const fetchGithubRepos = async (username: string) => {
  try {
    const { data } = await axios.get(
      `${GH}/users/${username}/repos?per_page=100&sort=updated`,
      { headers: ghHeaders(), timeout: 15_000 }
    );
    return data;
  } catch (err) {
    throw new Error(githubErrorMessage(err, username));
  }
};

export const aggregateLanguages = (repos: Array<{ language?: string | null }>): Record<string, number> => {
  const langMap: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) {
      langMap[repo.language] = (langMap[repo.language] || 0) + 1;
    }
  }
  return langMap;
};

export const fetchGithubContributions = async (username: string): Promise<number> => {
  try {
    const { data } = await axios.get(
      `${GH}/users/${username}/events/public?per_page=100`,
      { headers: ghHeaders(), timeout: 15_000 }
    );
    const pushEvents = data.filter((e: { type: string }) => e.type === "PushEvent");
    return pushEvents.reduce(
      (acc: number, e: { payload?: { commits?: unknown[] } }) => acc + (e.payload?.commits?.length ?? 0),
      0
    );
  } catch (err) {
    logger.warn(`GitHub events fetch failed for ${username}, using 0 commits`);
    return 0;
  }
};
