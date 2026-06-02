import { Search } from "lucide-react";
import { ActionTaken, ApiLog, Severity } from "../types";

interface ActivityTableProps {
  rows: ApiLog[];
  query: string;
  filterAction: ActionTaken | "All";
  filterSeverity: Severity | "All";
  onQueryChange: (value: string) => void;
  onActionChange: (value: ActionTaken | "All") => void;
  onSeverityChange: (value: Severity | "All") => void;
  onSelectRow: (row: ApiLog) => void;
}

const actionClass: Record<ActionTaken, string> = {
  Passed: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  Redacted: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  Blocked: "bg-rose-500/10 text-rose-300 border-rose-500/30",
};

const severityClass: Record<Severity, string> = {
  Low: "text-slate-300",
  Medium: "text-sky-300",
  High: "text-amber-300",
  Critical: "text-rose-300",
};

export const ActivityTable = ({
  rows,
  query,
  filterAction,
  filterSeverity,
  onQueryChange,
  onActionChange,
  onSeverityChange,
  onSelectRow,
}: ActivityTableProps) => {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">What&apos;s Been On</h2>
          <p className="text-xs text-slate-400">Live stream of the last 20 API transactions</p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <label className="relative">
            <Search size={15} className="pointer-events-none absolute left-2 top-2.5 text-slate-500" />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search model, endpoint, snippet..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-8 pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-slate-500 sm:w-72"
            />
          </label>

          <select
            value={filterAction}
            onChange={(event) => onActionChange(event.target.value as ActionTaken | "All")}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none focus:border-slate-500"
          >
            <option value="All">All Actions</option>
            <option value="Passed">Passed</option>
            <option value="Redacted">Redacted</option>
            <option value="Blocked">Blocked</option>
          </select>

          <select
            value={filterSeverity}
            onChange={(event) => onSeverityChange(event.target.value as Severity | "All")}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none focus:border-slate-500"
          >
            <option value="All">All Severities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-2 py-2">Timestamp</th>
              <th className="px-2 py-2">Endpoint / Model</th>
              <th className="px-2 py-2">Input Snippet</th>
              <th className="px-2 py-2">Triggered Guardrail</th>
              <th className="px-2 py-2">Action Taken</th>
              <th className="px-2 py-2">Latency</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onSelectRow(row)}
                className="cursor-pointer border-b border-slate-800/70 text-slate-200 transition hover:bg-slate-800/40"
              >
                <td className="px-2 py-3 font-mono text-xs text-slate-300">{row.timestamp}</td>
                <td className="px-2 py-3">
                  <p className="font-medium text-slate-100">{row.endpoint}</p>
                  <p className="text-xs text-slate-400">{row.model}</p>
                </td>
                <td className="max-w-[320px] px-2 py-3">
                  <p className="truncate text-slate-300" title={row.inputSnippet}>
                    {row.inputSnippet}
                  </p>
                </td>
                <td className="px-2 py-3">
                  <div className="space-y-0.5">
                    <p className="font-medium text-slate-100">{row.triggeredGuardrail}</p>
                    <p className={`text-xs ${severityClass[row.severity]}`}>{row.severity}</p>
                  </div>
                </td>
                <td className="px-2 py-3">
                  <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${actionClass[row.actionTaken]}`}>
                    {row.actionTaken}
                  </span>
                </td>
                <td className="px-2 py-3 text-slate-300">{row.latencyMs}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
