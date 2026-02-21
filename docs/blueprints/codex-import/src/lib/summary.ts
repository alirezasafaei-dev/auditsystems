// 01-audit/src/lib/summary.ts
import type { AuditSummaryV1 } from "./summary.types";
import type { Finding, ExtractedResource } from "./types";

function headerPresent(headers: Record<string, string>, name: string) {
  return Object.keys(headers).some((k) => k.toLowerCase() === name.toLowerCase());
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function buildAuditSummaryV1(input: {
  runId: string;
  inputUrl: string;
  normalizedUrl: string;
  finalUrl?: string;
  headers: Record<string, string>;
  resources: ExtractedResource[];
  findings: Finding[];
  lighthouse?: any;
  durationMs?: number;
  depth?: "QUICK" | "DEEP";
}): AuditSummaryV1 {
  const thirdPartyHosts = new Map<
    string,
    { host: string; count: number; kinds: Record<string, number>; examples: string[]; tags: string[] }
  >();

  for (const r of input.resources) {
    if (!r.isThirdParty) continue;
    const cur =
      thirdPartyHosts.get(r.host) ?? { host: r.host, count: 0, kinds: {}, examples: [], tags: [] };

    cur.count += 1;
    cur.kinds[r.kind] = (cur.kinds[r.kind] ?? 0) + 1;
    if (cur.examples.length < 5) cur.examples.push(r.url);

    const u = r.url.toLowerCase();
    if (u.includes("recaptcha")) cur.tags.push("recaptcha");
    if (u.includes("fonts.googleapis") || u.includes("fonts.gstatic")) cur.tags.push("google-fonts");

    thirdPartyHosts.set(r.host, cur);
  }

  const mixed = input.resources.filter((r) => /^http:\/\//i.test(r.url));

  // SEO basics — MVP: با regex سریع (برای دقت بهتر از parser استفاده کنید)
  const html = ""; // placeholder: اگر HTML را اینجا پاس بدهید، می‌توانید title/meta را دقیق‌تر بسازید
  const titlePresent = /<title>.*?<\/title>/i.test(html);
  const descPresent = /<meta\s+name=["']description["'][^>]*>/i.test(html);
  const canonicalPresent = /<link\s+rel=["']canonical["'][^>]*>/i.test(html);
  const ogPresent = /<meta\s+property=["']og:/i.test(html);

  const firstHost = new URL(input.normalizedUrl).hostname;

  return {
    schema: "asdev.audit.summary.v1",
    generatedAt: new Date().toISOString(),
    run: {
      id: input.runId,
      inputUrl: input.inputUrl,
      normalizedUrl: input.normalizedUrl,
      finalUrl: input.finalUrl,
      depth: input.depth,
      status: "SUCCEEDED",
      durationMs: input.durationMs,
    },
    dependencies: {
      firstPartyHosts: [firstHost],
      thirdParty: {
        count: thirdPartyHosts.size,
        hosts: Array.from(thirdPartyHosts.values()).map((x) => ({
          host: x.host,
          requestCount: x.count,
          kinds: x.kinds,
          tags: uniq(x.tags),
          examples: x.examples,
        })),
        highRiskHosts: Array.from(thirdPartyHosts.values())
          .filter((x) => x.tags.includes("recaptcha") || x.tags.includes("google-fonts"))
          .map((x) => x.host),
      },
    },
    security: {
      https: new URL(input.normalizedUrl).protocol === "https:",
      mixedContent: { count: mixed.length, examples: mixed.slice(0, 10).map((x) => x.url) },
      headers: {
        csp: headerPresent(input.headers, "content-security-policy") ? "present" : "missing",
        hsts: headerPresent(input.headers, "strict-transport-security") ? "present" : "missing",
        xContentTypeOptions: headerPresent(input.headers, "x-content-type-options") ? "present" : "missing",
        referrerPolicy: headerPresent(input.headers, "referrer-policy") ? "present" : "missing",
        permissionsPolicy: headerPresent(input.headers, "permissions-policy") ? "present" : "missing",
      },
    },
    seoBasics: {
      title: titlePresent ? "present" : "missing",
      metaDescription: descPresent ? "present" : "missing",
      canonical: canonicalPresent ? "present" : "missing",
      openGraph: ogPresent ? "present" : "missing",
    },
    findings: input.findings.map((f) => ({
      code: f.code,
      category: f.category,
      severity: f.severity,
      title: f.title,
      recommendation: f.recommendation,
      evidence: f.evidence,
    })),
    highlights: {
      topFixes: input.findings.slice(0, 3).map((f) => ({
        code: f.code,
        impact: "HIGH",
        effort: "MEDIUM",
        why: f.title,
        steps: [f.recommendation],
      })),
    },
  };
}
