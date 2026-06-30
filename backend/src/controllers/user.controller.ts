import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import User from "../models/User";
import { runLeetcodeSync } from "../services/leetcode/sync.service";
import { fetchGithubUser, fetchGithubRepos, aggregateLanguages, fetchGithubContributions } from "../services/github/github.service";
import GithubActivity from "../models/GithubActivity";
import LeetcodeStats from "../models/LeetcodeStats";
import Contest from "../models/Contest";
import { rebuildUserAnalytics } from "../services/analytics/snapshot.service";
import { logger } from "../utils/logger";

// ─── Trigger LeetCode Sync ────────────────────────────────────────────────────
export const syncLeetcode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id);
    const lcUser = user?.leetcodeUsername?.trim();
    if (!lcUser) {
      res.status(400).json({ success: false, message: "No LeetCode username set. Open Settings and add your LeetCode username first." });
      return;
    }
    await runLeetcodeSync(req.user!.id, lcUser);
    await rebuildUserAnalytics(req.user!.id);
    res.json({ success: true, message: "LeetCode sync complete" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "LeetCode sync failed";
    res.status(500).json({ success: false, message });
  }
};

// ─── Get LeetCode Stats ───────────────────────────────────────────────────────
export const getLeetcodeStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stats    = await LeetcodeStats.findOne({ userId: req.user!.id });
    const contests = await Contest.find({ userId: req.user!.id }).sort({ attendedAt: -1 });
    res.json({ success: true, stats, contests });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Sync GitHub ──────────────────────────────────────────────────────────────
export const syncGithub = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id);
    const ghUser = user?.githubUsername?.trim();
    if (!ghUser) {
      res.status(400).json({ success: false, message: "No GitHub username set. Open Settings and add your GitHub username first." });
      return;
    }
    const [profile, repos, commits] = await Promise.all([
      fetchGithubUser(ghUser),
      fetchGithubRepos(ghUser),
      fetchGithubContributions(ghUser),
    ]);
    const languages = aggregateLanguages(repos);
    const stars = repos.reduce((s: number, r: { stargazers_count?: number }) => s + (r.stargazers_count ?? 0), 0);

    await GithubActivity.findOneAndUpdate(
      { userId: req.user!.id },
      { userId: req.user!.id, repositories: profile.public_repos, commits, stars, languages },
      { upsert: true, new: true }
    );

    await rebuildUserAnalytics(req.user!.id);
    res.json({ success: true, message: "GitHub sync complete" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "GitHub sync failed";
    res.status(500).json({ success: false, message });
  }
};

// ─── Leaderboard ──────────────────────────────────────────────────────────────
export const getLeaderboard = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({ developerScore: { $gt: 0 } })
      .sort({ developerScore: -1 })
      .limit(100)
      .select("name email avatar developerScore leetcodeUsername githubUsername");
    res.json({ success: true, leaderboard: users });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Public Profile ───────────────────────────────────────────────────────────
export const getPublicProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.params;
    const user = await User.findOne({
      $or: [{ leetcodeUsername: username }, { githubUsername: username }],
    }).select("name avatar leetcodeUsername githubUsername developerScore role");

    if (!user) { res.status(404).json({ success: false, message: "Profile not found" }); return; }

    const [lc, gh] = await Promise.all([
      LeetcodeStats.findOne({ userId: user._id }),
      GithubActivity.findOne({ userId: user._id }),
    ]);

    res.json({ success: true, profile: { user, leetcode: lc, github: gh } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Update User Profile ──────────────────────────────────────────────────────
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { leetcodeUsername, githubUsername, name } = req.body;
    const userId = req.user!.id;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        name: name?.trim(),
        leetcodeUsername: leetcodeUsername?.trim() || undefined,
        githubUsername: githubUsername?.trim() || undefined,
      },
      { new: true, runValidators: true }
    );

    const lcUser = leetcodeUsername?.trim();
    const ghUser = githubUsername?.trim();

    if (lcUser) {
      try { await runLeetcodeSync(userId, lcUser); } catch (err) {
        logger.warn(`Auto LeetCode sync failed: ${err instanceof Error ? err.message : err}`);
      }
    }
    if (ghUser) {
      try {
        const [profile, repos, commits] = await Promise.all([
          fetchGithubUser(ghUser),
          fetchGithubRepos(ghUser),
          fetchGithubContributions(ghUser),
        ]);
        const languages = aggregateLanguages(repos);
        const stars = repos.reduce((s: number, r: { stargazers_count?: number }) => s + (r.stargazers_count ?? 0), 0);
        await GithubActivity.findOneAndUpdate(
          { userId },
          { userId, repositories: profile.public_repos, commits, stars, languages },
          { upsert: true }
        );
      } catch (err) {
        logger.warn(`Auto GitHub sync failed: ${err instanceof Error ? err.message : err}`);
      }
    }

    await rebuildUserAnalytics(userId);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
