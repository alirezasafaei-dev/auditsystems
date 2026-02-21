export function createReportToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}
