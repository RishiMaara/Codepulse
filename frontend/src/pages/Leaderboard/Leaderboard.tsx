import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLeaderboardStore } from "../../store/leaderboard.store";
import { useAuthStore } from "../../store/auth.store";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { Sparkles, ChevronRight, Flame } from "lucide-react";

export default function Leaderboard() {
  const { users, isLoading, error, fetchLeaderboard } = useLeaderboardStore();
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  if (isLoading) {
    return <LoadingSpinner className="h-64" label="Loading leaderboard standings..." />;
  }

  if (error) {
    return (
      <div style={{ padding: "20px", borderRadius: "16px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", fontWeight: 700 }}>
        {error}
      </div>
    );
  }

  const sampleUsers = users && users.length > 0
    ? users
    : [
        { _id: "1", name: "David Zhang", developerScore: 2450, leetcodeUsername: "davidz" },
        { _id: "2", name: "Sarah Jenkins", developerScore: 2280, leetcodeUsername: "sarahj" },
        { _id: "3", name: "Alex Kumar", developerScore: 2150, leetcodeUsername: "alexk" },
        { _id: "4", name: "Elena Rostova", developerScore: 1980, leetcodeUsername: "elena_r" },
        { _id: "5", name: "Marcus Thorne", developerScore: 1850, leetcodeUsername: "marcust" },
      ];

  const top3 = sampleUsers.slice(0, 3);

  const cardStyle: React.CSSProperties = {
    background: "var(--bg-card, #ffffff)",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid var(--border-color, #eef2f6)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* ══ HEADER ═══════════════════════════════════════ */}
      <div
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)",
          borderRadius: "24px",
          padding: "32px 36px",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "24px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 12px 36px rgba(99,102,241,0.22)",
        }}
      >
        <div style={{ maxWidth: "580px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "100px", fontSize: "0.78rem", fontWeight: 700, marginBottom: "12px" }}>
            <Sparkles size={14} /> Global Hall of Fame
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 10px", color: "white" }}>
            Developer Leaderboard
          </h1>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.88)", margin: 0, lineHeight: 1.6 }}>
            Top engineers ranked by algorithmic velocity, daily consistency, and verified mock interview scores.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", zIndex: 2 }}>
          <img src="/icons/medal.webp" alt="" width={64} height={64} style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.2))" }} />
        </div>
      </div>

      {/* ══ PODIUM TOP 3 ═════════════════════════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", alignItems: "end" }} id="podium-grid">
        {/* Silver #2 */}
        {top3[1] && (
          <div
            style={{
              ...cardStyle,
              background: "linear-gradient(180deg, rgba(148,163,184,0.1) 0%, var(--bg-card) 100%)",
              border: "1.5px solid rgba(148,163,184,0.3)",
              textAlign: "center",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: "-18px", left: "50%", transform: "translateX(-50%)" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#94a3b8", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1rem", boxShadow: "0 4px 10px rgba(0,0,0,0.25)" }}>
                2
              </div>
            </div>
            <div style={{ marginTop: "16px", marginBottom: "12px", display: "flex", justifyContent: "center" }}>
              <img src="/icons/star.webp" alt="" width={52} height={52} />
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: "0 0 4px" }}>{top3[1].name}</h3>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary, #64748b)", marginBottom: "12px" }}>@{top3[1].leetcodeUsername || "dev"}</div>
            <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#6366f1" }}>{top3[1].developerScore} pts</div>
          </div>
        )}

        {/* Gold #1 */}
        {top3[0] && (
          <div
            style={{
              ...cardStyle,
              background: "linear-gradient(180deg, rgba(245,158,11,0.15) 0%, var(--bg-card) 100%)",
              border: "2px solid #f59e0b",
              textAlign: "center",
              position: "relative",
              transform: "scale(1.04)",
              boxShadow: "0 12px 32px rgba(245,158,11,0.2)",
            }}
          >
            <div style={{ position: "absolute", top: "-22px", left: "50%", transform: "translateX(-50%)" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1.2rem", boxShadow: "0 6px 14px rgba(245,158,11,0.4)" }}>
                👑 1
              </div>
            </div>
            <div style={{ marginTop: "20px", marginBottom: "12px", display: "flex", justifyContent: "center" }}>
              <img src="/icons/medal.webp" alt="" width={68} height={68} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--text-primary, #0f172a)", margin: "0 0 4px" }}>{top3[0].name}</h3>
            <div style={{ fontSize: "0.82rem", color: "var(--text-secondary, #64748b)", marginBottom: "14px" }}>@{top3[0].leetcodeUsername || "dev"}</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#f59e0b" }}>{top3[0].developerScore} pts</div>
          </div>
        )}

        {/* Bronze #3 */}
        {top3[2] && (
          <div
            style={{
              ...cardStyle,
              background: "linear-gradient(180deg, rgba(217,119,6,0.1) 0%, var(--bg-card) 100%)",
              border: "1.5px solid rgba(217,119,6,0.3)",
              textAlign: "center",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: "-18px", left: "50%", transform: "translateX(-50%)" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#b45309", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1rem", boxShadow: "0 4px 10px rgba(0,0,0,0.25)" }}>
                3
              </div>
            </div>
            <div style={{ marginTop: "16px", marginBottom: "12px", display: "flex", justifyContent: "center" }}>
              <img src="/icons/star.webp" alt="" width={52} height={52} />
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: "0 0 4px" }}>{top3[2].name}</h3>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary, #64748b)", marginBottom: "12px" }}>@{top3[2].leetcodeUsername || "dev"}</div>
            <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#6366f1" }}>{top3[2].developerScore} pts</div>
          </div>
        )}
      </div>

      {/* ══ RANKINGS LIST ════════════════════════════════ */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: "0 0 16px" }}>
          Full Leaderboard Standings
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {sampleUsers.map((u, i) => (
            <div
              key={u._id || i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px",
                borderRadius: "14px",
                background: u._id === currentUser?.id ? "rgba(99,102,241,0.15)" : "var(--bg-secondary, #f8fafc)",
                border: u._id === currentUser?.id ? "1.5px solid #6366f1" : "1px solid var(--border-color, #eef2f6)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "0.95rem", fontWeight: 800, color: i < 3 ? "#f59e0b" : "var(--text-secondary, #94a3b8)", width: "24px" }}>
                  #{i + 1}
                </span>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem" }}>
                  {u.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-primary, #0f172a)" }}>{u.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary, #64748b)" }}>@{u.leetcodeUsername || "dev"}</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", fontWeight: 700, color: "#f59e0b" }}>
                  <Flame size={16} /> 14d
                </div>
                <div style={{ fontSize: "1rem", fontWeight: 900, color: "#6366f1" }}>
                  {u.developerScore} <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary, #94a3b8)" }}>pts</span>
                </div>
                <Link
                  to={`/u/${u.leetcodeUsername || "profile"}`}
                  style={{
                    color: "var(--text-secondary, #64748b)",
                    textDecoration: "none",
                    padding: "6px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #podium-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
