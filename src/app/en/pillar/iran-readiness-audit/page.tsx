import type { Metadata } from "next";
import { buildPageMetadata } from "../../../../lib/seoMeta";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  path: "/pillar/iran-readiness-audit",
  title: "Iran Readiness Audit Pillar",
  description: "A strategic pillar for technical SEO, performance, resilience, and payment readiness in Iran.",
  keywords: ["iran readiness audit", "technical SEO", "website resilience", "payment readiness"]
});

export default function IranReadinessAuditPillarPageEn() {
  return (
    <main className="grid">
      <section className="card">
        <h1>Iran Readiness Audit Pillar</h1>
        <p>This pillar consolidates performance, SEO, resilience, and payment-readiness practices for high-growth sites in Iran.</p>
      </section>

      <section className="card">
        <h2>Scope</h2>
        <ul>
          <li>Technical SEO and indexing hygiene</li>
          <li>Core Web Vitals and frontend latency controls</li>
          <li>Security controls around URL fetching and data exposure</li>
          <li>Lead-to-order payment and delivery workflows</li>
        </ul>
      </section>
    </main>
  );
}
