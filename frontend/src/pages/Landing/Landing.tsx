import { Link } from "react-router-dom";
import {
  Brain, ArrowRight, BarChart3, Target, Zap, Users,
  Code2, GitBranch, Sparkles, ChevronRight, Star
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Unified Analytics",
    desc: "Sync LeetCode & GitHub into one live dashboard with readiness scores.",
    iconClass: "text-brand-400",
    boxClass: "bg-brand-500/10 border-brand-500/20",
  },
  {
    icon: Brain,
    title: "AI Interview Coach",
    desc: "Personalized weak-topic analysis, roadmaps, and problem recommendations.",
    iconClass: "text-purple-400",
    boxClass: "bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: Target,
    title: "Company Fit Scores",
    desc: "See how ready you are for FAANG, startups, and top tech companies.",
    iconClass: "text-emerald-400",
    boxClass: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Zap,
    title: "Mock Interviews",
    desc: "Practice with AI-curated questions targeting your exact weak areas.",
    iconClass: "text-amber-400",
    boxClass: "bg-amber-500/10 border-amber-500/20",
  },
];

const stats = [
  { value: "10K+", label: "Problems Tracked" },
  { value: "500+", label: "Active Developers" },
  { value: "95%", label: "User Satisfaction" },
  { value: "24/7", label: "AI Coaching" },
];

const testimonials = [
  { name: "Priya S.", role: "SWE @ Google", text: "CodePulse helped me identify my DP weakness and land my dream offer in 8 weeks." },
  { name: "Marcus T.", role: "New Grad", text: "The company fit scores kept me motivated. I knew exactly what to work on each week." },
  { name: "Alex K.", role: "Career Switcher", text: "Syncing GitHub + LeetCode in one place changed how I prepared for interviews." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-200 text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-dark-200/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <Brain size={18} />
            </div>
            <span className="text-xl font-extrabold">Code<span className="text-gradient">Pulse</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Stories</a>
            <a href="#cta" className="hover:text-white transition-colors">Get Started</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link
              to="/login"
              className="text-sm font-semibold px-5 py-2.5 bg-gradient-to-r from-brand-600 to-purple-600 rounded-xl hover:from-brand-500 hover:to-purple-500 transition-all hover-glow"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="absolute top-0 left-1/4 w-[50%] h-[60%] bg-brand-600/15 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8 animate-fade-in">
              <Sparkles size={16} />
              AI-Powered Interview Preparation Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
              Ace Your Next{" "}
              <span className="text-gradient">Tech Interview</span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect your coding profiles, get AI-driven insights, and follow a personalized roadmap to land your dream job.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/login"
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-600 to-purple-600 rounded-2xl font-bold text-lg hover:from-brand-500 hover:to-purple-500 transition-all hover-glow hover:-translate-y-0.5"
              >
                Get Started Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all"
              >
                See How It Works
                <ChevronRight size={20} />
              </a>
            </div>

            {/* Live preview card */}
            <div className="glass-panel p-1 max-w-3xl mx-auto animate-float">
              <div className="bg-dark-100 rounded-xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs text-gray-500 font-mono">codepulse.app/dashboard</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Developer Score", value: "78", color: "text-brand-400" },
                    { label: "Readiness", value: "72%", color: "text-emerald-400" },
                    { label: "Problems", value: "247", color: "text-amber-400" },
                    { label: "Streak", value: "14d", color: "text-purple-400" },
                  ].map((s) => (
                    <div key={s.label} className="bg-dark-200/80 rounded-xl p-4 border border-white/5">
                      <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                      <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/5 bg-dark-100/50 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-gradient mb-1">{s.value}</div>
              <div className="text-sm text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">Everything You Need to <span className="text-gradient">Succeed</span></h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">One platform. All your prep data. AI that actually helps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="glass-panel p-8 group hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform ${f.boxClass}`}>
                  <f.icon className={f.iconClass} size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-8 flex items-center gap-6">
              <Code2 className="text-amber-400 shrink-0" size={40} />
              <div>
                <h3 className="font-bold text-lg mb-1">LeetCode Sync</h3>
                <p className="text-gray-400 text-sm">Auto-import problems, streaks, contest ratings, and submission history.</p>
              </div>
            </div>
            <div className="glass-panel p-8 flex items-center gap-6">
              <GitBranch className="text-purple-400 shrink-0" size={40} />
              <div>
                <h3 className="font-bold text-lg mb-1">GitHub Integration</h3>
                <p className="text-gray-400 text-sm">Track repos, commits, languages, and open-source contributions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-dark-100/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">Loved by <span className="text-gradient">Developers</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-panel p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{t.text}"</p>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center glass-panel p-12 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-purple-600/10 pointer-events-none" />
          <Users className="mx-auto text-brand-400 mb-6" size={48} />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 relative z-10">Ready to Level Up?</h2>
          <p className="text-gray-400 text-lg mb-8 relative z-10">Join developers who are preparing smarter, not harder.</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-600 to-purple-600 rounded-2xl font-bold text-lg hover:from-brand-500 hover:to-purple-500 transition-all hover-glow relative z-10"
          >
            Create Free Account <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 px-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} CodePulse. Built for developers, by developers.
      </footer>
    </div>
  );
}
