import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  isSessionAuthConfigured: vi.fn(),
  validateAdminCredentials: vi.fn(),
  createAdminSession: vi.fn(),
}));

vi.mock("@/lib/admin-auth", () => ({
  isSessionAuthConfigured: mocks.isSessionAuthConfigured,
  validateAdminCredentials: mocks.validateAdminCredentials,
  createAdminSession: mocks.createAdminSession,
}));

function request(body: unknown) {
  return new NextRequest("http://localhost/api/admin/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/admin/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.isSessionAuthConfigured.mockReturnValue(true);
    mocks.validateAdminCredentials.mockReturnValue(true);
    mocks.createAdminSession.mockResolvedValue("session-id");
  });

  it("fails closed when authentication is not configured", async () => {
    mocks.isSessionAuthConfigured.mockReturnValue(false);
    const { POST } = await import("./route");
    const response = await POST(request({ username: "admin", password: "secret" }));
    expect(response.status).toBe(503);
    expect(mocks.createAdminSession).not.toHaveBeenCalled();
  });

  it("rejects malformed credentials", async () => {
    const { POST } = await import("./route");
    const response = await POST(request({ username: "admin" }));
    expect(response.status).toBe(400);
    expect(mocks.validateAdminCredentials).not.toHaveBeenCalled();
  });

  it("rejects invalid credentials without creating a session", async () => {
    mocks.validateAdminCredentials.mockReturnValue(false);
    const { POST } = await import("./route");
    const response = await POST(request({ username: "admin", password: "wrong" }));
    expect(response.status).toBe(401);
    expect(mocks.createAdminSession).not.toHaveBeenCalled();
  });

  it("creates a persisted session after valid authentication", async () => {
    const { POST } = await import("./route");
    const response = await POST(request({ username: "admin", password: "secret" }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(mocks.createAdminSession).toHaveBeenCalledOnce();
  });

  it("returns 500 when the session store is unavailable", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    mocks.createAdminSession.mockRejectedValue(new Error("database unavailable"));
    const { POST } = await import("./route");
    const response = await POST(request({ username: "admin", password: "secret" }));
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: "Failed to create admin session" });
    consoleError.mockRestore();
  });
});
