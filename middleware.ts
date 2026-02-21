import { NextRequest, NextResponse } from "next/server";

function isHttpsRequest(request: NextRequest): boolean {
  const proto = request.headers.get("x-forwarded-proto");
  if (proto) return proto.toLowerCase() === "https";
  return request.nextUrl.protocol === "https:";
}

function withSecurityHeaders(request: NextRequest, response: NextResponse): NextResponse {
  const isApi = request.nextUrl.pathname.startsWith("/api/");

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-site");
  response.headers.set("X-DNS-Prefetch-Control", "off");

  if (!isApi) {
    response.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "style-src 'self' 'unsafe-inline'",
        "script-src 'self' 'unsafe-inline'",
        "connect-src 'self' https:",
        "form-action 'self'"
      ].join("; ")
    );
  } else {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  if (isHttpsRequest(request)) {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  return response;
}

export function middleware(request: NextRequest): NextResponse {
  return withSecurityHeaders(request, NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)"]
};

