import type { Metadata } from "next";
import { buildPageMetadata } from "../../../lib/seoMeta";

export const metadata: Metadata = buildPageMetadata({
  locale: "fa",
  path: "/pillar/iran-readiness-audit",
  title: "صفحه راهبردی Iran Readiness Audit",
  description: "راهبرد جامع برای کارایی، سئو، امنیت و آمادگی پرداخت وب‌سایت‌های رشدگرا در ایران.",
  keywords: ["iran readiness audit", "سئو ایران", "audit فنی", "پرداخت"]
});

export default function IranReadinessAuditPillarPage() {
  return (
    <main className="grid">
      <section className="card">
        <h1>صفحه راهبردی Iran Readiness Audit</h1>
        <p>این صفحه، رویه‌های کارایی، سئو، پایداری و آمادگی پرداخت برای وب‌سایت‌های رشدگرا در ایران را یکپارچه می‌کند.</p>
      </section>

      <section className="card">
        <h2>دامنه بررسی</h2>
        <ul>
          <li>سئوی فنی و سلامت ایندکس</li>
          <li>Core Web Vitals و کنترل تاخیر فرانت‌اند</li>
          <li>کنترل‌های امنیتی برای URL fetching و کاهش نشت داده</li>
          <li>جریان لید تا سفارش، پرداخت و تحویل</li>
        </ul>
      </section>
    </main>
  );
}
