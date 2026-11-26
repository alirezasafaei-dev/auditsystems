import { NextRequest } from "next/server";
import { prisma } from "../../../../../lib/db";
import { isReportShareAccessible, hasPassword } from "../../../../../lib/reportShare";
import { getReportAccessCookieName, verifyReportAccessCredential } from "../../../../../lib/report-access";
import { csrfProtection } from "../../../../../lib/csrf";
import { enforceAuthAbuseLimit } from "../../../../../lib/authRateLimit";
import { createRequestId, respondJson } from "../../../../../lib/observability";
import { parseReportCaptureInput } from "../../../../../lib/report-capture-schema";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const requestId = createRequestId();
  const csrfCheck = await csrfProtection(request);
  if (!csrfCheck.valid) {
    return respondJson({ error: "FORBIDDEN", requestId }, requestId, { status: 403, headers: { "Cache-Control": "no-store" } });
  }

  const { token } = await params;
  const rateLimit = await enforceAuthAbuseLimit({
    action: "report-capture",
    subject: token,
    request,
  });
  if (!rateLimit.allowed) {
    return respondJson({ error: "RATE_LIMITED", requestId }, requestId, {
      status: 429,
      headers: { "Cache-Control": "no-store", "Retry-After": String(rateLimit.retryAfterSec) },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return respondJson({ error: "INVALID_BODY", requestId }, requestId, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  if (!parseReportCaptureInput(body)) {
    return respondJson({ error: "INVALID_PAYLOAD", requestId }, requestId, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const share = await prisma.reportShare.findUnique({
    where: { token },
    include: { run: true },
  });
  if (!share || !isReportShareAccessible(share)) {
    return respondJson({ error: "NOT_FOUND", requestId }, requestId, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  if (hasPassword(share) && !verifyReportAccessCredential(request.cookies.get(getReportAccessCookieName(token))?.value, token)) {
    return respondJson({ error: "NOT_FOUND", requestId }, requestId, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  if (share.run.status !== "SUCCEEDED") {
    return respondJson({ error: "REPORT_NOT_READY", requestId }, requestId, { status: 409, headers: { "Cache-Control": "no-store" } });
  }

  return respondJson({ error: "DELIVERY_NOT_CONFIGURED", requestId }, requestId, { status: 503, headers: { "Cache-Control": "no-store" } });
}
