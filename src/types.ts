export type Environment = "Production" | "Staging";

export type GuardrailType = "PII" | "Prompt Injection" | "Toxicity" | "Jailbreak" | "None";

export type ActionTaken = "Passed" | "Redacted" | "Blocked";

export type Severity = "Low" | "Medium" | "High" | "Critical";

export interface GuardrailPayload {
  toxicityScore: number;
  piiDetected: boolean;
  promptInjectionRisk: number;
  policyIds: string[];
  categories: string[];
}

export interface ApiLog {
  id: string;
  timestamp: string;
  endpoint: string;
  model: string;
  inputSnippet: string;
  promptInput: string;
  sanitizedOutput: string;
  triggeredGuardrail: GuardrailType;
  actionTaken: ActionTaken;
  severity: Severity;
  latencyMs: number;
  guardrailPayload: GuardrailPayload;
  sourceIp: string;
  apiKey: string;
}

export interface DashboardMetrics {
  totalRequests: number;
  interventionRate: number;
  avgLatency: number;
  activePolicyViolations: number;
}

export interface GuardrailBreakdownItem {
  label: string;
  count: number;
}

export interface AlertItem {
  id: string;
  message: string;
  createdAt: string;
  severity: Exclude<Severity, "Low">;
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
}
