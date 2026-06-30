import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import ProblemHistory from "../models/ProblemHistory";
import LeetcodeStats from "../models/LeetcodeStats";
import GithubActivity from "../models/GithubActivity";
import UserAnalyticsSnapshot from "../models/UserAnalyticsSnapshot";
import { getWeakAndStrong } from "../services/analytics/topicAnalyzer";
import { calculateReadinessScore, calculateDeveloperScore } from "../services/analytics/readinessAnalyzer";
import { calculateCompanyFit } from "../services/analytics/companyFit";
import { getRecommendations, getRoadmap } from "../services/ai/aiGateway";

const INTERVIEW_BANK: Record<string, Array<{ question: string; hint: string; difficulty: string }>> = {
  "Array": [
    { question: "Find two numbers in an array that sum to a target.", hint: "Use a hash map to store complements.", difficulty: "Easy" },
    { question: "Find the maximum subarray sum (Kadane's algorithm).", hint: "Track running sum and reset when negative.", difficulty: "Medium" },
  ],
  "Dynamic Programming": [
    { question: "Explain the difference between memoization and tabulation.", hint: "Top-down vs bottom-up approaches.", difficulty: "Medium" },
    { question: "Solve the coin change problem with minimum coins.", hint: "DP[i] = min coins for amount i.", difficulty: "Medium" },
  ],
  "DP": [
    { question: "What is optimal substructure in DP?", hint: "Optimal solution contains optimal sub-solutions.", difficulty: "Easy" },
    { question: "Solve longest increasing subsequence.", hint: "O(n log n) with patience sorting.", difficulty: "Hard" },
  ],
  "Tree": [
    { question: "Validate if a binary tree is a BST.", hint: "Pass min/max bounds during traversal.", difficulty: "Medium" },
    { question: "Find lowest common ancestor in a binary tree.", hint: "Recurse; if both sides return non-null, current is LCA.", difficulty: "Medium" },
  ],
  "Graph": [
    { question: "Detect cycle in a directed graph.", hint: "DFS with recursion stack or Kahn's algorithm.", difficulty: "Medium" },
    { question: "Find shortest path in an unweighted graph.", hint: "BFS from source.", difficulty: "Easy" },
  ],
  "Hash Table": [
    { question: "Design a data structure with O(1) get and put.", hint: "Array + linked list buckets.", difficulty: "Medium" },
  ],
  "String": [
    { question: "Check if two strings are anagrams.", hint: "Sort or use character frequency map.", difficulty: "Easy" },
  ],
  "Binary Search": [
    { question: "Find first bad version using binary search.", hint: "Standard binary search with boundary tracking.", difficulty: "Easy" },
  ],
  "Greedy": [
    { question: "Activity selection problem — maximize non-overlapping intervals.", hint: "Sort by end time, greedily pick.", difficulty: "Medium" },
  ],
  "Sliding Window": [
    { question: "Longest substring without repeating characters.", hint: "Expand right, shrink left with a set/map.", difficulty: "Medium" },
  ],
};

const DEFAULT_QUESTIONS = [
  { question: "Tell me about a challenging bug you fixed recently.", hint: "Use STAR format: Situation, Task, Action, Result.", difficulty: "Behavioral" },
  { question: "Explain time and space complexity of your favorite algorithm.", hint: "Big-O notation with concrete examples.", difficulty: "Easy" },
  { question: "How would you design a URL shortener?", hint: "Hashing, database, caching, rate limiting.", difficulty: "Hard" },
  { question: "Reverse a linked list iteratively and recursively.", hint: "Three pointers: prev, curr, next.", difficulty: "Medium" },
  { question: "Implement a LRU cache.", hint: "HashMap + doubly linked list.", difficulty: "Hard" },
];

// ─── Weak Topics ──────────────────────────────────────────────────────────────
export const getWeakTopics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const problems = await ProblemHistory.find({ userId: req.user!.id });
    const { weakTopics, strongTopics } = getWeakAndStrong(problems);
    res.json({ success: true, weakTopics, strongTopics });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Recommendations ──────────────────────────────────────────────────────────
export const getRecommendationsForUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const problems = await ProblemHistory.find({ userId: req.user!.id });
    const { weakTopics } = getWeakAndStrong(problems);
    const topicNames = weakTopics.map(([t]) => t);
    const questions = await getRecommendations(topicNames);
    res.json({ success: true, questions });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Roadmap ──────────────────────────────────────────────────────────────────
export const getRoadmapForUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const problems = await ProblemHistory.find({ userId: req.user!.id });
    const { weakTopics } = getWeakAndStrong(problems);
    const topicNames = weakTopics.map(([t]) => t);
    const roadmap = await getRoadmap(topicNames);
    res.json({ success: true, roadmap });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Interview Readiness ──────────────────────────────────────────────────────
export const getReadiness = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const [lc, gh] = await Promise.all([
      LeetcodeStats.findOne({ userId }),
      GithubActivity.findOne({ userId }),
    ]);

    const lcData = { totalSolved: lc?.totalSolved ?? 0, hardSolved: lc?.hardSolved ?? 0, contestRating: (lc as any)?.contestRating ?? 0 };
    const ghData = { repos: gh?.repositories ?? 0 };

    const readiness      = calculateReadinessScore(lcData, ghData);
    const developerScore = calculateDeveloperScore(lcData, ghData);
    const companies      = calculateCompanyFit(readiness);

    // Cache snapshot
    await UserAnalyticsSnapshot.findOneAndUpdate(
      { userId },
      { userId, readinessScore: readiness, developerScore, companyFit: companies, generatedAt: new Date() },
      { upsert: true }
    );

    res.json({ success: true, readiness, developerScore, companies });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Mock Interview Questions ─────────────────────────────────────────────────
export const getInterviewQuestions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const problems = await ProblemHistory.find({ userId: req.user!.id });
    const { weakTopics } = getWeakAndStrong(problems);
    const topics = weakTopics.length ? weakTopics.map(([t]) => t) : ["Array", "Tree", "Graph"];

    const questions: Array<{ question: string; hint: string; difficulty: string; topic: string }> = [];
    for (const topic of topics.slice(0, 3)) {
      const bank = INTERVIEW_BANK[topic] ?? DEFAULT_QUESTIONS;
      for (const q of bank.slice(0, 2)) {
        questions.push({ ...q, topic });
      }
    }

    while (questions.length < 5) {
      const q = DEFAULT_QUESTIONS[questions.length % DEFAULT_QUESTIONS.length];
      questions.push({ ...q, topic: "General" });
    }

    res.json({ success: true, questions: questions.slice(0, 8) });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
