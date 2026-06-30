import User from "../../models/User";
import LeetcodeStats from "../../models/LeetcodeStats";
import GithubActivity from "../../models/GithubActivity";
import ProblemHistory from "../../models/ProblemHistory";
import UserAnalyticsSnapshot from "../../models/UserAnalyticsSnapshot";
import Achievement, { BADGES } from "../../models/Achievement";
import { calculateReadinessScore, calculateDeveloperScore } from "./readinessAnalyzer";
import { calculateCompanyFit } from "./companyFit";
import { getWeakAndStrong } from "./topicAnalyzer";

export async function rebuildUserAnalytics(userId: string): Promise<void> {
  const [lc, gh, problems] = await Promise.all([
    LeetcodeStats.findOne({ userId }),
    GithubActivity.findOne({ userId }),
    ProblemHistory.find({ userId }),
  ]);

  const lcData = {
    totalSolved: lc?.totalSolved ?? 0,
    hardSolved: lc?.hardSolved ?? 0,
    contestRating: (lc as { contestRating?: number })?.contestRating ?? 0,
  };
  const ghData = { repos: gh?.repositories ?? 0 };

  const readiness = calculateReadinessScore(lcData, ghData);
  const developerScore = calculateDeveloperScore(lcData, ghData);
  const companies = calculateCompanyFit(readiness);
  const { weakTopics, strongTopics } = getWeakAndStrong(problems);

  await UserAnalyticsSnapshot.findOneAndUpdate(
    { userId },
    {
      userId,
      totalSolved: lc?.totalSolved,
      contestRating: lcData.contestRating,
      weakTopics: weakTopics.map(([t]) => t),
      strongTopics: strongTopics.map(([t]) => t),
      readinessScore: readiness,
      developerScore,
      companyFit: companies,
      generatedAt: new Date(),
    },
    { upsert: true }
  );

  await User.findByIdAndUpdate(userId, { developerScore });
  await awardAchievements(userId, lc, gh);
}

async function awardAchievements(
  userId: string,
  lc: { totalSolved?: number | null; streak?: number | null; contestRating?: number | null } | null,
  gh: { repositories?: number | null } | null
): Promise<void> {
  const grants: string[] = [];

  if (lc?.totalSolved && lc.totalSolved >= 1) grants.push("first_solve");
  if (lc?.totalSolved && lc.totalSolved >= 10) grants.push("ten_problems");
  if (lc?.totalSolved && lc.totalSolved >= 100) grants.push("hundred_problems");
  if (lc?.totalSolved && lc.totalSolved >= 500) grants.push("five_hundred_problems");
  if (lc?.streak && lc.streak >= 30) grants.push("thirty_day_streak");
  if (lc?.contestRating && lc.contestRating > 0) grants.push("contest_debut");
  if (gh?.repositories && gh.repositories > 0) grants.push("github_connected");

  for (const badge of grants) {
    if (!BADGES.includes(badge as (typeof BADGES)[number])) continue;
    await Achievement.findOneAndUpdate(
      { userId, badge },
      { userId, badge, earnedAt: new Date() },
      { upsert: true }
    );
  }
}
