import { useEffect, useMemo, useState } from "react";
import { ActivityTable } from "./components/ActivityTable";
import { DetailDrawer } from "./components/DetailDrawer";
import { MetricsBar } from "./components/MetricsBar";
import { Navbar } from "./components/Navbar";
import { SidebarAnalytics } from "./components/SidebarAnalytics";
import { ToastStack } from "./components/ToastStack";
import { createLogEntry, createSeedLogs, deriveAlerts, deriveGuardrailBreakdown, deriveMetrics } from "./data/mock";
import { ActionTaken, ApiLog, Environment, Severity, ToastMessage } from "./types";

const MAX_ROWS = 20;

function App() {
  const [environment, setEnvironment] = useState<Environment>("Production");
  const [logs, setLogs] = useState<ApiLog[]>(() => createSeedLogs(MAX_ROWS));
  const [query, setQuery] = useState("");
  const [filterAction, setFilterAction] = useState<ActionTaken | "All">("All");
  const [filterSeverity, setFilterSeverity] = useState<Severity | "All">("All");
  const [selectedLog, setSelectedLog] = useState<ApiLog | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    let timeoutId: number;

    const enqueue = () => {
      timeoutId = window.setTimeout(() => {
        setLogs((previous) => [createLogEntry(), ...previous].slice(0, MAX_ROWS));
        enqueue();
      }, 3000 + Math.floor(Math.random() * 2000));
    };

    enqueue();
    return () => window.clearTimeout(timeoutId);
  }, []);

  const metrics = useMemo(() => deriveMetrics(logs), [logs]);
  const guardrailBreakdown = useMemo(() => deriveGuardrailBreakdown(logs), [logs]);
  const alerts = useMemo(() => deriveAlerts(logs), [logs]);

  const filteredLogs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return logs.filter((log) => {
      const matchesQuery =
        !normalized ||
        [log.endpoint, log.model, log.inputSnippet, log.triggeredGuardrail].some((field) =>
          field.toLowerCase().includes(normalized),
        );

      const matchesAction = filterAction === "All" || log.actionTaken === filterAction;
      const matchesSeverity = filterSeverity === "All" || log.severity === filterSeverity;

      return matchesQuery && matchesAction && matchesSeverity;
    });
  }, [logs, query, filterAction, filterSeverity]);

  const addToast = (title: string, description: string) => {
    const toast: ToastMessage = {
      id: crypto.randomUUID(),
      title,
      description,
    };
    setToasts((previous) => [...previous, toast]);
    window.setTimeout(() => {
      setToasts((previous) => previous.filter((item) => item.id !== toast.id));
    }, 2600);
  };

  const handleDrawerAction = (action: "override" | "block" | "dismiss", row: ApiLog) => {
    if (action === "override") {
      addToast("Override Approved", `Request ${row.id.slice(0, 8)} was manually approved.`);
      return;
    }
    if (action === "block") {
      addToast("IP/API Key Blocked", `${row.sourceIp} and ${row.apiKey} were blocklisted.`);
      return;
    }
    addToast("Alert Dismissed", `Critical alert for ${row.model} has been dismissed.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar environment={environment} onEnvironmentChange={setEnvironment} />

      <main className="mx-auto grid max-w-[1500px] grid-cols-1 gap-4 px-4 py-4 sm:px-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <MetricsBar metrics={metrics} />
          <ActivityTable
            rows={filteredLogs}
            query={query}
            filterAction={filterAction}
            filterSeverity={filterSeverity}
            onQueryChange={setQuery}
            onActionChange={setFilterAction}
            onSeverityChange={setFilterSeverity}
            onSelectRow={setSelectedLog}
          />
        </div>

        <SidebarAnalytics guardrails={guardrailBreakdown} alerts={alerts} />
      </main>

      <DetailDrawer row={selectedLog} onClose={() => setSelectedLog(null)} onAction={handleDrawerAction} />
      <ToastStack toasts={toasts} />
    </div>
  );
}

export default App;
