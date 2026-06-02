import { Activity, ChevronDown, ShieldCheck } from "lucide-react";
import { Environment } from "../types";

interface NavbarProps {
  environment: Environment;
  onEnvironmentChange: (env: Environment) => void;
}

export const Navbar = ({ environment, onEnvironmentChange }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-emerald-300">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100 sm:text-base">Guardrails Gateway</p>
            <p className="text-xs text-slate-400">Policy Intelligence Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="relative">
            <span className="sr-only">Select environment</span>
            <select
              value={environment}
              onChange={(event) => onEnvironmentChange(event.target.value as Environment)}
              className="appearance-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 pr-8 text-sm text-slate-200 outline-none transition focus:border-slate-500"
            >
              <option value="Production">Production</option>
              <option value="Staging">Staging</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-2.5 text-slate-400" size={16} />
          </label>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 sm:flex">
            <Activity className="text-emerald-300" size={15} />
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-emerald-200">System Status: Operational</span>
          </div>
        </div>
      </div>
    </header>
  );
};
