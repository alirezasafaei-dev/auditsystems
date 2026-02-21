import process from "node:process";
import { handlers } from "./audit.handler";
import { leaseNextJob, markJobFailed, markJobSucceeded, recycleExpiredLeases, sleep } from "./queue";

const workerId = `worker-${process.pid}`;
const pollMs = Number(process.env.WORKER_POLL_MS ?? "1200");
const fallbackTimeoutMs = Number(process.env.WORKER_JOB_TIMEOUT_MS ?? "45000");

async function runLoop(): Promise<void> {
  for (;;) {
    await recycleExpiredLeases();
    const job = await leaseNextJob(workerId, fallbackTimeoutMs);

    if (!job) {
      await sleep(pollMs);
      continue;
    }

    const controller = new AbortController();
    const timeoutMs = job.timeoutMs || fallbackTimeoutMs;
    const timer = setTimeout(() => controller.abort(new Error("JOB_TIMEOUT")), timeoutMs);

    try {
      const handler = handlers[job.type];
      if (!handler) {
        throw new Error(`NO_HANDLER_FOR_${job.type}`);
      }
      await handler(job, controller.signal);
      await markJobSucceeded(job.id);
    } catch (error) {
      await markJobFailed(job, error);
    } finally {
      clearTimeout(timer);
    }
  }
}

runLoop().catch((error) => {
  console.error("Worker crashed", error);
  process.exit(1);
});
