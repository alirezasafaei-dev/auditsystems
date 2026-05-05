import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

function readEnv(name: string): string {
  return String(process.env[name] ?? "").trim();
}

export function getLocalRedisUrl(): string | null {
  const url = readEnv("ASDEV_REDIS_URL") || readEnv("REDIS_URL");
  return url || null;
}

async function runRedisCli(args: string[], timeoutMs = 1500): Promise<string> {
  const redisUrl = getLocalRedisUrl();
  if (!redisUrl) {
    throw new Error("REDIS_URL_MISSING");
  }

  const { stdout } = await execFileAsync(
    "redis-cli",
    ["--no-auth-warning", "--raw", "-u", redisUrl, ...args],
    { timeout: timeoutMs, maxBuffer: 1024 * 1024 }
  );
  return stdout.trim();
}

export async function pingLocalRedis(timeoutMs = 1200): Promise<boolean> {
  const out = await runRedisCli(["PING"], timeoutMs);
  return out === "PONG";
}

export async function consumeLocalRedisWindow(input: {
  key: string;
  windowSec: number;
  timeoutMs?: number;
}): Promise<{ count: number; ttl: number }> {
  const script = [
    "local c=redis.call('INCR',KEYS[1]);",
    "local t=redis.call('TTL',KEYS[1]);",
    "if tonumber(t) < 0 then",
    "  redis.call('EXPIRE',KEYS[1],ARGV[1]);",
    "  t=tonumber(ARGV[1]);",
    "end;",
    "return {c,t};"
  ].join(" ");
  const out = await runRedisCli(["EVAL", script, "1", input.key, String(input.windowSec)], input.timeoutMs ?? 1500);
  const lines = out.split("\n").map((x) => x.trim()).filter(Boolean);
  const count = Number(lines[0] ?? Number.NaN);
  const ttlRaw = Number(lines[1] ?? Number.NaN);
  if (!Number.isFinite(count) || !Number.isFinite(ttlRaw)) {
    throw new Error(`LOCAL_REDIS_PARSE_ERROR:${out}`);
  }
  const ttl = ttlRaw > 0 ? ttlRaw : input.windowSec;
  return { count, ttl };
}
