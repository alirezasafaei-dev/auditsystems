import { prisma } from "../lib/db";
import { enqueueJob } from "../worker/queue";

async function main(): Promise<void> {
  const run = await prisma.auditRun.create({
    data: {
      url: "https://example.com",
      depth: "QUICK",
      status: "QUEUED"
    }
  });

  const share = await prisma.reportShare.create({
    data: {
      runId: run.id,
      token: crypto.randomUUID().replace(/-/g, "")
    }
  });

  const job = await enqueueJob({
    type: "AUDIT_RUN",
    payload: { runId: run.id }
  });

  console.log(JSON.stringify({ runId: run.id, token: share.token, jobId: job.id }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
