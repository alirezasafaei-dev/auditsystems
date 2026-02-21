import crypto from "node:crypto";
import { NextRequest } from "next/server";

const IP_HASH_SALT = process.env.IP_HASH_SALT ?? "asdev-audit-default-salt";

export function getClientIp(request: NextRequest): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const first = xForwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function hashClientIp(ip: string): string {
  return crypto.createHash("sha256").update(`${IP_HASH_SALT}:${ip}`).digest("hex");
}

export function sanitizeApiError(error: unknown): { status: number; code: string } {
  if (!(error instanceof Error)) {
    return { status: 500, code: "INTERNAL_ERROR" };
  }

  if (error.message.startsWith("INVALID_URL_") || error.message.startsWith("SSRF_BLOCKED_")) {
    return { status: 400, code: error.message };
  }

  return { status: 500, code: "INTERNAL_ERROR" };
}
