import { describe, expect, it } from "vitest";
import {
  hashPassword,
  isReportShareAccessible,
  verifyPassword,
} from "./reportShare";

describe("isReportShareAccessible", () => {
  it("returns false for revoked shares", () => {
    expect(isReportShareAccessible({ revokedAt: new Date(), expiresAt: null })).toBe(false);
  });

  it("returns false for expired shares", () => {
    expect(isReportShareAccessible(
      { revokedAt: null, expiresAt: new Date("2020-01-01T00:00:00.000Z") },
      new Date("2021-01-01T00:00:00.000Z"),
    )).toBe(false);
  });

  it("returns true for active shares", () => {
    expect(isReportShareAccessible({ revokedAt: null, expiresAt: null })).toBe(true);
  });
});

describe("report share passwords", () => {
  it("verifies a valid password asynchronously", async () => {
    const encoded = hashPassword("correct horse battery staple");

    await expect(verifyPassword("correct horse battery staple", encoded)).resolves.toBe(true);
    await expect(verifyPassword("wrong password", encoded)).resolves.toBe(false);
  });

  it("rejects malformed password hashes without throwing", async () => {
    await expect(verifyPassword("password", "invalid")).resolves.toBe(false);
    await expect(verifyPassword("password", "salt:not-hex")).resolves.toBe(false);
    await expect(verifyPassword("password", `salt:${"00".repeat(64)}:extra`)).resolves.toBe(false);
  });
});
