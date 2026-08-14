import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDashboardStore } from "../../store/dashboard.store";
import { useAuthStore } from "../../store/auth.store";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { RefreshCw, Mic, ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const BADGE_LABELS: Record<string, string> = {
  first_solve: "First Solve",
  ten_problems: "10 Problems",
  hundred_problems: "100 Problems",
  five_hundred_problems: "500 Problems",
  thirty_day_streak: "30-Day Streak",
  top_10_percent: "Top 10%",
  contest_debut: "Contest Debut",
  github_connected: "GitHub Connected",
};

export default function Dashboard() {
  const { data, isLoading, error, fetchDashboard, syncLeetcode, syncGithub } = useDashboardStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (isLoading && !data) {
    return <LoadingSpinner className="h-64" label="Loading your dashboard..." />;
  }

  if (error && !data) {
    return (
      <div style={{ padding: "20px", borderRadius: "16px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", fontWeight: 700 }}>
        {error}
      </div>
    );
  }

  const leetcode = data?.leetcode as Record<string, any> | undefined;
  const github = data?.github as Record<string, any> | undefined;
  const totalSolved = (leetcode?.easySolved || 0) + (leetcode?.mediumSolved || 0) + (leetcode?.hardSolved || 0);

  const doughnutData = {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [
      {
        data: [leetcode?.easySolved || 15, leetcode?.mediumSolved || 25, leetcode?.hardSolved || 5],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { boxWidth: 12, padding: 16, font: { family: "Plus Jakarta Sans", size: 12, weight: 600 as any } },
      },
    },
    cutout: "75%",
    maintainAspectRatio: false,
  };

  const cardStyle: React.CSSProperties = {
    background: "var(--bg-card, #ffffff)",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid var(--border-color, #eef2f6)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* ══ TOP WELCOME BANNER ═══════════════════════════ */}
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
        <div style={{ position: "relative", zIndex: 2, maxWidth: "600px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "100px", fontSize: "0.78rem", fontWeight: 700, marginBottom: "12px" }}>
            <Sparkles size={14} /> AI Readiness Hub
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 10px", lineHeight: 1.2, color: "white" }}>
            Welcome back, {user?.name || "Developer"}! 👋
          </h1>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.88)", margin: 0, lineHeight: 1.6 }}>
            Your interview readiness score is <strong style={{ color: "white" }}>{user?.readinessScore ?? 87}%</strong>. You're on track for Tier-1 Tech interviews. Keep the momentum going!
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", zIndex: 2, flexWrap: "wrap" }}>
          <button
            onClick={() => syncLeetcode()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "12px",
              background: "#ffffff",
              color: "#4f46e5",
              fontSize: "0.85rem",
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              transition: "all 0.2s ease",
            }}
          >
            <RefreshCw size={15} /> Sync LeetCode
          </button>
          <button
            onClick={() => syncGithub()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(8px)",
              color: "#ffffff",
              fontSize: "0.85rem",
              fontWeight: 700,
              border: "1px solid rgba(255,255,255,0.3)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <RefreshCw size={15} /> Sync GitHub
          </button>
          <Link
            to="/mock-interview"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.22)",
              backdropFilter: "blur(8px)",
              color: "#ffffff",
              fontSize: "0.85rem",
              fontWeight: 800,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.35)",
              transition: "all 0.2s ease",
            }}
          >
            <Mic size={16} /> Start Mock Prep <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* ══ STAT METRICS GRID (4 CARDS) ═════════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
        {[
          {
            title: "Total Problems Solved",
            value: totalSolved || 45,
            sub: `${leetcode?.easySolved || 15} Easy • ${leetcode?.mediumSolved || 25} Med • ${leetcode?.hardSolved || 5} Hard`,
            icon: "/icons/notebook.webp",
            badge: "+4 this week",
            color: "#6366f1",
          },
          {
            title: "Readiness Score",
            value: `${user?.readinessScore ?? 87}%`,
            sub: "Top 12% among all peers",
            icon: "/icons/target.webp",
            badge: "Target FAANG",
            color: "#10b981",
          },
          {
            title: "Daily Practice Streak",
            value: `${user?.streak ?? 14} Days`,
            sub: "Personal Best: 28 days",
            icon: "/icons/fire.webp",
            badge: "On Fire 🔥",
            color: "#f59e0b",
          },
          {
            title: "GitHub Contributions",
            value: `${github?.contributions ?? 312}`,
            sub: `${github?.totalRepos ?? 18} Repos • ${github?.totalStars ?? 45} Stars`,
            icon: "/icons/puzzle.webp",
            badge: "Active",
            color: "#8b5cf6",
          },
        ].map((stat) => (
          <div key={stat.title} style={cardStyle}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "14px" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary, #64748b)" }}>{stat.title}</span>
              <img src={stat.icon} alt="" width={38} height={38} style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))" }} />
            </div>
            <div style={{ fontSize: "1.85rem", fontWeight: 900, color: "var(--text-primary, #0f172a)", letterSpacing: "-0.03em", marginBottom: "6px" }}>
              {stat.value}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-secondary, #94a3b8)", fontWeight: 600 }}>{stat.sub}</span>
              <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "2px 8px", borderRadius: "100px", background: `${stat.color}20`, color: stat.color }}>
                {stat.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ══ CHARTS & PROFILE ANALYTICS ROW ════════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} id="dashboard-charts-row">
        {/* LeetCode Topic Breakdown */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: "0 0 4px" }}>
                Problem Difficulty Breakdown
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary, #64748b)", margin: 0 }}>Solved distribution across tiers</p>
            </div>
            <img src="/icons/chart.webp" alt="" width={32} height={32} />
          </div>

          <div style={{ height: "220px", position: "relative" }}>
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "16px", textAlign: "center" }}>
            <div style={{ background: "rgba(16, 185, 129, 0.12)", padding: "12px", borderRadius: "14px", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
              <div style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 800 }}>Easy</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#10b981" }}>{leetcode?.easySolved || 15}</div>
            </div>
            <div style={{ background: "rgba(245, 158, 11, 0.12)", padding: "12px", borderRadius: "14px", border: "1px solid rgba(245, 158, 11, 0.25)" }}>
              <div style={{ fontSize: "0.75rem", color: "#f59e0b", fontWeight: 800 }}>Medium</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#f59e0b" }}>{leetcode?.mediumSolved || 25}</div>
            </div>
            <div style={{ background: "rgba(239, 68, 68, 0.12)", padding: "12px", borderRadius: "14px", border: "1px solid rgba(239, 68, 68, 0.25)" }}>
              <div style={{ fontSize: "0.75rem", color: "#ef4444", fontWeight: 800 }}>Hard</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#ef4444" }}>{leetcode?.hardSolved || 5}</div>
            </div>
          </div>
        </div>

        {/* AI Weak Area & Recommendation Focus */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: "0 0 4px" }}>
                AI Weak-Topic Diagnostic
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary, #64748b)", margin: 0 }}>Identified topics requiring practice</p>
            </div>
            <img src="/icons/megaphone.webp" alt="" width={32} height={32} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { topic: "Dynamic Programming", level: "Low Proficiency (32%)", color: "#ef4444", bg: "rgba(239, 68, 68, 0.12)", border: "rgba(239, 68, 68, 0.25)" },
              { topic: "Graph Algorithms (BFS/DFS)", level: "Moderate (58%)", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)", border: "rgba(245, 158, 11, 0.25)" },
              { topic: "Binary Search & Pointers", level: "Strong (88%)", color: "#10b981", bg: "rgba(16, 185, 129, 0.12)", border: "rgba(16, 185, 129, 0.25)" },
            ].map((topic) => (
              <div
                key={topic.topic}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  background: topic.bg,
                  border: `1px solid ${topic.border}`,
                }}
              >
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-primary, #0f172a)" }}>{topic.topic}</div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: topic.color }}>{topic.level}</div>
                </div>
                <Link
                  to="/ai-coach"
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    color: topic.color,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  Practice <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "20px", padding: "14px", borderRadius: "14px", background: "var(--bg-secondary, #f8fafc)", border: "1px dashed var(--border-color, #cbd5e1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/icons/star.webp" alt="" width={24} height={24} />
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary, #475569)" }}>
                AI Recommendation: Solve 2 DP problems today
              </span>
            </div>
            <Link to="/mock-interview" style={{ fontSize: "0.82rem", fontWeight: 800, color: "#6366f1", textDecoration: "none" }}>
              Start Now →
            </Link>
          </div>
        </div>
      </div>

      {/* ══ EARNED BADGES ════════════════════════════════ */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: "0 0 4px" }}>
              Earned Badges & Milestones
            </h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary, #64748b)", margin: 0 }}>Achievements unlocked on CodePulse</p>
          </div>
          <img src="/icons/gift-box.webp" alt="" width={32} height={32} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "14px" }}>
          {["first_solve", "ten_problems", "hundred_problems", "thirty_day_streak", "top_10_percent"].map((b, i) => (
            <div
              key={b}
              style={{
                textAlign: "center",
                padding: "16px 12px",
                borderRadius: "16px",
                background: "var(--bg-secondary, #fafbff)",
                border: "1px solid var(--border-color, #eef2f6)",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                <img src={i % 2 === 0 ? "/icons/medal.webp" : "/icons/star.webp"} alt="" width={36} height={36} />
              </div>
              <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-primary, #0f172a)" }}>
                {BADGE_LABELS[b] || b}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#10b981", fontWeight: 700, marginTop: "2px" }}>
                Unlocked ✓
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          #dashboard-charts-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
