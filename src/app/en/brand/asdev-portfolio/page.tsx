import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "../../../../lib/seoMeta";
import { ASDEV_BRAND, getAsdevSignature } from "../../../../lib/brand";
import SeoPageEvent from "../../../../components/SeoPageEvent";

const baseMetadata = buildPageMetadata({
  locale: "en",
  path: "/brand/asdev-portfolio",
  title: "Alireza Safaei Portfolio | Brand Reference Page",
  description: "Reference page for Alireza Safaei brand identity and its relation to the Audit platform.",
  keywords: ["Alireza Safaei", "portfolio", "brand", "audit"]
});
export const metadata: Metadata = {
  ...baseMetadata,
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function AsdevPortfolioBrandEnPage() {
  return (
    <main>
      <SeoPageEvent event="seo_brand_portfolio_view" params={{ locale: "en", path: "/en/brand/asdev-portfolio" }} />
      <section className="card hero">
        <h1>Alireza Safaei Portfolio Brand Reference</h1>
        <p>
          {getAsdevSignature("en")} | Audit platform is part of Alireza Safaei product ecosystem. The primary brand narrative and delivery
          case studies are maintained on the main portfolio.
        </p>
        <div className="hero-actions">
          <a className="button" href={ASDEV_BRAND.portfolioBrandPageEn} target="_blank" rel="noopener noreferrer">
            Open Brand Page
          </a>
          <a className="button secondary" href={ASDEV_BRAND.portfolioHomeUrl} target="_blank" rel="noopener noreferrer">
            Open Portfolio
          </a>
        </div>
      </section>

      <section className="grid-2">
        <article className="card grid">
          <h2>Why this page matters</h2>
          <p>Delivery standards, service model, and cross-project trust layer are documented on this reference page.</p>
          <Link href="/en/guides">Explore Asdev Audit Guides</Link>
        </article>
        <article className="card grid">
          <h2>Product ecosystem continuity</h2>
          <p>Start from the brand reference to understand relationship between Audit, PersianToolbox, and Portfolio.</p>
          <a href={ASDEV_BRAND.portfolioBrandPageEn} target="_blank" rel="noopener noreferrer">
            Go to brand reference page
          </a>
        </article>
      </section>
    </main>
  );
}
