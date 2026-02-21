import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const PORT = Number(process.env.LIGHTHOUSE_PORT || 3100);
const ROUTES = ["/", "/audit", "/guides"];

function run(command: string, args: string[], options: { env?: NodeJS.ProcessEnv } = {}): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      env: { ...process.env, ...options.env }
    });
    child.on("close", (code) => resolve(code ?? 1));
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(port: number, retries = 40): Promise<void> {
  const url = `http://localhost:${port}/`;
  for (let i = 0; i < retries; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // retry
    }
    await sleep(1000);
  }
  throw new Error(`SERVER_NOT_READY_${url}`);
}

async function main(): Promise<void> {
  const outDir = path.resolve("logs/lighthouse");
  await fs.mkdir(outDir, { recursive: true });

  const server = spawn("pnpm", ["exec", "next", "start", "-p", String(PORT)], {
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" }
  });

  await waitForServer(PORT);

  const results: Array<{ route: string; code: number; report: string }> = [];
  try {
    for (const route of ROUTES) {
      const target = `http://localhost:${PORT}${route}`;
      const report = path.join(outDir, `lighthouse-${route === "/" ? "home" : route.replace(/\//g, "-")}.json`);
      const code = await run("pnpm", [
        "dlx",
        "lighthouse",
        target,
        "--quiet",
        "--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage --allow-insecure-localhost --ignore-certificate-errors",
        "--only-categories=performance,seo,best-practices,accessibility",
        "--output=json",
        `--output-path=${report}`
      ]);
      results.push({ route, code, report });
    }
  } finally {
    server.kill("SIGTERM");
  }

  const failed = results.filter((x) => x.code !== 0);
  await fs.writeFile(
    path.join(outDir, "summary.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        port: PORT,
        results,
        failed: failed.length
      },
      null,
      2
    )
  );

  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
