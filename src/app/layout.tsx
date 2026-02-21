import "./globals.css";
import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import Link from "next/link";

const appBaseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appBaseUrl),
  title: {
    default: "Asdev Audit Platform",
    template: "%s | Asdev Audit Platform"
  },
  description: "Advanced website audit and conversion platform for performance, SEO, security, and growth operations.",
  keywords: [
    "website audit",
    "technical seo audit",
    "performance audit",
    "security audit",
    "core web vitals",
    "iran readiness audit"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: appBaseUrl,
    title: "Asdev Audit Platform",
    description: "Advanced website audit and conversion platform for performance, SEO, security, and growth operations.",
    siteName: "Asdev Audit Platform"
  },
  twitter: {
    card: "summary_large_image",
    title: "Asdev Audit Platform",
    description: "Advanced website audit and conversion platform."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f7a66",
  colorScheme: "light"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const currentYear = new Date().getFullYear();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Asdev Audit Platform",
        url: appBaseUrl
      },
      {
        "@type": "WebSite",
        name: "Asdev Audit Platform",
        url: appBaseUrl,
        inLanguage: "fa-IR"
      },
      {
        "@type": "SoftwareApplication",
        name: "Asdev Audit Platform",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        }
      }
    ]
  };

  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preload" href="/fonts/Vazirmatn-Variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/IRANSansX-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/IRANSansX-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script
          id="root-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          رفتن به محتوای اصلی
        </a>
        <header className="topbar">
          <div className="container topbar-inner">
            <Link href="/" className="brand">
              Asdev Audit
            </Link>
            <nav className="nav">
              <Link href="/audit">Audit</Link>
              <Link href="/guides">Guides</Link>
              <Link href="/sample-report">Sample Report</Link>
              <Link href="/pillar/iran-readiness-audit">Pillar</Link>
            </nav>
          </div>
        </header>
        <div className="container page-shell">
          <main id="main-content">{children}</main>
        </div>
        <footer className="footer">
          <div className="container footer-content">
            <section className="footer-grid">
              <article>
                <h2>ASDEV</h2>
                <p>Asdev Audit Platform برای تحلیل فنی، سئو، امنیت و بهبود نرخ تبدیل.</p>
                <p>تهران — همکاری حضوری/ریموت در سراسر ایران</p>
              </article>

              <nav aria-label="لینک‌های سریع">
                <h3>لینک‌های سریع</h3>
                <ul>
                  <li>
                    <Link href="/">خانه</Link>
                  </li>
                  <li>
                    <Link href="/audit">شروع Audit</Link>
                  </li>
                  <li>
                    <Link href="/guides">راهنماها</Link>
                  </li>
                  <li>
                    <Link href="/sample-report">گزارش نمونه</Link>
                  </li>
                </ul>
              </nav>

              <section>
                <h3>اتصال به سازنده</h3>
                <ul>
                  <li>
                    <Link href="https://alirezasafaeisystems.ir" target="_blank" rel="noopener noreferrer">
                      سایت شخصی
                    </Link>
                  </li>
                  <li>
                    <Link href="https://github.com/alirezasafaeisystems/asdev-audit-ir" target="_blank" rel="noopener noreferrer">
                      مخزن GitHub پروژه
                    </Link>
                  </li>
                </ul>
              </section>

              <section>
                <h3>تماس</h3>
                <p>برای همکاری، ارزیابی زیرساخت یا اجرای فاز Production تماس بگیرید.</p>
                <a className="button" href="mailto:team@alirezasafaeisystems.ir">
                  ارسال پیام
                </a>
              </section>
            </section>

            <div className="footer-bottom">
              <p>تمامی حقوق محفوظ است. Asdev Audit © {currentYear}</p>
              <p>
                ساخته شده توسط{" "}
                <Link href="https://alirezasafaeisystems.ir" target="_blank" rel="noopener noreferrer">
                  Alireza Safaei Systems
                </Link>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
