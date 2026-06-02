import { Ban, CheckCheck, ShieldBan, X } from "lucide-react";
import { ApiLog } from "../types";

interface DetailDrawerProps {
  row: ApiLog | null;
  onClose: () => void;
  onAction: (action: "override" | "block" | "dismiss", row: ApiLog) => void;
}

export const DetailDrawer = ({ row, onClose, onAction }: DetailDrawerProps) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/45 transition ${row ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-xl transform border-l border-slate-800 bg-slate-900 p-5 shadow-2xl transition-transform duration-300 ${
          row ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {!row ? null : (
          <>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-slate-100">Request Deep Dive</h3>
                <p className="text-xs text-slate-400">
                  {row.timestamp} • {row.endpoint} • {row.model}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-md border border-slate-700 bg-slate-800 p-1.5 text-slate-400 transition hover:text-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pb-8 pr-1">
              <section className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                <h4 className="mb-2 text-xs uppercase tracking-wide text-slate-400">Prompt Input</h4>
                <p className="whitespace-pre-wrap break-words text-sm text-slate-200">{row.promptInput}</p>
              </section>

              <section className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                <h4 className="mb-2 text-xs uppercase tracking-wide text-slate-400">Safe Sanitized Output</h4>
                <p className="whitespace-pre-wrap break-words text-sm text-slate-200">{row.sanitizedOutput}</p>
              </section>

              <section className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                <h4 className="mb-2 text-xs uppercase tracking-wide text-slate-400">Guardrail JSON Payload</h4>
                <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded bg-slate-950 p-3 text-xs text-cyan-300">
                  {JSON.stringify(row.guardrailPayload, null, 2)}
                </pre>
              </section>

              <section className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  onClick={() => onAction("override", row)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/20"
                >
                  <CheckCheck size={15} />
                  Approve Override
                </button>
                <button
                  onClick={() => onAction("block", row)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/20"
                >
                  <ShieldBan size={15} />
                  Block IP/API Key
                </button>
                <button
                  onClick={() => onAction("dismiss", row)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
                >
                  <Ban size={15} />
                  Dismiss Alert
                </button>
              </section>
            </div>
          </>
        )}
      </aside>
    </>
  );
};
