import { useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [error, setError] = useState("");

  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const isRegister = mode === "register";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (isRegister && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await login(email, isRegister ? name : undefined);
      navigate("/dashboard");
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setError(ax.response?.data?.message || (err instanceof Error ? err.message : "Something went wrong."));
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1.5px solid #e2e8f0",
    background: "#f8fafc",
    fontSize: "0.92rem",
    color: "var(--text-primary, #0f172a)",
    outline: "none",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Inter', system-ui, sans-serif", background: "var(--bg-primary, #f8f9ff)" }}>
      {/* ══ LEFT HERO / BRAND PANEL ════════════════════════ */}
      <div
        id="auth-left-panel"
        style={{
          flex: "0 0 460px",
          background: "linear-gradient(145deg, #4f46e5 0%, #6366f1 45%, #7c3aed 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 44px",
          position: "relative",
          overflow: "hidden",
          color: "white",
        }}
      >
        {/* Background Decorative Shapes */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-10%",
            width: "320px",
            height: "320px",
            background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-15%",
            left: "-15%",
            width: "360px",
            height: "360px",
            background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        {/* Brand Header */}
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "12px", textDecoration: "none", zIndex: 2 }}>
          <img
            src="/icons/computer.webp"
            alt="CodePulse"
            width={38}
            height={38}
            style={{ filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.25))" }}
          />
          <span style={{ fontSize: "1.35rem", fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>
            Code<span style={{ color: "#c7d2fe" }}>Pulse</span>
          </span>
        </Link>

        {/* Center 3D Showcase Card with 3D Character Avatar from template */}
        <div style={{ position: "relative", zIndex: 2, margin: "24px 0" }}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.22)",
              borderRadius: "24px",
              padding: "28px 24px",
              boxShadow: "0 20px 48px rgba(0, 0, 0, 0.18)",
              textAlign: "center",
            }}
          >
            <div style={{ display: "inline-flex", justifyContent: "center", marginBottom: "14px", animation: "cpFloat 6s ease-in-out infinite" }}>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "26px",
                  background: "var(--bg-card, #ffffff)",
                  padding: "4px",
                  boxShadow: "0 10px 28px rgba(0,0,0,0.25)",
                }}
              >
                <img
                  src="/icons/profile.png"
                  alt="3D Developer Avatar"
                  width={92}
                  height={92}
                  style={{ borderRadius: "22px", objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 700, marginBottom: "10px" }}>
              <Sparkles size={14} /> FlexUI Design System
            </div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "white", lineHeight: 1.3, marginBottom: "8px" }}>
              {isRegister ? "Join 500+ Top Engineers" : "Next-Gen AI Interview Coach"}
            </h3>
            <p style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, margin: 0 }}>
              {isRegister
                ? "Unlock your full potential with real-time feedback, LeetCode sync, and adaptive mock interviews."
                : "Real-time readiness analytics, company fit scores, and curated practice tailored to you."}
            </p>
          </div>

          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              "Real-time LeetCode & GitHub Sync",
              "AI Question Recommender Engine",
              "FAANG & Tier-1 Company Fit Score",
            ].map((feat) => (
              <div key={feat} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <CheckCircle2 size={16} color="#a5b4fc" />
                <span style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", zIndex: 2 }}>
          © {new Date().getFullYear()} CodePulse Inc. All rights reserved.
        </div>
      </div>

      {/* ══ RIGHT FORM PANEL ══════════════════════════════ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          background: "white",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: "440px", position: "relative" }}>
          <div style={{ position: "absolute", top: "-10px", right: 0 }}>
            <ThemeToggle />
          </div>
          {/* Mobile brand header if left panel hidden */}
          <div className="mobile-brand" style={{ display: "none", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
            <img src="/icons/computer.webp" alt="CodePulse" width={32} height={32} />
            <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
              Code<span style={{ color: "#6366f1" }}>Pulse</span>
            </span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: "32px" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#6366f1",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                display: "inline-block",
                marginBottom: "6px",
              }}
            >
              {isRegister ? "Start your journey" : "Welcome Back"}
            </span>
            <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em", margin: "0 0 8px" }}>
              {isRegister ? "Create an account" : "Log in to your account"}
            </h1>
            <p style={{ fontSize: "0.9rem", color: "#64748b", margin: 0 }}>
              {isRegister
                ? "Enter your details to register and start practicing."
                : "Welcome back! Please enter your details to continue."}
            </p>
          </div>

          {/* Error notice */}
          {error && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                background: "#fef2f2",
                border: "1px solid #fee2e2",
                color: "#ef4444",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          {/* Social Logins */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
            <button
              type="button"
              onClick={() => {
                setEmail("demo@codepulse.ai");
                if (isRegister) setName("Alex Developer");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "11px 16px",
                borderRadius: "12px",
                border: "1.5px solid #e2e8f0",
                background: "#ffffff",
                color: "#0f172a",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#6366f1";
                e.currentTarget.style.background = "#f8faff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.background = "#ffffff";
              }}
            >
              <img src="/icons/computer.webp" alt="Demo" width={18} height={18} />
              Quick Demo
            </button>
            <button
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "11px 16px",
                borderRadius: "12px",
                border: "1.5px solid #e2e8f0",
                background: "#ffffff",
                color: "#0f172a",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#6366f1";
                e.currentTarget.style.background = "#f8faff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.background = "#ffffff";
              }}
            >
              <img src="/icons/puzzle.webp" alt="GitHub" width={18} height={18} />
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Or with email</span>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {isRegister && (
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#6366f1";
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.background = "#f8fafc";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#6366f1";
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.background = "#f8fafc";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155" }}>Password</label>
                {!isRegister && (
                  <span style={{ fontSize: "0.8rem", color: "#6366f1", fontWeight: 600, cursor: "pointer" }}>
                    Forgot password?
                  </span>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: "44px" }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#6366f1";
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.background = "#f8fafc";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Confirm Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showCf ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    style={{ ...inputStyle, paddingRight: "44px" }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#6366f1";
                      e.currentTarget.style.background = "#ffffff";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.background = "#f8fafc";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCf(!showCf)}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {showCf ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: "8px",
                width: "100%",
                padding: "14px 24px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "white",
                fontSize: "0.95rem",
                fontWeight: 700,
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 6px 20px rgba(99,102,241,0.35)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.45)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.35)";
                }
              }}
            >
              {isLoading ? (
                "Loading..."
              ) : isRegister ? (
                <>Create Account <ArrowRight size={18} /></>
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div style={{ marginTop: "28px", textAlign: "center" }}>
            <p style={{ fontSize: "0.88rem", color: "#64748b", margin: 0 }}>
              {isRegister ? "Already have an account?" : "Don't have an account yet?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(isRegister ? "login" : "register");
                  setError("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6366f1",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "underline",
                }}
              >
                {isRegister ? "Log in here" : "Create one now"}
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cpFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @media (max-width: 860px) {
          #auth-left-panel { display: none !important; }
          .mobile-brand { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
