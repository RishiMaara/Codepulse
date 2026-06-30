import { create } from "zustand";
import api from "../services/api";
import { getErrorMessage } from "../lib/utils";

export interface InterviewQuestion {
  question: string;
  hint: string;
  difficulty: string;
  topic: string;
}

interface InterviewState {
  questions: InterviewQuestion[];
  currentIndex: number;
  showHint: boolean;
  completed: Set<number>;
  isLoading: boolean;
  error: string | null;
  fetchQuestions: () => Promise<void>;
  nextQuestion: () => void;
  prevQuestion: () => void;
  toggleHint: () => void;
  markComplete: (index: number) => void;
  reset: () => void;
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  questions: [],
  currentIndex: 0,
  showHint: false,
  completed: new Set(),
  isLoading: false,
  error: null,

  fetchQuestions: async () => {
    set({ isLoading: true, error: null, currentIndex: 0, showHint: false, completed: new Set() });
    try {
      const { data } = await api.get("/ai/interview");
      set({ questions: data.questions ?? [], isLoading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get();
    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1, showHint: false });
    }
  },

  prevQuestion: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1, showHint: false });
    }
  },

  toggleHint: () => set((s) => ({ showHint: !s.showHint })),

  markComplete: (index) => {
    set((s) => {
      const completed = new Set(s.completed);
      completed.add(index);
      return { completed };
    });
  },

  reset: () => set({ currentIndex: 0, showHint: false, completed: new Set() }),
}));
