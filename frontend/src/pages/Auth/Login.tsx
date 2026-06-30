import { useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Brain } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, isRegistering ? name : undefined);
      navigate("/dashboard");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string }; status?: number } };
      setError(axiosErr.response?.data?.message || (err instanceof Error ? err.message : "An error occurred"));
    }
  };

  return (
    <div className="min-h-screen bg-dark-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-600/20 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[150px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-md glass-panel p-10 relative z-10 animate-fade-in">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)] border border-white/20 animate-float">
            <Brain size={48} className="text-white" />
          </div>
        </div>

        <div className="mt-12 text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400 mb-2 tracking-tight">
            CodePulse
          </h1>
          <p className="text-gray-400 font-medium">
            {isRegistering ? "Create your account to start improving." : "Welcome back to your AI Interview Coach."}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm text-center font-medium shadow-[0_0_15px_rgba(244,63,94,0.1)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegistering && (
            <div className="group">
              <label className="block text-sm font-semibold text-gray-300 mb-2 group-focus-within:text-brand-400 transition-colors">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-3.5 bg-dark-100/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-white placeholder-gray-500 outline-none transition-all shadow-inner"
                placeholder="John Doe"
              />
            </div>
          )}
          
          <div className="group">
            <label className="block text-sm font-semibold text-gray-300 mb-2 group-focus-within:text-brand-400 transition-colors">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 bg-dark-100/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-white placeholder-gray-500 outline-none transition-all shadow-inner"
              placeholder="john@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-4 mt-2 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : isRegistering ? (
              <><UserPlus size={20} /> Create Account</>
            ) : (
              <><LogIn size={20} /> Sign In</>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors hover:underline underline-offset-4"
          >
            {isRegistering ? "Already have an account? Sign in" : "Need an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}
