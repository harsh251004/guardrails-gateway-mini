import { AlertItem, GuardrailBreakdownItem } from "../types";

interface SidebarAnalyticsProps {
  guardrails: GuardrailBreakdownItem[];
  alerts: AlertItem[];
}

const severityClass = {
  Medium: "text-sky-300 border-sky-500/30 bg-sky-500/10",
  High: "text-amber-300 border-amber-500/30 bg-amber-500/10",
  Critical: "text-rose-300 border-rose-500/30 bg-rose-500/10",
};

export const SidebarAnalytics = ({ guardrails, alerts }: SidebarAnalyticsProps) => {
  const max = Math.max(...guardrails.map((item) => item.count), 1);

  return (
    <aside className="space-y-4">
      <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <h3 className="text-sm font-semibold text-slate-100">Top Triggered Guardrails</h3>
        <p className="mb-4 text-xs text-slate-400">Breakdown of recurring interventions</p>

        <div className="space-y-3">
          {guardrails.length === 0 ? (
            <p className="text-sm text-slate-400">No guardrail triggers in this window.</p>
          ) : (
            guardrails.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                  <span>{item.label}</span>
                  <span>{item.count}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
                    style={{ width: `${(item.count / max) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <h3 className="text-sm font-semibold text-slate-100">Recent Alerts</h3>
        <p className="mb-3 text-xs text-slate-400">Immediate actions requiring attention</p>

        <div className="space-y-2">
          {alerts.length === 0 ? (
            <p className="text-sm text-slate-400">No urgent alerts in the current stream.</p>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] ${severityClass[alert.severity]}`}>
                    {alert.severity}
                  </span>
                  <span className="text-[10px] text-slate-500">{alert.createdAt}</span>
                </div>
                <p className="text-xs text-slate-300">{alert.message}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </aside>
  );
};
