import { firstSrcsetCandidate } from "./normalizeAuditTargetUrl";
import { ExtractedResource, ResourceKind } from "./types";

type ExtractOptions = {
  baseUrl: string;
  firstPartyHosts: Set<string>;
};

function parseAttrs(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrRegex = /(\w[\w:-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match: RegExpExecArray | null;
  while ((match = attrRegex.exec(tag)) !== null) {
    const key = match[1].toLowerCase();
    const value = (match[2] ?? match[3] ?? match[4] ?? "").trim();
    attrs[key] = value;
  }
  return attrs;
}

function safeToAbsolute(baseUrl: string, candidate: string): string | null {
  const value = String(candidate ?? "").trim();
  if (!value || /^data:|^javascript:/i.test(value)) return null;
  try {
    const url = new URL(value, baseUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function buildResource(
  opts: ExtractOptions,
  rawUrl: string,
  kind: ResourceKind,
  tagIndex: number,
  headEnd: number,
  attrs: Record<string, string | boolean>
): ExtractedResource | null {
  const absolute = safeToAbsolute(opts.baseUrl, rawUrl);
  if (!absolute) return null;

  const host = new URL(absolute).hostname.toLowerCase();

  return {
    url: absolute,
    host,
    kind,
    isThirdParty: !opts.firstPartyHosts.has(host),
    inHead: headEnd === -1 ? undefined : tagIndex < headEnd,
    attrs
  };
}

export function extractResourcesFromHtml(html: string, opts: ExtractOptions): ExtractedResource[] {
  const resources: ExtractedResource[] = [];
  const headEnd = html.toLowerCase().indexOf("</head>");

  const push = (
    rawUrl: string,
    kind: ResourceKind,
    tagIndex: number,
    attrs: Record<string, string | boolean>
  ): void => {
    const resource = buildResource(opts, rawUrl, kind, tagIndex, headEnd, attrs);
    if (resource) resources.push(resource);
  };

  const scriptRegex = /<script\b[^>]*>/gi;
  let scriptMatch: RegExpExecArray | null;
  while ((scriptMatch = scriptRegex.exec(html)) !== null) {
    const attrs = parseAttrs(scriptMatch[0]);
    if (!attrs.src) continue;
    push(attrs.src, "script", scriptMatch.index, {
      async: Object.hasOwn(attrs, "async"),
      defer: Object.hasOwn(attrs, "defer"),
      type: attrs.type ?? ""
    });
  }

  const linkRegex = /<link\b[^>]*>/gi;
  let linkMatch: RegExpExecArray | null;
  while ((linkMatch = linkRegex.exec(html)) !== null) {
    const attrs = parseAttrs(linkMatch[0]);
    if (!attrs.href) continue;
    const rel = (attrs.rel ?? "").toLowerCase();
    const as = (attrs.as ?? "").toLowerCase();

    if (rel.includes("stylesheet")) {
      push(attrs.href, "style", linkMatch.index, { rel, as });
      continue;
    }

    if (rel.includes("preload")) {
      if (as === "font") push(attrs.href, "font", linkMatch.index, { rel, as });
      else if (as === "style") push(attrs.href, "style", linkMatch.index, { rel, as });
      else if (as === "script") push(attrs.href, "script", linkMatch.index, { rel, as });
      else push(attrs.href, "preload", linkMatch.index, { rel, as });
      continue;
    }

    push(attrs.href, "other", linkMatch.index, { rel, as });
  }

  const imgRegex = /<img\b[^>]*>/gi;
  let imgMatch: RegExpExecArray | null;
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    const attrs = parseAttrs(imgMatch[0]);
    if (attrs.src) {
      push(attrs.src, "img", imgMatch.index, { loading: attrs.loading ?? "" });
      continue;
    }
    if (attrs.srcset) {
      const candidate = firstSrcsetCandidate(attrs.srcset);
      if (candidate) push(candidate, "img", imgMatch.index, { srcset: "used-first-candidate" });
    }
  }

  const sourceRegex = /<source\b[^>]*>/gi;
  let sourceMatch: RegExpExecArray | null;
  while ((sourceMatch = sourceRegex.exec(html)) !== null) {
    const attrs = parseAttrs(sourceMatch[0]);
    if (!attrs.srcset) continue;
    const candidate = firstSrcsetCandidate(attrs.srcset);
    if (!candidate) continue;
    push(candidate, "img", sourceMatch.index, { srcset: "used-first-candidate", type: attrs.type ?? "" });
  }

  return resources;
}
