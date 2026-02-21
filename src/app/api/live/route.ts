import { observeApiRequest } from "../../../lib/metrics";
import { createRequestId, respondJson } from "../../../lib/observability";

export async function GET(): Promise<Response> {
  const requestId = createRequestId();
  const startedAt = Date.now();

  try {
    return respondJson(
      {
        status: "alive",
        service: "asdev-audit-ir",
        timestamp: new Date().toISOString(),
        requestId
      },
      requestId,
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } finally {
    observeApiRequest("/api/live", 200, Date.now() - startedAt);
  }
}

