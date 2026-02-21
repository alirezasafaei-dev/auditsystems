import { describe, expect, it } from "vitest";
import { hashClientIp, sanitizeApiError } from "./security";

describe("hashClientIp", () => {
  it("produces a stable sha256 hash", () => {
    const hash = hashClientIp("203.0.113.8");
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(hashClientIp("203.0.113.8")).toBe(hash);
  });
});

describe("sanitizeApiError", () => {
  it("keeps known validation errors as 400", () => {
    expect(sanitizeApiError(new Error("INVALID_URL_PARSE"))).toEqual({ status: 400, code: "INVALID_URL_PARSE" });
    expect(sanitizeApiError(new Error("SSRF_BLOCKED_PRIVATE_IP"))).toEqual({ status: 400, code: "SSRF_BLOCKED_PRIVATE_IP" });
  });

  it("hides unknown internal errors", () => {
    expect(sanitizeApiError(new Error("db failure"))).toEqual({ status: 500, code: "INTERNAL_ERROR" });
    expect(sanitizeApiError("oops")).toEqual({ status: 500, code: "INTERNAL_ERROR" });
  });
});
