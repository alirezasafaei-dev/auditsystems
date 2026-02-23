import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "../lib/seoMeta";
import SeoPageEvent from "../components/SeoPageEvent";

export const metadata: Metadata = buildPageMetadata({
  locale: "fa",
  path: "/",
  title: "پلتفرم تحلیل فنی و سئوی وب‌سایت",
  description: "اجرای audit فنی، تحلیل یافته‌ها، و تبدیل گزارش به جریان پرداخت و تحویل حرفه‌ای.",
  keywords: ["audit سایت", "سئو فنی", "security audit", "core web vitals"]
});

export default function HomePage() {
  return (
    <main>
      <SeoPageEvent event="seo_landing_view" params={{ locale: "fa", path: "/" }} />
      <section className="card hero">
        <h1>پلتفرم Audit وب‌سایت برای تیم‌های رشد</h1>
        <p>تحلیل فنی، بررسی سئو، کنترل امنیت و تبدیل گزارش به جریان تحویل پولی با اتوماسیون Production-Ready.</p>
        <div className="hero-actions">
          <Link className="button" href="/audit">
            شروع Audit جدید
          </Link>
          <Link className="button secondary" href="/guides">
            مشاهده راهنماها
          </Link>
        </div>
      </section>

      <section className="kpi-grid">
        <article className="kpi">
          <strong>22/22</strong>
          <p>عبور کامل چک‌های فازهای Done در اتوماسیون</p>
        </article>
        <article className="kpi">
          <strong>10</strong>
          <p>مسیر API عملیاتی و مستندسازی‌شده</p>
        </article>
        <article className="kpi">
          <strong>20+</strong>
          <p>صفحات سئو-آماده در دو زبان فارسی و انگلیسی</p>
        </article>
        <article className="kpi">
          <strong>4</strong>
          <p>پایپلاین CI برای roadmap، docs، readiness و main gate</p>
        </article>
      </section>

      <section className="grid-2">
        <article className="card grid">
          <h2>جریان‌های اصلی</h2>
          <p>ایجاد run، اجرای worker در صف، اشتراک‌گذاری tokenized، callback پرداخت، و تحویل PDF پولی.</p>
          <Link href="/sample-report">مشاهده ورودی گزارش نمونه</Link>
        </article>
        <article className="card grid">
          <h2>ابزارهای عملیاتی</h2>
          <p>اتوماسیون roadmap، تولید مستندات، preflight پرداخت و workflow آماده‌سازی Production یکپارچه شده‌اند.</p>
          <Link href="/pillar/iran-readiness-audit">مطالعه صفحه راهبردی</Link>
          <Link href="/brand/asdev-portfolio">صفحه مرجع ASDEV Portfolio</Link>
        </article>
      </section>
    </main>
  );
}
