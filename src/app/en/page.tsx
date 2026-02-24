import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "../../lib/seoMeta";
import SeoPageEvent from "../../components/SeoPageEvent";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  path: "/",
  title: "Website Audit Platform for Growth Teams",
  description: "Technical audits, SEO diagnostics, security checks, and conversion-ready report delivery.",
  keywords: ["website audit", "technical SEO", "performance audit", "conversion operations"]
});

export default function HomePageEn() {
  return (
    <main>
      <SeoPageEvent event="seo_landing_view" params={{ locale: "en", path: "/en" }} />
      <section className="card hero">
        <h1>Website Audit Platform for Growth Teams</h1>
        <p>
          Built for engineering and growth teams to transform technical/SEO/security findings into clear, execution-ready delivery output.
        </p>
        <div className="hero-actions">
          <Link className="button" href="/en/audit">Start New Audit</Link>
          <Link className="button secondary" href="/en/guides">Explore Guides</Link>
          <Link className="button secondary" href="/en/standards">Delivery Standards</Link>
        </div>
      </section>

      <section className="kpi-grid">
        <article className="kpi"><strong>22/22</strong><p>All checks of done phases passing in automation</p></article>
        <article className="kpi"><strong>10</strong><p>Implemented API routes</p></article>
        <article className="kpi"><strong>20+</strong><p>SEO-ready static and dynamic pages in two languages</p></article>
        <article className="kpi"><strong>4</strong><p>CI pipelines for roadmap, docs, production readiness, and main gate</p></article>
      </section>

      <section className="grid-2">
        <article className="card grid">
          <h2>Core Flows</h2>
          <p>Audit run creation, queued worker execution, tokenized report sharing, checkout callbacks, and paid PDF delivery.</p>
          <Link href="/en/sample-report">Open Sample Report Entry</Link>
        </article>
        <article className="card grid">
          <h2>Operational Tooling</h2>
          <p>Roadmap automation, docs generation, payment preflight checks, and production readiness workflow are fully integrated.</p>
          <Link href="/en/pillar/iran-readiness-audit">Read Platform Pillar</Link>
          <Link href="/en/standards">Output definition and intent map</Link>
          <Link href="/en/brand/asdev-portfolio">Open ASDEV Portfolio Reference</Link>
        </article>
      </section>
    </main>
  );
}
