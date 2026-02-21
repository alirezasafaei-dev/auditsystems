import { Job, JobType, Prisma } from "@prisma/client";
import { prisma } from "../lib/db";
import { extractResourcesFromHtml } from "../lib/extractResources";
import { normalizeAuditTargetUrl } from "../lib/normalizeAuditTargetUrl";
import { evaluateAuditRules } from "../lib/rules";
import { parseSeoBasics } from "../lib/seo";
import { buildAuditSummaryV1 } from "../lib/summary";

export type JobHandler = (job: Job, signal: AbortSignal) => Promise<void>;

async function fetchMainHtml(url: string, signal: AbortSignal): Promise<{
  finalUrl: string;
  status: number;
  headers: Record<string, string>;
  html: string;
  responseMs: number;
}> {
  const start = Date.now();
  const response = await fetch(url, { redirect: "follow", signal });
  const html = await response.text();
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    finalUrl: response.url,
    status: response.status,
    headers,
    html,
    responseMs: Date.now() - start
  };
}

export const auditRunHandler: JobHandler = async (job, signal) => {
  const payload = job.payload as { runId?: string };
  if (!payload.runId) {
    throw new Error("INVALID_JOB_PAYLOAD");
  }

  const run = await prisma.auditRun.findUnique({ where: { id: payload.runId } });
  if (!run) {
    throw new Error("RUN_NOT_FOUND");
  }

  const normalized = await normalizeAuditTargetUrl(run.url, {
    verifyDnsPublicIp: String(process.env.AUDIT_DNS_GUARD ?? "true") !== "false"
  });

  await prisma.auditRun.update({
    where: { id: run.id },
    data: {
      normalizedUrl: normalized.normalizedUrl,
      status: "RUNNING",
      startedAt: new Date(),
      errorCode: null,
      errorMessage: null
    }
  });

  const started = Date.now();

  try {
    const main = await fetchMainHtml(normalized.normalizedUrl, signal);
    const firstPartyHosts = new Set([normalized.host, `www.${normalized.host}`]);
    const resources = extractResourcesFromHtml(main.html, { baseUrl: main.finalUrl, firstPartyHosts });
    const seo = parseSeoBasics(main.html);

    const findings = evaluateAuditRules({
      target: {
        normalizedUrl: normalized.normalizedUrl,
        origin: normalized.origin,
        host: normalized.host,
        protocol: normalized.protocol,
        firstPartyHosts
      },
      main: {
        finalUrl: main.finalUrl,
        status: main.status,
        headers: main.headers,
        html: main.html,
        metrics: {
          responseMs: main.responseMs,
          ttfbMs: main.responseMs
        }
      },
      resources,
      seo
    });

    const summary = buildAuditSummaryV1({
      runId: run.id,
      inputUrl: run.url,
      normalizedUrl: normalized.normalizedUrl,
      finalUrl: main.finalUrl,
      depth: run.depth,
      durationMs: Date.now() - started,
      headers: main.headers,
      resources,
      findings,
      seo
    });

    await prisma.$transaction([
      prisma.auditResource.deleteMany({ where: { runId: run.id } }),
      prisma.auditFinding.deleteMany({ where: { runId: run.id } }),
      prisma.auditResource.createMany({
        data: resources.map((resource) => ({
          runId: run.id,
          kind: resource.kind,
          url: resource.url,
          host: resource.host,
          isThirdParty: resource.isThirdParty,
          inHead: resource.inHead,
          attrs: resource.attrs
        }))
      }),
      prisma.auditFinding.createMany({
        data: findings.map((finding) => ({
          runId: run.id,
          category: finding.category,
          severity: finding.severity,
          code: finding.code,
          title: finding.title,
          description: finding.description,
          recommendation: finding.recommendation,
          evidence: (finding.evidence ?? Prisma.JsonNull) as Prisma.InputJsonValue
        }))
      }),
      prisma.auditRun.update({
        where: { id: run.id },
        data: {
          status: "SUCCEEDED",
          finishedAt: new Date(),
          summary: summary as Prisma.InputJsonValue
        }
      })
    ]);
  } catch (error) {
    await prisma.auditRun.update({
      where: { id: run.id },
      data: {
        status: "FAILED",
        finishedAt: new Date(),
        errorCode: "AUDIT_FAILED",
        errorMessage: error instanceof Error ? error.message : String(error)
      }
    });
    throw error;
  }
};

export const handlers: Record<JobType, JobHandler> = {
  AUDIT_RUN: auditRunHandler
};
