import { NextResponse } from "next/server";
import crypto from "node:crypto";

type LogLevel = "info" | "warn" | "error";

export function createRequestId(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

export function respondJson(body: unknown, requestId: string, init?: ResponseInit): NextResponse {
  const headers = new Headers(init?.headers);
  headers.set("x-request-id", requestId);
  return NextResponse.json(body, { ...init, headers });
}

export function logEvent(level: LogLevel, event: string, data: Record<string, unknown>): void {
  const record = {
    ts: new Date().toISOString(),
    level,
    event,
    ...data
  };
  const line = JSON.stringify(record);

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
}
