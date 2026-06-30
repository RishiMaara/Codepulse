import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import { Code2, GitBranch, ChevronLeft, Target } from "lucide-react";

export default function PublicProfile() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/user/u/${username}`);
        setProfileData(data.profile);
      } catch (err: any) {
        setError("Profile not found or is private.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (isLoading) {
    return <div className="h-screen bg-dark-200 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div></div>;
  }

  if (error || !profileData) {
    return (
      <div className="h-screen bg-dark-200 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-rose-500/10 blur-[120px] pointer-events-none z-0" />
        <div className="relative z-10 glass-panel p-10 flex flex-col items-center text-center max-w-md w-full">
          <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/20">
            <span className="text-3xl">😕</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{error}</h2>
          <p className="text-gray-400 mb-8">The user might not exist or hasn't made their profile public yet.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 hover:border-white/20">
            <ChevronLeft size={20} /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { user, leetcode, github } = profileData;

  return (
    <div className="min-h-screen bg-dark-200 text-white p-4 md:p-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-brand-600/20 blur-[150px] pointer-events-none z-0 animate-pulse-slow" />
      <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none z-0 animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10 animate-fade-in">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/5 hover:bg-white/10">
            <ChevronLeft size={20} /> Dashboard
          </Link>
        </div>

        <div className="glass-panel p-8 md:p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-500/20 to-purple-600/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
          
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start relative z-10">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-6xl font-black border border-white/20 shadow-[0_0_30px_rgba(99,102,241,0.4)] animate-float">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full pt-2">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{user?.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-400 font-medium">
                {user?.leetcodeUsername && (
                  <a href={`https://leetcode.com/${user.leetcodeUsername}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-dark-100 rounded-xl border border-white/5 hover:bg-brand-500/10 hover:border-brand-500/30 hover:text-brand-400 transition-all shadow-inner">
                    <Code2 size={18} /> @{user.leetcodeUsername}
                  </a>
                )}
                {user?.githubUsername && (
                  <a href={`https://github.com/${user.githubUsername}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-dark-100 rounded-xl border border-white/5 hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-400 transition-all shadow-inner">
                    <GitBranch size={18} /> @{user.githubUsername}
                  </a>
                )}
              </div>
            </div>

            <div className="text-center bg-dark-100/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl min-w-[180px] shadow-xl relative overflow-hidden group/score">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 opacity-0 group-hover/score:opacity-100 transition-opacity"></div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target size={16} className="text-brand-400" />
                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Developer Score</div>
              </div>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-400 to-purple-400 drop-shadow-lg">
                {user?.developerScore || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-8 group transition-all hover:border-white/20">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
              <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
                <Code2 className="text-amber-400" size={24} />
              </div>
              LeetCode Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-100 p-5 rounded-2xl border border-white/5 shadow-inner">
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Total Solved</div>
                <div className="text-4xl font-black text-white">{leetcode?.totalSolved || 0}</div>
              </div>
              <div className="bg-dark-100 p-5 rounded-2xl border border-white/5 shadow-inner">
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Contest Rating</div>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">{leetcode?.contestRating || "N/A"}</div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 group transition-all hover:border-white/20">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
              <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                <GitBranch className="text-purple-400" size={24} />
              </div>
              GitHub Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-100 p-5 rounded-2xl border border-white/5 shadow-inner">
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Repositories</div>
                <div className="text-4xl font-black text-white">{github?.repositories || 0}</div>
              </div>
              <div className="bg-dark-100 p-5 rounded-2xl border border-white/5 shadow-inner">
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Commits</div>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">{github?.commits || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
