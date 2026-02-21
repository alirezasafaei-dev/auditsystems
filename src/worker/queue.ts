import { Job, JobStatus, JobType, Prisma } from "@prisma/client";
import { prisma } from "../lib/db";

export type LeasedJob = Job;

export async function enqueueJob(input: {
  type: JobType;
  payload: Prisma.InputJsonValue;
  maxAttempts?: number;
  timeoutMs?: number;
}): Promise<Job> {
  return prisma.job.create({
    data: {
      type: input.type,
      payload: input.payload,
      maxAttempts: input.maxAttempts ?? 3,
      timeoutMs: input.timeoutMs ?? 45000
    }
  });
}

export async function recycleExpiredLeases(): Promise<number> {
  const result = await prisma.job.updateMany({
    where: {
      status: JobStatus.RUNNING,
      leasedUntil: { lt: new Date() }
    },
    data: {
      status: JobStatus.QUEUED,
      availableAt: new Date(Date.now() + 5000),
      lockedAt: null,
      leasedUntil: null,
      workerId: null,
      lastError: "Job lease expired and was re-queued"
    }
  });

  return result.count;
}

export async function leaseNextJob(workerId: string, fallbackTimeoutMs: number): Promise<LeasedJob | null> {
  const rows = await prisma.$queryRaw<LeasedJob[]>`
WITH candidate AS (
  SELECT j.id
  FROM "Job" j
  WHERE j.status = 'QUEUED'::"JobStatus"
    AND j."availableAt" <= NOW()
  ORDER BY j."availableAt" ASC, j."createdAt" ASC
  FOR UPDATE SKIP LOCKED
  LIMIT 1
)
UPDATE "Job" j
SET status = 'RUNNING'::"JobStatus",
    "attempt" = j."attempt" + 1,
    "startedAt" = COALESCE(j."startedAt", NOW()),
    "lockedAt" = NOW(),
    "leasedUntil" = NOW() + (COALESCE(NULLIF(j."timeoutMs", 0), ${fallbackTimeoutMs}) * INTERVAL '1 millisecond'),
    "workerId" = ${workerId},
    "updatedAt" = NOW()
FROM candidate c
WHERE j.id = c.id
RETURNING j.*;
`;

  return rows[0] ?? null;
}

export async function markJobSucceeded(jobId: string): Promise<void> {
  await prisma.job.update({
    where: { id: jobId },
    data: {
      status: JobStatus.SUCCEEDED,
      leasedUntil: null,
      finishedAt: new Date()
    }
  });
}

function nextBackoffMs(attempt: number): number {
  return Math.min(60000, 5000 * 2 ** Math.max(0, attempt - 1));
}

export async function markJobFailed(job: Job, error: unknown): Promise<void> {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const shouldRetry = job.attempt < job.maxAttempts;

  await prisma.job.update({
    where: { id: job.id },
    data: shouldRetry
      ? {
          status: JobStatus.QUEUED,
          availableAt: new Date(Date.now() + nextBackoffMs(job.attempt)),
          leasedUntil: null,
          lockedAt: null,
          workerId: null,
          lastError: errorMessage
        }
      : {
          status: JobStatus.FAILED,
          leasedUntil: null,
          finishedAt: new Date(),
          lastError: errorMessage
        }
  });
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
