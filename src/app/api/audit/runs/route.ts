import { enqueueJob } from "../../../../worker/queue";
import { prisma } from "../../../../lib/db";
import { normalizeAuditTargetUrl } from "../../../../lib/normalizeAuditTargetUrl";
import { createReportToken } from "../../../../lib/token";
import { createRequestId, logEvent, respondJson } from "../../../../lib/observability";
import { getClientIp, hashClientIp, sanitizeApiError } from "../../../../lib/security";
import { NextRequest } from "next/server";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_RUNS = 5;

export async function POST(request: NextRequest) {
  const requestId = createRequestId();
  const startedAt = Date.now();

  try {
    const body = await request.json();
    const inputUrl = String(body.url ?? "");
    const depth = body.depth === "DEEP" ? "DEEP" : "QUICK";
    const ipHash = hashClientIp(getClientIp(request));

    const recentRuns = await prisma.auditRun.count({
      where: {
        ipHash,
        createdAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS) }
      }
    });
    if (recentRuns >= RATE_LIMIT_MAX_RUNS) {
      logEvent("warn", "audit_run_rate_limited", { requestId, ipHash });
      return respondJson({ error: "RATE_LIMITED", requestId }, requestId, { status: 429, headers: { "Cache-Control": "no-store" } });
    }

    const normalized = await normalizeAuditTargetUrl(inputUrl, { verifyDnsPublicIp: true });

    const run = await prisma.auditRun.create({
      data: {
        url: inputUrl,
        normalizedUrl: normalized.normalizedUrl,
        depth,
        status: "QUEUED",
        ipHash,
        userAgent: request.headers.get("user-agent") ?? null,
        locale: request.headers.get("accept-language") ?? null
      }
    });

    const share = await prisma.reportShare.create({
      data: {
        runId: run.id,
        token: createReportToken()
      }
    });

    await enqueueJob({
      type: "AUDIT_RUN",
      payload: { runId: run.id }
    });

    logEvent("info", "audit_run_created", { requestId, runId: run.id, durationMs: Date.now() - startedAt, depth });
    return respondJson({ runId: run.id, token: share.token, status: run.status, requestId }, requestId, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    const safeError = sanitizeApiError(error);
    logEvent("error", "audit_run_create_failed", {
      requestId,
      durationMs: Date.now() - startedAt,
      code: safeError.code
    });
    return respondJson({ error: safeError.code, requestId }, requestId, {
      status: safeError.status,
      headers: { "Cache-Control": "no-store" }
    });
  }
}
