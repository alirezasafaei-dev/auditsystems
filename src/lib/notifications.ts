import { prisma } from "./db";
import { logEvent } from "./observability";

export type AuditCompletionData = {
  auditId: string;
  url: string;
  score: number;
  grade: string;
  totalFindings: number;
  severityCounts: Record<string, number>;
  categoryScores: Record<string, number | null>;
  resultAvailability: "AVAILABLE" | "PARTIAL" | "UNAVAILABLE" | "LEGACY" | "INVALID";
  coverageRatio: number | null;
};

export async function sendAuditCompleteNotification(
  userId: string,
  auditData: AuditCompletionData
): Promise<boolean> {
  const membership = await prisma.membership.findFirst({
    where: { userId },
    include: {
      organization: { include: { notificationPreference: true } },
      user: { select: { email: true, name: true } }
    }
  });

  if (!membership) return false;

  const organizationId = membership.organization.id;
  if (!membership.organization.notificationPreference?.emailEnabled) {
    logEvent("info", "notification_skipped_disabled", { organizationId, auditId: auditData.auditId });
    return false;
  }
  if (!membership.user?.email) {
    logEvent("warn", "notification_no_email", { organizationId, auditId: auditData.auditId });
    return false;
  }

  logEvent("warn", "notification_delivery_not_configured", { organizationId, auditId: auditData.auditId });
  return false;
}
