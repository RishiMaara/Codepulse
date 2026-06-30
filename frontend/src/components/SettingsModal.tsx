import { useState, useEffect } from "react";
import { useAuthStore } from "../store/auth.store";
import { useToastStore } from "../store/toast.store";
import { X, Save, User, GitBranch, Code2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, updateProfile } = useAuthStore();
  const toast = useToastStore((s) => s.add);
  const [name, setName] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [github, setGithub] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setLeetcode(user.leetcodeUsername || "");
      setGithub(user.githubUsername || "");
    }
  }, [user, isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      await updateProfile({
        name,
        leetcodeUsername: leetcode,
        githubUsername: github,
      });
      setSuccess("Profile updated! Syncing your data...");
      toast("Profile saved — syncing your platforms", "success");
      setTimeout(() => {
        setSuccess("");
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-200/90 backdrop-blur-md transition-opacity duration-300">
      {/* Modal Container */}
      <div 
        className="glass-panel relative w-full max-w-lg overflow-hidden neon-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-2xl z-0">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        {/* Header */}
        <div className="relative z-10 flex justify-between items-start p-8 border-b border-white/5 bg-dark-100/50">
          <div>
            <h2 className="text-3xl font-bold text-gradient tracking-tight">
              Profile Settings
            </h2>
            <p className="text-sm text-gray-400 mt-2 font-medium">Manage your identity and connected platforms.</p>
          </div>
          <button 
            onClick={onClose} 
            className="group p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 text-gray-400 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            aria-label="Close modal"
          >
            <X size={22} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 p-8">
          {/* Status Messages */}
          <div className="min-h-[44px] mb-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm rounded-xl font-medium">
                <AlertCircle size={18} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-xl font-medium">
                <CheckCircle2 size={18} className="shrink-0" />
                <p>{success}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Group: Full Name */}
            <div className="group space-y-2">
              <label className="text-sm font-semibold text-gray-300 group-focus-within:text-brand-400 transition-colors flex items-center gap-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-brand-400 transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-dark-200/80 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:bg-dark-100 transition-all shadow-inner font-medium text-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Input Group: LeetCode */}
              <div className="group space-y-2">
                <label className="text-sm font-semibold text-gray-300 group-focus-within:text-amber-400 transition-colors flex items-center gap-2">
                  LeetCode Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-amber-400 transition-colors">
                    <Code2 size={20} />
                  </div>
                  <input
                    type="text"
                    value={leetcode}
                    onChange={(e) => setLeetcode(e.target.value)}
                    placeholder="e.g. neetcode"
                    className="w-full bg-dark-200/80 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:bg-dark-100 transition-all shadow-inner font-medium text-lg"
                  />
                </div>
              </div>

              {/* Input Group: GitHub */}
              <div className="group space-y-2">
                <label className="text-sm font-semibold text-gray-300 group-focus-within:text-purple-400 transition-colors flex items-center gap-2">
                  GitHub Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                    <GitBranch size={20} />
                  </div>
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="e.g. torvalds"
                    className="w-full bg-dark-200/80 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:bg-dark-100 transition-all shadow-inner font-medium text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 mt-4 border-t border-white/5 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-300 flex-1 sm:flex-none sm:w-32 text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold rounded-xl hover-glow transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 text-lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
