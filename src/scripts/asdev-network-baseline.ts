import fs from "node:fs/promises";
import path from "node:path";

type HostCheck = {
  slug: string;
  baseUrl: string;
};

type RouteResult = {
  path: string;
  status: number;
  ok: boolean;
  durationMs: number;
};

type HostResult = {
  slug: string;
  baseUrl: string;
  lang: string | null;
  dir: string | null;
  rootStatus: number;
  asdevStatus: number;
  readyGet: number;
  readyHead: number;
  readyParity: boolean;
  routes: RouteResult[];
  failures: string[];
};

const HOSTS: HostCheck[] = [
  { slug: "portfolio", baseUrl: "https://alirezasafaeisystems.ir" },
  { slug: "persiantoolbox", baseUrl: "https://persiantoolbox.ir" },
  { slug: "audit", baseUrl: "https://audit.alirezasafaeisystems.ir" }
];

const STAGING_AUDIT = "https://staging.audit.alirezasafaeisystems.ir";

async function request(url: string, method: "GET" | "HEAD" = "GET"): Promise<{ status: number; body: string; durationMs: number }> {
  const start = Date.now();
  const response = await fetch(url, {
    method,
    redirect: "follow",
    cache: "no-store"
  });
  const body = method === "HEAD" ? "" : await response.text();
  return {
    status: response.status,
    body,
    durationMs: Date.now() - start
  };
}

function extractLangDir(html: string): { lang: string | null; dir: string | null } {
  const htmlTag = html.match(/<html[^>]*>/i)?.[0] ?? "";
  const lang = htmlTag.match(/lang=["']([^"']+)["']/i)?.[1] ?? null;
  const dir = htmlTag.match(/dir=["']([^"']+)["']/i)?.[1] ?? null;
  return { lang, dir };
}

async function checkHost(host: HostCheck): Promise<HostResult> {
  const failures: string[] = [];
  const routes: RouteResult[] = [];

  const root = await request(`${host.baseUrl}/`);
  routes.push({ path: "/", status: root.status, ok: root.status === 200, durationMs: root.durationMs });
  const langDir = extractLangDir(root.body);
  if (langDir.lang !== "fa" && langDir.dir !== "rtl") {
    failures.push("default_locale_not_fa_rtl");
  }

  const asdev = await request(`${host.baseUrl}/asdev`);
  routes.push({ path: "/asdev", status: asdev.status, ok: asdev.status === 200, durationMs: asdev.durationMs });
  if (asdev.status !== 200) {
    failures.push("asdev_page_unavailable");
  }
  if (!asdev.body.includes("alireza_safaei_network")) {
    failures.push("network_utm_missing");
  }

  const readyGet = await request(`${host.baseUrl}/api/ready`);
  routes.push({ path: "/api/ready", status: readyGet.status, ok: readyGet.status === 200, durationMs: readyGet.durationMs });
  if (readyGet.status !== 200) {
    failures.push("ready_get_not_200");
  }

  const readyHead = await request(`${host.baseUrl}/api/ready`, "HEAD");
  const readyParity = readyHead.status === readyGet.status;
  if (!readyParity) {
    failures.push("ready_get_head_mismatch");
  }

  for (const p of ["/robots.txt", "/sitemap.xml"]) {
    const route = await request(`${host.baseUrl}${p}`);
    routes.push({ path: p, status: route.status, ok: route.status === 200, durationMs: route.durationMs });
    if (route.status !== 200) {
      failures.push(`${p}_not_200`);
    }
  }

  return {
    slug: host.slug,
    baseUrl: host.baseUrl,
    lang: langDir.lang,
    dir: langDir.dir,
    rootStatus: root.status,
    asdevStatus: asdev.status,
    readyGet: readyGet.status,
    readyHead: readyHead.status,
    readyParity,
    routes,
    failures
  };
}

async function checkAuditStaging(): Promise<{ get: number; head: number; parity: boolean }> {
  const get = await request(`${STAGING_AUDIT}/api/ready`);
  const head = await request(`${STAGING_AUDIT}/api/ready`, "HEAD");
  return {
    get: get.status,
    head: head.status,
    parity: get.status === head.status
  };
}

async function main(): Promise<void> {
  const generatedAt = new Date().toISOString();
  const results: HostResult[] = [];

  for (const host of HOSTS) {
    results.push(await checkHost(host));
  }

  const staging = await checkAuditStaging();
  const hasFailure =
    results.some((x) => x.failures.length > 0) ||
    staging.get !== 200 ||
    !staging.parity;

  const outDir = path.resolve("logs/runtime");
  await fs.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, "asdev-network-baseline.json");
  await fs.writeFile(
    outPath,
    JSON.stringify(
      {
        generatedAt,
        results,
        auditStagingReady: staging
      },
      null,
      2
    )
  );

  for (const item of results) {
    console.log(
      `${item.slug}: root=${item.rootStatus} asdev=${item.asdevStatus} ready(get/head)=${item.readyGet}/${item.readyHead} locale=${item.lang}/${item.dir} failures=${item.failures.length}`
    );
  }
  console.log(`audit-staging-ready(get/head): ${staging.get}/${staging.head} parity=${staging.parity}`);
  console.log(`report: ${outPath}`);

  if (hasFailure) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
