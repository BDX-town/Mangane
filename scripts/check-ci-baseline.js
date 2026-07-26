'use strict';

const fs = require('node:fs');
const path = require('node:path');

const YAML = require('yaml');

const root = path.resolve(process.env.CI_BASELINE_ROOT || path.resolve(__dirname, '..'));
const workflowPath = path.join(root, '.github', 'workflows', 'phase-0g-quality.yml');
const ledgerPath = path.join(root, 'config', 'test-ci-baseline.json');
const fail = message => {
  throw new Error(`ci-baseline: ${message}`);
};
const source = fs.readFileSync(workflowPath, 'utf8');
const workflow = YAML.parse(source);
const requiredJobs = [
  'quality',
  'unit-integration',
  'browser-accessibility',
  'worker-security',
  'production-build',
  'development-build',
];
const requiredDocuments = [
  'docs/architecture/TEST_AND_CI_BASELINE.md',
  'docs/architecture/FLAKY_TEST_AND_QUARANTINE_POLICY.md',
  'docs/architecture/BROWSER_WORKER_HARNESS_PLAN.md',
  'docs/architecture/ACCESSIBILITY_TEST_BASELINE.md',
  'docs/architecture/SECURITY_REGRESSION_SUITE.md',
  'docs/architecture/BUILD_AND_BUNDLE_BUDGETS.md',
];

if (source.includes('continue-on-error')) fail('continue-on-error is prohibited');
if (workflow.permissions?.contents !== 'read' || Object.keys(workflow.permissions).length !== 1) {
  fail('workflow permissions must remain contents: read only');
}
if (!workflow.concurrency?.['cancel-in-progress']) fail('stale workflow runs must be cancelled');
const hasTrigger = trigger => Object.prototype.hasOwnProperty.call(workflow.on || {}, trigger);
if (!hasTrigger('pull_request') || !hasTrigger('push') || !hasTrigger('workflow_dispatch')) {
  fail('pull request, main push, and manual triggers are required');
}
if (JSON.stringify(Object.keys(workflow.jobs).sort()) !== JSON.stringify([...requiredJobs].sort())) {
  fail('canonical job matrix changed without reconciliation');
}
const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
const typecheckBaseline = JSON.parse(fs.readFileSync(path.join(root, 'config', 'typecheck-baseline.json'), 'utf8'));
const buildBudget = JSON.parse(fs.readFileSync(path.join(root, 'config', 'build-budget.json'), 'utf8'));
if (ledger.schemaVersion !== 1 || ledger.status !== 'phase-0g-canonical') fail('baseline ledger schema or status changed');
if (JSON.stringify(ledger.requiredJobs) !== JSON.stringify(requiredJobs)) fail('baseline ledger job matrix drifted');
if (ledger.baselines?.quarantinedTests !== 0 || ledger.baselines?.automaticTestRetries !== 0) {
  fail('baseline ledger must not accept quarantines or automatic retries');
}
if (ledger.baselines.typeScriptInheritedDiagnostics !== typecheckBaseline.diagnosticCount) {
  fail('baseline ledger TypeScript diagnostic count drifted');
}
if (buildBudget.schemaVersion !== 1 || !buildBudget.owner) fail('build budget authority is invalid');
for (const document of requiredDocuments) {
  if (!fs.readFileSync(path.join(root, document), 'utf8').trim()) fail(`required document is empty: ${document}`);
}
for (const directory of ['app', 'config', 'docs', 'scripts']) {
  const start = path.join(root, directory);
  if (!fs.existsSync(start)) continue;
  const pending = [start];
  while (pending.length) {
    const current = pending.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (/ \d+\.[^.]+$/.test(entry.name)) fail(`unreconciled conflict copy: ${path.relative(root, path.join(current, entry.name))}`);
      if (entry.isDirectory()) pending.push(path.join(current, entry.name));
    }
  }
}
for (const jobId of requiredJobs) {
  const job = workflow.jobs[jobId];
  if (!job.name?.includes('/')) fail(`${jobId} must name its owner`);
  if (!Number.isInteger(job['timeout-minutes']) || job['timeout-minutes'] > 35) {
    fail(`${jobId} must have a bounded timeout of at most 35 minutes`);
  }
  for (const step of job.steps) {
    if (step.uses && !/@[0-9a-f]{40}$/.test(step.uses.split(' ')[0])) {
      fail(`${jobId} contains an action that is not pinned to a full commit`);
    }
    if (step.uses?.startsWith('actions/checkout@') && step.with?.['persist-credentials'] !== false) {
      fail(`${jobId} must not persist checkout credentials into untrusted build steps`);
    }
  }
  const commands = job.steps.filter(step => step.run).map(step => step.run);
  if (!commands.includes('yarn install --immutable --mode=skip-build')) {
    fail(`${jobId} must use the immutable script-free install`);
  }
}

const requiredCommands = {
  quality: ['yarn lint:js:baseline', 'yarn lint:sass', 'yarn typecheck'],
  'unit-integration': ['yarn test --runInBand --coverage --silent', 'yarn test:governance', 'yarn check:persistence'],
  'browser-accessibility': ['yarn test:browser-accessibility'],
  'worker-security': ['yarn test:security-regression'],
  'production-build': ['yarn build', 'yarn check:build'],
  'development-build': ['yarn prepare:twemoji', 'yarn build'],
};
requiredCommands['production-build'].unshift('yarn prepare:twemoji');
for (const [jobId, commands] of Object.entries(requiredCommands)) {
  const actual = workflow.jobs[jobId].steps.filter(step => step.run).map(step => step.run);
  for (const command of commands) {
    if (!actual.includes(command)) fail(`${jobId} is missing required command: ${command}`);
  }
  if (commands.includes('yarn prepare:twemoji') && actual.indexOf('yarn prepare:twemoji') > actual.indexOf('yarn build')) {
    fail(`${jobId} must prepare verified Twemoji assets before building`);
  }
}

process.stdout.write(`${JSON.stringify({
  jobs: requiredJobs.length,
  permissions: workflow.permissions,
  concurrency: workflow.concurrency,
}, null, 2)}\n`);
