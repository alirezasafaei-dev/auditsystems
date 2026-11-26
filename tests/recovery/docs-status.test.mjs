import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';

test('generated phase inventory does not certify production readiness', () => {
  const scratch = resolve('.state/docs-status-tests');
  mkdirSync(scratch, { recursive: true });
  const fixture = mkdtempSync(join(scratch, 'case-'));
  try {
    for (const dir of ['src/app/api', 'ops/roadmap']) mkdirSync(join(fixture, dir), { recursive: true });
    mkdirSync(join(fixture, 'src/app/api/health'), { recursive: true });
    writeFileSync(join(fixture, 'src/app/api/health/route.ts'), 'export {};');
    writeFileSync(join(fixture, 'package.json'), JSON.stringify({ scripts: {} }));
    writeFileSync(join(fixture, '.env.example'), 'EXAMPLE=placeholder\n');
    writeFileSync(join(fixture, 'ops/roadmap/phases.json'), JSON.stringify({
      version: 'test', phases: [{ id: 'A', title: 'Foundation', status: 'done', checks: [] }]
    }));
    const result = spawnSync(process.execPath, ['--experimental-strip-types', resolve('src/scripts/docs-automation.ts')], {
      cwd: fixture, encoding: 'utf8', timeout: 15000
    });
    assert.equal(result.status, 0, result.stderr);
    const output = readFileSync(join(fixture, 'docs/AUTO_GENERATED_STATUS.md'), 'utf8');
    assert.match(output, /not production verification/);
    assert.match(output, /recovery\/CURRENT_STATUS\.md/);
    assert.match(output, /Declared done: 1/);
    assert.doesNotMatch(output, /^- Done:/m);
    assert.match(output, /API routes: 1/);
    assert.match(output, /`\/api\/health`/);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
