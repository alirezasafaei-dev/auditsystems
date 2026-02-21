import { describe, expect, it } from "vitest";
import { normalizeAuditTargetUrl } from "./normalizeAuditTargetUrl";

describe("normalizeAuditTargetUrl", () => {
  it("adds default https scheme", async () => {
    const out = await normalizeAuditTargetUrl("example.com");
    expect(out.normalizedUrl).toBe("https://example.com/");
    expect(out.warnings).toContain("SCHEME_ADDED_DEFAULT");
  });

  it("strips credentials", async () => {
    const out = await normalizeAuditTargetUrl("https://user:pass@example.com/path");
    expect(out.normalizedUrl).toBe("https://example.com/path");
    expect(out.warnings).toContain("CREDENTIALS_STRIPPED");
  });

  it("drops hash and tracking query params and sorts query", async () => {
    const out = await normalizeAuditTargetUrl("https://example.com/?utm_source=x&b=2&gclid=123&a=1#frag");
    expect(out.normalizedUrl).toBe("https://example.com/?a=1&b=2");
  });

  it("removes default ports", async () => {
    const out = await normalizeAuditTargetUrl("https://example.com:443/a");
    expect(out.normalizedUrl).toBe("https://example.com/a");
  });

  it("normalizes duplicate slashes and trailing slash", async () => {
    const out = await normalizeAuditTargetUrl("https://example.com//a//b/");
    expect(out.normalizedUrl).toBe("https://example.com/a/b");
  });

  it("converts IDN host to ASCII", async () => {
    const out = await normalizeAuditTargetUrl("https://bücher.de");
    expect(out.host).toBe("xn--bcher-kva.de");
  });

  it("blocks localhost", async () => {
    await expect(normalizeAuditTargetUrl("http://localhost:8080")).rejects.toThrow("SSRF_BLOCKED_HOSTNAME");
  });

  it("blocks .local and .internal domains", async () => {
    await expect(normalizeAuditTargetUrl("http://myapp.local")).rejects.toThrow("SSRF_BLOCKED_HOSTNAME");
    await expect(normalizeAuditTargetUrl("http://service.internal")).rejects.toThrow("SSRF_BLOCKED_HOSTNAME");
  });

  it("blocks private IPv4", async () => {
    await expect(normalizeAuditTargetUrl("http://10.10.0.1")).rejects.toThrow("SSRF_BLOCKED_PRIVATE_IP");
    await expect(normalizeAuditTargetUrl("http://192.168.1.20")).rejects.toThrow("SSRF_BLOCKED_PRIVATE_IP");
  });

  it("blocks loopback IPv6", async () => {
    await expect(normalizeAuditTargetUrl("http://[::1]"))
      .rejects
      .toThrow("SSRF_BLOCKED_PRIVATE_IP");
  });

  it("blocks protocol other than http/https", async () => {
    await expect(normalizeAuditTargetUrl("ftp://example.com")).rejects.toThrow("INVALID_URL_PROTOCOL");
  });

  it("strips control chars", async () => {
    const out = await normalizeAuditTargetUrl("\u0000\nhttps://example.com");
    expect(out.normalizedUrl).toBe("https://example.com/");
  });

  it("enforces max length", async () => {
    await expect(normalizeAuditTargetUrl(`https://example.com/${"a".repeat(3000)}`)).rejects.toThrow("INVALID_URL_TOO_LONG");
  });

  it("rejects malformed urls", async () => {
    await expect(normalizeAuditTargetUrl("https://exa mple.com")).rejects.toThrow("INVALID_URL_PARSE");
  });

  it("rejects dns lookup that resolves to private ip", async () => {
    await expect(
      normalizeAuditTargetUrl("https://example.com", {
        verifyDnsPublicIp: true,
        dnsLookup: async () => [{ address: "10.0.0.2", family: 4 }]
      })
    ).rejects.toThrow("SSRF_BLOCKED_DNS_PRIVATE_IP");
  });

  it("accepts dns lookup with public records", async () => {
    const out = await normalizeAuditTargetUrl("https://example.com", {
      verifyDnsPublicIp: true,
      dnsLookup: async () => [{ address: "93.184.216.34", family: 4 }]
    });
    expect(out.normalizedUrl).toBe("https://example.com/");
  });

  it("keeps http scheme when explicitly provided", async () => {
    const out = await normalizeAuditTargetUrl("http://example.com/path");
    expect(out.protocol).toBe("http:");
  });
});
