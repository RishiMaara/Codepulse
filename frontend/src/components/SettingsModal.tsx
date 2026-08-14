import { useState, useEffect } from "react";
import { useAuthStore } from "../store/auth.store";
import { useToastStore } from "../store/toast.store";
import { X, Save, CheckCircle2, AlertCircle } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, updateProfile } = useAuthStore();
  const toast = useToastStore((s) => s.add);
  const [name, setName] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [github, setGithub] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setLeetcode(user.leetcodeUsername || "");
      setGithub(user.githubUsername || "");
    }
  }, [user, isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      await updateProfile({
        name,
        leetcodeUsername: leetcode,
        githubUsername: github,
      });
      setSuccess("Profile settings saved successfully!");
      toast("Profile saved — syncing your platforms", "success");
      setTimeout(() => {
        setSuccess("");
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: "14px",
    border: "1.5px solid var(--border-color, #e2e8f0)",
    background: "var(--bg-secondary, #f8fafc)",
    fontSize: "0.92rem",
    color: "var(--text-primary, #0f172a)",
    outline: "none",
    fontFamily: "var(--font-family)",
    boxSizing: "border-box",
    transition: "all 0.2s ease",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "var(--bg-card, #ffffff)",
          borderRadius: "24px",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.35)",
          border: "1px solid var(--border-color, #222740)",
          overflow: "hidden",
          animation: "modalFadeIn 0.25s ease-out",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 30px",
            borderBottom: "1px solid var(--border-color, #222740)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--bg-secondary, #fafbff)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <img
              src="/icons/key.webp"
              alt="Settings"
              width={40}
              height={40}
              style={{ filter: "drop-shadow(0 4px 10px rgba(99,102,241,0.3))" }}
            />
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-primary, #0f172a)", margin: "0 0 2px" }}>
                Account Settings
              </h2>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary, #64748b)", margin: 0 }}>
                Configure your profile & connected coding accounts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "var(--bg-card, #f1f5f9)",
              border: "1px solid var(--border-color, #e2e8f0)",
              borderRadius: "10px",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary, #64748b)",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "26px 30px" }}>
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 16px",
                borderRadius: "12px",
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#ef4444",
                fontSize: "0.85rem",
                fontWeight: 700,
                marginBottom: "20px",
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 16px",
                borderRadius: "12px",
                background: "rgba(16, 185, 129, 0.12)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "#10b981",
                fontSize: "0.85rem",
                fontWeight: 700,
                marginBottom: "20px",
              }}
            >
              <CheckCircle2 size={16} />
              <span>{success}</span>
            </div>
          )}

          {/* Theme Appearance Option */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              borderRadius: "16px",
              background: "var(--bg-secondary, #f8fafc)",
              border: "1px solid var(--border-color, #e2e8f0)",
              marginBottom: "20px",
            }}
          >
            <div>
              <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-primary, #0f172a)" }}>
                Theme Appearance
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary, #64748b)" }}>
                Toggle between light & dark interface
              </div>
            </div>
            <ThemeToggle showLabel={true} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.84rem", fontWeight: 800, color: "var(--text-primary, #334155)", marginBottom: "6px" }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Developer"
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#6366f1";
                  e.currentTarget.style.background = "var(--bg-card, white)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-color, #e2e8f0)";
                  e.currentTarget.style.background = "var(--bg-secondary, #f8fafc)";
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <img src="/icons/notebook.webp" alt="" width={16} height={16} />
                  <label style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--text-primary, #334155)" }}>
                    LeetCode Username
                  </label>
                </div>
                <input
                  type="text"
                  value={leetcode}
                  onChange={(e) => setLeetcode(e.target.value)}
                  placeholder="e.g. neetcode"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#6366f1";
                    e.currentTarget.style.background = "var(--bg-card, white)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-color, #e2e8f0)";
                    e.currentTarget.style.background = "var(--bg-secondary, #f8fafc)";
                  }}
                />
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  <img src="/icons/puzzle.webp" alt="" width={16} height={16} />
                  <label style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--text-primary, #334155)" }}>
                    GitHub Username
                  </label>
                </div>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="e.g. torvalds"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#6366f1";
                    e.currentTarget.style.background = "var(--bg-card, white)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-color, #e2e8f0)";
                    e.currentTarget.style.background = "var(--bg-secondary, #f8fafc)";
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "11px 20px",
                  borderRadius: "12px",
                  background: "var(--bg-secondary, #f1f5f9)",
                  border: "1px solid var(--border-color, #e2e8f0)",
                  color: "var(--text-secondary, #64748b)",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "11px 24px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white",
                  fontSize: "0.88rem",
                  fontWeight: 800,
                  border: "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
                }}
              >
                <Save size={16} />
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
