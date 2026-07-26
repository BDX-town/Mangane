'use strict';

const fs = require('node:fs');
const path = require('node:path');

const repositoryRoot = path.resolve(
  process.env.FOUNDATIONAL_CONTROL_ROOT || path.resolve(__dirname, '..'),
);
const repositoryRealRoot = fs.realpathSync(repositoryRoot);
const requiredControls = [
  'avatar',
  'button',
  'card-shell',
  'chip',
  'field',
  'icon-button',
  'list-row',
  'menu-trigger',
  'segmented-control',
];

const fail = message => {
  throw new Error(`Foundational control contract: ${message}`);
};

const resolveRepositoryFile = (relativePath, label) => {
  if (typeof relativePath !== 'string' || relativePath.length === 0) {
    fail(`${label} must be a non-empty repository-relative path`);
  }
  const resolved = path.resolve(repositoryRoot, relativePath);
  if (resolved !== repositoryRoot && !resolved.startsWith(`${repositoryRoot}${path.sep}`)) {
    fail(`${label} escapes the repository`);
  }
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    fail(`${label} missing: ${relativePath}`);
  }
  const canonical = fs.realpathSync(resolved);
  if (canonical !== repositoryRealRoot && !canonical.startsWith(`${repositoryRealRoot}${path.sep}`)) {
    fail(`${label} resolves outside the repository`);
  }
  return canonical;
};

const readUtf8 = (relativePath, label) =>
  fs.readFileSync(resolveRepositoryFile(relativePath, label), 'utf8');

const contractPath = resolveRepositoryFile(
  'config/foundational-control-contracts.json',
  'configuration',
);

let contract;
try {
  contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
} catch (error) {
  fail(`configuration is not valid JSON: ${error.message}`);
}

if (contract.schemaVersion !== 1) fail('schemaVersion must be 1');
if (!contract.controls || typeof contract.controls !== 'object' || Array.isArray(contract.controls)) {
  fail('controls must be an object');
}
const actualControls = Object.keys(contract.controls).sort();
if (JSON.stringify(actualControls) !== JSON.stringify(requiredControls)) {
  fail(`control keys must be exactly: ${requiredControls.join(', ')}`);
}

for (const [name, control] of Object.entries(contract.controls)) {
  resolveRepositoryFile(control.implementation, `${name} implementation`);
  if (!Array.isArray(control.states) || !control.states.includes('default')) {
    fail(`${name} states must include default`);
  }
  if (new Set(control.states).size !== control.states.length) {
    fail(`${name} states must not contain duplicates`);
  }
  if (typeof control.nativeSemantics !== 'string' || control.nativeSemantics.trim().length === 0) {
    fail(`${name} nativeSemantics must be documented`);
  }
  if (!Array.isArray(control.testEvidence) || control.testEvidence.length === 0) {
    fail(`${name} testEvidence must not be empty`);
  }
  control.testEvidence.forEach((testPath, index) => {
    resolveRepositoryFile(testPath, `${name} testEvidence[${index}]`);
  });
}

const styles = readUtf8(contract.styleContract, 'styleContract');
for (const marker of [
  ':focus-visible',
  'prefers-reduced-motion: reduce',
  'forced-colors: active',
  'var(--ds-color-focus-ring)',
]) {
  if (!styles.includes(marker)) fail(`style contract must include ${marker}`);
}
if (/transition\s*:\s*all\b/.test(styles)) fail('style contract must not use transition: all');

const focusUtility = readUtf8(contract.focusUtility, 'focusUtility');
if (!focusUtility.includes('isConnected') || !focusUtility.includes('.focus()')) {
  fail('focus utility must validate connection before restoring focus');
}

const documentation = readUtf8(contract.documentation, 'documentation');
for (const [name, control] of Object.entries(contract.controls)) {
  if (!documentation.includes(`\`${name}\``)) fail(`documentation missing ${name}`);
  for (const state of control.states) {
    if (!documentation.includes(`\`${state}\``)) {
      fail(`documentation missing ${name} state ${state}`);
    }
  }
}

process.stdout.write(
  `Foundational control contract verified: ${actualControls.length} controls, focus, motion, forced-colors, evidence, and documentation.\n`,
);
