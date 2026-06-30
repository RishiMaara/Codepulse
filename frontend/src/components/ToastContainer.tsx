import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { useToastStore } from "../store/toast.store";
import { cn } from "../lib/utils";

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  error: "border-rose-500/30 bg-rose-500/10 text-rose-400",
  info: "border-brand-500/30 bg-brand-500/10 text-brand-400",
};

export default function ToastContainer() {
  const { toasts, remove } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-center gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl animate-fade-in",
              styles[toast.type]
            )}
          >
            <Icon size={20} className="shrink-0" />
            <p className="text-sm font-medium flex-1 text-white">{toast.message}</p>
            <button onClick={() => remove(toast.id)} className="opacity-60 hover:opacity-100 transition-opacity">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
