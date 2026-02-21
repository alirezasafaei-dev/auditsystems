import { prisma } from "./db";

export type HealthCheckStatus = "pass" | "fail" | "skip";

export type HealthCheckResult = {
  name: string;
  status: HealthCheckStatus;
  latencyMs: number;
  detail: string;
};

export type ReadinessReport = {
  ok: boolean;
  service: string;
  timestamp: string;
  checks: HealthCheckResult[];
};

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: NodeJS.Timeout | null = null;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("TIMEOUT")), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function checkDatabaseHealth(timeoutMs: number = 1500): Promise<HealthCheckResult> {
  const startedAt = Date.now();
  try {
    await withTimeout(prisma.$queryRaw`SELECT 1`, timeoutMs);
    return {
      name: "database",
      status: "pass",
      latencyMs: Date.now() - startedAt,
      detail: "PostgreSQL query succeeded"
    };
  } catch (error) {
    return {
      name: "database",
      status: "fail",
      latencyMs: Date.now() - startedAt,
      detail: `Database not ready (${error instanceof Error ? error.message : String(error)})`
    };
  }
}

export async function checkRedisHealth(timeoutMs: number = 1200): Promise<HealthCheckResult> {
  const startedAt = Date.now();
  const url = String(process.env.UPSTASH_REDIS_REST_URL ?? "").trim();
  const token = String(process.env.UPSTASH_REDIS_REST_TOKEN ?? "").trim();

  if (!url || !token) {
    return {
      name: "redis",
      status: "skip",
      latencyMs: Date.now() - startedAt,
      detail: "Upstash Redis is not configured"
    };
  }

  try {
    const response = await withTimeout(
      fetch(`${url}/ping`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      timeoutMs
    );

    if (!response.ok) {
      return {
        name: "redis",
        status: "fail",
        latencyMs: Date.now() - startedAt,
        detail: `Redis ping failed (${response.status})`
      };
    }

    return {
      name: "redis",
      status: "pass",
      latencyMs: Date.now() - startedAt,
      detail: "Redis ping succeeded"
    };
  } catch (error) {
    return {
      name: "redis",
      status: "fail",
      latencyMs: Date.now() - startedAt,
      detail: `Redis not ready (${error instanceof Error ? error.message : String(error)})`
    };
  }
}

export async function buildReadinessReport(service = "asdev-audit-ir"): Promise<ReadinessReport> {
  const checks = await Promise.all([checkDatabaseHealth(), checkRedisHealth()]);
  const ok = checks.every((x) => x.status === "pass" || x.status === "skip");

  return {
    ok,
    service,
    timestamp: new Date().toISOString(),
    checks
  };
}

