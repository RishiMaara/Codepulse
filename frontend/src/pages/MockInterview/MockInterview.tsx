import { useEffect } from "react";
import { useInterviewStore } from "../../store/interview.store";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import {
  ChevronLeft, ChevronRight, Lightbulb, CheckCircle2, RotateCcw
} from "lucide-react";

const difficultyBadges: Record<string, { bg: string; text: string; border: string }> = {
  Easy: { bg: "rgba(16, 185, 129, 0.12)", text: "#10b981", border: "rgba(16, 185, 129, 0.3)" },
  Medium: { bg: "rgba(245, 158, 11, 0.12)", text: "#f59e0b", border: "rgba(245, 158, 11, 0.3)" },
  Hard: { bg: "rgba(239, 68, 68, 0.12)", text: "#ef4444", border: "rgba(239, 68, 68, 0.3)" },
  Behavioral: { bg: "rgba(124, 58, 237, 0.12)", text: "#7c3aed", border: "rgba(124, 58, 237, 0.3)" },
};

export default function MockInterview() {
  const {
    questions,
    currentIndex,
    showHint,
    completed,
    isLoading,
    error,
    fetchQuestions,
    nextQuestion,
    prevQuestion,
    toggleHint,
    markComplete,
    reset,
  } = useInterviewStore();

  useEffect(() => {
    if (!questions.length) fetchQuestions();
  }, []);

  if (isLoading) {
    return <LoadingSpinner className="h-64" label="Generating customized interview questions..." />;
  }

  if (error) {
    return (
      <div style={{ padding: "20px", borderRadius: "16px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", fontWeight: 700 }}>
        {error}
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div style={{ background: "var(--bg-card, #ffffff)", padding: "48px 32px", borderRadius: "24px", textAlign: "center", border: "1px solid var(--border-color, #eef2f6)", boxShadow: "0 4px 24px rgba(0,0,0,0.03)" }}>
        <img src="/icons/play.webp" alt="" width={64} height={64} style={{ marginBottom: "16px" }} />
        <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", marginBottom: "8px" }}>No Questions Generated Yet</h3>
        <p style={{ fontSize: "0.9rem", color: "var(--text-secondary, #64748b)", maxWidth: "420px", margin: "0 auto 24px" }}>
          Connect and sync your coding profile to unlock AI-tailored mock interview sessions.
        </p>
        <button
          onClick={fetchQuestions}
          style={{
            padding: "12px 24px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "white",
            fontWeight: 800,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
          }}
        >
          Generate Questions
        </button>
      </div>
    );
  }

  const current = questions[currentIndex];
  const progress = ((completed.size / questions.length) * 100).toFixed(0);
  const diffBadge = difficultyBadges[current.difficulty] || difficultyBadges.Medium;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* ══ SESSION HEADER ═══════════════════════════ */}
      <div
        style={{
          background: "var(--bg-card, #ffffff)",
          borderRadius: "20px",
          padding: "24px 28px",
          border: "1px solid var(--border-color, #eef2f6)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <img src="/icons/play.webp" alt="" width={42} height={42} />
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", margin: 0 }}>
              Live AI Mock Session
            </h2>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary, #64748b)", margin: 0 }}>
              Question {currentIndex + 1} of {questions.length} • {completed.size} Completed
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "160px", height: "8px", borderRadius: "100px", background: "var(--bg-secondary, #f1f5f9)", overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", borderRadius: "100px", background: "linear-gradient(90deg, #6366f1, #10b981)", transition: "width 0.3s ease" }} />
          </div>
          <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary, #0f172a)" }}>{progress}%</span>
          <button
            onClick={reset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 12px",
              borderRadius: "10px",
              background: "var(--bg-secondary, #f8fafc)",
              border: "1px solid var(--border-color, #e2e8f0)",
              color: "var(--text-secondary, #64748b)",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* ══ QUESTION CARD ════════════════════════════════ */}
      <div
        style={{
          background: "var(--bg-card, #ffffff)",
          borderRadius: "24px",
          padding: "36px",
          border: "1px solid var(--border-color, #eef2f6)",
          boxShadow: "0 6px 24px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "100px",
              fontSize: "0.75rem",
              fontWeight: 800,
              background: diffBadge.bg,
              color: diffBadge.text,
              border: `1px solid ${diffBadge.border}`,
            }}
          >
            {current.difficulty}
          </span>
          <span style={{ padding: "4px 12px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 700, background: "var(--bg-secondary, #f1f5f9)", color: "var(--text-secondary, #475569)" }}>
            {current.topic || "Algorithmic Analysis"}
          </span>
        </div>

        <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", letterSpacing: "-0.02em", marginBottom: "16px", lineHeight: 1.45 }}>
          {current.question}
        </h3>

        {/* Hints */}
        {current.hint && (
          <div style={{ marginBottom: "24px" }}>
            <button
              onClick={toggleHint}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "10px",
                background: "rgba(245, 158, 11, 0.12)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                color: "#f59e0b",
                fontSize: "0.82rem",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              <Lightbulb size={15} /> {showHint ? "Hide AI Hint" : "Show AI Hint"}
            </button>
            {showHint && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "16px 20px",
                  borderRadius: "14px",
                  background: "rgba(245, 158, 11, 0.08)",
                  border: "1px dashed rgba(245, 158, 11, 0.35)",
                  fontSize: "0.88rem",
                  color: "var(--text-primary, #78350f)",
                  lineHeight: 1.6,
                }}
              >
                💡 <strong>Hint:</strong> {current.hint}
              </div>
            )}
          </div>
        )}

        {/* Action controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "24px", borderTop: "1px solid var(--border-color, #f1f5f9)", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 18px",
                borderRadius: "12px",
                background: "var(--bg-secondary, #f8fafc)",
                border: "1.5px solid var(--border-color, #e2e8f0)",
                color: "var(--text-primary, #475569)",
                fontSize: "0.85rem",
                fontWeight: 800,
                cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                opacity: currentIndex === 0 ? 0.5 : 1,
              }}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              onClick={nextQuestion}
              disabled={currentIndex === questions.length - 1}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 18px",
                borderRadius: "12px",
                background: "var(--bg-secondary, #f8fafc)",
                border: "1.5px solid var(--border-color, #e2e8f0)",
                color: "var(--text-primary, #475569)",
                fontSize: "0.85rem",
                fontWeight: 800,
                cursor: currentIndex === questions.length - 1 ? "not-allowed" : "pointer",
                opacity: currentIndex === questions.length - 1 ? 0.5 : 1,
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={() => markComplete(currentIndex)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 22px",
              borderRadius: "12px",
              background: completed.has(currentIndex) ? "#10b981" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "white",
              fontSize: "0.85rem",
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
              transition: "all 0.2s ease",
            }}
          >
            <CheckCircle2 size={16} />
            {completed.has(currentIndex) ? "Marked as Solved ✓" : "Mark as Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}
