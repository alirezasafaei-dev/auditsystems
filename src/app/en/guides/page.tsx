import Link from "next/link";
import { getGuides } from "../../../content/guides";
import type { Metadata } from "next";
import { buildPageMetadata } from "../../../lib/seoMeta";

const guides = getGuides("en");

export const metadata: Metadata = buildPageMetadata({
  locale: "en",
  path: "/guides",
  title: "Growth and Technical Guides",
  description: "Growth and technical playbooks for performance, SEO, security, and conversion operations.",
  keywords: ["technical SEO guides", "performance playbooks", "security playbooks"]
});

export default function GuidesIndexPageEn() {
  return (
    <main>
      <section className="card hero">
        <h1>Growth & Technical Guides</h1>
        <p>Curated playbooks for audit quality, web performance, security posture, and conversion operations.</p>
      </section>

      <section className="guide-grid">
        {guides.map((guide) => (
          <article key={guide.slug} className="guide-item">
            <h2>{guide.title}</h2>
            <p>{guide.summary}</p>
            <p><Link href={`/en/guides/${guide.slug}`}>Read Guide</Link></p>
          </article>
        ))}
      </section>
    </main>
  );
}
