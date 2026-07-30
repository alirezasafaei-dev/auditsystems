import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { fetchAuditHtml } from "./safeAuditFetch";

describe("fetchAuditHtml", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    vi.stubEnv("AUDIT_ALLOW_LOCAL_FIXTURE", "true");

    server = createServer((request, response) => {
      if (request.url === "/redirect") {
        response.writeHead(302, { Location: "/ok" });
        response.end();
        return;
      }

      if (request.url === "/loop") {
        response.writeHead(302, { Location: "/loop" });
        response.end();
        return;
      }

      if (request.url === "/large") {
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.end("x".repeat(512));
        return;
      }

      if (request.url === "/binary") {
        response.writeHead(200, { "Content-Type": "application/octet-stream" });
        response.end("not html");
        return;
      }

      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end("<html><head><title>Fixture</title></head><body>ok</body></html>");
    });

    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", () => resolve());
    });

    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    vi.unstubAllEnvs();
  });

  it("fetches HTML through the DNS-pinned transport", async () => {
    const response = await fetchAuditHtml(`${baseUrl}/ok`, new AbortController().signal);

    expect(response.status).toBe(200);
    expect(response.finalUrl).toBe(`${baseUrl}/ok`);
    expect(response.html).toContain("<title>Fixture</title>");
  });

  it("revalidates and follows bounded redirects", async () => {
    const response = await fetchAuditHtml(`${baseUrl}/redirect`, new AbortController().signal);

    expect(response.status).toBe(200);
    expect(response.finalUrl).toBe(`${baseUrl}/ok`);
  });

  it("rejects redirect loops", async () => {
    await expect(
      fetchAuditHtml(`${baseUrl}/loop`, new AbortController().signal, { maxRedirects: 1 })
    ).rejects.toThrow("AUDIT_TOO_MANY_REDIRECTS");
  });

  it("rejects decompressed bodies over the byte budget", async () => {
    await expect(
      fetchAuditHtml(`${baseUrl}/large`, new AbortController().signal, { maxResponseBytes: 64 })
    ).rejects.toThrow("AUDIT_RESPONSE_TOO_LARGE");
  });

  it("rejects non-HTML content", async () => {
    await expect(fetchAuditHtml(`${baseUrl}/binary`, new AbortController().signal)).rejects.toThrow(
      "AUDIT_UNSUPPORTED_CONTENT_TYPE"
    );
  });
});
