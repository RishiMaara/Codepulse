import { useEffect } from "react";
import { useAIStore } from "../../store/ai.store";
import { BrainCircuit, Target, AlertTriangle, BookOpen, CheckCircle, RefreshCw } from "lucide-react";
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
    fetchInsights 
  } = useAIStore();

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  if (isLoading && !readiness) {
    return <LoadingSpinner className="h-64" label="Analyzing your profile..." />;
  }

  if (error) {
    return <div className="text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-500/20 glass-panel">{error}</div>;
  }

  return (
    <div className="space-y-8 relative z-10 animate-fade-in">
      {/* Background Orbs */}
      <div className="absolute top-[-5%] left-[-2%] w-[30%] h-[30%] rounded-full bg-brand-600/10 blur-[120px] pointer-events-none z-0" />
      
      {/* Header */}
      <div className="glass-panel p-8 md:p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-500/20 to-purple-600/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 flex items-center gap-4 tracking-tight">
              <div className="p-3 bg-brand-500/20 rounded-2xl border border-brand-500/30 shadow-[0_0_20px_rgba(99,102,241,0.3)] animate-pulse-slow">
                <BrainCircuit className="text-brand-400" size={32} />
              </div>
              AI Interview Coach
            </h2>
            <p className="text-gray-400 text-lg">Personalized insights based on your problem-solving history.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={fetchInsights}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-brand-500/20 transition-all disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
            <div className="text-center bg-dark-100/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl min-w-[180px] shadow-xl group/score transition-all hover:border-brand-500/30">
              <div className="text-xs text-brand-400 font-bold uppercase tracking-widest mb-2">Readiness Score</div>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
                {readiness?.score || 0}<span className="text-2xl text-brand-500/50 font-bold">/100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Strengths & Weaknesses */}
        <div className="space-y-8 lg:col-span-1">
          <div className="glass-panel p-6 group transition-all hover:border-rose-500/30">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <div className="p-2.5 bg-rose-500/10 rounded-xl border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                <AlertTriangle className="text-rose-400" size={20} />
              </div>
              Weak Areas
            </h3>
            <div className="space-y-3">
              {weakTopics?.length ? weakTopics.map(([topic, count], idx) => (
                <div key={idx} className="flex justify-between items-center bg-dark-100 p-3.5 rounded-xl border border-white/5 hover:border-rose-500/30 transition-colors shadow-inner">
                  <span className="font-medium text-gray-300">{topic}</span>
                  <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">{count} solves</span>
                </div>
              )) : <div className="text-gray-500 text-sm font-medium p-4 text-center bg-dark-100 rounded-xl border border-white/5">Not enough data.</div>}
            </div>
          </div>

          <div className="glass-panel p-6 group transition-all hover:border-emerald-500/30">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
                <CheckCircle className="text-emerald-400" size={20} />
              </div>
              Strongest Topics
            </h3>
            <div className="space-y-3">
              {strongTopics?.length ? strongTopics.map(([topic, count], idx) => (
                <div key={idx} className="flex justify-between items-center bg-dark-100 p-3.5 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-colors shadow-inner">
                  <span className="font-medium text-gray-300">{topic}</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">{count} solves</span>
                </div>
              )) : <div className="text-gray-500 text-sm font-medium p-4 text-center bg-dark-100 rounded-xl border border-white/5">Not enough data.</div>}
            </div>
          </div>
        </div>

        {/* Middle/Right Column: Roadmap & Recommendations */}
        <div className="space-y-8 lg:col-span-2">
          
          {/* Smart Recommendations */}
          <div className="glass-panel p-8 group transition-all hover:border-white/20">
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-3 text-white">
              <div className="p-2.5 bg-brand-500/10 rounded-xl border border-brand-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                <Target className="text-brand-400" size={24} />
              </div>
              Targeted Practice
            </h3>
            <p className="text-gray-400 mb-8 ml-14">AI-selected problems targeting your weak areas.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations?.length ? recommendations.map((q, idx) => (
                <a 
                  key={idx} 
                  href={`https://leetcode.com/problemset/all/?search=${encodeURIComponent(q)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 bg-dark-100 p-4 rounded-xl border border-white/5 hover:border-brand-500/50 hover:bg-brand-500/5 transition-all cursor-pointer shadow-inner group/item hover:-translate-y-0.5"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-sm group-hover/item:bg-brand-500 group-hover/item:text-white transition-all shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                    {idx + 1}
                  </div>
                  <span className="font-semibold text-gray-200 group-hover/item:text-brand-300 transition-colors">{q}</span>
                </a>
              )) : <div className="col-span-2 text-gray-500 text-sm font-medium p-6 text-center bg-dark-100 rounded-xl border border-white/5">Solve more problems to unlock AI recommendations.</div>}
            </div>
          </div>

          {/* Dynamic Roadmap */}
          <div className="glass-panel p-8 group transition-all hover:border-purple-500/20">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
              <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                <BookOpen className="text-purple-400" size={24} />
              </div>
              Personalized Roadmap
            </h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-500/50 before:via-purple-500/30 before:to-transparent">
              {roadmap?.length ? roadmap.map((step, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-brand-500 bg-dark-200 text-brand-400 font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110">
                    W{step.week}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-dark-100 p-6 rounded-2xl border border-white/10 shadow-xl group-hover:border-brand-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-white text-lg tracking-wide">{step.focus}</h4>
                      <span className="text-xs font-bold text-brand-400 bg-brand-500/10 px-3 py-1.5 rounded-lg border border-brand-500/20 shadow-inner">{step.problems} problems</span>
                    </div>
                    {step.tip && <p className="text-sm text-gray-400 font-medium leading-relaxed">{step.tip}</p>}
                  </div>
                </div>
              )) : <div className="text-gray-500 text-sm font-medium p-6 text-center bg-dark-100 rounded-xl border border-white/5 ml-12 md:ml-0">Roadmap will be generated after tracking your problem history.</div>}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
