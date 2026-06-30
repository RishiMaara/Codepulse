import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLeaderboardStore } from "../../store/leaderboard.store";
import { useAuthStore } from "../../store/auth.store";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import { Trophy, Medal, Crown, Code2, GitBranch } from "lucide-react";
import { cn } from "../../lib/utils";

const rankStyles = [
  { icon: Crown, bg: "from-amber-500/20 to-yellow-600/20", border: "border-amber-500/30", text: "text-amber-400" },
  { icon: Medal, bg: "from-gray-400/20 to-gray-500/20", border: "border-gray-400/30", text: "text-gray-300" },
  { icon: Medal, bg: "from-orange-600/20 to-orange-700/20", border: "border-orange-600/30", text: "text-orange-400" },
];

export default function Leaderboard() {
  const { users, isLoading, error, fetchLeaderboard } = useLeaderboardStore();
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  if (isLoading) {
    return <LoadingSpinner className="h-64" label="Loading leaderboard..." />;
  }

  if (error) {
    return (
      <div className="text-rose-400 bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 glass-panel">
        {error}
      </div>
    );
  }

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
          <Trophy className="text-amber-400" size={32} />
          Leaderboard
        </h2>
        <p className="text-gray-400">Top developers ranked by Developer Score.</p>
      </div>

      {users.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No rankings yet"
          description="Connect your profiles and sync data to appear on the leaderboard."
        />
      ) : (
        <>
          {/* Podium */}
          {top3.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {[1, 0, 2].map((idx) => {
                const u = top3[idx];
                if (!u) return <div key={idx} />;
                const style = rankStyles[idx];
                const RankIcon = style.icon;
                const isMe = u._id === currentUser?._id;
                return (
                  <div
                    key={u._id}
                    className={cn(
                      "glass-panel p-6 text-center transition-all hover:-translate-y-1",
                      idx === 0 ? "md:order-2 md:-mt-4" : idx === 1 ? "md:order-1" : "md:order-3",
                      isMe && "ring-2 ring-brand-500/50"
                    )}
                  >
                    <div className={cn("w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br flex items-center justify-center mb-3 border", style.bg, style.border)}>
                      <RankIcon className={style.text} size={28} />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">#{idx + 1}</div>
                    <h3 className="font-bold text-lg text-white truncate">{u.name}</h3>
                    <div className={cn("text-3xl font-black mt-2", style.text)}>{u.developerScore}</div>
                    <div className="text-xs text-gray-500 mt-1">Developer Score</div>
                    {isMe && <span className="inline-block mt-2 text-xs text-brand-400 font-semibold">You</span>}
                  </div>
                );
              })}
            </div>
          )}

          {/* Full list */}
          <div className="glass-panel overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-xs font-bold uppercase tracking-wider text-gray-500">
              <div className="col-span-1">Rank</div>
              <div className="col-span-5">Developer</div>
              <div className="col-span-3">Profiles</div>
              <div className="col-span-3 text-right">Score</div>
            </div>
            {rest.map((u, i) => {
              const rank = i + 4;
              const isMe = u._id === currentUser?._id;
              return (
                <div
                  key={u._id}
                  className={cn(
                    "grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 items-center hover:bg-white/5 transition-colors",
                    isMe && "bg-brand-500/5"
                  )}
                >
                  <div className="col-span-1 font-bold text-gray-400">#{rank}</div>
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-sm font-bold shrink-0">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-white truncate">{u.name}</div>
                      {isMe && <span className="text-xs text-brand-400">You</span>}
                    </div>
                  </div>
                  <div className="col-span-3 flex gap-2">
                    {u.leetcodeUsername && (
                      <a href={`https://leetcode.com/${u.leetcodeUsername}`} target="_blank" rel="noreferrer" className="text-amber-400 hover:text-amber-300">
                        <Code2 size={16} />
                      </a>
                    )}
                    {u.githubUsername && (
                      <a href={`https://github.com/${u.githubUsername}`} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300">
                        <GitBranch size={16} />
                      </a>
                    )}
                  </div>
                  <div className="col-span-3 text-right font-black text-xl text-gradient">{u.developerScore}</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <p className="text-center text-sm text-gray-500">
        Want to climb the ranks?{" "}
        <Link to="/dashboard" className="text-brand-400 hover:underline">Sync your profiles</Link>
      </p>
    </div>
  );
}
