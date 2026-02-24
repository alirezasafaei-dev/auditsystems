import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // TODO: در آینده اتصال DB/Redis را هم بررسی کنید
  return NextResponse.json({ status: "ready" });
}
