import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const res = NextResponse.next();
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  res.headers.set("x-request-id", requestId);
  res.headers.set("x-correlation-id", requestId);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
