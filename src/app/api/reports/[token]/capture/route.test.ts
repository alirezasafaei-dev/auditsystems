import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  findFirst: vi.fn(),
  create: vi.fn(),
  verifyReportAccessCredential: vi.fn(() => false),
  csrfProtection: vi.fn(),
  enforceAuthAbuseLimit: vi.fn(),
}));

vi.mock("../../../../../lib/reportShare", () => ({
  isReportShareAccessible: () => true,
  hasPassword: (share: { passwordHash?: string | null }) => Boolean(share.passwordHash),
}));

vi.mock("../../../../../lib/report-access", () => ({
  getReportAccessCookieName: () => "report_access_fixture",
  verifyReportAccessCredential: mocks.verifyReportAccessCredential,
}));
vi.mock("../../../../../lib/csrf", () => ({ csrfProtection: mocks.csrfProtection }));
vi.mock("../../../../../lib/authRateLimit", () => ({ enforceAuthAbuseLimit: mocks.enforceAuthAbuseLimit }));

vi.mock("../../../../../lib/db", () => ({
  prisma: {
    reportShare: { findUnique: mocks.findUnique },
    auditLead: {
      findFirst: mocks.findFirst,
      create: mocks.create,
    },
  },
}));

describe("POST /api/reports/[token]/capture", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.findUnique.mockResolvedValue({ runId: "run-1", run: { url: "https://example.com", normalizedUrl: "https://example.com/", status: "SUCCEEDED" } });
    mocks.findFirst.mockResolvedValue(null);
    mocks.verifyReportAccessCredential.mockReturnValue(false);
    mocks.csrfProtection.mockResolvedValue({ valid: true });
    mocks.enforceAuthAbuseLimit.mockResolvedValue({ allowed: true, retryAfterSec: 0, backend: "local-redis" });
  });

  it("rejects missing consent without retaining the email", async () => {
    const { POST } = await import("./route");

    const response = await POST(request({ email: "owner@example.com" }), { params: Promise.resolve({ token: "share-token" }) });

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: "INVALID_PAYLOAD" });
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("fails closed when delivery is not configured and does not retain the email", async () => {
    const { POST } = await import("./route");
    const response = await POST(request({ email: "owner@example.com", consentPrivacy: true }), { params: Promise.resolve({ token: "share-token" }) });

    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ error: "DELIVERY_NOT_CONFIGURED" });
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("rejects capture without CSRF protection before reading the report", async () => {
    mocks.csrfProtection.mockResolvedValue({ valid: false });
    const { POST } = await import("./route");
    const response = await POST(request({ email: "owner@example.com", consentPrivacy: true }), { params: Promise.resolve({ token: "share-token" }) });

    expect(response.status).toBe(403);
    expect(mocks.findUnique).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("rejects unexpected fields so capture cannot retain unapproved personal data", async () => {
    const { POST } = await import("./route");
    const response = await POST(request({ email: "owner@example.com", consentPrivacy: true, name: "Unapproved name" }), { params: Promise.resolve({ token: "share-token" }) });

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: "INVALID_PAYLOAD" });
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("does not read or retain a report when the capture limiter is exhausted", async () => {
    mocks.enforceAuthAbuseLimit.mockResolvedValue({ allowed: false, retryAfterSec: 60, backend: "local-redis", reason: "RATE_LIMITED" });
    const { POST } = await import("./route");
    const response = await POST(request({ email: "owner@example.com", consentPrivacy: true }), { params: Promise.resolve({ token: "share-token" }) });

    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("60");
    expect(mocks.findUnique).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("does not disclose or mutate a protected report without authorization", async () => {
    mocks.findUnique.mockResolvedValue({
      passwordHash: "synthetic-hash",
      runId: "run-1",
      run: { url: "https://private.invalid", normalizedUrl: "https://private.invalid/", status: "SUCCEEDED" },
    });
    const { POST } = await import("./route");

    const response = await POST(request({ email: "owner@example.com", consentPrivacy: true }), { params: Promise.resolve({ token: "share-token" }) });

    expect(response.status).toBe(404);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toMatchObject({ error: "NOT_FOUND" });
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("does not retain capture for a protected report with a valid session while delivery is unavailable", async () => {
    mocks.findUnique.mockResolvedValue({
      passwordHash: "synthetic-hash",
      runId: "run-1",
      run: { url: "https://private.invalid", normalizedUrl: "https://private.invalid/", status: "SUCCEEDED" },
    });
    mocks.verifyReportAccessCredential.mockReturnValue(true);
    const { POST } = await import("./route");

    const response = await POST(request(
      { email: "owner@example.com", consentPrivacy: true },
      "report_access_fixture=signed-report-credential",
    ), { params: Promise.resolve({ token: "share-token" }) });

    expect(response.status).toBe(503);
    expect(mocks.verifyReportAccessCredential).toHaveBeenCalledWith("signed-report-credential", "share-token");
    expect(mocks.create).not.toHaveBeenCalled();
  });
});

function request(body: unknown, cookie?: string): NextRequest {
  return new NextRequest("https://audit.test/api/reports/share-token/capture", {
    method: "POST",
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    body: JSON.stringify(body),
  });
}
