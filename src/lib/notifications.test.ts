import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ findFirst: vi.fn(), create: vi.fn(), logEvent: vi.fn() }));

vi.mock("./db", () => ({ prisma: {
  membership: { findFirst: mocks.findFirst },
  notificationHistory: { create: mocks.create },
} }));
vi.mock("./observability", () => ({ logEvent: mocks.logEvent }));

describe("audit completion notification coverage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.findFirst.mockResolvedValue({
      organization: { id: "org-1", name: "Synthetic org", notificationPreference: { emailEnabled: true } },
      user: { email: "synthetic@example.invalid", name: "Synthetic user" },
    });
    mocks.create.mockResolvedValue({});
  });

  it("fails closed without a delivery provider without requiring delivery secrets or persisting a sent-email record", async () => {
    const { sendAuditCompleteNotification } = await import("./notifications");

    const delivered = await sendAuditCompleteNotification("user-1", {
      auditId: "audit-1", url: "https://synthetic.invalid", score: 100, grade: "EXCELLENT", totalFindings: 0,
      severityCounts: {}, categoryScores: { SEO: 100 }, resultAvailability: "AVAILABLE", coverageRatio: 1,
    });

    expect(delivered).toBe(false);
    expect(mocks.create).not.toHaveBeenCalled();
    expect(JSON.stringify(mocks.logEvent.mock.calls)).not.toContain("synthetic@example.invalid");
  });
});
