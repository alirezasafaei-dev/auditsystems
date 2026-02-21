import { afterEach, describe, expect, it, vi } from "vitest";
import { prisma } from "./db";
import { buildReadinessReport, checkDatabaseHealth } from "./health";

describe("health checks", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  it("returns database pass when query succeeds", async () => {
    vi.spyOn(prisma, "$queryRaw").mockResolvedValueOnce([1] as never);
    const result = await checkDatabaseHealth();
    expect(result.name).toBe("database");
    expect(result.status).toBe("pass");
  });

  it("marks report as not ready when database check fails", async () => {
    vi.spyOn(prisma, "$queryRaw").mockRejectedValueOnce(new Error("DB_DOWN"));
    const report = await buildReadinessReport();
    expect(report.ok).toBe(false);
    expect(report.checks.find((x) => x.name === "database")?.status).toBe("fail");
  });

  it("skips redis when no upstash config exists", async () => {
    vi.spyOn(prisma, "$queryRaw").mockResolvedValueOnce([1] as never);
    const report = await buildReadinessReport();
    expect(report.checks.find((x) => x.name === "redis")?.status).toBe("skip");
  });
});

