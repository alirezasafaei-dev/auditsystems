import { describe, expect, it } from "vitest";
import { createDownloadToken, verifyDownloadToken } from "./downloadToken";

describe("downloadToken", () => {
  it("creates and verifies token", () => {
    const token = createDownloadToken({ runId: "run_1", orderId: "ord_1", email: "u@example.com", ttlSec: 60 });
    const payload = verifyDownloadToken(token);
    expect(payload?.runId).toBe("run_1");
    expect(payload?.orderId).toBe("ord_1");
    expect(payload?.email).toBe("u@example.com");
  });

  it("rejects tampered token", () => {
    const token = createDownloadToken({ runId: "run_1", orderId: "ord_1", email: "u@example.com", ttlSec: 60 });
    const tampered = `${token}x`;
    expect(verifyDownloadToken(tampered)).toBeNull();
  });
});
