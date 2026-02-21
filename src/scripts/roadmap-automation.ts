import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const CONFIG_PATH = path.resolve("ops/roadmap/phases.json");
const REPORT_DIR = path.resolve("logs/roadmap");

type PhaseStatus = "done" | "in_progress" | "planned";

type CheckConfig = {
  id: string;
  description: string;
  command: string;
};

type PhaseConfig = {
  id: string;
  title: string;
  status: PhaseStatus;
  checks: CheckConfig[];
};

type RoadmapConfig = {
  version: string;
  defaultMode: "done_and_in_progress" | "all";
  phases: PhaseConfig[];
};

type CheckResult = {
  phaseId: string;
  phaseTitle: string;
  phaseStatus: PhaseStatus;
  checkId: string;
  description: string;
  command: string;
  outcome: "passed" | "failed" | "skipped";
  exitCode: number | null;
  durationMs: number;
  stdout: string;
  stderr: string;
};

type RunSummary = {
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  strict: boolean;
  dryRun: boolean;
  includePlanned: boolean;
  onlyPhase: string | null;
  failedCount: number;
  passedCount: number;
  skippedCount: number;
  results: CheckResult[];
};

function parseArgs(argv: string[]): {
  strict: boolean;
  dryRun: boolean;
  includePlanned: boolean;
  onlyPhase: string | null;
} {
  let strict = false;
  let dryRun = false;
  let includePlanned = false;
  let onlyPhase: string | null = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--strict") strict = true;
    if (arg === "--dry-run") dryRun = true;
    if (arg === "--include-planned") includePlanned = true;
    if (arg === "--phase") {
      const value = argv[i + 1];
      if (!value) throw new Error("Missing value for --phase");
      onlyPhase = value.toUpperCase();
      i += 1;
    }
  }

  return { strict, dryRun, includePlanned, onlyPhase };
}

async function runCommand(command: string): Promise<{ exitCode: number | null; stdout: string; stderr: string; durationMs: number }> {
  const start = Date.now();

  return new Promise((resolve) => {
    const child = spawn(command, {
      shell: true,
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk: Buffer) => {
      const text = chunk.toString();
      stdout += text;
      process.stdout.write(text);
    });

    child.stderr.on("data", (chunk: Buffer) => {
      const text = chunk.toString();
      stderr += text;
      process.stderr.write(text);
    });

    child.on("close", (exitCode) => {
      resolve({ exitCode, stdout, stderr, durationMs: Date.now() - start });
    });
  });
}

function shouldRunPhase(phase: PhaseConfig, onlyPhase: string | null, includePlanned: boolean): boolean {
  if (onlyPhase && phase.id !== onlyPhase) return false;
  if (phase.status === "planned" && !includePlanned) return false;
  return true;
}

async function writeReports(summary: RunSummary): Promise<void> {
  await fs.mkdir(REPORT_DIR, { recursive: true });

  const jsonPath = path.join(REPORT_DIR, "last-run.json");
  const mdPath = path.join(REPORT_DIR, "last-run.md");

  await fs.writeFile(jsonPath, JSON.stringify(summary, null, 2));

  const lines: string[] = [];
  lines.push("# Roadmap Automation Report");
  lines.push("");
  lines.push(`- Started: ${summary.startedAt}`);
  lines.push(`- Finished: ${summary.finishedAt}`);
  lines.push(`- Duration: ${summary.durationMs} ms`);
  lines.push(`- Strict: ${summary.strict}`);
  lines.push(`- Dry Run: ${summary.dryRun}`);
  lines.push(`- Include Planned: ${summary.includePlanned}`);
  lines.push(`- Only Phase: ${summary.onlyPhase ?? "all"}`);
  lines.push("");
  lines.push("## Totals");
  lines.push(`- Passed: ${summary.passedCount}`);
  lines.push(`- Failed: ${summary.failedCount}`);
  lines.push(`- Skipped: ${summary.skippedCount}`);
  lines.push("");
  lines.push("## Checks");
  lines.push("| Phase | Status | Check | Outcome | Exit | Duration(ms) |");
  lines.push("|---|---|---|---|---:|---:|");

  for (const r of summary.results) {
    lines.push(`| ${r.phaseId} | ${r.phaseStatus} | ${r.checkId} | ${r.outcome} | ${r.exitCode ?? "-"} | ${r.durationMs} |`);
  }

  lines.push("");
  lines.push("## Failed Check Details");

  const failed = summary.results.filter((r) => r.outcome === "failed");
  if (failed.length === 0) {
    lines.push("No failures.");
  } else {
    for (const r of failed) {
      lines.push(`### ${r.phaseId}/${r.checkId}`);
      lines.push("");
      lines.push(`- Command: \`${r.command}\``);
      lines.push(`- Exit: ${r.exitCode}`);
      lines.push("");
      if (r.stderr.trim()) {
        lines.push("```text");
        lines.push(r.stderr.trim());
        lines.push("```");
      }
      if (r.stdout.trim()) {
        lines.push("```text");
        lines.push(r.stdout.trim());
        lines.push("```");
      }
      lines.push("");
    }
  }

  await fs.writeFile(mdPath, lines.join("\n"));
}

async function main(): Promise<void> {
  const { strict, dryRun, includePlanned, onlyPhase } = parseArgs(process.argv.slice(2));
  const start = Date.now();
  const startedAt = new Date(start).toISOString();

  const rawConfig = await fs.readFile(CONFIG_PATH, "utf8");
  const config = JSON.parse(rawConfig) as RoadmapConfig;

  const results: CheckResult[] = [];

  for (const phase of config.phases) {
    const runPhase = shouldRunPhase(phase, onlyPhase, includePlanned);

    for (const check of phase.checks) {
      if (!runPhase) {
        results.push({
          phaseId: phase.id,
          phaseTitle: phase.title,
          phaseStatus: phase.status,
          checkId: check.id,
          description: check.description,
          command: check.command,
          outcome: "skipped",
          exitCode: null,
          durationMs: 0,
          stdout: "",
          stderr: ""
        });
        continue;
      }

      if (dryRun) {
        console.log(`[dry-run] ${phase.id}/${check.id} -> ${check.command}`);
        results.push({
          phaseId: phase.id,
          phaseTitle: phase.title,
          phaseStatus: phase.status,
          checkId: check.id,
          description: check.description,
          command: check.command,
          outcome: "skipped",
          exitCode: null,
          durationMs: 0,
          stdout: "",
          stderr: ""
        });
        continue;
      }

      console.log(`\n==> ${phase.id} ${phase.title} :: ${check.id}`);
      const run = await runCommand(check.command);
      const outcome: CheckResult["outcome"] = run.exitCode === 0 ? "passed" : "failed";

      results.push({
        phaseId: phase.id,
        phaseTitle: phase.title,
        phaseStatus: phase.status,
        checkId: check.id,
        description: check.description,
        command: check.command,
        outcome,
        exitCode: run.exitCode,
        durationMs: run.durationMs,
        stdout: run.stdout,
        stderr: run.stderr
      });
    }
  }

  const finishedAt = new Date().toISOString();
  const passedCount = results.filter((r) => r.outcome === "passed").length;
  const failedCount = results.filter((r) => r.outcome === "failed").length;
  const skippedCount = results.filter((r) => r.outcome === "skipped").length;

  const summary: RunSummary = {
    startedAt,
    finishedAt,
    durationMs: Date.now() - start,
    strict,
    dryRun,
    includePlanned,
    onlyPhase,
    failedCount,
    passedCount,
    skippedCount,
    results
  };

  await writeReports(summary);

  console.log("\nRoadmap automation complete.");
  console.log(`Passed: ${passedCount}, Failed: ${failedCount}, Skipped: ${skippedCount}`);
  console.log(`Reports: ${path.relative(process.cwd(), path.join(REPORT_DIR, "last-run.json"))}`);
  console.log(`Reports: ${path.relative(process.cwd(), path.join(REPORT_DIR, "last-run.md"))}`);

  if (strict && failedCount > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("roadmap automation failed", error);
  process.exit(1);
});
