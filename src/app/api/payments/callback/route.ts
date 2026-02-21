import { prisma } from "../../../../lib/db";
import { createDownloadToken } from "../../../../lib/downloadToken";
import { observeApiRequest } from "../../../../lib/metrics";
import { createRequestId, logEvent, respondJson } from "../../../../lib/observability";
import { verifyCheckout } from "../../../../lib/payments";
import { PaymentProvider } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

function asProvider(value: string | null): PaymentProvider {
  const upper = (value ?? "").toUpperCase();
  if (upper === "ZARINPAL") return "ZARINPAL";
  if (upper === "IDPAY") return "IDPAY";
  if (upper === "PAYPING") return "PAYPING";
  return "MOCK";
}

async function handleCallback(request: NextRequest): Promise<NextResponse> {
  const requestId = createRequestId();
  const startedAt = Date.now();
  let statusCode = 200;

  try {
    const query = request.nextUrl.searchParams;
    const body = request.method === "POST" ? await request.json().catch(() => ({})) : {};

    const provider = asProvider(String(query.get("provider") ?? (body as { provider?: string }).provider ?? "MOCK"));
    const callbackRef = String(query.get("callbackRef") ?? (body as { callbackRef?: string }).callbackRef ?? "").trim();
    const providerRef = String(query.get("Authority") ?? (body as { Authority?: string; providerRef?: string }).Authority ?? (body as { providerRef?: string }).providerRef ?? "").trim();
    const callbackStatus = String(query.get("Status") ?? (body as { Status?: string; status?: string }).Status ?? (body as { status?: string }).status ?? "").trim();

    if (!callbackRef) {
      statusCode = 400;
      return respondJson({ error: "INVALID_CALLBACK_REF", requestId }, requestId, { status: statusCode, headers: { "Cache-Control": "no-store" } });
    }

    const order = await prisma.auditOrder.findFirst({ where: { callbackRef }, include: { run: { include: { shares: { orderBy: { createdAt: "desc" }, take: 1 } } } } });
    if (!order) {
      statusCode = 404;
      return respondJson({ error: "ORDER_NOT_FOUND", requestId }, requestId, { status: statusCode, headers: { "Cache-Control": "no-store" } });
    }

    if (order.status === "PAID") {
      const shareToken = order.run.shares[0]?.token;
      if (!shareToken) {
        statusCode = 409;
        return respondJson({ error: "REPORT_TOKEN_NOT_FOUND", requestId }, requestId, {
          status: statusCode,
          headers: { "Cache-Control": "no-store" }
        });
      }

      const download = createDownloadToken({ runId: order.runId, orderId: order.id, email: order.email });
      return respondJson(
        {
          ok: true,
          orderId: order.id,
          status: order.status,
          downloadUrl: `/api/pdf/${shareToken}?dl=${encodeURIComponent(download)}`,
          requestId
        },
        requestId,
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const verification = await verifyCheckout({
      provider,
      providerRef: providerRef || order.providerRef || `NOREF-${order.id}`,
      amountToman: order.amountToman,
      callbackStatus
    });

    const nextStatus = verification.paid ? "PAID" : "FAILED";

    const updated = await prisma.auditOrder.update({
      where: { id: order.id },
      data: {
        status: nextStatus,
        paidAt: verification.paid ? new Date() : null,
        providerRef: verification.providerRef ?? order.providerRef
      },
      include: { run: { include: { shares: { orderBy: { createdAt: "desc" }, take: 1 } } } }
    });

    await prisma.auditOrderEvent.create({
      data: {
        orderId: order.id,
        kind: verification.paid ? "PAYMENT_CONFIRMED" : "PAYMENT_FAILED",
        payload: {
          provider,
          callbackRef,
          callbackStatus,
          providerRef,
          verification: verification.raw ?? null
        }
      }
    });

    const shareToken = updated.run.shares[0]?.token;

    if (!verification.paid || !shareToken) {
      statusCode = verification.paid ? 409 : 402;
      return respondJson(
        {
          ok: false,
          orderId: updated.id,
          status: updated.status,
          error: verification.paid ? "REPORT_TOKEN_NOT_FOUND" : "PAYMENT_NOT_CONFIRMED",
          requestId
        },
        requestId,
        { status: statusCode, headers: { "Cache-Control": "no-store" } }
      );
    }

    const download = createDownloadToken({ runId: updated.runId, orderId: updated.id, email: updated.email });
    const downloadUrl = `/api/pdf/${shareToken}?dl=${encodeURIComponent(download)}`;
    const successUrl = `/audit/r/${shareToken}/success?orderId=${encodeURIComponent(updated.id)}&dl=${encodeURIComponent(download)}`;

    logEvent("info", "payment_confirmed", {
      requestId,
      orderId: updated.id,
      provider,
      durationMs: Date.now() - startedAt
    });

    return respondJson(
      {
        ok: true,
        orderId: updated.id,
        status: updated.status,
        provider,
        downloadUrl,
        successUrl,
        requestId
      },
      requestId,
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    statusCode = 500;
    logEvent("error", "payment_callback_failed", {
      requestId,
      code: error instanceof Error ? error.message : String(error)
    });
    return respondJson({ error: "INTERNAL_ERROR", requestId }, requestId, { status: statusCode, headers: { "Cache-Control": "no-store" } });
  } finally {
    observeApiRequest("/api/payments/callback", statusCode, Date.now() - startedAt);
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleCallback(request);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleCallback(request);
}
