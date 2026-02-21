export async function GET(): Promise<Response> {
  return Response.json(
    {
      status: "ready",
      service: "asdev-audit-ir",
      timestamp: new Date().toISOString()
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
