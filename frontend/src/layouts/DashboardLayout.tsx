import { useState } from "react";
import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { LogOut, Menu, X, Sparkles } from "lucide-react";
import SettingsModal from "../components/SettingsModal";
import ThemeToggle from "../components/ThemeToggle";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon3d: "/icons/chart.webp" },
  { path: "/ai-coach", label: "AI Coach", icon3d: "/icons/megaphone.webp" },
  { path: "/mock-interview", label: "Mock Interview", icon3d: "/icons/play.webp" },
  { path: "/leaderboard", label: "Leaderboard", icon3d: "/icons/medal.webp" },
];

export default function DashboardLayout() {
  const { isAuthenticated, logout, user } = useAuthStore();
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isActive = (path: string) => location.pathname === path;
  const profilePath = `/u/${user?.leetcodeUsername || user?.githubUsername || "profile"}`;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "var(--bg-primary, #f8f9ff)",
        fontFamily: "var(--font-family)",
        color: "var(--text-primary, #0f172a)",
        overflow: "hidden",
      }}
    >
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 40,
          }}
        />
      )}

      {/* ══ SIDEBAR ══════════════════════════════════════ */}
      <aside
        id="app-sidebar"
        style={{
          width: "280px",
          background: "var(--bg-card, #ffffff)",
          borderRight: "1px solid var(--border-color, #eef2f6)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 50,
          transition: "transform 0.3s ease, background-color 0.25s ease",
          boxShadow: "2px 0 16px rgba(0,0,0,0.03)",
        }}
      >
        {/* Sidebar Top: Logo */}
        <div>
          <div
            style={{
              padding: "24px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--border-color, #f1f5f9)",
            }}
          >
            <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <img
                src="/icons/computer.webp"
                alt="CodePulse"
                width={34}
                height={34}
                style={{ filter: "drop-shadow(0 4px 10px rgba(99,102,241,0.35))" }}
              />
              <span
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 900,
                  color: "var(--text-primary, #0f172a)",
                  letterSpacing: "-0.02em",
                }}
              >
                Code<span style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Pulse</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg-hidden-btn"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary, #64748b)", display: "none" }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Items */}
          <nav style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-secondary, #94a3b8)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 12px 8px" }}>
              Main Navigation
            </div>
            {navItems.map(({ path, label, icon3d }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "11px 16px",
                    borderRadius: "14px",
                    textDecoration: "none",
                    fontSize: "0.92rem",
                    fontWeight: active ? 800 : 600,
                    color: active ? "#6366f1" : "var(--text-secondary, #475569)",
                    background: active ? "var(--bg-secondary, #eef2ff)" : "transparent",
                    border: active ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "var(--bg-secondary, #f8fafc)";
                      e.currentTarget.style.color = "var(--text-primary, #0f172a)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-secondary, #475569)";
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <img src={icon3d} alt="" width={24} height={24} style={{ objectFit: "contain" }} />
                    <span>{label}</span>
                  </div>
                  {active && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 8px #6366f1" }} />}
                </Link>
              );
            })}

            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-secondary, #94a3b8)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "16px 12px 8px" }}>
              User Space
            </div>

            {/* Public Profile link */}
            <Link
              to={profilePath}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                padding: "11px 16px",
                borderRadius: "14px",
                textDecoration: "none",
                fontSize: "0.92rem",
                fontWeight: location.pathname.startsWith("/u/") ? 800 : 600,
                color: location.pathname.startsWith("/u/") ? "#6366f1" : "var(--text-secondary, #475569)",
                background: location.pathname.startsWith("/u/") ? "var(--bg-secondary, #eef2ff)" : "transparent",
                border: location.pathname.startsWith("/u/") ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!location.pathname.startsWith("/u/")) {
                  e.currentTarget.style.background = "var(--bg-secondary, #f8fafc)";
                  e.currentTarget.style.color = "var(--text-primary, #0f172a)";
                }
              }}
              onMouseLeave={(e) => {
                if (!location.pathname.startsWith("/u/")) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--text-secondary, #475569)";
                }
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src="/icons/profile.png"
                  alt="Profile"
                  width={24}
                  height={24}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
                <span>Public Profile</span>
              </div>
              {location.pathname.startsWith("/u/") && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1" }} />}
            </Link>

            {/* Settings button */}
            <button
              onClick={() => { setIsSettingsOpen(true); setSidebarOpen(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "11px 16px",
                borderRadius: "14px",
                background: "transparent",
                border: "none",
                fontSize: "0.92rem",
                fontWeight: 600,
                color: "var(--text-secondary, #475569)",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                transition: "all 0.15s ease",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-secondary, #f8fafc)";
                e.currentTarget.style.color = "var(--text-primary, #0f172a)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--text-secondary, #475569)";
              }}
            >
              <img src="/icons/key.webp" alt="Settings" width={24} height={24} style={{ objectFit: "contain" }} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom: User Card & Sign Out */}
        <div style={{ padding: "16px", borderTop: "1px solid var(--border-color, #f1f5f9)" }}>
          <div
            style={{
              background: "var(--bg-secondary, #f8fafc)",
              border: "1px solid var(--border-color, #e2e8f0)",
              borderRadius: "16px",
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
              <img
                src="/icons/profile.png"
                alt="Avatar"
                width={36}
                height={36}
                style={{ borderRadius: "10px", objectFit: "cover", boxShadow: "0 2px 8px rgba(99,102,241,0.2)" }}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-primary, #0f172a)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user?.name || "Developer"}
                </div>
                <div style={{ fontSize: "0.74rem", color: "#6366f1", fontWeight: 700 }}>
                  Score: {user?.developerScore ?? 0}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              padding: "10px 14px",
              borderRadius: "12px",
              background: "transparent",
              border: "1px solid transparent",
              color: "#ef4444",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ══ MAIN AREA ════════════════════════════════════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden", background: "var(--bg-primary, #f8f9ff)" }}>
        {/* Top Navbar */}
        <header
          style={{
            height: "68px",
            background: "var(--bg-glass, rgba(255, 255, 255, 0.85))",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid var(--border-color, #eef2f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            zIndex: 30,
            transition: "background-color 0.25s ease, border-color 0.25s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg-menu-btn"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary, #64748b)", padding: "6px", display: "none" }}
            >
              <Menu size={22} />
            </button>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "100px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
              <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#10b981" }}>AI System Online</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <ThemeToggle />
            <Link
              to="/ai-coach"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "9px 18px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "white",
                fontSize: "0.86rem",
                fontWeight: 800,
                textDecoration: "none",
                boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
              }}
            >
              <Sparkles size={15} /> AI Advice
            </Link>
            <button
              onClick={() => setIsSettingsOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "12px",
                background: "var(--bg-secondary, #f1f5f9)",
                border: "1.5px solid var(--border-color, #e2e8f0)",
                color: "var(--text-primary, #475569)",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <img src="/icons/key.webp" alt="Settings" width={18} height={18} />
              <span>Settings</span>
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main style={{ flex: 1, overflowY: "auto", padding: "32px", background: "var(--bg-primary, #f8f9ff)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <Outlet />
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 960px) {
          #app-sidebar {
            position: fixed !important;
            inset: 0 auto 0 0 !important;
            transform: ${sidebarOpen ? "translateX(0)" : "translateX(-100%)"};
          }
          .lg-menu-btn { display: flex !important; }
          .lg-hidden-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
