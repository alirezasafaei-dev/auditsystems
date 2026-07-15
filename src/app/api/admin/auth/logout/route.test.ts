import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  clearAdminSession: vi.fn(),
}));

vi.mock("@/lib/admin-auth", () => ({
  clearAdminSession: mocks.clearAdminSession,
}));

describe("POST /api/admin/auth/logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.clearAdminSession.mockResolvedValue(undefined);
  });

  it("revokes the current session and clears its cookie", async () => {
    const { POST } = await import("./route");
    const response = await POST();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(mocks.clearAdminSession).toHaveBeenCalledOnce();
  });

  it("fails closed when server-side revocation fails", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    mocks.clearAdminSession.mockRejectedValue(new Error("database unavailable"));
    const { POST } = await import("./route");
    const response = await POST();
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "Failed to revoke admin session" });
    consoleError.mockRestore();
  });
});
