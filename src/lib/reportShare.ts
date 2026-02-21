import { ReportShare } from "@prisma/client";

export function isReportShareAccessible(share: Pick<ReportShare, "revokedAt" | "expiresAt">, now: Date = new Date()): boolean {
  if (share.revokedAt) return false;
  if (share.expiresAt && share.expiresAt < now) return false;
  return true;
}
