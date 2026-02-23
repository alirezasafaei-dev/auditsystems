export const ASDEV_BRAND = {
  masterBrand: "ASDEV",
  ownerNameFa: "علیرضا صفایی",
  ownerNameEn: "Alireza Safaei",
  ownerSiteUrl: "https://alirezasafaeisystems.ir",
  portfolioBrandPageFa: "https://alirezasafaeisystems.ir/fa/about-brand",
  portfolioBrandPageEn: "https://alirezasafaeisystems.ir/en/about-brand",
  portfolioHomeUrl: "https://alirezasafaeisystems.ir"
} as const;

export function getAsdevSignature(locale: "fa" | "en"): string {
  return locale === "fa"
    ? `${ASDEV_BRAND.masterBrand} | ${ASDEV_BRAND.ownerNameFa}`
    : `${ASDEV_BRAND.masterBrand} | ${ASDEV_BRAND.ownerNameEn}`;
}
