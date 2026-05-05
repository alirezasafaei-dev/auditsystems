export const ASDEV_BRAND = {
  masterBrand: "Alireza Safaei",
  ownerNameFa: "علیرضا صفایی",
  ownerNameEn: "Alireza Safaei",
  ownerSiteUrl: "https://alirezasafaeisystems.ir",
  portfolioBrandPageFa: "https://alirezasafaeisystems.ir/fa/about-brand",
  portfolioBrandPageEn: "https://alirezasafaeisystems.ir/en/about-brand",
  portfolioHomeUrl: "https://alirezasafaeisystems.ir",
  persianToolboxUrl: "https://persiantoolbox.ir"
} as const;

export const ASDEV_SIGNATURE_FULL = "Alireza Safaei — علیرضا صفایی" as const;
export const ASDEV_PORTFOLIO_LINE = "Portfolio & contact: alirezasafaeisystems.ir" as const;
export const ASDEV_TELEGRAM_URL = "https://t.me/asdevsystems" as const;
export const ASDEV_TELEGRAM_LINE = "Telegram: @asdevsystems" as const;

export function getAsdevSignature(locale: "fa" | "en"): string {
  return locale === "fa"
    ? `${ASDEV_BRAND.ownerNameFa}`
    : `${ASDEV_BRAND.ownerNameEn}`;
}

type AsdevUtmContent = "footer" | "asdev_page" | "standards_page";

export function buildAsdevNetworkLinks(utmSource: "audit", utmContent: AsdevUtmContent) {
  const links = [
    {
      key: "portfolio",
      label: "پورتفولیو و راه‌های ارتباطی",
      baseUrl: ASDEV_BRAND.ownerSiteUrl
    },
    {
      key: "toolbox",
      label: "PersianToolbox — ابزارهای فارسی (لوکال و امن)",
      baseUrl: ASDEV_BRAND.persianToolboxUrl
    },
    {
      key: "audit",
      label: "Audit IR — بررسی فنی و امنیتی",
      baseUrl: "https://audit.alirezasafaeisystems.ir"
    }
  ] as const;

  return links.map((item) => {
    const url = new URL(item.baseUrl);
    url.searchParams.set("utm_source", utmSource);
    url.searchParams.set("utm_medium", "cross_site");
    url.searchParams.set("utm_campaign", "alireza_safaei_network");
    url.searchParams.set("utm_content", utmContent);
    return {
      ...item,
      href: url.toString()
    };
  });
}
