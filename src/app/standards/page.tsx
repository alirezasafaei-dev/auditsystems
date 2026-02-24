import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "../../lib/seoMeta";
import { ASDEV_SIGNATURE_FULL, buildAsdevNetworkLinks } from "../../lib/brand";

export const metadata: Metadata = buildPageMetadata({
  locale: "fa",
  path: "/standards",
  title: "استانداردهای تحویل ASDEV",
  description: "تعریف روشن «این سایت چیست/برای چه کسی است/خروجی چیست» + intent map فارسی و لینک داخلی بین سه محصول ASDEV.",
  keywords: ["استاندارد تحویل", "audit فنی", "intent map فارسی", "ASDEV network"],
  type: "article"
});

export default function StandardsPage() {
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
        <h1>استانداردهای تحویل ASDEV</h1>
        <p>این صفحه مرجع کوتاه، مسئله، مخاطب و خروجی اجرایی هر تحویل را شفاف می‌کند تا تصمیم‌گیری محصول/فنی سریع‌تر شود.</p>
      </section>

      <section className="grid-2">
        <article className="card grid">
          <h2>این سایت چیست؟</h2>
          <p>پلتفرم Audit برای تحلیل فنی، سئو و امنیت با خروجی قابل اقدام برای تیم رشد و تیم فنی.</p>
        </article>
        <article className="card grid">
          <h2>برای چه کسی است؟</h2>
          <p>CTO، تیم Platform، و تیم Growth که نیاز به اولویت‌بندی ریسک و برنامه اصلاح مرحله‌ای دارند.</p>
        </article>
      </section>

      <section className="card grid">
        <h2>خروجی چیست؟</h2>
        <ul>
          <li>گزارش اولویت‌بندی‌شده Performance/SEO/Security</li>
          <li>مسیر اقدام ۷ تا ۳۰ روزه با ترتیب اجرا</li>
          <li>پیوند مستقیم به ابزار اجرای سریع در PersianToolbox و راهبرد در Portfolio</li>
        </ul>
      </section>

      <section className="card grid">
        <h2>Intent map فارسی + internal-link plan</h2>
        <ul>
          <li>جست‌وجوی «بررسی فنی سایت / audit امنیتی» → Audit IR</li>
          <li>جست‌وجوی «ابزار سریع فارسی / تبدیل و محاسبه» → PersianToolbox</li>
          <li>جست‌وجوی «مشاوره زیرساخت / استاندارد تحویل» → ASDEV Portfolio</li>
        </ul>
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
