import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGuideBySlug, getGuideSlugs, getRelatedGuides } from "../../../content/guides";
import { buildArticleSchema, buildBreadcrumbSchema, buildPageMetadata } from "../../../lib/seoMeta";
import SeoPageEvent from "../../../components/SeoPageEvent";

export async function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug, "fa");
  if (!guide) {
    return { title: "راهنما پیدا نشد" };
  }

  return buildPageMetadata({
    locale: "fa",
    path: `/guides/${guide.slug}`,
    title: `${guide.title} | سیستم ممیزی علیرضا صفایی`,
    description: guide.summary,
    type: "article",
    keywords: ["راهنمای سئو", "راهنمای فنی", "audit", guide.slug.replaceAll("-", " ")]
  });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug, "fa");

  if (!guide) {
    notFound();
  }

  const related = getRelatedGuides(guide.slug, "fa");
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "خانه", path: "/" },
    { name: "راهنماها", path: "/guides" },
    { name: guide.title, path: `/guides/${guide.slug}` }
  ]);
  const articleSchema = buildArticleSchema({
    title: guide.title,
    description: guide.summary,
    path: `/guides/${guide.slug}`,
    inLanguage: "fa-IR",
    datePublished: guide.updatedAt,
    dateModified: guide.updatedAt
  });

  return (
    <main className="grid">
      <SeoPageEvent event="seo_guide_view" params={{ locale: "fa", slug: guide.slug }} />
      <section className="card grid">
        <nav aria-label="Breadcrumb">
          <Link href="/guides">بازگشت به راهنماها</Link>
        </nav>
        <h1>{guide.title}</h1>
        <p>{guide.summary}</p>
        <p>آخرین بروزرسانی: {guide.updatedAt}</p>
      </section>

      <section className="card">
        <h2>بخش‌ها</h2>
        <ul>
          {guide.sections.map((section) => (
            <li key={section}>{section}</li>
          ))}
        </ul>
      </section>

      {related.length > 0 ? (
        <section className="card">
          <h2>راهنماهای مرتبط</h2>
          <ul>
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/guides/${item.slug}`}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <script
        id="guide-fa-breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        id="guide-fa-article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </main>
  );
}
