import { CheckCircle2 } from "lucide-react";
import { ToastMessage } from "../types";

interface ToastStackProps {
  toasts: ToastMessage[];
}

export const ToastStack = ({ toasts }: ToastStackProps) => {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex max-w-sm items-start gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 shadow-xl"
        >
          <CheckCircle2 size={16} className="mt-0.5 text-emerald-300" />
          <div>
            <p className="text-sm font-medium text-slate-100">{toast.title}</p>
            <p className="text-xs text-slate-400">{toast.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
