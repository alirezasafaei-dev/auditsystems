import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

async function loadDotEnvFileIfNeeded(): Promise<void> {
  const envPath = path.resolve(".env");
  try {
    const raw = await fs.readFile(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const [key, ...rest] = trimmed.split("=");
      const value = rest.join("=").trim().replace(/^"(.*)"$/, "$1");
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // ignore
  }
}

function env(name: string): string {
  return String(process.env[name] ?? "").trim();
}

async function main(): Promise<void> {
  await loadDotEnvFileIfNeeded();

  const merchantId = env("ZARINPAL_MERCHANT_ID");
  const baseUrl = env("APP_BASE_URL") || "http://localhost:3000";

  if (!merchantId) {
    console.log("[SKIP] ZARINPAL_MERCHANT_ID is not set.");
    return;
  }

  const callbackRef = `smoke-${crypto.randomUUID().replace(/-/g, "")}`;
  const callbackUrl = `${baseUrl}/api/payments/callback?provider=ZARINPAL&callbackRef=${encodeURIComponent(callbackRef)}`;
  const amountRial = 1000;

  const requestResponse = await fetch("https://api.zarinpal.com/pg/v4/payment/request.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: merchantId,
      amount: amountRial,
      callback_url: callbackUrl,
      description: "asdev-audit-ir zarinpal smoke"
    })
  });

  if (!requestResponse.ok) {
    throw new Error(`ZARINPAL_REQUEST_HTTP_${requestResponse.status}`);
  }

  const requestBody = (await requestResponse.json()) as { data?: { code?: number; authority?: string }; errors?: unknown };
  const authority = requestBody.data?.authority;

  if (requestBody.data?.code !== 100 || !authority) {
    throw new Error(`ZARINPAL_REQUEST_INVALID_RESPONSE_${JSON.stringify(requestBody)}`);
  }

  const verifyResponse = await fetch("https://api.zarinpal.com/pg/v4/payment/verify.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: merchantId,
      amount: amountRial,
      authority
    })
  });

  if (!verifyResponse.ok) {
    throw new Error(`ZARINPAL_VERIFY_HTTP_${verifyResponse.status}`);
  }

  const verifyBody = (await verifyResponse.json()) as { data?: { code?: number; ref_id?: number }; errors?: unknown };
  if (typeof verifyBody.data?.code !== "number") {
    throw new Error(`ZARINPAL_VERIFY_INVALID_RESPONSE_${JSON.stringify(verifyBody)}`);
  }

  const outDir = path.resolve("logs/preflight");
  await fs.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, "zarinpal-smoke.json");
  await fs.writeFile(
    outPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        callbackRef,
        callbackUrl,
        request: { authority, code: requestBody.data?.code },
        verify: { code: verifyBody.data?.code, ref_id: verifyBody.data?.ref_id ?? null }
      },
      null,
      2
    )
  );

  console.log(`[OK] Zarinpal smoke request+verify succeeded. authority=${authority}`);
  console.log(`Report: ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
