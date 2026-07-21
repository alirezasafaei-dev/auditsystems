import { describe, expect, it, beforeEach } from "vitest";
import { createCheckout, verifyCheckout, resolvePaymentProvider } from "./payments";
import { PaymentProvider } from "@prisma/client";

describe("payments", () => {
  beforeEach(() => {
    delete process.env.ZARINPAL_MERCHANT_ID;
    delete process.env.PAYMENT_PROVIDER_DEFAULT;
  });

  describe("resolvePaymentProvider", () => {
    it("resolves ZARINPAL provider", () => {
      expect(resolvePaymentProvider("zarinpal")).toBe("ZARINPAL");
      expect(resolvePaymentProvider("ZARINPAL")).toBe("ZARINPAL");
    });

    it("fails closed to MOCK for unsupported IDPAY requests", () => {
      expect(resolvePaymentProvider("idpay")).toBe("MOCK");
      expect(resolvePaymentProvider("IDPAY")).toBe("MOCK");
    });

    it("fails closed to MOCK for unsupported PAYPING requests", () => {
      expect(resolvePaymentProvider("payping")).toBe("MOCK");
      expect(resolvePaymentProvider("PAYPING")).toBe("MOCK");
    });

    it("resolves MOCK provider as default", () => {
      expect(resolvePaymentProvider("unknown")).toBe("MOCK");
      expect(resolvePaymentProvider(null)).toBe("MOCK");
    });

    it("fails closed when the default provider is unsupported", () => {
      process.env.PAYMENT_PROVIDER_DEFAULT = "IDPAY";
      expect(resolvePaymentProvider()).toBe("MOCK");

      process.env.PAYMENT_PROVIDER_DEFAULT = "PAYPING";
      expect(resolvePaymentProvider()).toBe("MOCK");
    });
  });

  describe("createCheckout", () => {
    it("creates MOCK checkout successfully", async () => {
      const result = await createCheckout({
        provider: "MOCK",
        orderId: "order-123",
        callbackRef: "ref-456",
        amountToman: 100000,
        email: "test@example.com"
      });

      expect(result.redirectUrl).toContain("MOCK-order-123");
      expect(result.providerRef).toBe("MOCK-order-123");
      expect(result.callbackRef).toBe("ref-456");
    });

    it("throws error for ZARINPAL without merchant ID", async () => {
      await expect(
        createCheckout({
          provider: "ZARINPAL",
          orderId: "order-123",
          callbackRef: "ref-456",
          amountToman: 100000,
          email: "test@example.com"
        })
      ).rejects.toThrow("PAYMENT_PROVIDER_NOT_CONFIGURED");
    });

    it("rejects direct PAYPING checkout as unimplemented", async () => {
      await expect(
        createCheckout({
          provider: "PAYPING",
          orderId: "order-123",
          callbackRef: "ref-456",
          amountToman: 100000,
          email: "test@example.com"
        })
      ).rejects.toThrow("PAYMENT_PROVIDER_NOT_IMPLEMENTED");
    });

    it("rejects direct IDPAY checkout as unimplemented", async () => {
      await expect(
        createCheckout({
          provider: "IDPAY",
          orderId: "order-123",
          callbackRef: "ref-456",
          amountToman: 100000,
          email: "test@example.com"
        })
      ).rejects.toThrow("PAYMENT_PROVIDER_NOT_IMPLEMENTED");
    });

    it("throws error for unimplemented provider", async () => {
      await expect(
        createCheckout({
          provider: "UNKNOWN" as PaymentProvider,
          orderId: "order-123",
          callbackRef: "ref-456",
          amountToman: 100000,
          email: "test@example.com"
        })
      ).rejects.toThrow("PAYMENT_PROVIDER_NOT_IMPLEMENTED");
    });
  });

  describe("verifyCheckout", () => {
    it("verifies MOCK checkout successfully", async () => {
      const result = await verifyCheckout({
        provider: "MOCK",
        providerRef: "MOCK-order-123",
        amountToman: 100000,
        callbackStatus: "OK"
      });

      expect(result.paid).toBe(true);
      expect(result.providerRef).toBe("MOCK-order-123");
    });

    it("verifies MOCK checkout with failed status", async () => {
      const result = await verifyCheckout({
        provider: "MOCK",
        providerRef: "MOCK-order-123",
        amountToman: 100000,
        callbackStatus: "FAILED"
      });

      expect(result.paid).toBe(false);
    });

    it("throws error for ZARINPAL without merchant ID", async () => {
      await expect(
        verifyCheckout({
          provider: "ZARINPAL",
          providerRef: "auth-123",
          amountToman: 100000
        })
      ).rejects.toThrow("PAYMENT_PROVIDER_NOT_CONFIGURED");
    });

    it("rejects direct PAYPING verification as unimplemented", async () => {
      await expect(
        verifyCheckout({
          provider: "PAYPING",
          providerRef: "ref-123",
          amountToman: 100000
        })
      ).rejects.toThrow("PAYMENT_PROVIDER_NOT_IMPLEMENTED");
    });

    it("rejects direct IDPAY verification as unimplemented", async () => {
      await expect(
        verifyCheckout({
          provider: "IDPAY",
          providerRef: "id-123",
          amountToman: 100000
        })
      ).rejects.toThrow("PAYMENT_PROVIDER_NOT_IMPLEMENTED");
    });

    it("throws error for unimplemented provider", async () => {
      await expect(
        verifyCheckout({
          provider: "UNKNOWN" as PaymentProvider,
          providerRef: "ref-123",
          amountToman: 100000
        })
      ).rejects.toThrow("PAYMENT_PROVIDER_NOT_IMPLEMENTED");
    });
  });
});
