import type { Metadata } from "next";
import Link from "next/link";

const utmSource = "audit";

function withUtm(baseUrl: string, content: "footer" | "asdev_page") {
  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", utmSource);
  url.searchParams.set("utm_medium", "cross_site");
  url.searchParams.set("utm_campaign", "asdev_network");
  url.searchParams.set("utm_content", content);
  return url.toString();
}

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
  const links = [
    {
      label: "پورتفولیو و راه‌های ارتباطی",
      href: withUtm("https://alirezasafaeisystems.ir/", "asdev_page"),
      desc: "معرفی و کانال‌های تماس مستقیم با علیرضا صفایی."
    },
    {
      label: "PersianToolbox — ابزارهای فارسی (لوکال و امن)",
      href: withUtm("https://persiantoolbox.ir/", "asdev_page"),
      desc: "ابزارهای فارسی با پردازش لوکال و حریم خصوصی کاربر."
    },
    {
      label: "Audit IR — بررسی فنی و امنیتی",
      href: withUtm("https://audit.alirezasafaeisystems.ir/", "asdev_page"),
      desc: "همین پلتفرم برای Audit Performance/SEO/Security."
    }
  ];

  const contactLinks = [
    { label: "GitHub", href: "https://github.com/alirezasafaeisystems" },
    { label: "Telegram", href: "https://t.me/asdevsystems" },
    { label: "Portfolio & contact", href: "https://alirezasafaeisystems.ir/" }
  ];

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
        <p className="text-sm text-muted">ASDEV | Alireza Safaei — علیرضا صفایی</p>
        <p className="text-sm text-muted">
          Portfolio &amp; contact:{" "}
          <Link href="https://alirezasafaeisystems.ir/" target="_blank" rel="noopener noreferrer" className="link">
            alirezasafaeisystems.ir
          </Link>
        </p>
        <div className="footer-links">
          {contactLinks.map((item) => (
            <Link key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="link">
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
