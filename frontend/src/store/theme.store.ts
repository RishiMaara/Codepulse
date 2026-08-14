import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const applyThemeToDOM = (theme: Theme) => {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
    root.style.setProperty("--bg-primary", "#0b0d17");
    root.style.setProperty("--bg-card", "#131728");
    root.style.setProperty("--bg-secondary", "#1c2136");
    root.style.setProperty("--bg-glass", "rgba(19, 23, 40, 0.85)");
    root.style.setProperty("--text-primary", "#f8fafc");
    root.style.setProperty("--text-secondary", "#94a3b8");
    root.style.setProperty("--border-color", "#222740");
    root.style.setProperty("--border-subtle", "rgba(255, 255, 255, 0.08)");
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
    root.style.setProperty("--bg-primary", "#f8f9ff");
    root.style.setProperty("--bg-card", "#ffffff");
    root.style.setProperty("--bg-secondary", "#f1f5f9");
    root.style.setProperty("--bg-glass", "rgba(255, 255, 255, 0.85)");
    root.style.setProperty("--text-primary", "#0f172a");
    root.style.setProperty("--text-secondary", "#64748b");
    root.style.setProperty("--border-color", "#eef2f6");
    root.style.setProperty("--border-subtle", "rgba(99, 102, 241, 0.08)");
  }
};

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem("codepulse_theme") as Theme | null;
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const initial = getInitialTheme();
applyThemeToDOM(initial);

export const useThemeStore = create<ThemeState>((set) => ({
  theme: initial,

  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("codepulse_theme", nextTheme);
      applyThemeToDOM(nextTheme);
      return { theme: nextTheme };
    });
  },

  setTheme: (theme: Theme) => {
    localStorage.setItem("codepulse_theme", theme);
    applyThemeToDOM(theme);
    set({ theme });
  },
}));
