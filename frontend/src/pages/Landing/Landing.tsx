import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Star, CheckCircle2, Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "../../components/ThemeToggle";

/* ── 3D Icon helper ── */
interface I3Props { src: string; alt: string; size?: number; style?: React.CSSProperties; }
const I3 = ({ src, alt, size = 80, style }: I3Props) => (
  <img src={src} alt={alt} width={size} height={size} draggable={false}
    style={{ objectFit: "contain", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.15))", ...style }} />
);

const features = [
  { icon: "/icons/chart.webp",     title: "Unified Analytics",   desc: "Sync LeetCode & GitHub into one live dashboard with real-time readiness scores.",     accent: "#6366f1" },
  { icon: "/icons/megaphone.webp", title: "AI Interview Coach",  desc: "Personalized weak-topic analysis, custom roadmaps, and smart AI recommendations.",    accent: "#8b5cf6" },
  { icon: "/icons/target.webp",    title: "Company Fit Scores",  desc: "See exactly how ready you are for FAANG, top startups, and leading tech companies.",  accent: "#10b981" },
  { icon: "/icons/play.webp",      title: "Mock Interviews",     desc: "Practice with AI-curated questions targeting your exact weak areas with live feedback.", accent: "#f59e0b" },
  { icon: "/icons/notebook.webp",  title: "LeetCode Sync",       desc: "Auto-import problems, streaks, contest ratings, and full submission history.",         accent: "#ef4444" },
  { icon: "/icons/puzzle.webp",    title: "GitHub Integration",  desc: "Track repos, commits, languages, and open-source contributions all in one place.",     accent: "#3b82f6" },
];

const steps = [
  { num: "01", icon: "/icons/key.webp",   title: "Connect Your Profiles",  desc: "Link your LeetCode and GitHub accounts in seconds. We pull all your data automatically.", color: "#6366f1" },
  { num: "02", icon: "/icons/star.webp",  title: "Get Your AI Report",     desc: "Our AI analyzes your strengths, weak areas, and builds you a custom preparation roadmap.", color: "#8b5cf6" },
  { num: "03", icon: "/icons/medal.webp", title: "Practice & Land Offers", desc: "Follow your plan, practice targeted mock interviews, and land your dream job.", color: "#10b981" },
];

const stats = [
  { icon: "/icons/notebook.webp", value: "10K+", label: "Problems Tracked"  },
  { icon: "/icons/thumb-up.webp", value: "500+", label: "Active Developers" },
  { icon: "/icons/heart.webp",    value: "95%",  label: "User Satisfaction" },
  { icon: "/icons/clock.webp",    value: "24/7", label: "AI Coaching"       },
];

const testimonials = [
  { name: "Priya S.",  role: "SWE @ Google",     avatar: "PS", avatarBg: "#eef2ff", avatarColor: "#6366f1", text: "CodePulse helped me identify my DP weakness and land my dream offer in 8 weeks. The AI coaching is incredible." },
  { name: "Marcus T.", role: "New Grad @ Meta",  avatar: "MT", avatarBg: "#f5f3ff", avatarColor: "#8b5cf6", text: "The company fit scores kept me motivated. I knew exactly what to work on each week to hit my target." },
  { name: "Alex K.",   role: "Career Switcher",  avatar: "AK", avatarBg: "#ecfdf5", avatarColor: "#10b981", text: "Syncing GitHub + LeetCode in one place changed how I prepared. Got 3 offers in 6 weeks!" },
];

const companies = [
  { name: "Google",    color: "#5f6368", weight: 700, size: "1.2rem" },
  { name: "amazon",   color: "#232f3e", weight: 800, size: "1.1rem" },
  { name: "Meta",     color: "#0866ff", weight: 700, size: "1.2rem" },
  { name: "Microsoft",color: "#737373", weight: 700, size: "1.1rem" },
  { name: "Apple",    color: "#555555", weight: 700, size: "1.2rem" },
];

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div style={{ fontFamily: "var(--font-family)", background: "var(--bg-primary, #f8f9ff)", minHeight: "100vh", color: "var(--text-primary, #0f172a)", overflowX: "hidden" }}>

      {/* NAVBAR */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "var(--bg-glass, rgba(255,255,255,0.92))", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(99,102,241,0.08)", boxShadow: "0 1px 20px rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <I3 src="/icons/computer.webp" alt="CodePulse" size={36} style={{ filter: "drop-shadow(0 4px 10px rgba(99,102,241,0.4))" }} />
            <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.02em" }}>
              Code<span style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Pulse</span>
            </span>
          </div>

          <div id="nav-links" style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            {["Features", "Stories", "Pricing", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ fontSize: "0.875rem", fontWeight: 500, color: "#64748b", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#6366f1")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}>
                {item}
              </a>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ThemeToggle />
            <Link to="/login" style={{ fontSize: "0.875rem", fontWeight: 500, color: "#64748b", textDecoration: "none", padding: "8px 16px", borderRadius: "8px", transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#6366f1"; (e.currentTarget as HTMLElement).style.background = "#eef2ff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#64748b"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              Log in
            </Link>
            <Link to="/login" style={{ fontSize: "0.875rem", fontWeight: 600, color: "white", textDecoration: "none", padding: "10px 22px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 12px rgba(99,102,241,0.3)", transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(99,102,241,0.4)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(99,102,241,0.3)"; }}>
              Sign Up Free
            </Link>
            <button id="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={{ background: "white", padding: "16px 24px 24px", borderTop: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: "16px" }}>
            {["Features", "Stories", "Pricing", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{ fontSize: "0.95rem", color: "#64748b", textDecoration: "none", fontWeight: 500 }}>{item}</a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: "120px", paddingBottom: "80px", paddingLeft: "24px", paddingRight: "24px", position: "relative" }}>
        <div style={{ position: "absolute", top: "10%", left: "5%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "0%", right: "5%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

        <div id="hero-row" style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", gap: "60px", position: "relative", zIndex: 1 }}>
          {/* Left */}
          <div style={{ flex: "1 1 0%", minWidth: 0 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "100px", background: "linear-gradient(135deg, #eef2ff, #f5f3ff)", border: "1px solid rgba(99,102,241,0.2)", marginBottom: "24px" }}>
              <Sparkles size={14} color="#6366f1" />
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#6366f1", letterSpacing: "0.02em" }}>AI-Powered Interview Prep</span>
            </div>

            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 800, color: "#0f172a", lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px" }}>
              The right preparation<br />
              <span style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>and opportunities</span>
            </h1>

            <p style={{ fontSize: "1.05rem", color: "#64748b", lineHeight: 1.7, maxWidth: "440px", marginBottom: "36px" }}>
              Connect your coding profiles, get AI-driven insights, and follow a personalized roadmap to land your dream tech job.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px", flexWrap: "wrap" }}>
              <input
                id="username-input"
                type="text"
                placeholder="Enter your LeetCode username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: "1 1 220px", padding: "13px 18px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "white", fontSize: "0.9rem", color: "#1e293b", outline: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", maxWidth: "280px", fontFamily: "inherit" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
              />
              <Link to="/login" id="get-started-btn" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 28px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", boxShadow: "0 4px 16px rgba(99,102,241,0.35)", transition: "all 0.2s", whiteSpace: "nowrap" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(99,102,241,0.45)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(99,102,241,0.35)"; }}>
                Get Started <ArrowRight size={18} />
              </Link>
            </div>

            <div>
              <p style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 500, marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Trusted by developers from</p>
              <div style={{ display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap" }}>
                {companies.map((c) => (
                  <span key={c.name} style={{ fontFamily: "'Inter', sans-serif", fontSize: c.size, fontWeight: c.weight, color: c.color, opacity: 0.7, transition: "opacity 0.2s", cursor: "default" }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}>
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right illustration */}
          <div id="hero-illustration" style={{ flex: "0 0 auto", maxWidth: "520px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: "-20px", left: "-30px", zIndex: 10, background: "white", borderRadius: "14px", padding: "10px 16px", boxShadow: "0 8px 32px rgba(0,0,0,0.11)", display: "flex", alignItems: "center", gap: "10px", animation: "cpFloat 6s ease-in-out infinite" }}>
                <I3 src="/icons/tick.webp" alt="Ready" size={34} />
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Readiness Score</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#10b981" }}>87% Ready 🎯</div>
                </div>
              </div>

              <div style={{ position: "absolute", bottom: "10px", right: "-20px", zIndex: 10, background: "white", borderRadius: "14px", padding: "10px 16px", boxShadow: "0 8px 32px rgba(0,0,0,0.11)", display: "flex", alignItems: "center", gap: "10px", animation: "cpFloat 6s ease-in-out 2s infinite" }}>
                <I3 src="/icons/fire.webp" alt="Streak" size={34} />
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Interview Streak</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#6366f1" }}>14 Days 🔥</div>
                </div>
              </div>

              <div style={{ position: "absolute", top: "32%", right: "-40px", zIndex: 10, background: "white", borderRadius: "12px", padding: "9px 14px", boxShadow: "0 8px 28px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "8px", animation: "cpFloat 7s ease-in-out 1s infinite" }}>
                <I3 src="/icons/medal.webp" alt="Medal" size={26} />
                <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#f59e0b" }}>#1 Ranked</span>
              </div>

              <div style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)", borderRadius: "28px", padding: "16px", boxShadow: "0 20px 60px rgba(99,102,241,0.12), 0 4px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(99,102,241,0.1)" }}>
                <img src="/hero-illustration.jpg" alt="AI Interview preparation illustration" style={{ width: "100%", maxWidth: "460px", borderRadius: "18px", display: "block" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats-bar" style={{ background: "white", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", padding: "48px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px", textAlign: "center" }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center", padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10, animation: "cpFloat 6s ease-in-out infinite" }}>
                <I3 src={s.icon} alt={s.label} size={52} />
              </div>
              <div style={{ fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.03em", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "4px" }}>{s.value}</div>
              <div style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "100px 24px", background: "#f8f9ff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", padding: "5px 14px", borderRadius: "100px", background: "#eef2ff", border: "1px solid rgba(99,102,241,0.2)", marginBottom: "16px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6366f1", letterSpacing: "0.04em", textTransform: "uppercase" }}>Features</span>
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: "16px" }}>
              Everything You Need to <span style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Succeed</span>
            </h2>
            <p style={{ fontSize: "1.05rem", color: "#64748b", maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}>One platform. All your prep data. AI that actually helps you land the job.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            {features.map((f) => (
              <div key={f.title}
                style={{ background: "white", borderRadius: "20px", padding: "32px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", transition: "all 0.3s", cursor: "default", position: "relative", overflow: "hidden" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 48px ${f.accent}18`; (e.currentTarget as HTMLElement).style.borderColor = `${f.accent}25`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; (e.currentTarget as HTMLElement).style.borderColor = "#f1f5f9"; }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, background: `radial-gradient(circle at top right,${f.accent}10,transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ marginBottom: 18 }}>
                  <I3 src={f.icon} alt={f.title} size={64} />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "10px" }}>{f.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "#64748b", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: "100px 24px", background: "white" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ display: "inline-flex", padding: "5px 14px", borderRadius: "100px", background: "#ecfdf5", border: "1px solid rgba(16,185,129,0.2)", marginBottom: "16px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#10b981", letterSpacing: "0.04em", textTransform: "uppercase" }}>How It Works</span>
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>
              Start in <span style={{ background: "linear-gradient(135deg, #10b981, #059669)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>3 simple steps</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "32px" }}>
            {steps.map((s, i) => (
              <div key={s.num}
                style={{ textAlign: "center", padding: "32px 24px", background: "#fafbff", borderRadius: "20px", border: "1px solid #f1f5f9", transition: "all 0.3s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${s.color}14`; (e.currentTarget as HTMLElement).style.borderColor = `${s.color}20`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.borderColor = "#f1f5f9"; }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, animation: `cpFloat ${6 + i}s ease-in-out ${i * 0.8}s infinite` }}>
                  <I3 src={s.icon} alt={s.title} size={76} />
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "8px", background: `${s.color}15`, marginBottom: 12 }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: s.color }}>{s.num}</span>
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", marginBottom: "10px" }}>{s.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "#64748b", lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="stories" style={{ padding: "100px 24px", background: "#f8f9ff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ display: "inline-flex", padding: "5px 14px", borderRadius: "100px", background: "#fffbeb", border: "1px solid rgba(245,158,11,0.25)", marginBottom: "16px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#f59e0b", letterSpacing: "0.04em", textTransform: "uppercase" }}>Success Stories</span>
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em" }}>
              Loved by <span style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Developers</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {testimonials.map((t) => (
              <div key={t.name} style={{ background: "white", borderRadius: "20px", padding: "32px", border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", transition: "all 0.3s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}>
                <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
                  {[...Array(5)].map((_, i) => (<Star key={i} size={16} color="#f59e0b" fill="#f59e0b" />))}
                </div>
                <p style={{ fontSize: "0.95rem", color: "#475569", lineHeight: 1.7, marginBottom: "24px", fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "12px", background: t.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700, color: t.avatarColor }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a" }}>{t.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 500 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" style={{ padding: "100px 24px", background: "white" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #ecfdf5 100%)", borderRadius: "32px", padding: "72px 48px", border: "1px solid rgba(99,102,241,0.12)", boxShadow: "0 20px 60px rgba(99,102,241,0.08)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(99,102,241,0.06)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-40px", left: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(16,185,129,0.06)", pointerEvents: "none" }} />
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <div style={{ animation: "cpFloat 5s ease-in-out infinite" }}><I3 src="/icons/gift-box.webp" alt="Gift" size={54} /></div>
              <div style={{ animation: "cpFloat 6s ease-in-out 1s infinite", marginTop: -8 }}><I3 src="/icons/medal.webp" alt="Medal" size={68} /></div>
              <div style={{ animation: "cpFloat 7s ease-in-out 0.5s infinite" }}><I3 src="/icons/star.webp" alt="Star" size={54} /></div>
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: "16px", position: "relative" }}>Ready to Level Up?</h2>
            <p style={{ fontSize: "1.05rem", color: "#64748b", lineHeight: 1.65, marginBottom: "28px", position: "relative" }}>Join 500+ developers who are preparing smarter, not harder. Start your AI-powered journey today — completely free.</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", marginBottom: 32 }}>
              {["No credit card required", "Set up in 60 seconds", "Cancel anytime"].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>
                  <CheckCircle2 size={15} color="#10b981" />{item}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", flexWrap: "wrap", position: "relative" }}>
              <Link to="/login" id="cta-signup-btn" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 32px", borderRadius: "12px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontWeight: 700, fontSize: "1rem", textDecoration: "none", boxShadow: "0 4px 16px rgba(99,102,241,0.35)", transition: "all 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(99,102,241,0.5)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(99,102,241,0.35)"; }}>
                Create Free Account <ArrowRight size={18} />
              </Link>
              <a href="#features" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", borderRadius: "12px", background: "white", color: "#64748b", fontWeight: 600, fontSize: "1rem", textDecoration: "none", border: "1.5px solid #e2e8f0", transition: "all 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#6366f1"; (e.currentTarget as HTMLElement).style.color = "#6366f1"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0"; (e.currentTarget as HTMLElement).style.color = "#64748b"; }}>
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0f172a", color: "#94a3b8", padding: "48px 24px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px", marginBottom: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <I3 src="/icons/computer.webp" alt="logo" size={32} style={{ filter: "drop-shadow(0 4px 10px rgba(99,102,241,0.5))" }} />
              <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "white" }}>
                Code<span style={{ background: "linear-gradient(135deg, #818cf8, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Pulse</span>
              </span>
            </div>
            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
              {["Features", "Pricing", "Contact", "Privacy"].map((item) => (
                <a key={item} href="#" style={{ fontSize: "0.875rem", color: "#64748b", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}>{item}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid #1e293b", paddingTop: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: "0.85rem", color: "#475569" }}>
            <span>© {new Date().getFullYear()} CodePulse. Built for developers, by developers. 🚀</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <I3 src="/icons/heart.webp" alt="Love" size={22} />
              <span>Made with passion</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes cpFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @media (max-width: 900px) {
          #nav-links { display: none !important; }
          #hamburger-btn { display: flex !important; }
        }
        @media (max-width: 768px) {
          #hero-row { flex-direction: column !important; }
          #hero-illustration { max-width: 100% !important; }
          #stats-bar > div { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
