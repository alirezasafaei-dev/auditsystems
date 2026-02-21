// 01-audit/src/lib/extractResources.ts
// استخراج ساده منابع از HTML (بدون dependency) — MVP
//
// این parser عمدی ساده است؛ برای دقت بالاتر در آینده می‌توانید از cheerio/parse5 استفاده کنید.

import { ExtractedResource } from "./types";

type ExtractOptions = {
  baseUrl: string;
  firstPartyHosts: Set<string>;
};

function safeUrlJoin(baseUrl: string, maybeUrl: string): string | null {
  const u = String(maybeUrl ?? "").trim();
  if (!u) return null;

  // ignore data: and javascript:
  if (/^(data:|javascript:)/i.test(u)) return null;

  try {
    const abs = new URL(u, baseUrl);
    if (abs.protocol !== "http:" && abs.protocol !== "https:") return null;
    return abs.toString();
  } catch {
    return null;
  }
}

function parseAttrs(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /(\w[\w-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(tag))) {
    const key = m[1].toLowerCase();
    const val = (m[2] ?? m[3] ?? m[4] ?? "").trim();
    attrs[key] = val;
  }
  return attrs;
}

export function extractResourcesFromHtml(html: string, opts: ExtractOptions): ExtractedResource[] {
  const headEnd = html.toLowerCase().indexOf("</head>");
  const resources: ExtractedResource[] = [];

  const push = (kind: ExtractedResource["kind"], rawUrl: string, tagIndex: number, attrs?: Record<string, string>) => {
    const abs = safeUrlJoin(opts.baseUrl, rawUrl);
    if (!abs) return;

    const u = new URL(abs);
    const host = u.hostname.toLowerCase();
    const isThirdParty = !opts.firstPartyHosts.has(host);

    resources.push({
      url: abs,
      kind,
      host,
      isThirdParty,
      inHead: headEnd !== -1 ? tagIndex < headEnd : undefined,
      attrs,
    });
  };

  // <script src="">
  {
    const re = /<script\b[^>]*>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html))) {
      const tag = m[0];
      const attrs = parseAttrs(tag);
      if (attrs.src) push("script", attrs.src, m.index, attrs);
    }
  }

  // <link href="" rel="">
  {
    const re = /<link\b[^>]*>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html))) {
      const tag = m[0];
      const attrs = parseAttrs(tag);
      const rel = (attrs.rel ?? "").toLowerCase();
      const as = (attrs.as ?? "").toLowerCase();

      if (!attrs.href) continue;

      if (rel.includes("stylesheet")) {
        push("style", attrs.href, m.index, attrs);
      } else if (rel.includes("preload") && as === "font") {
        push("font", attrs.href, m.index, attrs);
      } else {
        // سایر linkها را هم نگه می‌داریم
        push("other", attrs.href, m.index, attrs);
      }
    }
  }

  // <img src="">
  {
    const re = /<img\b[^>]*>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html))) {
      const tag = m[0];
      const attrs = parseAttrs(tag);
      if (attrs.src) push("img", attrs.src, m.index, attrs);
    }
  }

  return resources;
}
