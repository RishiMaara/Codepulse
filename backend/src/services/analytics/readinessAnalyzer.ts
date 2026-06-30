interface LCStats {
  totalSolved: number;
  hardSolved: number;
  contestRating: number;
}

interface GHStats {
  repos: number;
}

/**
 * Interview Readiness Score (0–100)
 *
 * Breakdown:
 *   30 pts — problems solved (capped at 180 problems)
 *   20 pts — hard problems solved (capped at 20)
 *   25 pts — contest rating (capped at 2500)
 *   25 pts — GitHub repos (capped at 25)
 */
export const calculateReadinessScore = (lc: LCStats, gh: GHStats): number => {
  let score = 0;
  score += Math.min(lc.totalSolved / 6, 30);
  score += Math.min(lc.hardSolved, 20);
  score += Math.min(lc.contestRating / 100, 25);
  score += Math.min(gh.repos, 25);
  return Math.round(score);
};

/**
 * Developer Score (0–100) — broader signal
 *
 * Weights:
 *   40% problems
 *   30% contest
 *   30% github
 */
export const calculateDeveloperScore = (lc: LCStats, gh: GHStats): number => {
  const problemScore  = Math.min((lc.totalSolved / 500) * 100, 100) * 0.4;
  const contestScore  = Math.min((lc.contestRating / 3000) * 100, 100) * 0.3;
  const githubScore   = Math.min((gh.repos / 30) * 100, 100) * 0.3;
  return Math.round(problemScore + contestScore + githubScore);
};
