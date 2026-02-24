import type { Metadata } from "next";
import Link from "next/link";
import {
  ASDEV_BRAND,
  ASDEV_PORTFOLIO_LINE,
  ASDEV_SIGNATURE_FULL,
  ASDEV_TELEGRAM_URL,
  buildAsdevNetworkLinks
} from "../../lib/brand";

export const metadata: Metadata = {
  title: "ASDEV — صفحه برند و لینک‌های شبکه",
  description: "لینک‌دهی رسمی بین پورتفولیو، PersianToolbox و Audit IR همراه با امضای برند ASDEV.",
  alternates: {
    canonical: "https://audit.alirezasafaeisystems.ir/asdev"
  },
  openGraph: {
    title: "ASDEV | شبکه محصولات",
    description: "صفحه برند ASDEV با لینک‌های متقابل سه سایت اصلی.",
    url: "https://audit.alirezasafaeisystems.ir/asdev"
  },
  twitter: {
    card: "summary_large_image",
    title: "ASDEV — صفحه برند",
    description: "لینک‌های رسمی ASDEV و راه‌های ارتباطی علیرضا صفایی."
  }
};

export default function AsdevPage() {
  const links = buildAsdevNetworkLinks("audit", "asdev_page").map((item) => {
    if (item.key === "portfolio") {
      return {
        ...item,
        desc: "معرفی و کانال‌های تماس مستقیم با علیرضا صفایی."
      };
    }
    if (item.key === "toolbox") {
      return {
        ...item,
        desc: "ابزارهای فارسی با پردازش لوکال و حریم خصوصی کاربر."
      };
    }
    return {
      ...item,
      desc: "همین پلتفرم برای Audit Performance/SEO/Security."
    };
  });

  const contactLinks = [
    { label: "GitHub", href: "https://github.com/alirezasafaeisystems" },
    { label: "Telegram", href: ASDEV_TELEGRAM_URL },
    { label: "Portfolio & contact", href: ASDEV_BRAND.ownerSiteUrl }
  ];

  const orgPersonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "ASDEV",
        url: ASDEV_BRAND.ownerSiteUrl,
        sameAs: [ASDEV_BRAND.ownerSiteUrl, "https://github.com/alirezasafaeisystems", ASDEV_TELEGRAM_URL]
      },
      {
        "@type": "Person",
        name: "Alireza Safaei",
        url: ASDEV_BRAND.ownerSiteUrl,
        jobTitle: "Architecture & Systems DEV"
      }
    ]
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "چطور می‌توان از نتایج Audit استفاده کرد؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "از لینک‌های همین صفحه به پورتفولیو و PersianToolbox بروید تا اقدام‌های اصلاحی را اجرا کنید."
        }
      },
      {
        "@type": "Question",
        name: "کانال رسمی ASDEV چیست؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "کانال تلگرام رسمی: https://t.me/asdevsystems"
        }
      }
    ]
  };

  return (
    <main className="container page-shell space-y-8 py-10" id="main-content">
      <header className="card">
        <h1 className="text-2xl font-bold">ASDEV — علیرضا صفایی</h1>
        <p className="text-muted">معرفی برند ASDEV و لینک‌های رسمی شبکه محصولات.</p>
      </header>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgPersonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <section className="grid gap-4 md:grid-cols-3">
        {links.map((item) => (
          <article key={item.label} className="card space-y-2">
            <h2 className="text-base font-semibold leading-tight">{item.label}</h2>
            <p className="text-sm text-muted leading-6">{item.desc}</p>
            <Link href={item.href} target="_blank" rel="noopener noreferrer" className="link">
              مشاهده <span aria-hidden>→</span>
            </Link>
          </article>
        ))}
      </section>

      <section className="card space-y-2">
        <h2 className="text-sm font-semibold">امضای برند</h2>
        <p className="text-sm text-muted">{ASDEV_SIGNATURE_FULL}</p>
        <p className="text-sm text-muted">
          <Link href={ASDEV_BRAND.ownerSiteUrl} target="_blank" rel="noopener noreferrer" className="link">
            {ASDEV_PORTFOLIO_LINE}
          </Link>
        </p>
        <div className="footer-links">
          {contactLinks.map((item) => (
            <Link key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="link">
              {item.label}
            </Link>
          ))}
        </div>
        <Link href="/standards" className="link">
          استانداردهای تحویل و نقشه intent فارسی
        </Link>
      </section>
    </main>
  );
}
