'use strict';

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const baselinePath = path.resolve(process.env.TYPECHECK_BASELINE_PATH || path.join(root, 'config', 'typecheck-baseline.json'));
const tscPath = path.join(root, 'node_modules', 'typescript', 'bin', 'tsc');
const args = ['-p', path.join(root, 'tsconfig.typecheck.json'), '--pretty', 'false'];

const result = spawnSync(process.execPath, [tscPath, ...args], {
  cwd: root,
  encoding: 'utf8',
  env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
  maxBuffer: 16 * 1024 * 1024,
});

if (result.error) throw result.error;

const output = `${result.stdout || ''}${result.stderr || ''}`
  .replaceAll(`${root}${path.sep}`, '')
  .replaceAll('\\', '/')
  .trim();
const diagnosticLines = output
  .split('\n')
  .map(line => line.trimEnd())
  .filter(line => /(?:^|\/)[^(\n]+\(\d+,\d+\): error TS\d+:/.test(line));
const diagnostics = diagnosticLines.map(line => {
  const match = line.match(/^(.+)\((\d+),(\d+)\): error (TS\d+): (.+)$/);
  if (!match) throw new Error(`typecheck-baseline: could not parse diagnostic: ${line}`);
  return {
    code: match[4],
    column: Number(match[3]),
    file: match[1],
    line: Number(match[2]),
    message: match[5],
  };
});
const countsByCode = diagnostics.reduce((counts, diagnostic) => {
  counts[diagnostic.code] = (counts[diagnostic.code] || 0) + 1;
  return counts;
}, {});
const observed = {
  compilerExitCode: result.status,
  diagnosticCount: diagnostics.length,
  countsByCode: Object.fromEntries(Object.entries(countsByCode).sort(([left], [right]) => left.localeCompare(right))),
  diagnostics,
};

if (process.argv.includes('--update')) {
  const baseline = {
    schemaVersion: 1,
    status: diagnostics.length === 0 ? 'clean' : 'inherited-debt-drift-gated',
    owner: 'frontend-maintainers',
    trackingIssue: 'Phase 1 TypeScript authority migration',
    expiresOn: '2026-10-31',
    rationale: 'The inherited mixed JavaScript and TypeScript reducer graph is not yet soundly typed. Every existing diagnostic is pinned so new or changed errors fail CI.',
    ...observed,
  };
  fs.writeFileSync(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`);
  process.stdout.write(`Updated ${path.relative(root, baselinePath)} with ${diagnostics.length} diagnostics.\n`);
  process.exit(0);
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
for (const field of ['schemaVersion', 'status', 'owner', 'trackingIssue', 'expiresOn', 'rationale']) {
  if (!baseline[field]) throw new Error(`typecheck-baseline: missing ${field}`);
}
if (baseline.schemaVersion !== 1) throw new Error(`typecheck-baseline: unsupported schemaVersion ${baseline.schemaVersion}`);
if (Date.parse(`${baseline.expiresOn}T23:59:59Z`) < Date.now()) {
  throw new Error(`typecheck-baseline: inherited diagnostic baseline expired on ${baseline.expiresOn}`);
}

const expected = {
  compilerExitCode: baseline.compilerExitCode,
  diagnosticCount: baseline.diagnosticCount,
  countsByCode: baseline.countsByCode,
  diagnostics: baseline.diagnostics,
};
if (JSON.stringify(observed) !== JSON.stringify(expected)) {
  process.stderr.write('TypeScript diagnostics drifted from config/typecheck-baseline.json.\n');
  process.stderr.write(`Expected ${expected.diagnosticCount}; observed ${observed.diagnosticCount}.\n`);
  if (output) process.stderr.write(`${output}\n`);
  process.exit(1);
}

process.stdout.write(`TypeScript baseline is stable: ${diagnostics.length} inherited diagnostics, 0 unbaselined diagnostics.\n`);
