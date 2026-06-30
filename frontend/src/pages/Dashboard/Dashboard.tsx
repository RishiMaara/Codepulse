import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDashboardStore } from "../../store/dashboard.store";
import { useAuthStore } from "../../store/auth.store";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import {
  RefreshCw, Code2, GitBranch, Target, Trophy, Flame,
  Award, Mic, Brain, ArrowRight
} from "lucide-react";
import { Doughnut, Bar } from "react-chartjs-2";
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
    return <div className="text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-500/20 glass-panel">{error}</div>;
  }

  const leetcode = data?.leetcode as Record<string, number> | undefined;
  const github = data?.github as Record<string, number> | undefined;
  const snapshot = data?.snapshot as Record<string, unknown> | undefined;
  const achievements = (data?.achievements as Array<{ badge: string }>) ?? [];

  const hasLeetcode = !!user?.leetcodeUsername;
  const hasGithub = !!user?.githubUsername;
  const needsSetup = !hasLeetcode && !hasGithub;

  const doughnutData = {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [{
      data: [leetcode?.easySolved ?? 0, leetcode?.mediumSolved ?? 0, leetcode?.hardSolved ?? 0],
      backgroundColor: ["#34d399", "#fbbf24", "#f43f5e"],
      borderWidth: 0,
    }],
  };

  const companyFit = snapshot?.companyFit as Record<string, number> | undefined;
  const companyEntries = companyFit ? Object.entries(companyFit) : [];

  const barData = companyEntries.length ? {
    labels: companyEntries.map(([c]) => c),
    datasets: [{
      label: "Fit %",
      data: companyEntries.map(([, s]) => s),
      backgroundColor: "rgba(99, 102, 241, 0.6)",
      borderRadius: 8,
    }],
  } : null;

  return (
    <div className="space-y-8 relative z-10 animate-fade-in">
      {/* Setup banner */}
      {needsSetup && (
        <div className="glass-panel p-6 border-brand-500/30 bg-brand-500/5">
          <h3 className="font-bold text-white text-lg mb-1">Connect your profiles to get started</h3>
          <p className="text-gray-400 text-sm">Add your LeetCode and GitHub usernames via Settings in the sidebar.</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-1">
            Welcome back, <span className="text-gradient">{user?.name?.split(" ")[0] || "Developer"}</span>
          </h2>
          <p className="text-gray-400">Your interview readiness snapshot.</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={syncLeetcode}
            disabled={!hasLeetcode || isLoading}
            title={!hasLeetcode ? "Set LeetCode username in Settings" : undefined}
            className="flex items-center space-x-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-brand-500/20 hover:border-brand-500/50 text-white rounded-xl transition-all duration-300 disabled:opacity-50 hover-glow"
          >
            <RefreshCw size={18} className={`text-brand-400 ${isLoading ? "animate-spin" : ""}`} />
            <span className="font-medium">Sync LeetCode</span>
          </button>
          <button
            onClick={syncGithub}
            disabled={!hasGithub || isLoading}
            title={!hasGithub ? "Set GitHub username in Settings" : undefined}
            className="flex items-center space-x-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-purple-500/20 hover:border-purple-500/50 text-white rounded-xl transition-all duration-300 disabled:opacity-50 hover-glow"
          >
            <RefreshCw size={18} className={`text-purple-400 ${isLoading ? "animate-spin" : ""}`} />
            <span className="font-medium">Sync GitHub</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Developer Score" value={snapshot?.developerScore ?? user?.developerScore ?? 0} icon={<Target size={22} className="text-brand-400" />} glow="group-hover:border-brand-500/30" />
        <StatCard title="Readiness" value={`${snapshot?.readinessScore ?? 0}%`} icon={<Trophy size={22} className="text-emerald-400" />} glow="group-hover:border-emerald-500/30" />
        <StatCard title="Problems" value={leetcode?.totalSolved ?? 0} icon={<Code2 size={22} className="text-amber-400" />} glow="group-hover:border-amber-500/30" />
        <StatCard title="Commits" value={github?.commits ?? 0} icon={<GitBranch size={22} className="text-purple-400" />} glow="group-hover:border-purple-500/30" />
        <StatCard title="Streak" value={`${leetcode?.streak ?? 0}d`} icon={<Flame size={22} className="text-orange-400" />} glow="group-hover:border-orange-500/30" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/ai-coach" className="glass-panel p-5 flex items-center gap-4 hover:border-brand-500/30 transition-all group hover:-translate-y-0.5">
          <div className="p-3 bg-brand-500/10 rounded-xl border border-brand-500/20"><Brain className="text-brand-400" size={24} /></div>
          <div className="flex-1">
            <div className="font-bold text-white">AI Coach</div>
            <div className="text-sm text-gray-400">View weak topics & roadmap</div>
          </div>
          <ArrowRight size={18} className="text-gray-500 group-hover:text-brand-400 transition-colors" />
        </Link>
        <Link to="/mock-interview" className="glass-panel p-5 flex items-center gap-4 hover:border-purple-500/30 transition-all group hover:-translate-y-0.5">
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20"><Mic className="text-purple-400" size={24} /></div>
          <div className="flex-1">
            <div className="font-bold text-white">Mock Interview</div>
            <div className="text-sm text-gray-400">Practice tailored questions</div>
          </div>
          <ArrowRight size={18} className="text-gray-500 group-hover:text-purple-400 transition-colors" />
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Code2 className="text-amber-400" size={20} /> Problem Breakdown
          </h3>
          <div className="h-48 flex items-center justify-center">
            {(leetcode?.totalSolved ?? 0) > 0 ? (
              <Doughnut data={doughnutData} options={{ plugins: { legend: { position: "bottom", labels: { color: "#9ca3af", padding: 16 } } }, cutout: "65%" }} />
            ) : (
              <p className="text-gray-500 text-sm">Sync LeetCode to see breakdown</p>
            )}
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="text-brand-400" size={20} /> Company Fit
          </h3>
          <div className="h-48">
            {barData ? (
              <Bar data={barData} options={{ plugins: { legend: { display: false } }, scales: { x: { ticks: { color: "#9ca3af" }, grid: { color: "rgba(255,255,255,0.05)" } }, y: { max: 100, ticks: { color: "#9ca3af" }, grid: { color: "rgba(255,255,255,0.05)" } } } }} />
            ) : (
              <p className="text-gray-500 text-sm flex items-center justify-center h-full">Sync profiles to calculate company fit</p>
            )}
          </div>
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="text-amber-400" size={20} /> Achievements
          </h3>
          <div className="flex flex-wrap gap-3">
            {achievements.map((a) => (
              <span key={a.badge} className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-sm font-semibold">
                {BADGE_LABELS[a.badge] ?? a.badge}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, glow }: { title: string; value: string | number; icon: React.ReactNode; glow: string }) {
  return (
    <div className={`glass-panel p-5 flex flex-col group transition-all duration-300 ${glow} hover:-translate-y-0.5`}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-gray-400 font-medium uppercase text-xs">{title}</h4>
        <div className="p-2 bg-dark-100 border border-white/5 rounded-lg">{icon}</div>
      </div>
      <div className="text-3xl font-extrabold text-white tracking-tight">{value}</div>
    </div>
  );
}
