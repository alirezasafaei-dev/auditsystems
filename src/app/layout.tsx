import "./globals.css";
import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import Script from "next/script";
import { getAppBaseUrl } from "../lib/site";
import { ASDEV_BRAND, getAsdevSignature } from "../lib/brand";

const appBaseUrl = getAppBaseUrl();

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
    canonical: "/",
    languages: {
      "fa-IR": "/",
      en: "/en"
    }
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

type LayoutCopy = {
  brand: string;
  nav: { audit: string; guides: string; sample: string; pillar: string };
  skipToContent: string;
  footer: {
    aboutTitle: string;
    aboutText: string;
    location: string;
    quickTitle: string;
    creatorTitle: string;
    portfolioTitle: string;
    toolboxTitle: string;
    personalSiteTitle: string;
    repoTitle: string;
    contactTitle: string;
    contactText: string;
    messageCta: string;
    rights: string;
    builtBy: string;
    langSwitch: string;
  };
};

const faCopy: LayoutCopy = {
  brand: "Asdev Audit",
  nav: { audit: "شروع Audit", guides: "راهنماها", sample: "گزارش نمونه", pillar: "صفحه راهبردی" },
  skipToContent: "رفتن به محتوای اصلی",
  footer: {
    aboutTitle: "ASDEV",
    aboutText: "Asdev Audit Platform برای تحلیل فنی، سئو، امنیت و بهبود نرخ تبدیل در اکوسیستم محصولات ASDEV.",
    location: "تهران — همکاری حضوری/ریموت در سراسر ایران",
    quickTitle: "لینک‌های سریع",
    creatorTitle: "اتصال به سازنده",
    portfolioTitle: "صفحه برند ASDEV Portfolio",
    toolboxTitle: "ASDEV PersianToolbox",
    personalSiteTitle: "سایت شخصی",
    repoTitle: "مخزن GitHub پروژه",
    contactTitle: "تماس",
    contactText: "برای همکاری، ارزیابی زیرساخت یا اجرای فاز Production تماس بگیرید.",
    messageCta: "ارسال پیام",
    rights: "تمامی حقوق محفوظ است. Asdev Audit",
    builtBy: "ساخته شده توسط",
    langSwitch: "English"
  }
};

const enCopy: LayoutCopy = {
  brand: "Asdev Audit",
  nav: { audit: "Start Audit", guides: "Guides", sample: "Sample Report", pillar: "Pillar" },
  skipToContent: "Skip to main content",
  footer: {
    aboutTitle: "ASDEV",
    aboutText: "Asdev Audit Platform for technical audits, SEO growth, security, and conversion performance within ASDEV product ecosystem.",
    location: "Tehran — Remote and on-site collaboration",
    quickTitle: "Quick Links",
    creatorTitle: "Creator",
    portfolioTitle: "ASDEV Portfolio brand page",
    toolboxTitle: "ASDEV PersianToolbox",
    personalSiteTitle: "Personal site",
    repoTitle: "Project GitHub repository",
    contactTitle: "Contact",
    contactText: "For production rollout and infrastructure consulting, get in touch.",
    messageCta: "Send Message",
    rights: "All rights reserved. Asdev Audit",
    builtBy: "Built by",
    langSwitch: "فارسی"
  }
};

function withLocalePath(path: string, locale: "fa" | "en"): string {
  if (locale === "fa") return path;
  if (path === "/") return "/en";
  return `/en${path}`;
}

function toOtherLocalePath(pathname: string, locale: "fa" | "en"): string {
  if (locale === "fa") {
    if (pathname === "/") return "/en";
    return `/en${pathname}`;
  }
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return "/";
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const h = await headers();
  const locale = h.get("x-asdev-locale") === "en" ? "en" : "fa";
  const pathname = h.get("x-asdev-pathname") ?? "/";
  const copy = locale === "en" ? enCopy : faCopy;
  const signature = getAsdevSignature(locale);
  const currentYear = new Date().getFullYear();
  const gaMeasurementId = String(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? "").trim();
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
        inLanguage: locale === "en" ? "en-US" : "fa-IR"
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
  const networkLinks = [
    {
      label: locale === "en" ? "Portfolio & contact" : "پورتفولیو و راه‌های ارتباطی",
      href: `https://alirezasafaeisystems.ir/?utm_source=audit&utm_medium=cross_site&utm_campaign=asdev_network&utm_content=footer`
    },
    {
      label: "PersianToolbox — ابزارهای فارسی (لوکال و امن)",
      href: `https://persiantoolbox.ir/?utm_source=audit&utm_medium=cross_site&utm_campaign=asdev_network&utm_content=footer`
    },
    {
      label: "Audit IR — بررسی فنی و امنیتی",
      href: `https://audit.alirezasafaeisystems.ir/?utm_source=audit&utm_medium=cross_site&utm_campaign=asdev_network&utm_content=footer`
    }
  ];
  const telegramLink = "https://t.me/asdevsystems";

  return (
    <html lang={locale === "en" ? "en" : "fa"} dir={locale === "en" ? "ltr" : "rtl"}>
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
        {gaMeasurementId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
            <Script
              id="ga4-bootstrap"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  window.gtag = gtag;
                  gtag('js', new Date());
                  gtag('consent', 'default', { analytics_storage: 'denied' });
                  gtag('config', '${gaMeasurementId}', { anonymize_ip: true, send_page_view: false });
                `
              }}
            />
          </>
        ) : null}
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          {copy.skipToContent}
        </a>
        <header className="topbar">
          <div className="container topbar-inner">
            <Link href={withLocalePath("/", locale)} className="brand">
              {copy.brand}
            </Link>
            <nav className="nav">
              <Link href={withLocalePath("/audit", locale)}>{copy.nav.audit}</Link>
              <Link href={withLocalePath("/guides", locale)}>{copy.nav.guides}</Link>
              <Link href={withLocalePath("/sample-report", locale)}>{copy.nav.sample}</Link>
              <Link href={withLocalePath("/pillar/iran-readiness-audit", locale)}>{copy.nav.pillar}</Link>
              <Link className="lang-switch" href={toOtherLocalePath(pathname, locale)}>
                {copy.footer.langSwitch}
              </Link>
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
                <h2>{copy.footer.aboutTitle}</h2>
                <p>{copy.footer.aboutText}</p>
                <p>{copy.footer.location}</p>
              </article>

              <nav aria-label={copy.footer.quickTitle}>
                <h3>{copy.footer.quickTitle}</h3>
                <ul>
                  <li>
                    <Link href={withLocalePath("/", locale)}>{locale === "en" ? "Home" : "خانه"}</Link>
                  </li>
                  <li>
                    <Link href={withLocalePath("/audit", locale)}>{copy.nav.audit}</Link>
                  </li>
                  <li>
                    <Link href={withLocalePath("/guides", locale)}>{copy.nav.guides}</Link>
                  </li>
                  <li>
                    <Link href={withLocalePath("/sample-report", locale)}>{copy.nav.sample}</Link>
                  </li>
                  <li>
                    <Link href={withLocalePath("/brand/asdev-portfolio", locale)}>{copy.footer.portfolioTitle}</Link>
                  </li>
                  <li>
                    <Link href={ASDEV_BRAND.persianToolboxUrl} target="_blank" rel="noopener noreferrer">
                      {copy.footer.toolboxTitle}
                    </Link>
                  </li>
                </ul>
              </nav>

              <section>
                <h3>{copy.footer.creatorTitle}</h3>
                <ul>
                  <li>
                    <Link href={ASDEV_BRAND.ownerSiteUrl} target="_blank" rel="noopener noreferrer">
                      {copy.footer.personalSiteTitle}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={locale === "en" ? ASDEV_BRAND.portfolioBrandPageEn : ASDEV_BRAND.portfolioBrandPageFa}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {copy.footer.portfolioTitle}
                    </Link>
                  </li>
                  <li>
                    <Link href="https://github.com/alirezasafaeisystems/asdev-audit-ir" target="_blank" rel="noopener noreferrer">
                      {copy.footer.repoTitle}
                    </Link>
                  </li>
                </ul>
              </section>

              <section>
                <h3>{copy.footer.contactTitle}</h3>
                <p>{copy.footer.contactText}</p>
                <a className="button" href="mailto:team@alirezasafaeisystems.ir">
                  {copy.footer.messageCta}
                </a>
              </section>
            </section>

            <div className="footer-bottom">
              <p>
                {copy.footer.rights} © {currentYear}
              </p>
              <div className="footer-signature">
                <p>
                  {copy.footer.builtBy}{" "}
                  <Link href={ASDEV_BRAND.ownerSiteUrl} target="_blank" rel="noopener noreferrer">
                    {signature}
                  </Link>
                </p>
                <p className="text-sm">
                  ASDEV | Alireza Safaei — علیرضا صفایی · Portfolio & contact:
                  {" "}
                  <Link href="https://alirezasafaeisystems.ir/" target="_blank" rel="noopener noreferrer" className="link">
                    alirezasafaeisystems.ir
                  </Link>
                  {" · "}
                  <Link href={telegramLink} target="_blank" rel="noopener noreferrer" className="link">
                    Telegram: @asdevsystems
                  </Link>
                </p>
                <div className="footer-links">
                  {networkLinks.map((item) => (
                    <Link key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="link">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
