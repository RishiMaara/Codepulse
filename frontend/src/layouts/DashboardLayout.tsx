import { useState } from "react";
import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import {
  LayoutDashboard, Brain, Trophy, User, LogOut, Settings,
  Mic, Menu, X
} from "lucide-react";
import SettingsModal from "../components/SettingsModal";
import { cn } from "../lib/utils";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/ai-coach", label: "AI Coach", icon: Brain },
  { path: "/mock-interview", label: "Mock Interview", icon: Mic },
  { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
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

  const NavLinks = () => (
    <>
      {navItems.map(({ path, label, icon: Icon }) => (
        <Link
          key={path}
          to={path}
          onClick={() => setSidebarOpen(false)}
          className={cn(
            "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group",
            isActive(path)
              ? "bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-inner"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          )}
        >
          <Icon size={20} className={isActive(path) ? "drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "group-hover:scale-110 transition-transform"} />
          <span className="font-medium">{label}</span>
        </Link>
      ))}
      <Link
        to={profilePath}
        onClick={() => setSidebarOpen(false)}
        className={cn(
          "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group",
          location.pathname.startsWith("/u/")
            ? "bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-inner"
            : "text-gray-400 hover:bg-white/5 hover:text-white"
        )}
      >
        <User size={20} />
        <span className="font-medium">Public Profile</span>
      </Link>
      <button
        onClick={() => { setIsSettingsOpen(true); setSidebarOpen(false); }}
        className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl transition-all duration-300 group text-gray-400 hover:bg-white/5 hover:text-white"
      >
        <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
        <span className="font-medium">Settings</span>
      </button>
    </>
  );

  return (
    <div className="flex h-screen bg-dark-200 text-white overflow-hidden relative">
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={cn(
        "w-64 glass-panel border-y-0 border-l-0 rounded-none border-r border-white/5 flex flex-col z-50 shadow-2xl transition-transform duration-300",
        "fixed lg:relative inset-y-0 left-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 pb-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <Brain size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight">
              Code<span className="text-gradient">Pulse</span>
            </h1>
          </Link>
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          <NavLinks />
        </nav>

        <div className="p-4 border-t border-white/5 m-4 glass-panel bg-dark-100/50">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-2 w-full text-left text-gray-400 hover:text-rose-400 transition-colors group"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative z-10 scroll-smooth">
        <header className="h-16 border-b border-white/5 bg-dark-200/50 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
          <button className="lg:hidden p-2 text-gray-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-white">{user?.name}</span>
              <span className="text-xs text-brand-400">Score: {user?.developerScore ?? 0}</span>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-sm font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:scale-105 transition-transform border border-white/20"
            >
              {user?.name?.charAt(0).toUpperCase()}
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
