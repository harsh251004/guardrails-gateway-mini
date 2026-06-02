import { AlertTriangle, Clock3, ShieldAlert, TrendingUp } from "lucide-react";
import { DashboardMetrics } from "../types";

interface MetricsBarProps {
  metrics: DashboardMetrics;
}

const metricCardClass = "rounded-xl border border-slate-800 bg-slate-900/50 p-4";

export const MetricsBar = ({ metrics }: MetricsBarProps) => {
  const interventionColor =
    metrics.interventionRate >= 4 ? "text-amber-300 border-amber-500/30 bg-amber-500/10" : "text-sky-300 border-sky-500/30 bg-sky-500/10";

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <article className={metricCardClass}>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total Requests</p>
          <TrendingUp size={16} className="text-emerald-300" />
        </div>
        <p className="text-2xl font-semibold text-slate-100">{metrics.totalRequests.toLocaleString()}</p>
        <p className="mt-2 text-xs text-emerald-300">+12% vs previous window</p>
      </article>

      <article className={metricCardClass}>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-slate-400">Intervention Rate</p>
          <AlertTriangle size={16} className="text-amber-300" />
        </div>
        <div className={`inline-flex rounded-md border px-2 py-1 text-lg font-semibold ${interventionColor}`}>
          {metrics.interventionRate}%
        </div>
        <p className="mt-2 text-xs text-slate-400">Escalates when safety actions increase</p>
      </article>

      <article className={metricCardClass}>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-slate-400">Avg Guardrail Latency</p>
          <Clock3 size={16} className="text-cyan-300" />
        </div>
        <p className="text-2xl font-semibold text-slate-100">{metrics.avgLatency}ms</p>
        <p className="mt-2 text-xs text-slate-400">Inference + policy evaluation overhead</p>
      </article>

      <article className={metricCardClass}>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-slate-400">Active Policy Violations</p>
          <ShieldAlert size={16} className="text-rose-300" />
        </div>
        <p className="text-2xl font-semibold text-rose-300">{metrics.activePolicyViolations}</p>
        <p className="mt-2 text-xs text-slate-400">Critical blocks in current stream</p>
      </article>
    </section>
  );
};
