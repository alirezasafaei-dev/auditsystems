import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "../../../lib/seoMeta";
import { ASDEV_BRAND, getAsdevSignature } from "../../../lib/brand";
import SeoPageEvent from "../../../components/SeoPageEvent";

export const metadata: Metadata = buildPageMetadata({
  locale: "fa",
  path: "/brand/asdev-portfolio",
  title: "ASDEV Portfolio | صفحه مرجع برند",
  description: "معرفی صفحه مرجع برند ASDEV در سایت اصلی علیرضا صفایی و ارتباط آن با محصول Asdev Audit.",
  keywords: ["ASDEV", "علیرضا صفایی", "portfolio", "برند", "asdev audit"]
});

export default function AsdevPortfolioBrandFaPage() {
  return (
    <main>
      <SeoPageEvent event="seo_brand_portfolio_view" params={{ locale: "fa", path: "/brand/asdev-portfolio" }} />
      <section className="card hero">
        <h1>صفحه مرجع برند ASDEV Portfolio</h1>
        <p>
          {getAsdevSignature("fa")} | محصول Asdev Audit بخشی از اکوسیستم محصولات ASDEV است و صفحه مرجع روایت برند و مطالعات
          موردی در سایت اصلی نگهداری می‌شود.
        </p>
        <div className="hero-actions">
          <a className="button" href={ASDEV_BRAND.portfolioBrandPageFa} target="_blank" rel="noopener noreferrer">
            مشاهده صفحه برند ASDEV
          </a>
          <a className="button secondary" href={ASDEV_BRAND.portfolioHomeUrl} target="_blank" rel="noopener noreferrer">
            ورود به ASDEV Portfolio
          </a>
        </div>
      </section>

      <section className="grid-2">
        <article className="card grid">
          <h2>چرا این صفحه مهم است؟</h2>
          <p>استانداردهای تحویل، مدل خدمات و اعتبار بین‌پروژه‌ای ASDEV در این صفحه و صفحات مرتبط آن تعریف می‌شود.</p>
          <Link href="/guides">مشاهده راهنماهای Asdev Audit</Link>
        </article>
        <article className="card grid">
          <h2>اتصال محصولی</h2>
          <p>برای درک بهتر ارتباط بین Audit، PersianToolbox و Portfolio از صفحه مرجع برند شروع کنید.</p>
          <a href={ASDEV_BRAND.portfolioBrandPageFa} target="_blank" rel="noopener noreferrer">
            رفتن به صفحه مرجع برند
          </a>
        </article>
      </section>
    </main>
  );
}
