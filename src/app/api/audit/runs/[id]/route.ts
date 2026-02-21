import { prisma } from "../../../../../lib/db";
import { createRequestId, logEvent, respondJson } from "../../../../../lib/observability";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const requestId = createRequestId();
  const startedAt = Date.now();
  const { id } = await context.params;

  const run = await prisma.auditRun.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      startedAt: true,
      finishedAt: true,
      errorCode: true,
      errorMessage: true
    }
  });

  if (!run) {
    logEvent("warn", "audit_run_status_not_found", { requestId, runId: id });
    return respondJson({ error: "NOT_FOUND", requestId }, requestId, { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  logEvent("info", "audit_run_status_fetched", { requestId, runId: id, durationMs: Date.now() - startedAt });
  return respondJson({ ...run, requestId }, requestId, { headers: { "Cache-Control": "no-store" } });
}
