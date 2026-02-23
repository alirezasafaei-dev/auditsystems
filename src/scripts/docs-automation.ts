import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "src/app");
const API_DIR = path.join(APP_DIR, "api");
const OUT_FILE = path.join(ROOT, "docs/AUTO_GENERATED_STATUS.md");
const ROADMAP_FILE = path.join(ROOT, "ops/roadmap/phases.json");
const ROADMAP_LAST_RUN = path.join(ROOT, "logs/roadmap/last-run.json");

type Phase = { id: string; title: string; status: "done" | "in_progress" | "planned"; checks: Array<{ id: string }> };

type RoadmapConfig = { version: string; phases: Phase[] };

type LastRunSummary = {
  startedAt: string;
  finishedAt: string;
  passedCount: number;
  failedCount: number;
  skippedCount: number;
};

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function walkFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walkFiles(full)));
      continue;
    }
    out.push(full);
  }
  return out;
}

function routeFromApiFile(file: string): string {
  const rel = path.relative(API_DIR, file).replace(/\\/g, "/");
  const clean = rel.replace(/\/route\.ts$/, "");
  return `/api/${clean}`.replace(/\/index$/, "");
}

function routeFromPageFile(file: string): string {
  const rel = path.relative(APP_DIR, file).replace(/\\/g, "/");
  if (rel === "page.tsx") return "/";
  return `/${rel.replace(/\/page\.tsx$/, "")}`;
}

async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw) as T;
}

async function main(): Promise<void> {
  const [packageJson, roadmap] = await Promise.all([
    readJson<{ scripts: Record<string, string>; dependencies?: Record<string, string>; devDependencies?: Record<string, string> }>(
      path.join(ROOT, "package.json")
    ),
    readJson<RoadmapConfig>(ROADMAP_FILE)
  ]);

  const appFiles = await walkFiles(APP_DIR);
  const apiRoutes = appFiles
    .filter((f) => f.startsWith(API_DIR) && f.endsWith("/route.ts"))
    .map(routeFromApiFile)
    .sort((a, b) => a.localeCompare(b));

  const pageRoutes = appFiles
    .filter((f) => f.endsWith("/page.tsx") || f.endsWith(`${path.sep}page.tsx`))
    .map(routeFromPageFile)
    .sort((a, b) => a.localeCompare(b));

  const testFiles = (await walkFiles(path.join(ROOT, "src"))).filter((f) => /\.test\.ts$/.test(f));

  const envExample = await fs.readFile(path.join(ROOT, ".env.example"), "utf8");
  const envVars = envExample
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => line.split("=")[0]);

  const statuses = {
    done: roadmap.phases.filter((p) => p.status === "done").length,
    inProgress: roadmap.phases.filter((p) => p.status === "in_progress").length,
    planned: roadmap.phases.filter((p) => p.status === "planned").length
  };

  let lastRun: LastRunSummary | null = null;
  if (await exists(ROADMAP_LAST_RUN)) {
    lastRun = await readJson<LastRunSummary>(ROADMAP_LAST_RUN);
  }

  const generatedAt = new Date().toISOString();

  const lines: string[] = [];
  lines.push("# Auto Generated Project Status");
  lines.push("");
  lines.push(`Generated at: ${generatedAt}`);
  lines.push("");

  lines.push("## Overview");
  lines.push(`- API routes: ${apiRoutes.length}`);
  lines.push(`- Page routes: ${pageRoutes.length}`);
  lines.push(`- Test files: ${testFiles.length}`);
  lines.push(`- NPM scripts: ${Object.keys(packageJson.scripts ?? {}).length}`);
  lines.push("");

  lines.push("## Roadmap Phases");
  lines.push(`- Done: ${statuses.done}`);
  lines.push(`- In Progress: ${statuses.inProgress}`);
  lines.push(`- Planned: ${statuses.planned}`);
  if (lastRun) {
    lines.push(`- Last automation run: ${lastRun.finishedAt}`);
    lines.push(`- Last run results: passed=${lastRun.passedCount}, failed=${lastRun.failedCount}, skipped=${lastRun.skippedCount}`);
  }
  lines.push("");

  lines.push("## API Routes");
  for (const route of apiRoutes) lines.push(`- \`${route}\``);
  lines.push("");

  lines.push("## Page Routes");
  for (const route of pageRoutes) lines.push(`- \`${route}\``);
  lines.push("");

  lines.push("## Environment Variables (.env.example)");
  for (const key of envVars) lines.push(`- \`${key}\``);
  lines.push("");

  lines.push("## Phase Checks Inventory");
  lines.push("| Phase | Title | Status | Checks |");
  lines.push("|---|---|---|---:|");
  for (const phase of roadmap.phases) {
    lines.push(`| ${phase.id} | ${phase.title} | ${phase.status} | ${phase.checks.length} |`);
  }
  lines.push("");

  lines.push("## Key Commands");
  for (const [name, command] of Object.entries(packageJson.scripts ?? {})) {
    if (
      [
        "check",
        "roadmap:run",
        "roadmap:dry",
        "roadmap:phase",
        "seo:audit",
        "seo:audit:dry",
        "docs:generate",
        "docs:refresh",
        "payment:preflight",
        "payment:preflight:strict",
        "payment:zarinpal:smoke",
        "automation:run",
        "lighthouse:local",
        "dev",
        "worker:dev"
      ].includes(name)
    ) {
      lines.push(`- \`pnpm run ${name}\` -> \`${command}\``);
    }
  }

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, `${lines.join("\n")}\n`, "utf8");
  console.log(`Generated ${path.relative(ROOT, OUT_FILE)}`);
}

main().catch((error) => {
  console.error("docs automation failed", error);
  process.exit(1);
});
