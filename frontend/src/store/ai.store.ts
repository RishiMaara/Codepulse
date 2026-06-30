import { create } from "zustand";
import api from "../services/api";
import { getErrorMessage } from "../lib/utils";

interface AIState {
  weakTopics: [string, number][];
  strongTopics: [string, number][];
  recommendations: string[];
  roadmap: Array<{ week: number; focus: string; problems: number; tip?: string }>;
  readiness: { score: number; companies?: Record<string, number>; developerScore?: number } | null;
  isLoading: boolean;
  error: string | null;
  fetchInsights: () => Promise<void>;
}

export const useAIStore = create<AIState>((set) => ({
  weakTopics: [],
  strongTopics: [],
  recommendations: [],
  roadmap: [],
  readiness: null,
  isLoading: false,
  error: null,

  fetchInsights: async () => {
    set({ isLoading: true, error: null });
    try {
      const [topicsRes, recRes, roadmapRes, readinessRes] = await Promise.all([
        api.get("/ai/weak-topics"),
        api.get("/ai/recommendations"),
        api.get("/ai/roadmap"),
        api.get("/ai/readiness"),
      ]);

      set({
        weakTopics: topicsRes.data.weakTopics ?? [],
        strongTopics: topicsRes.data.strongTopics ?? [],
        recommendations: recRes.data.questions ?? [],
        roadmap: roadmapRes.data.roadmap ?? [],
        readiness: {
          score: readinessRes.data.readiness ?? 0,
          companies: readinessRes.data.companies,
          developerScore: readinessRes.data.developerScore,
        },
        isLoading: false,
      });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },
}));
