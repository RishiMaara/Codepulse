import axios from "axios";
import { env } from "../../config/env";
import { logger } from "../../utils/logger";

const AI_URL = env.AI_SERVICE_URL;

/** Forward weak topics to FastAPI and get recommended problems */
export const getRecommendations = async (weakTopics: string[]): Promise<string[]> => {
  try {
    const { data } = await axios.post(`${AI_URL}/recommend`, { weak_topics: weakTopics });
    return data.questions ?? [];
  } catch (err: any) {
    logger.warn(`AI service /recommend unavailable, using fallback: ${err.message}`);
    return getFallbackRecommendations(weakTopics);
  }
};

/** Forward weak topics to FastAPI and get a weekly roadmap */
export const getRoadmap = async (
  weakTopics: string[]
): Promise<Array<{ week: number; focus: string; problems: number }>> => {
  try {
    const { data } = await axios.post(`${AI_URL}/roadmap`, { weak_topics: weakTopics });
    return data.roadmap ?? [];
  } catch (err: any) {
    logger.warn(`AI service /roadmap unavailable, using fallback: ${err.message}`);
    return weakTopics.map((topic, i) => ({ week: i + 1, focus: topic, problems: 10 }));
  }
};

/** Forward stats to FastAPI and get predicted rating */
export const predictRating = async (features: Record<string, number>): Promise<number> => {
  try {
    const { data } = await axios.post(`${AI_URL}/predict-rating`, features);
    return data.predicted_rating ?? 0;
  } catch {
    return 0;
  }
};

// ─── Fallback (when AI service is down) ──────────────────────────────────────
const FALLBACK_MAP: Record<string, string[]> = {
  DP:          ["Coin Change", "House Robber", "Climbing Stairs", "Unique Paths"],
  Graph:       ["Number of Islands", "Course Schedule", "Clone Graph", "Word Ladder"],
  Tree:        ["Diameter of Binary Tree", "Balanced Tree", "LCA of BST"],
  "Segment Tree": ["Range Sum Query", "Count of Range Sum"],
  Greedy:      ["Jump Game", "Gas Station", "Task Scheduler"],
  "Sliding Window": ["Longest Substring Without Repeating", "Minimum Window Substring"],
};

const getFallbackRecommendations = (weakTopics: string[]): string[] => {
  const result: string[] = [];
  for (const topic of weakTopics) {
    const problems = FALLBACK_MAP[topic] ?? [];
    result.push(...problems);
  }
  return result.slice(0, 5);
};
