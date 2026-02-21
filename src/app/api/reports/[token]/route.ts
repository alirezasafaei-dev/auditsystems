import { prisma } from "../../../../lib/db";
import { createRequestId, logEvent, respondJson } from "../../../../lib/observability";
import { isReportShareAccessible } from "../../../../lib/reportShare";

export async function GET(_request: Request, context: { params: Promise<{ token: string }> }) {
  const requestId = createRequestId();
  const startedAt = Date.now();
  const { token } = await context.params;

  const share = await prisma.reportShare.findUnique({
    where: { token },
    include: {
      run: {
        include: {
          findings: {
            orderBy: [{ createdAt: "asc" }]
          }
        }
      }
    }
  });

  if (!share || !isReportShareAccessible(share)) {
    logEvent("warn", "report_fetch_not_found", { requestId, token });
    return respondJson({ error: "NOT_FOUND", requestId }, requestId, { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  logEvent("info", "report_fetched", { requestId, runId: share.run.id, durationMs: Date.now() - startedAt });
  return respondJson(
    {
      run: {
        id: share.run.id,
        url: share.run.url,
        normalizedUrl: share.run.normalizedUrl,
        status: share.run.status,
        summary: share.run.summary
      },
      findings: share.run.findings,
      status: share.run.status,
      requestId
    },
    requestId,
    { headers: { "Cache-Control": "no-store" } }
  );
}
