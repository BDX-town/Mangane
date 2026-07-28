'use strict';

const { spawnSync } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const eslintPath = path.join(root, 'node_modules', 'eslint', 'bin', 'eslint.js');
const warningBudget = 187;
const result = spawnSync(process.execPath, [
  eslintPath,
  '--ext', '.js,.jsx,.ts,.tsx',
  '.',
  '--no-cache',
  '--format', 'json',
], {
  cwd: root,
  encoding: 'utf8',
  env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
  maxBuffer: 16 * 1024 * 1024,
});

if (result.error) throw result.error;
if (result.status !== 0 && result.status !== 1) {
  process.stderr.write(result.stderr || result.stdout);
  process.exit(result.status || 1);
}

const reports = JSON.parse(result.stdout || '[]');
const errors = reports.reduce((count, report) => count + report.errorCount, 0);
const warnings = reports.reduce((count, report) => count + report.warningCount, 0);
if (errors > 0 || warnings > warningBudget) {
  process.stderr.write(`ESLint baseline failed: ${errors} errors, ${warnings} warnings (budget ${warningBudget}).\n`);
  process.exit(1);
}

process.stdout.write(`ESLint baseline passed: ${errors} errors, ${warnings}/${warningBudget} warnings.\n`);
