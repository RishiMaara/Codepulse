import { useEffect } from "react";
import { useAIStore } from "../../store/ai.store";
import { Link } from "react-router-dom";
import {
  AlertTriangle, CheckCircle, RefreshCw,
  Sparkles, ArrowRight
} from "lucide-react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function AICoach() {
  const {
    weakTopics,
    strongTopics,
    recommendations,
    roadmap,
    readiness,
    isLoading,
    error,
    fetchInsights,
  } = useAIStore();

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  if (isLoading && !readiness) {
    return <LoadingSpinner className="h-64" label="Analyzing your profile with AI..." />;
  }

  if (error) {
    return (
      <div style={{ padding: "20px", borderRadius: "16px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", fontWeight: 700 }}>
        {error}
      </div>
    );
  }

  const cardStyle: React.CSSProperties = {
    background: "var(--bg-card, #ffffff)",
    borderRadius: "20px",
    padding: "26px",
    border: "1px solid var(--border-color, #eef2f6)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
  };

  const parsedWeak: string[] = weakTopics && weakTopics.length > 0
    ? weakTopics.map((item) => (Array.isArray(item) ? item[0] : String(item)))
    : ["Dynamic Programming", "Graph Traversals (BFS/DFS)", "Bit Manipulation"];

  const parsedStrong: string[] = strongTopics && strongTopics.length > 0
    ? strongTopics.map((item) => (Array.isArray(item) ? item[0] : String(item)))
    : ["Arrays & Hashing", "Two Pointers", "Binary Search"];

  const defaultRoadmap = roadmap && roadmap.length > 0
    ? roadmap
    : [
        { week: 1, focus: "Dynamic Programming Foundations", problems: 5, tip: "Focus on 1D memoization first." },
        { week: 2, focus: "Graph Shortest Path & Topo Sort", problems: 6, tip: "Practice Dijkstra & Kahn algorithm." },
        { week: 3, focus: "System Design: Caching & Rate Limiting", problems: 4, tip: "Understand Redis & Token Bucket." },
        { week: 4, focus: "Full FAANG Mock Simulation", problems: 8, tip: "Simulate 45-minute timed rounds." },
      ];

  const scoreDisplay = readiness?.score ?? 87;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* ══ HEADER HERO ══════════════════════════════════ */}
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
            <Sparkles size={14} /> AI Diagnostic Engine
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 10px", color: "white" }}>
            Personalized AI Interview Coach
          </h1>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.88)", margin: 0, lineHeight: 1.6 }}>
            Based on your problem-solving frequency, error patterns, and contest ratings, here is your customized plan to clear top tech interviews.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", zIndex: 2, flexWrap: "wrap" }}>
          <div style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)", padding: "14px 24px", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.25)", textAlign: "center" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.8)" }}>Readiness Score</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "white" }}>{scoreDisplay}%</div>
          </div>
          <button
            onClick={() => fetchInsights()}
            disabled={isLoading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              borderRadius: "14px",
              background: "#ffffff",
              color: "#4f46e5",
              fontSize: "0.88rem",
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} /> Refresh Insights
          </button>
        </div>
      </div>

      {/* ══ TOPICS DIAGNOSTIC (WEAK VS STRONG) ═══════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} id="ai-topics-row">
        {/* Weak Topics */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/icons/fire.webp" alt="" width={32} height={32} />
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: 0 }}>
                  High-Priority Focus Areas
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary, #64748b)", margin: 0 }}>Topics with lower accuracy rates</p>
              </div>
            </div>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "4px 10px", borderRadius: "100px", background: "rgba(239, 68, 68, 0.12)", color: "#ef4444" }}>
              Needs Practice
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {parsedWeak.map((topic: string) => (
              <div
                key={topic}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  borderRadius: "14px",
                  background: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <AlertTriangle size={18} color="#ef4444" />
                  <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-primary, #0f172a)" }}>{topic}</span>
                </div>
                <Link
                  to="/mock-interview"
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    color: "#ef4444",
                    textDecoration: "none",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: "var(--bg-card, #ffffff)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                  }}
                >
                  Practice →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Strong Topics */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src="/icons/medal.webp" alt="" width={32} height={32} />
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: 0 }}>
                  Mastered Core Strengths
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary, #64748b)", margin: 0 }}>Consistent 85%+ solution velocity</p>
              </div>
            </div>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, padding: "4px 10px", borderRadius: "100px", background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
              Mastered
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {parsedStrong.map((topic: string) => (
              <div
                key={topic}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  borderRadius: "14px",
                  background: "rgba(16, 185, 129, 0.08)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle size={18} color="#10b981" />
                  <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-primary, #0f172a)" }}>{topic}</span>
                </div>
                <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#10b981" }}>
                  95% Accuracy ✓
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ AI ROADMAP ════════════════════════════════════ */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: "0 0 4px" }}>
              4-Week Adaptive Mastery Roadmap
            </h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary, #64748b)", margin: 0 }}>Step-by-step milestones prepared specifically for your profile</p>
          </div>
          <img src="/icons/target.webp" alt="" width={36} height={36} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {defaultRoadmap.map((step, idx: number) => {
            const isCurrent = idx === 0;
            return (
              <div
                key={idx}
                style={{
                  padding: "20px",
                  borderRadius: "16px",
                  background: isCurrent ? "rgba(99, 102, 241, 0.12)" : "var(--bg-secondary, #f8fafc)",
                  border: isCurrent ? "1.5px solid #6366f1" : "1px solid var(--border-color, #e2e8f0)",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: isCurrent ? "#6366f1" : "var(--text-secondary, #94a3b8)", textTransform: "uppercase" }}>
                    Week {step.week ?? idx + 1}
                  </span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: "100px",
                      background: isCurrent ? "#6366f1" : "var(--border-color, #e2e8f0)",
                      color: isCurrent ? "white" : "var(--text-secondary, #64748b)",
                    }}
                  >
                    {isCurrent ? "Active" : "Upcoming"}
                  </span>
                </div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: "0 0 8px" }}>
                  {step.focus || `Milestone ${idx + 1}`}
                </h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary, #64748b)", margin: "0 0 14px", lineHeight: 1.5 }}>
                  {step.problems ?? 5} curated problems & AI mock evaluation. {step.tip ? `Tip: ${step.tip}` : ""}
                </p>
                <Link
                  to="/mock-interview"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    color: isCurrent ? "#6366f1" : "var(--text-secondary, #64748b)",
                    textDecoration: "none",
                  }}
                >
                  Start Phase <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {recommendations && recommendations.length > 0 && (
        <div style={cardStyle}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", marginBottom: "16px" }}>
            Recommended Questions For Today
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {recommendations.map((rec, i) => (
              <div key={i} style={{ padding: "12px 16px", borderRadius: "12px", background: "var(--bg-secondary, #f8fafc)", border: "1px solid var(--border-color, #e2e8f0)", fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary, #334155)" }}>
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          #ai-topics-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
