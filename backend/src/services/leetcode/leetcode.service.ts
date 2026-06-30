import axios from "axios";
import { logger } from "../../utils/logger";

const LC_GRAPHQL = "https://leetcode.com/graphql";

const headers = {
  "Content-Type": "application/json",
  Referer: "https://leetcode.com",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

async function lcQuery<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const { data } = await axios.post<GraphQLResponse<T>>(LC_GRAPHQL, { query, variables }, { headers, timeout: 20_000 });

  if (data.errors?.length) {
    throw new Error(data.errors[0].message);
  }
  if (!data.data) {
    throw new Error("LeetCode API returned no data");
  }
  return data.data;
}

export const fetchLeetcodeProfile = async (username: string) => {
  const result = await lcQuery<{ matchedUser: unknown }>(`
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile { ranking reputation }
        submitStats {
          acSubmissionNum { difficulty count }
        }
      }
    }
  `, { username });

  return result.matchedUser as {
    username: string;
    profile?: { ranking?: number };
    submitStats?: { acSubmissionNum: Array<{ difficulty: string; count: number }> };
  } | null;
};

export const fetchContestHistory = async (username: string) => {
  return lcQuery<{
    userContestRanking?: { rating?: number };
    userContestRankingHistory?: Array<{
      attended?: boolean;
      rating?: number;
      ranking?: number;
      contest?: { title?: string; startTime?: number };
    }>;
  }>(`
    query userContestRankingInfo($username: String!) {
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        totalParticipants
        topPercentage
      }
      userContestRankingHistory(username: $username) {
        attended
        trendDirection
        problemsSolved
        totalProblems
        finishTimeInSeconds
        rating
        ranking
        contest { title startTime }
      }
    }
  `, { username });
};

export const fetchSubmissionCalendar = async (username: string) => {
  const result = await lcQuery<{ matchedUser?: { userCalendar?: { streak?: number } } }>(`
    query userProfileCalendar($username: String!, $year: Int) {
      matchedUser(username: $username) {
        userCalendar(year: $year) {
          submissionCalendar
          totalActiveDays
          streak
        }
      }
    }
  `, { username, year: new Date().getFullYear() });

  return result.matchedUser?.userCalendar ?? null;
};

export const fetchRecentSubmissions = async (username: string, limit = 20) => {
  const result = await lcQuery<{ recentAcSubmissionList?: Array<{ title: string; titleSlug: string; timestamp: string }> }>(`
    query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id title titleSlug timestamp
      }
    }
  `, { username, limit });

  return result.recentAcSubmissionList ?? [];
};

export const fetchProblemDetails = async (titleSlug: string) => {
  try {
    const result = await lcQuery<{ question?: { difficulty?: string; topicTags?: Array<{ name: string }> } }>(`
      query questionData($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          difficulty
          topicTags { name slug }
        }
      }
    `, { titleSlug });

    const q = result.question;
    if (!q) return null;

    return {
      difficulty: q.difficulty as "Easy" | "Medium" | "Hard" | undefined,
      topics: (q.topicTags ?? []).map((t) => t.name),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn(`Could not fetch problem ${titleSlug}: ${msg}`);
    return null;
  }
};
