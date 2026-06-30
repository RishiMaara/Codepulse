import cron from "node-cron";
import User from "../models/User";
import { runLeetcodeSync } from "../services/leetcode/sync.service";
import { fetchGithubUser, fetchGithubRepos, aggregateLanguages, fetchGithubContributions } from "../services/github/github.service";
import GithubActivity from "../models/GithubActivity";
import { calculateReadinessScore, calculateDeveloperScore } from "../services/analytics/readinessAnalyzer";
import { calculateCompanyFit } from "../services/analytics/companyFit";
import UserAnalyticsSnapshot from "../models/UserAnalyticsSnapshot";
import LeetcodeStats from "../models/LeetcodeStats";
import { getWeakAndStrong } from "../services/analytics/topicAnalyzer";
import ProblemHistory from "../models/ProblemHistory";
import { logger } from "../utils/logger";

/** Runs every night at 2AM — syncs all users with usernames set */
export const startSyncJob = (): void => {
  cron.schedule("0 2 * * *", async () => {
    logger.info("[CronJob] Starting nightly user sync...");

    const users = await User.find({
      $or: [{ leetcodeUsername: { $exists: true } }, { githubUsername: { $exists: true } }],
    });

    for (const user of users) {
      try {
        const userId = user._id.toString();

        // LeetCode sync
        if (user.leetcodeUsername) {
          await runLeetcodeSync(userId, user.leetcodeUsername);
        }

        // GitHub sync
        if (user.githubUsername) {
          const [profile, repos, commits] = await Promise.all([
            fetchGithubUser(user.githubUsername),
            fetchGithubRepos(user.githubUsername),
            fetchGithubContributions(user.githubUsername),
          ]);
          const languages = aggregateLanguages(repos);
          const stars = repos.reduce((s: number, r: any) => s + (r.stargazers_count ?? 0), 0);
          await GithubActivity.findOneAndUpdate(
            { userId },
            { userId, repositories: profile.public_repos, commits, stars, languages },
            { upsert: true }
          );
        }

        // Rebuild analytics snapshot
        const [lc, gh, problems] = await Promise.all([
          LeetcodeStats.findOne({ userId }),
          GithubActivity.findOne({ userId }),
          ProblemHistory.find({ userId }),
        ]);

        const lcData = { totalSolved: lc?.totalSolved ?? 0, hardSolved: lc?.hardSolved ?? 0, contestRating: (lc as any)?.contestRating ?? 0 };
        const ghData = { repos: gh?.repositories ?? 0 };
        const readiness      = calculateReadinessScore(lcData, ghData);
        const developerScore = calculateDeveloperScore(lcData, ghData);
        const companies      = calculateCompanyFit(readiness);
        const { weakTopics, strongTopics } = getWeakAndStrong(problems);

        await UserAnalyticsSnapshot.findOneAndUpdate(
          { userId },
          {
            userId,
            totalSolved:   lc?.totalSolved,
            contestRating: (lc as any)?.contestRating,
            weakTopics:    weakTopics.map(([t]) => t),
            strongTopics:  strongTopics.map(([t]) => t),
            readinessScore: readiness,
            developerScore,
            companyFit: companies,
            generatedAt: new Date(),
          },
          { upsert: true }
        );

        // Update developer score on user doc
        await User.findByIdAndUpdate(userId, { developerScore });

        logger.info(`[CronJob] Synced user: ${user.email}`);
      } catch (err: any) {
        logger.error(`[CronJob] Failed for ${user.email}: ${err.message}`);
      }
    }

    logger.info("[CronJob] Nightly sync complete.");
  });

  logger.info("📅 Nightly sync cron registered (2AM daily)");
};
