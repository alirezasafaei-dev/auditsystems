import { PaymentProvider } from "@prisma/client";

export type PaymentCheckoutResult = {
  redirectUrl: string;
  providerRef: string;
  callbackRef: string;
  raw?: unknown;
};

export type PaymentVerifyResult = {
  paid: boolean;
  providerRef?: string;
  raw?: unknown;
};

function getBaseUrl(): string {
  return process.env.APP_BASE_URL ?? "http://localhost:3000";
}

function getDefaultProvider(): PaymentProvider {
  const value = (process.env.PAYMENT_PROVIDER_DEFAULT ?? "MOCK").toUpperCase();
  if (value === "ZARINPAL") return "ZARINPAL";
  if (value === "IDPAY") return "IDPAY";
  if (value === "PAYPING") return "PAYPING";
  return "MOCK";
}

export function resolvePaymentProvider(value?: string | null): PaymentProvider {
  if (!value) return getDefaultProvider();
  const upper = value.toUpperCase();
  if (upper === "ZARINPAL") return "ZARINPAL";
  if (upper === "IDPAY") return "IDPAY";
  if (upper === "PAYPING") return "PAYPING";
  return "MOCK";
}

export async function createCheckout(input: {
  provider: PaymentProvider;
  orderId: string;
  callbackRef: string;
  amountToman: number;
  email: string;
}): Promise<PaymentCheckoutResult> {
  const callbackUrl = `${getBaseUrl()}/api/payments/callback?provider=${input.provider}&callbackRef=${encodeURIComponent(input.callbackRef)}`;

  if (input.provider === "MOCK") {
    const redirectUrl = `${getBaseUrl()}/api/payments/callback?provider=MOCK&callbackRef=${encodeURIComponent(input.callbackRef)}&Status=OK&Authority=MOCK-${input.orderId}`;
    return {
      redirectUrl,
      providerRef: `MOCK-${input.orderId}`,
      callbackRef: input.callbackRef
    };
  }

  if (input.provider === "ZARINPAL") {
    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    if (!merchantId) {
      throw new Error("PAYMENT_PROVIDER_NOT_CONFIGURED");
    }

    const response = await fetch("https://api.zarinpal.com/pg/v4/payment/request.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: input.amountToman * 10,
        callback_url: callbackUrl,
        description: `Audit order ${input.orderId}`,
        metadata: { email: input.email }
      })
    });

    if (!response.ok) {
      throw new Error(`PAYMENT_PROVIDER_HTTP_${response.status}`);
    }

    const body = (await response.json()) as { data?: { code?: number; authority?: string } };
    const code = body.data?.code;
    const authority = body.data?.authority;

    if (code !== 100 || !authority) {
      throw new Error("PAYMENT_PROVIDER_REQUEST_FAILED");
    }

    return {
      redirectUrl: `https://www.zarinpal.com/pg/StartPay/${authority}`,
      providerRef: authority,
      callbackRef: input.callbackRef,
      raw: body
    };
  }

  throw new Error("PAYMENT_PROVIDER_NOT_IMPLEMENTED");
}

export async function verifyCheckout(input: {
  provider: PaymentProvider;
  providerRef: string;
  amountToman: number;
  callbackStatus?: string | null;
}): Promise<PaymentVerifyResult> {
  if (input.provider === "MOCK") {
    return {
      paid: (input.callbackStatus ?? "").toUpperCase() === "OK",
      providerRef: input.providerRef
    };
  }

  if (input.provider === "ZARINPAL") {
    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    if (!merchantId) {
      throw new Error("PAYMENT_PROVIDER_NOT_CONFIGURED");
    }

    const response = await fetch("https://api.zarinpal.com/pg/v4/payment/verify.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: input.amountToman * 10,
        authority: input.providerRef
      })
    });

    if (!response.ok) {
      throw new Error(`PAYMENT_PROVIDER_HTTP_${response.status}`);
    }

    const body = (await response.json()) as { data?: { code?: number; ref_id?: number } };
    const code = body.data?.code;

    return {
      paid: code === 100 || code === 101,
      providerRef: body.data?.ref_id ? String(body.data.ref_id) : input.providerRef,
      raw: body
    };
  }

  throw new Error("PAYMENT_PROVIDER_NOT_IMPLEMENTED");
}
