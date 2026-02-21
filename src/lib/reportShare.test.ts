import { describe, expect, it } from "vitest";
import { isReportShareAccessible } from "./reportShare";

describe("isReportShareAccessible", () => {
  it("returns false for revoked shares", () => {
    expect(isReportShareAccessible({ revokedAt: new Date(), expiresAt: null })).toBe(false);
  });

  it("returns false for expired shares", () => {
    expect(isReportShareAccessible({ revokedAt: null, expiresAt: new Date("2020-01-01T00:00:00.000Z") }, new Date("2021-01-01T00:00:00.000Z"))).toBe(
      false
    );
  });

  it("returns true for active shares", () => {
    expect(isReportShareAccessible({ revokedAt: null, expiresAt: null })).toBe(true);
  });
});
