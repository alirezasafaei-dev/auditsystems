import { spawn } from "node:child_process";

type Step = { name: string; command: string };

const steps: Step[] = [
  { name: "Quality Gate", command: "pnpm run check" },
  { name: "Roadmap Automation", command: "pnpm run roadmap:run" },
  { name: "SEO Audit Automation", command: "pnpm run seo:audit" },
  { name: "Docs Refresh", command: "pnpm run docs:generate" },
  { name: "Payment Preflight", command: "pnpm run payment:preflight:strict" }
];

async function run(command: string): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(command, {
      shell: true,
      stdio: "inherit",
      env: process.env
    });

    child.on("close", (code) => resolve(code ?? 1));
  });
}

async function main(): Promise<void> {
  const strict = process.argv.includes("--strict");
  let failed = 0;

  for (const step of steps) {
    console.log(`\n=== ${step.name} ===`);
    const code = await run(step.command);
    if (code !== 0) {
      failed += 1;
      console.error(`Step failed: ${step.name}`);
      if (strict) {
        process.exit(code);
      }
    }
  }

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
