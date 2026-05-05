import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuideBySlug, getGuideSlugs, getRelatedGuides } from "../../../../content/guides";
import { buildArticleSchema, buildBreadcrumbSchema, buildPageMetadata } from "../../../../lib/seoMeta";
import SeoPageEvent from "../../../../components/SeoPageEvent";

export async function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug, "en");
  if (!guide) return { title: "Guide Not Found" };

  return buildPageMetadata({
    locale: "en",
    path: `/guides/${guide.slug}`,
    title: `${guide.title} | Alireza Safaei Audit System`,
    description: guide.summary,
    type: "article",
    keywords: ["technical SEO guide", "website audit guide", guide.slug.replaceAll("-", " ")]
  });
}

export default async function GuidePageEn({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug, "en");
  if (!guide) notFound();

  const related = getRelatedGuides(guide.slug, "en");
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/en" },
    { name: "Guides", path: "/en/guides" },
    { name: guide.title, path: `/en/guides/${guide.slug}` }
  ]);
  const articleSchema = buildArticleSchema({
    title: guide.title,
    description: guide.summary,
    path: `/en/guides/${guide.slug}`,
    inLanguage: "en-US",
    datePublished: guide.updatedAt,
    dateModified: guide.updatedAt
  });

  return (
    <main className="grid">
      <SeoPageEvent event="seo_guide_view" params={{ locale: "en", slug: guide.slug }} />
      <section className="card grid">
        <nav aria-label="Breadcrumb">
          <Link href="/en/guides">Back to guides</Link>
        </nav>
        <h1>{guide.title}</h1>
        <p>{guide.summary}</p>
        <p>Last updated: {guide.updatedAt}</p>
      </section>
      <section className="card">
        <h2>Sections</h2>
        <ul>
          {guide.sections.map((section) => (
            <li key={section}>{section}</li>
          ))}
        </ul>
      </section>
      {related.length > 0 ? (
        <section className="card">
          <h2>Related Guides</h2>
          <ul>
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/en/guides/${item.slug}`}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <script
        id="guide-en-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        id="guide-en-article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </main>
  );
}
