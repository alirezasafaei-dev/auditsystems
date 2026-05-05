import { MetadataRoute } from "next";
import { getGuideSlugs, getGuideUpdatedAtMap } from "../content/guides";
import { getAppBaseUrl } from "../lib/site";

const STATIC_LASTMOD = process.env.NEXT_PUBLIC_BUILD_DATE ?? "2026-03-01";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getAppBaseUrl();
  const guideSlugs = getGuideSlugs();
  const updatedAtBySlug = getGuideUpdatedAtMap();

  const staticSpecs: Array<{
    route: string;
    priority: number;
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  }> = [
    { route: "/", priority: 1, changeFrequency: "weekly" },
    { route: "/audit", priority: 0.8, changeFrequency: "weekly" },
    { route: "/guides", priority: 0.8, changeFrequency: "weekly" },
    { route: "/standards", priority: 0.72, changeFrequency: "monthly" },
    { route: "/sample-report", priority: 0.7, changeFrequency: "monthly" },
    { route: "/pillar/iran-readiness-audit", priority: 0.75, changeFrequency: "monthly" }
  ];

  const staticRoutes: MetadataRoute.Sitemap = [
    ...staticSpecs
  ].flatMap((entry) => {
    const enRoute = entry.route === "/" ? "/en" : `/en${entry.route}`;

    return [
      {
        url: `${baseUrl}${entry.route}`,
        lastModified: STATIC_LASTMOD,
        changeFrequency: entry.changeFrequency,
        priority: entry.priority,
        alternates: {
          languages: {
            "fa-IR": `${baseUrl}${entry.route}`,
            "en-US": `${baseUrl}${enRoute}`,
            "x-default": `${baseUrl}${entry.route}`
          }
        }
      },
      {
        url: `${baseUrl}${enRoute}`,
        lastModified: STATIC_LASTMOD,
        changeFrequency: entry.changeFrequency,
        priority: Math.max(0.5, entry.priority - 0.05),
        alternates: {
          languages: {
            "fa-IR": `${baseUrl}${entry.route}`,
            "en-US": `${baseUrl}${enRoute}`,
            "x-default": `${baseUrl}${entry.route}`
          }
        }
      }
    ];
  });

  const guideRoutes: MetadataRoute.Sitemap = guideSlugs.flatMap((slug) => {
    const faUrl = `${baseUrl}/guides/${slug}`;
    const enUrl = `${baseUrl}/en/guides/${slug}`;
    const lastModified = updatedAtBySlug.get(slug) ?? STATIC_LASTMOD;

    return [
      {
        url: faUrl,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.65,
        alternates: {
          languages: {
            "fa-IR": faUrl,
            "en-US": enUrl,
            "x-default": faUrl
          }
        }
      },
      {
        url: enUrl,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.63,
        alternates: {
          languages: {
            "fa-IR": faUrl,
            "en-US": enUrl,
            "x-default": faUrl
          }
        }
      }
    ];
  });

  return [...staticRoutes, ...guideRoutes];
}
