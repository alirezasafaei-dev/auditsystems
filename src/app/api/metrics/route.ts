import { renderPrometheusMetrics } from "../../../lib/metrics";

export async function GET() {
  return new Response(renderPrometheusMetrics(), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
