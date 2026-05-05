import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "../lib/seoMeta";
import SeoPageEvent from "../components/SeoPageEvent";
import IntentRouter from "../components/IntentRouter";

export const metadata: Metadata = buildPageMetadata({
  locale: "fa",
  path: "/",
  title: "ارزیابی فنی، سئو و امنیت وب‌سایت",
  description: "آدرس سایت را وارد کنید و یک گزارش قابل‌اجرا برای تیم فنی و تیم رشد دریافت کنید.",
  keywords: ["ارزیابی سایت", "سئو فنی", "امنیت سایت", "core web vitals"]
});

export default function HomePage() {
  return (
    <main className="landing">
      <SeoPageEvent event="seo_landing_view" params={{ locale: "fa", path: "/" }} />
      <section className="card hero hero-large">
        <span className="badge hero-badge">گزارش اجرایی برای تیم فنی و رشد</span>
        <h1>ارزیابی سایت با خروجی قابل‌اجرا، نه فقط لیست خطا</h1>
        <p className="hero-lead">
          در کمتر از چند دقیقه، مشکلات فنی، سئو و امنیت سایت شما اولویت‌بندی می‌شود و مسیر اصلاح مرحله‌به‌مرحله دریافت می‌کنید.
        </p>
        <ul className="hero-checklist">
          <li>خروجی واضح برای تیم فنی، محتوا و رشد</li>
          <li>طبقه‌بندی ریسک: بحرانی، بالا، متوسط</li>
          <li>قابل استفاده برای برنامه ۷ تا ۳۰ روزه</li>
        </ul>
        <div className="hero-actions">
          <Link className="button" href="/audit">
            شروع ارزیابی جدید
          </Link>
          <Link className="button secondary" href="/guides">
            راهنماهای کاربردی
          </Link>
          <Link className="button secondary" href="/standards">
            استاندارد تحویل
          </Link>
          <Link
            className="button secondary"
            href="https://alirezasafaeisystems.ir/?utm_source=audit&utm_medium=cross_site&utm_campaign=alireza_safaei_network&utm_content=hero_contact"
            target="_blank"
            rel="noopener noreferrer"
          >
            مشاوره و ارتباط مستقیم
          </Link>
          <Link
            className="button secondary"
            href="https://persiantoolbox.ir/?utm_source=audit&utm_medium=cross_site&utm_campaign=alireza_safaei_network&utm_content=hero_toolbox"
            target="_blank"
            rel="noopener noreferrer"
          >
            ابزارهای فارسی PersianToolbox
          </Link>
        </div>
      </section>

      <section className="trust-strip">
        <article>
          <strong>تحویل سریع</strong>
          <p>ثبت درخواست و شروع پردازش به‌صورت خودکار</p>
        </article>
        <article>
          <strong>خروجی قابل پیگیری</strong>
          <p>برای هر یافته، اقدام پیشنهادی مشخص دریافت می‌کنید</p>
        </article>
        <article>
          <strong>زیرساخت پایدار</strong>
          <p>مسیر آماده برای تیم‌های تولیدی و عملیاتی</p>
        </article>
      </section>

      <IntentRouter locale="fa" />

      <section className="kpi-grid">
        <article className="kpi">
          <strong>22/22</strong>
          <p>عبور کامل چک‌های فازهای Done در اتوماسیون</p>
        </article>
        <article className="kpi">
          <strong>10</strong>
          <p>مسیر API عملیاتی و مستند</p>
        </article>
        <article className="kpi">
          <strong>20+</strong>
          <p>صفحه سئو-آماده در دو زبان فارسی و انگلیسی</p>
        </article>
        <article className="kpi">
          <strong>4</strong>
          <p>پایپلاین CI برای roadmap، docs، readiness و main gate</p>
        </article>
      </section>

      <section className="section-head">
        <h2>چطور این سرویس کمک می‌کند؟</h2>
        <p>از ثبت درخواست تا تحویل گزارش نهایی، همه‌چیز برای اجرای سریع طراحی شده است.</p>
      </section>

      <section className="feature-grid">
        <article className="card feature">
          <h3>جریان‌های اصلی</h3>
          <p>ثبت درخواست ارزیابی، اجرای worker در صف، لینک گزارش امن و تحویل خروجی برای تیم شما.</p>
          <Link href="/sample-report">مشاهده نمونه گزارش</Link>
        </article>
        <article className="card feature">
          <h3>ابزارهای عملیاتی</h3>
          <p>اتوماسیون roadmap، تولید مستندات، preflight پرداخت و workflow آماده‌سازی Production یکپارچه شده است.</p>
          <Link href="/pillar/iran-readiness-audit">مطالعه چارچوب ارزیابی</Link>
          <Link href="/standards">تعریف خروجی و intent map فارسی</Link>
        </article>
      </section>
    </main>
  );
}
