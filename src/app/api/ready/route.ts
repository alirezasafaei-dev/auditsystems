import { NextResponse } from "next/server";
import { buildReadinessReport } from "../../../lib/health";
import { createRequestId } from "../../../lib/observability";

export const dynamic = "force-dynamic";

export async function GET() {
  const requestId = createRequestId();
  const report = await buildReadinessReport("asdev-audit-ir");
  const statusCode = report.ok ? 200 : 503;

  return NextResponse.json(
    {
      status: report.ok ? "ready" : "degraded",
      requestId,
      ...report
    },
    {
      status: statusCode,
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}

export async function HEAD() {
  const response = await GET();
  return new NextResponse(null, { status: response.status, headers: response.headers });
}
