import { create } from "zustand";
import api from "../services/api";
import { getErrorMessage } from "../lib/utils";
import { useToastStore } from "./toast.store";

interface DashboardState {
  data: Record<string, unknown> | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboard: () => Promise<void>;
  syncLeetcode: () => Promise<void>;
  syncGithub: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  data: null,
  isLoading: true,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/dashboard");
      set({ data: data.data, isLoading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },

  syncLeetcode: async () => {
    const toast = useToastStore.getState().add;
    set({ isLoading: true, error: null });
    try {
      await api.post("/user/leetcode/sync");
      const { data } = await api.get("/dashboard");
      set({ data: data.data, isLoading: false });
      toast("LeetCode synced successfully!", "success");
    } catch (err) {
      const msg = getErrorMessage(err, "LeetCode sync failed");
      set({ error: msg, isLoading: false });
      toast(msg, "error");
    }
  },

  syncGithub: async () => {
    const toast = useToastStore.getState().add;
    set({ isLoading: true, error: null });
    try {
      await api.post("/user/github/sync");
      const { data } = await api.get("/dashboard");
      set({ data: data.data, isLoading: false });
      toast("GitHub synced successfully!", "success");
    } catch (err) {
      const msg = getErrorMessage(err, "GitHub sync failed");
      set({ error: msg, isLoading: false });
      toast(msg, "error");
    }
  },
}));
