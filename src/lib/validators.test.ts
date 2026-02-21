import { describe, expect, it } from "vitest";
import { normalizeEmail } from "./validators";

describe("normalizeEmail", () => {
  it("normalizes casing and spaces", () => {
    expect(normalizeEmail("  TEST@Example.COM ")).toBe("test@example.com");
  });

  it("rejects invalid email", () => {
    expect(() => normalizeEmail("invalid-email")).toThrowError("INVALID_EMAIL");
  });
});
