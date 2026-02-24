import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "../../../lib/seoMeta";
import { ASDEV_SIGNATURE_FULL, buildAsdevNetworkLinks } from "../../../lib/brand";

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  path: "/standards",
  title: "ASDEV Delivery Standards",
  description: "Clear contract for what this product is, who it serves, and what measurable delivery output is expected.",
  keywords: ["delivery standards", "technical audit", "internal links", "asdev network"],
  type: "article"
});

export default function StandardsPageEn() {
  const networkLinks = buildAsdevNetworkLinks("audit", "standards_page");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ASDEV cross-site intent links",
    itemListElement: networkLinks.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: item.href
    }))
  };

  return (
    <main className="container page-shell space-y-8 py-10" id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="card hero">
        <h1>ASDEV Delivery Standards</h1>
        <p>This page states what this site is, who it is for, and what measurable output every delivery should produce.</p>
      </section>

      <section className="grid-2">
        <article className="card grid">
          <h2>What is this site?</h2>
          <p>A technical audit platform for performance, SEO, and security with action-ready output.</p>
        </article>
        <article className="card grid">
          <h2>Who is it for?</h2>
          <p>CTOs, platform teams, and growth teams needing risk prioritization and step-by-step remediation.</p>
        </article>
      </section>

      <section className="card grid">
        <h2>Expected output</h2>
        <ul>
          <li>Prioritized findings for Performance/SEO/Security</li>
          <li>Action plan for 7/30-day execution windows</li>
          <li>Cross-links to PersianToolbox for execution and Portfolio for strategy</li>
        </ul>
      </section>

      <section className="card grid">
        <h2>Intent map + internal-link plan</h2>
        <div className="footer-links">
          {networkLinks.map((item) => (
            <Link key={item.key} href={item.href} target="_blank" rel="noopener noreferrer" className="link">
              {item.label}
            </Link>
          ))}
        </div>
        <p className="text-sm text-muted">{ASDEV_SIGNATURE_FULL}</p>
      </section>
    </main>
  );
}
