import LeetcodeStats from "../../models/LeetcodeStats";
import Contest from "../../models/Contest";
import SubmissionHistory from "../../models/SubmissionHistory";
import ProblemHistory from "../../models/ProblemHistory";
import {
  fetchLeetcodeProfile,
  fetchContestHistory,
  fetchSubmissionCalendar,
  fetchRecentSubmissions,
  fetchProblemDetails,
} from "./leetcode.service";
import { logger } from "../../utils/logger";

export async function runLeetcodeSync(userId: string, username: string): Promise<void> {
  const cleanUsername = username.trim();
  logger.info(`[Sync] Starting LeetCode sync for user ${userId} (${cleanUsername})`);

  try {
    const profile = await fetchLeetcodeProfile(cleanUsername);
    if (!profile) {
      throw new Error(`LeetCode user "${cleanUsername}" not found. Check your username in Settings.`);
    }

    const statsRaw = profile.submitStats?.acSubmissionNum ?? [];
    const easyCount  = statsRaw.find((s) => s.difficulty === "Easy")?.count   ?? 0;
    const medCount   = statsRaw.find((s) => s.difficulty === "Medium")?.count ?? 0;
    const hardCount  = statsRaw.find((s) => s.difficulty === "Hard")?.count   ?? 0;
    const totalCount = statsRaw.find((s) => s.difficulty === "All")?.count    ?? 0;

    const contestData = await fetchContestHistory(cleanUsername);
    const contestRating = contestData?.userContestRanking?.rating ?? 0;

    const calendar = await fetchSubmissionCalendar(cleanUsername);
    const streak = calendar?.streak ?? 0;

    await LeetcodeStats.findOneAndUpdate(
      { userId },
      {
        userId,
        totalSolved: totalCount,
        easySolved: easyCount,
        mediumSolved: medCount,
        hardSolved: hardCount,
        ranking: profile.profile?.ranking ?? 0,
        contestRating,
        streak,
      },
      { upsert: true, new: true }
    );

    const history = contestData?.userContestRankingHistory ?? [];
    for (const c of history) {
      if (!c.attended || !c.contest?.title) continue;
      await Contest.findOneAndUpdate(
        { userId, contestName: c.contest.title },
        {
          userId,
          contestName: c.contest.title,
          rating: c.rating,
          rank: c.ranking,
          attendedAt: c.contest.startTime ? new Date(c.contest.startTime * 1000) : new Date(),
        },
        { upsert: true }
      );
    }

    const recent = await fetchRecentSubmissions(cleanUsername, 30);
    for (const sub of recent) {
      const details = await fetchProblemDetails(sub.titleSlug);
      const difficulty = details?.difficulty ?? "Medium";
      const topics = details?.topics ?? [];
      const solvedAt = new Date(parseInt(sub.timestamp, 10) * 1000);

      await SubmissionHistory.findOneAndUpdate(
        { userId, problemSlug: sub.titleSlug },
        { userId, problemSlug: sub.titleSlug, title: sub.title, difficulty, topics, timestamp: solvedAt },
        { upsert: true }
      );

      await ProblemHistory.findOneAndUpdate(
        { userId, title: sub.title },
        { userId, title: sub.title, difficulty, topics, solvedAt },
        { upsert: true }
      );
    }

    logger.info(`[Sync] LeetCode sync complete for ${cleanUsername} (${totalCount} solved, ${recent.length} recent)`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error(`[Sync] LeetCode sync failed for ${cleanUsername}: ${msg}`);
    throw err;
  }
}
