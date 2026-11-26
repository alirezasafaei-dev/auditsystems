import { Prisma } from "@prisma/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { prisma } from "./db";
import { runDueScheduledAudits } from "./scheduled-audit-runner";

function rawQueryError(sqlState: string): Prisma.PrismaClientKnownRequestError {
  return new Prisma.PrismaClientKnownRequestError("raw query failed", {
    code: "P2010",
    clientVersion: "test",
    meta: { code: sqlState },
  });
}

describe("scheduled audit transaction retries", () => {
  afterEach(() => vi.restoreAllMocks());

  it.each(["40001", "40P01"])("retries the transaction on PostgreSQL SQLSTATE %s", async (sqlState) => {
    const transaction = vi.spyOn(prisma, "$transaction")
      .mockRejectedValueOnce(rawQueryError(sqlState))
      .mockResolvedValueOnce({ kind: "none" });

    await expect(runDueScheduledAudits()).resolves.toMatchObject({ results: [] });
    expect(transaction).toHaveBeenCalledTimes(2);
  });

  it("propagates unrelated raw query failures without retrying a claim", async () => {
    const failure = rawQueryError("42P01");
    const transaction = vi.spyOn(prisma, "$transaction").mockRejectedValueOnce(failure);

    await expect(runDueScheduledAudits()).rejects.toBe(failure);
    expect(transaction).toHaveBeenCalledTimes(1);
  });
});
