import { useParams, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { useToastStore } from "../../store/toast.store";
import {
  Share2, ArrowLeft, Target, Flame
} from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const { user: authUser } = useAuthStore();
  const toast = useToastStore((s) => s.add);

  const isOwnProfile = !username || username === authUser?.leetcodeUsername || username === authUser?.githubUsername;
  const user = isOwnProfile ? authUser : {
    name: "Alex Dev",
    developerScore: 2450,
    readinessScore: 92,
    streak: 24,
    rank: 8,
    leetcode: {
      totalSolved: 265,
      easySolved: 85,
      mediumSolved: 142,
      hardSolved: 38,
      acceptanceRate: "68.4%",
      ranking: "18,450",
    },
    github: {
      contributions: 548,
      totalRepos: 32,
      totalStars: 124,
    },
  };

  const leetcode = user?.leetcode as any;
  const github = user?.github as any;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Profile link copied to clipboard!", "success");
  };

  const cardStyle: React.CSSProperties = {
    background: "var(--bg-card, #ffffff)",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid var(--border-color, #eef2f6)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary, #f8f9ff)", padding: "40px 24px", fontFamily: "var(--font-family)", color: "var(--text-primary, #0f172a)", transition: "background-color 0.25s ease" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
        
        {/* Top Navbar Back Link & Share */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link
            to="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.88rem",
              fontWeight: 700,
              color: "var(--text-secondary, #64748b)",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: "12px",
              background: "var(--bg-card, #ffffff)",
              border: "1px solid var(--border-color, #e2e8f0)",
              transition: "all 0.15s ease",
            }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ThemeToggle />
            <button
              onClick={handleShare}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "9px 18px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "white",
                fontSize: "0.85rem",
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
              }}
            >
              <Share2 size={16} /> Share Profile
            </button>
          </div>
        </div>

        {/* ══ HERO PROFILE SHOWCASE ══════════════════════ */}
        <div
          style={{
            background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)",
            borderRadius: "28px",
            padding: "40px 48px",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "28px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 16px 40px rgba(99,102,241,0.25)",
          }}
        >
          {/* Background decorative circles */}
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "240px", height: "240px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-60px", left: "30%", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "24px", position: "relative", zIndex: 2 }}>
            <div
              style={{
                width: "104px",
                height: "104px",
                borderRadius: "28px",
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                padding: "6px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 12px 32px rgba(0,0,0,0.22)",
                flexShrink: 0,
              }}
            >
              <img
                src="/icons/profile.png"
                alt="Developer Avatar"
                width={92}
                height={92}
                style={{ borderRadius: "22px", objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: 0, letterSpacing: "-0.03em", color: "white" }}>
                  {user?.name || "Developer"}
                </h1>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, padding: "3px 10px", borderRadius: "100px", background: "#f59e0b", color: "white" }}>
                  Rank #{user?.rank ?? 8}
                </span>
              </div>
              <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.88)", margin: "0 0 14px" }}>
                @{username || authUser?.leetcodeUsername || "developer"} • Full-Stack / Distributed Systems Engineer
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", fontWeight: 700, padding: "4px 12px", borderRadius: "100px", background: "rgba(255,255,255,0.2)" }}>
                  <Flame size={14} color="#fcd34d" /> {user?.streak ?? 24} Day Streak
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", fontWeight: 700, padding: "4px 12px", borderRadius: "100px", background: "rgba(255,255,255,0.2)" }}>
                  <Target size={14} color="#6ee7b7" /> {user?.readinessScore ?? 92}% Interview Ready
                </span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right", position: "relative", zIndex: 2 }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>
              Developer Score
            </div>
            <div style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, color: "white" }}>
              {user?.developerScore ?? 2450}
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)", marginTop: "6px" }}>
              Top 2% Globally
            </div>
          </div>
        </div>

        {/* ══ 4 STATS OVERVIEW ═══════════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
          {[
            { label: "LeetCode Solved", value: leetcode?.totalSolved || 265, icon: "/icons/notebook.webp", sub: `Rank #${leetcode?.ranking || "18,450"}` },
            { label: "Acceptance Rate", value: leetcode?.acceptanceRate || "68.4%", icon: "/icons/tick.webp", sub: "Algorithm Accuracy" },
            { label: "GitHub Contributions", value: github?.contributions || 548, icon: "/icons/puzzle.webp", sub: "Last 12 Months" },
            { label: "Milestones Unlocked", value: "8 Badges", icon: "/icons/medal.webp", sub: "All-Time Achievements" },
          ].map((s) => (
            <div key={s.label} style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary, #64748b)" }}>{s.label}</span>
                <img src={s.icon} alt="" width={32} height={32} />
              </div>
              <div style={{ fontSize: "1.7rem", fontWeight: 900, color: "var(--text-primary, #0f172a)", marginBottom: "4px" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary, #94a3b8)", fontWeight: 600 }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* ══ LEETCODE & GITHUB SPLIT ════════════════════ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} id="profile-details-grid">
          {/* LeetCode Details */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src="/icons/chart.webp" alt="" width={34} height={34} />
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: 0 }}>
                    Problem Distribution
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary, #64748b)", margin: 0 }}>Breakdown by difficulty tier</p>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", textAlign: "center", marginBottom: "20px" }}>
              <div style={{ background: "rgba(16, 185, 129, 0.12)", padding: "18px 12px", borderRadius: "16px", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
                <div style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 800 }}>Easy</div>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#10b981" }}>{leetcode?.easySolved || 85}</div>
              </div>
              <div style={{ background: "rgba(245, 158, 11, 0.12)", padding: "18px 12px", borderRadius: "16px", border: "1px solid rgba(245, 158, 11, 0.25)" }}>
                <div style={{ fontSize: "0.75rem", color: "#f59e0b", fontWeight: 800 }}>Medium</div>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#f59e0b" }}>{leetcode?.mediumSolved || 142}</div>
              </div>
              <div style={{ background: "rgba(239, 68, 68, 0.12)", padding: "18px 12px", borderRadius: "16px", border: "1px solid rgba(239, 68, 68, 0.25)" }}>
                <div style={{ fontSize: "0.75rem", color: "#ef4444", fontWeight: 800 }}>Hard</div>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#ef4444" }}>{leetcode?.hardSolved || 38}</div>
              </div>
            </div>

            {/* Target FAANG fit list */}
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary, #475569)", marginBottom: "10px" }}>
                Company Match Ratings
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { name: "Google", fit: "94% Match", color: "#4285f4" },
                  { name: "Meta", fit: "91% Match", color: "#0668e1" },
                  { name: "Amazon", fit: "88% Match", color: "#ff9900" },
                ].map((c) => (
                  <div
                    key={c.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      background: "var(--bg-secondary, #f8fafc)",
                      border: "1px solid var(--border-color, #eef2f6)",
                    }}
                  >
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary, #0f172a)" }}>{c.name}</span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#10b981" }}>{c.fit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GitHub Activity & Badges */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src="/icons/star.webp" alt="" width={34} height={34} />
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: 0 }}>
                    Verified Achievements
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary, #64748b)", margin: 0 }}>Earned on CodePulse platform</p>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
              {[
                { name: "Algorithm Master", icon: "/icons/medal.webp", desc: "Top 5% solver" },
                { name: "30-Day Streak", icon: "/icons/fire.webp", desc: "Unstoppable habit" },
                { name: "Fast Learner", icon: "/icons/brain.webp", desc: "100+ DP solved" },
                { name: "System Builder", icon: "/icons/puzzle.webp", desc: "30+ active repos" },
              ].map((b) => (
                <div
                  key={b.name}
                  style={{
                    padding: "14px",
                    borderRadius: "16px",
                    background: "var(--bg-secondary, #fafbff)",
                    border: "1px solid var(--border-color, #eef2f6)",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <img src={b.icon} alt="" width={36} height={36} />
                  <div>
                    <div style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--text-primary, #0f172a)" }}>{b.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-secondary, #64748b)" }}>{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* GitHub stats bar */}
            <div style={{ padding: "16px", borderRadius: "16px", background: "var(--bg-secondary, #f8fafc)", border: "1px solid var(--border-color, #e2e8f0)" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary, #475569)", marginBottom: "8px" }}>
                GitHub Activity Summary
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center" }}>
                <div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-primary, #0f172a)" }}>{github?.totalRepos || 32}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary, #64748b)" }}>Repositories</div>
                </div>
                <div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-primary, #0f172a)" }}>{github?.totalStars || 124}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary, #64748b)" }}>Stars</div>
                </div>
                <div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#6366f1" }}>{github?.contributions || 548}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary, #64748b)" }}>Contributions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          #profile-details-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
