import { useEffect } from "react";
import { useInterviewStore } from "../../store/interview.store";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";
import {
  Mic, ChevronLeft, ChevronRight, Lightbulb, CheckCircle2,
  RotateCcw, Play, Eye, EyeOff
} from "lucide-react";
import { cn } from "../../lib/utils";

const difficultyColors: Record<string, string> = {
  Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Hard: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  Behavioral: "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

export default function MockInterview() {
  const {
    questions, currentIndex, showHint, completed, isLoading, error,
    fetchQuestions, nextQuestion, prevQuestion, toggleHint, markComplete, reset
  } = useInterviewStore();

  useEffect(() => {
    if (!questions.length) fetchQuestions();
  }, []);

  if (isLoading) {
    return <LoadingSpinner className="h-64" label="Preparing your interview session..." />;
  }

  if (error) {
    return (
      <div className="text-rose-400 bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 glass-panel">
        {error}
      </div>
    );
  }

  if (!questions.length) {
    return (
      <EmptyState
        icon={Mic}
        title="No questions available"
        description="Sync your LeetCode profile first so we can tailor questions to your weak areas."
        action={
          <button onClick={fetchQuestions} className="px-6 py-3 bg-brand-600 hover:bg-brand-500 rounded-xl font-semibold transition-colors">
            Try Again
          </button>
        }
      />
    );
  }

  const current = questions[currentIndex];
  const progress = ((completed.size / questions.length) * 100).toFixed(0);
  const diffStyle = difficultyColors[current.difficulty] ?? difficultyColors.Medium;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2.5 bg-brand-500/10 rounded-xl border border-brand-500/20">
              <Mic className="text-brand-400" size={24} />
            </div>
            Mock Interview
          </h2>
          <p className="text-gray-400 mt-1">Practice questions tailored to your weak topics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { reset(); fetchQuestions(); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium"
          >
            <RotateCcw size={16} /> New Session
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="glass-panel p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Progress</span>
          <span className="text-brand-400 font-semibold">{completed.size}/{questions.length} completed ({progress}%)</span>
        </div>
        <div className="w-full bg-dark-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-600 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => useInterviewStore.setState({ currentIndex: i, showHint: false })}
              className={cn(
                "w-8 h-8 rounded-lg text-xs font-bold transition-all border",
                i === currentIndex
                  ? "bg-brand-500/20 border-brand-500/50 text-brand-400"
                  : completed.has(i)
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-dark-100 border-white/5 text-gray-500 hover:border-white/20"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-panel p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-6 relative z-10">
          <span className="text-sm font-bold text-gray-500">Q{currentIndex + 1}</span>
          <span className={cn("text-xs font-bold px-3 py-1 rounded-lg border", diffStyle)}>
            {current.difficulty}
          </span>
          <span className="text-xs text-gray-500 bg-dark-100 px-3 py-1 rounded-lg border border-white/5">
            {current.topic}
          </span>
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-white leading-relaxed mb-8 relative z-10">
          {current.question}
        </h3>

        {/* Hint */}
        <div className="relative z-10 mb-8">
          <button
            onClick={toggleHint}
            className="flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors mb-3"
          >
            {showHint ? <EyeOff size={16} /> : <Eye size={16} />}
            {showHint ? "Hide Hint" : "Show Hint"}
          </button>
          {showHint && (
            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl animate-fade-in">
              <Lightbulb className="text-amber-400 shrink-0 mt-0.5" size={18} />
              <p className="text-amber-200/90 text-sm leading-relaxed">{current.hint}</p>
            </div>
          )}
        </div>

        {/* Timer simulation */}
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-8 relative z-10">
          <Play size={14} />
          <span>Think out loud — explain your approach before coding.</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 relative z-10">
          <button
            onClick={() => markComplete(currentIndex)}
            disabled={completed.has(currentIndex)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all",
              completed.has(currentIndex)
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-default"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            )}
          >
            <CheckCircle2 size={18} />
            {completed.has(currentIndex) ? "Completed" : "Mark as Done"}
          </button>
          <div className="flex gap-3">
            <button
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-30"
            >
              <ChevronLeft size={18} /> Prev
            </button>
            <button
              onClick={nextQuestion}
              disabled={currentIndex === questions.length - 1}
              className="flex items-center gap-1 px-5 py-3.5 bg-brand-600 hover:bg-brand-500 rounded-xl font-semibold transition-colors disabled:opacity-30"
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
