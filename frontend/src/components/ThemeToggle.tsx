import { useThemeStore } from "../store/theme.store";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export default function ThemeToggle({ showLabel = false, className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: showLabel ? "8px 16px" : "8px",
        borderRadius: "12px",
        background: "var(--bg-secondary, #f1f5f9)",
        border: "1.5px solid var(--border-color, #e2e8f0)",
        color: "var(--text-primary, #0f172a)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: "inherit",
        fontSize: "0.85rem",
        fontWeight: 700,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.borderColor = "#6366f1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.borderColor = "var(--border-color, #e2e8f0)";
      }}
    >
      <div
        style={{
          width: "22px",
          height: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isDark ? "#facc15" : "#6366f1",
          transition: "transform 0.3s ease",
        }}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </div>
      {showLabel && <span>{isDark ? "Light Mode" : "Dark Mode"}</span>}
    </button>
  );
}
