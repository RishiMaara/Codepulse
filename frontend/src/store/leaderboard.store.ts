import { create } from "zustand";
import api from "../services/api";
import { getErrorMessage } from "../lib/utils";

export interface LeaderboardUser {
  _id: string;
  name: string;
  developerScore: number;
  leetcodeUsername?: string;
  githubUsername?: string;
}

interface LeaderboardState {
  users: LeaderboardUser[];
  isLoading: boolean;
  error: string | null;
  fetchLeaderboard: () => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchLeaderboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/user/leaderboard");
      set({ users: data.leaderboard ?? [], isLoading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },
}));
