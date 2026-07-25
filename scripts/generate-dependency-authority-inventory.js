#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const {
  buildInventory,
  parseAuditJsonLines,
  parseLockfile,
} = require('./dependency-inventory-lib');

const root = path.resolve(process.env.DEPENDENCY_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const auditIndex = process.argv.indexOf('--audit');
if (auditIndex === -1 || !process.argv[auditIndex + 1]) {
  throw new Error('usage: node scripts/generate-dependency-authority-inventory.js --audit <yarn-audit.jsonl>');
}

const auditRowsFromRegistry = parseAuditJsonLines(path.resolve(process.argv[auditIndex + 1]));
const resolved = parseLockfile(path.join(root, 'yarn.lock')).entries;
const auditRows = auditRowsFromRegistry.filter(advisory =>
  resolved.some(entry => entry.name === advisory.package && advisory.treeVersions.includes(entry.version)));
const inventory = buildInventory({ root, auditRows });
const configDirectory = path.join(root, 'config');
const docsDirectory = path.join(root, 'docs', 'architecture');
fs.mkdirSync(configDirectory, { recursive: true });
fs.mkdirSync(docsDirectory, { recursive: true });

fs.writeFileSync(
  path.join(configDirectory, 'dependency-advisory-snapshot.json'),
  `${JSON.stringify({ schemaVersion: 1, advisories: auditRows }, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(configDirectory, 'dependency-authority-inventory.json'),
  `${JSON.stringify(inventory, null, 2)}\n`,
);

const directPackages = inventory.packages.filter(pkg => pkg.direct);
const licenseCounts = new Map();
for (const pkg of inventory.packages) {
  const current = licenseCounts.get(pkg.license.expression) || { count: 0, statuses: new Set(), obligations: new Set() };
  current.count += 1;
  current.statuses.add(pkg.license.status);
  for (const obligation of pkg.license.obligations) current.obligations.add(obligation);
  licenseCounts.set(pkg.license.expression, current);
}
const installRiskPackages = inventory.packages.filter(pkg =>
  pkg.installBehavior.hasInstallScript
  || pkg.installBehavior.hasNativeBinding
  || pkg.installBehavior.hasInstallTimeNetworkIndicator
  || pkg.installBehavior.hasPackageScriptNetworkIndicator
  || pkg.installBehavior.hasCodeGenerationIndicator);

const dependencyMarkdown = `# Dependency and License Inventory

Status: **Current Phase 0A evidence**

Generated from \`package.json\`, \`yarn.lock\`, installed package metadata, repository import/configuration evidence, GitHub Actions workflows, and the committed npm advisory snapshot. Do not edit generated tables by hand; regenerate them with \`scripts/generate-dependency-authority-inventory.js\`.

## Authority and completeness

- Machine-readable authority: [\`config/dependency-authority-inventory.json\`](../../config/dependency-authority-inventory.json)
- Advisory snapshot: [\`config/dependency-advisory-snapshot.json\`](../../config/dependency-advisory-snapshot.json)
- Drift and license checker: [\`scripts/check-dependency-authority-inventory.js\`](../../scripts/check-dependency-authority-inventory.js)
- Resolved packages classified: **${inventory.summary.resolvedPackages}**
- Direct packages with an owner, purpose, context, and usage evidence: **${inventory.summary.directPackages}**
- Package names with multiple locked locators or versions: **${inventory.summary.duplicatePackageNames}**
- Packages with install scripts: **${inventory.summary.installScriptPackages}**
- Packages with native-binding indicators: **${inventory.summary.nativeBindingPackages}**
- Packages with install-time network indicators: **${inventory.summary.networkInstallIndicatorPackages}**
- Packages with network-capable package scripts: **${inventory.summary.packageScriptNetworkIndicatorPackages}**
- Packages with code-generation/build script indicators: **${inventory.summary.codeGenerationIndicatorPackages}**
- GitHub Actions use sites reviewed: **${inventory.summary.actionUses}** (${inventory.summary.unpinnedActionUses} not commit-pinned)

Every lockfile locator has a classification, execution context, root reachability set, maintenance status, license disposition, install behavior, owner, and purpose in the machine-readable authority. A transitive package may inherit multiple roots and contexts.

The machine-readable \`duplicatePackages\` register records every package name with multiple locked locators or versions, including all roots that pull it into the graph. Duplicate presence is evidence for consolidation review, not proof that versions are interchangeable.

## Classification rules

| Classification | Meaning |
|---|---|
| runtime / runtime-transitive | Imported by browser or worker production source, or reachable from such a direct root |
| build-only / build-transitive | Used by build, repository automation, development tooling, or a transitive root in that class |
| test-only / test-transitive | Used only by test infrastructure or reachable only from a test root |
| development-unverified / unverified-transitive | Declared for development but no authoritative import or command use was found |
| unused-or-dynamically-referenced-unverified | Production-section declaration with no static evidence; removal or dynamic-use review is required |
| orphaned-lockfile-entry | Present in the lockfile but no direct-root path was reconstructed; it must not be treated as shipped without review |

## Direct dependency authority

| Package | Version | Classification | Context | Owner | Evidence sites | Replacement relevance |
|---|---:|---|---|---|---:|---|
${directPackages.map(pkg => `| ${pkg.name} | ${pkg.version} | ${pkg.classification} | ${pkg.executionContexts.join(', ') || 'unverified'} | ${pkg.owner} | ${pkg.usageEvidence.length} | ${pkg.replacementRelevance} |`).join('\n')}

## License families

| License expression | Resolved packages | Evidence status | Obligations / disposition |
|---|---:|---|---|
${[...licenseCounts].sort((a, b) => a[0].localeCompare(b[0])).map(([license, record]) => `| ${license} | ${record.count} | ${[...record.statuses].sort().join(', ')} | ${[...record.obligations].sort().join(', ')} |`).join('\n')}

Mangane remains AGPL-3.0-or-later. This inventory records dependency declarations; it is not legal advice. Copyleft, notice, attribution, custom-license, and license-conflict entries must be reviewed before distribution changes.

## Install, native, download, and code-generation exposure

| Package | Version | Install script | Native | Install network | Any-script network | Code generation | Root reachability |
|---|---:|---:|---:|---:|---:|---:|---|
${installRiskPackages.map(pkg => `| ${pkg.name} | ${pkg.version} | ${pkg.installBehavior.hasInstallScript} | ${pkg.installBehavior.hasNativeBinding} | ${pkg.installBehavior.hasInstallTimeNetworkIndicator} | ${pkg.installBehavior.hasPackageScriptNetworkIndicator} | ${pkg.installBehavior.hasCodeGenerationIndicator} | ${pkg.rootDependencies.join(', ')} |`).join('\n')}

The repository itself also runs \`scripts/download-twemoji-assets.js\` during \`postinstall\`, performing an unverified GitHub download piped into \`tar\`. That is a supply-chain and reproducibility blocker queued for remediation; the Phase 0A CI gate uses \`--mode=skip-build\` so inventory validation cannot execute dependency or repository install scripts.

## GitHub Actions supply-chain review

All action use sites are enumerated in the machine-readable inventory. Non-SHA refs are findings, not implicit approvals. New, removed, or changed use sites fail the checker until the authority is regenerated and reviewed. The dedicated Phase 0A workflow pins its checkout action by commit.
`;

const highCritical = inventory.advisories.filter(row => ['high', 'critical'].includes(row.severity));
const advisoryMarkdown = `# Advisory Disposition Register

Status: **Current Phase 0A evidence**

Audit snapshot totals: ${inventory.summary.advisories.critical} critical, ${inventory.summary.advisories.high} high, ${inventory.summary.advisories.moderate} moderate, and ${inventory.summary.advisories.low} low findings. Deprecation notices emitted by Yarn are retained in the same snapshot.

High and critical findings require a reachability record, owner, status, and concrete action. None is dismissed solely for being transitive. “Potentially reachable” is fail-closed: it remains remediation-required until an affected-code-path test or upgrade proves otherwise.

| Severity | Package / versions | Advisory | Reachability | Root dependencies | Owner | Required action |
|---|---|---|---|---|---|---|
${highCritical.map(row => `| ${row.severity} | ${row.package} ${row.treeVersions.join(', ')} | ${row.url ? `[${row.advisoryId}](${row.url})` : row.advisoryId} | ${row.disposition.reachability} | ${row.disposition.rootDependencies.join(', ') || 'no reconstructed root'} | ${row.disposition.owner} | ${row.disposition.requiredAction} |`).join('\n')}

Moderate and low findings remain in \`config/dependency-advisory-snapshot.json\` and the machine-readable inventory. Their lower severity does not constitute acceptance; they are tracked for the replacement and baseline work.
`;

const replacementMarkdown = `# Dependency Replacement Queue

Status: **Current Phase 0A evidence**

The queue is risk-ordered during remediation. The machine-readable queue is authoritative for membership; this document establishes priorities and completion evidence.

## P0 — runtime and trusted-install blockers

1. Upgrade or replace runtime-reachable high/critical packages, beginning with Axios and Immutable.
2. Remove or upgrade install/build chains that contain critical \`loader-utils\`, \`tar\`, \`lodash@3\`, or \`websocket-driver\`.
3. Replace the repository \`postinstall\` network pipe with a checksum-verified, bounded, retry-aware asset acquisition or vendored build input.
4. Resolve \`taffydb@2.6.2\` license ambiguity by upgrading JSDoc/removing TaffyDB or obtaining an authoritative legal disposition.

## P1 — deprecated and obsolete direct dependencies

Replace Babel proposal plugins with their maintained transform equivalents, remove duplicate icon/emoji/polyfill stacks after usage proof, and upgrade development-server/build chains that carry known advisories.

## P2 — unverified direct declarations

For every direct package classified \`unused-or-dynamically-referenced-unverified\` or \`development-unverified\`, prove dynamic/configuration usage with an executable fixture or remove it. Moving build/test packages out of \`dependencies\` requires a clean production build and service-worker build before merge.

## Completion evidence

A queue item closes only with lockfile regeneration, updated inventory, targeted tests for the affected execution path, a fresh advisory snapshot, license reconciliation, and a clean install/build result. Suppressions without expiry, owner, and path-specific reachability evidence are prohibited.

Machine-readable queued direct packages: **${inventory.replacementQueue.length}**.
`;

fs.writeFileSync(path.join(docsDirectory, 'DEPENDENCY_AND_LICENSE_INVENTORY.md'), dependencyMarkdown);
fs.writeFileSync(path.join(docsDirectory, 'ADVISORY_DISPOSITION_REGISTER.md'), advisoryMarkdown);
fs.writeFileSync(path.join(docsDirectory, 'DEPENDENCY_REPLACEMENT_QUEUE.md'), replacementMarkdown);

process.stdout.write(`${JSON.stringify(inventory.summary, null, 2)}\n`);
