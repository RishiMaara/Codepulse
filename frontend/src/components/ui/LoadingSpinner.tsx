import { cn } from "../../lib/utils";

export default function LoadingSpinner({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
      </div>
      {label && <p className="text-sm text-gray-400 font-medium">{label}</p>}
    </div>
  );
}
