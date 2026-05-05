import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "../../../lib/seoMeta";
import { ASDEV_BRAND, getAsdevSignature } from "../../../lib/brand";
import SeoPageEvent from "../../../components/SeoPageEvent";

const baseMetadata = buildPageMetadata({
  locale: "fa",
  path: "/brand/asdev-portfolio",
  title: "Alireza Safaei Portfolio | صفحه مرجع برند",
  description: "معرفی صفحه مرجع برند علیرضا صفایی در سایت اصلی و ارتباط آن با پلتفرم Audit.",
  keywords: ["Alireza Safaei", "علیرضا صفایی", "portfolio", "برند", "audit"]
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

export default function AsdevPortfolioBrandFaPage() {
  return (
    <main>
      <SeoPageEvent event="seo_brand_portfolio_view" params={{ locale: "fa", path: "/brand/asdev-portfolio" }} />
      <section className="card hero">
        <h1>صفحه مرجع برند Alireza Safaei Portfolio</h1>
        <p>
          {getAsdevSignature("fa")} | پلتفرم Audit بخشی از شبکه محصولات علیرضا صفایی است و صفحه مرجع روایت برند و مطالعات
          موردی در سایت اصلی نگهداری می‌شود.
        </p>
        <div className="hero-actions">
          <a className="button" href={ASDEV_BRAND.portfolioBrandPageFa} target="_blank" rel="noopener noreferrer">
            مشاهده صفحه برند
          </a>
          <a className="button secondary" href={ASDEV_BRAND.portfolioHomeUrl} target="_blank" rel="noopener noreferrer">
            ورود به Portfolio
          </a>
        </div>
      </section>

      <section className="grid-2">
        <article className="card grid">
          <h2>چرا این صفحه مهم است؟</h2>
          <p>استانداردهای تحویل، مدل خدمات و اعتبار بین‌پروژه‌ای در این صفحه و صفحات مرتبط آن تعریف می‌شود.</p>
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
