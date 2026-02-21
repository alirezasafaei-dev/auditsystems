import Link from "next/link";
import { guides } from "../../../content/guides";
import type { Metadata } from "next";

const baseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Guides",
  description: "Growth and technical playbooks for performance, SEO, security, and conversion operations.",
  alternates: {
    canonical: `${baseUrl}/en/guides`,
    languages: {
      "fa-IR": `${baseUrl}/guides`,
      en: `${baseUrl}/en/guides`
    }
  }
};

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
