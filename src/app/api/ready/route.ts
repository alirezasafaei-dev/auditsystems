import { NextResponse } from "next/server";
import { buildReadinessReport } from "../../../lib/health";
import { createRequestId } from "../../../lib/observability";

export const dynamic = "force-dynamic";
const READINESS_CACHE_CONTROL = "no-store";

export async function GET() {
  const startedAt = Date.now();
  const requestId = createRequestId();
  const report = await buildReadinessReport("asdev-audit-ir");
  const statusCode = report.ok ? 200 : 503;

  return NextResponse.json(
    {
      status: report.ok ? "ready" : "degraded",
      ok: report.ok,
      service: "auditsystems",
      requestId,
      responseMs: Date.now() - startedAt,
      timestamp: report.timestamp,
      checks: report.checks,
    },
    {
      status: statusCode,
      headers: {
        "Cache-Control": READINESS_CACHE_CONTROL
      }
    }
  );
}

export async function HEAD() {
  const response = await GET();
  return new NextResponse(null, { status: response.status, headers: response.headers });
}
