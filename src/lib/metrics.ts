const apiCounters = new Map<string, number>();
const apiDurationBuckets = new Map<string, number>();

const LATENCY_BUCKETS_MS = [50, 100, 250, 500, 1000, 2500, 5000, 10000];

function incrementCounter(key: string, by: number = 1): void {
  apiCounters.set(key, (apiCounters.get(key) ?? 0) + by);
}

function observeLatency(route: string, durationMs: number): void {
  for (const bucket of LATENCY_BUCKETS_MS) {
    if (durationMs <= bucket) {
      incrementCounter(`audit_api_duration_bucket{route="${route}",le="${bucket}"}`);
    }
  }
  incrementCounter(`audit_api_duration_bucket{route="${route}",le="+Inf"}`);
  apiDurationBuckets.set(`audit_api_duration_sum{route="${route}"}`, (apiDurationBuckets.get(`audit_api_duration_sum{route="${route}"}`) ?? 0) + durationMs);
  apiDurationBuckets.set(`audit_api_duration_count{route="${route}"}`, (apiDurationBuckets.get(`audit_api_duration_count{route="${route}"}`) ?? 0) + 1);
}

export function observeApiRequest(route: string, status: number, durationMs: number): void {
  incrementCounter(`audit_api_requests_total{route="${route}",status="${status}"}`);
  observeLatency(route, durationMs);
}

export function renderPrometheusMetrics(): string {
  const lines: string[] = [];

  lines.push("# HELP audit_api_requests_total Total API requests by route and status");
  lines.push("# TYPE audit_api_requests_total counter");
  for (const [k, v] of apiCounters.entries()) {
    if (k.startsWith("audit_api_requests_total")) {
      lines.push(`${k} ${v}`);
    }
  }

  lines.push("");
  lines.push("# HELP audit_api_duration_bucket API duration histogram buckets in milliseconds");
  lines.push("# TYPE audit_api_duration_bucket counter");
  for (const [k, v] of apiCounters.entries()) {
    if (k.startsWith("audit_api_duration_bucket")) {
      lines.push(`${k} ${v}`);
    }
  }

  lines.push("");
  lines.push("# HELP audit_api_duration_sum Total API duration in milliseconds");
  lines.push("# TYPE audit_api_duration_sum counter");
  for (const [k, v] of apiDurationBuckets.entries()) {
    if (k.startsWith("audit_api_duration_sum")) {
      lines.push(`${k} ${v}`);
    }
  }

  lines.push("");
  lines.push("# HELP audit_api_duration_count API call count for latency histogram");
  lines.push("# TYPE audit_api_duration_count counter");
  for (const [k, v] of apiDurationBuckets.entries()) {
    if (k.startsWith("audit_api_duration_count")) {
      lines.push(`${k} ${v}`);
    }
  }

  return `${lines.join("\n")}\n`;
}
