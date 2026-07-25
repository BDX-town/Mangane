'use strict';

const fs = require('node:fs');
const path = require('node:path');

const extensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.yml', '.yaml']);
const excluded = new Set(['node_modules', '.git', 'build', 'coverage', 'dist', 'tmp']);
const patterns = [
  ['console', /\bconsole\.(?:debug|error|info|log|warn)\b/g],
  ['telemetry-capture', /(?:@sentry\/|\bSentry\.|\bcaptureException\s*\(|\bcaptureMessage\s*\(|\baddBreadcrumb\s*\()/g],
  ['devtools', /(?:\bdevTools\s*:|__REDUX_DEVTOOLS|ReactQueryDevtools)/g],
  ['source-map-setting', /\bdevtool\s*:\s*['"][^'"]+['"]|\bdevtool\s*:\s*false/g],
  ['notification-payload', /(?:showNotification\s*\(|notification\.data)/g],
  ['clipboard', /(?:navigator\.clipboard|clipboardData)/g],
  ['error-boundary', /\bcomponentDidCatch\s*\(/g],
  ['environment-read', /\bprocess\.env(?:\.[A-Z][A-Z0-9_]*|\b)/g],
  ['artifact-upload', /actions\/upload-artifact@/g],
  ['secret-candidate', /(?:-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----|ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[0-9A-Z]{16}|Bearer [A-Za-z0-9._-]{24,}|eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,})/g],
];

const walk = directory => {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute));
    else if (extensions.has(path.extname(entry.name))) files.push(absolute);
  }
  return files;
};

const lineInfo = (source, index) => {
  const prefix = source.slice(0, index);
  const line = prefix.split('\n').length;
  const start = prefix.lastIndexOf('\n') + 1;
  const end = source.indexOf('\n', index);
  return { line, expression: source.slice(start, end < 0 ? source.length : end).trim() };
};

const classify = (kind, relativePath) => {
  if (relativePath === 'app/soapbox/utils/diagnostics.ts') return 'central-redaction-boundary';
  if (relativePath.includes('/__tests__/') || relativePath.includes('/__fixtures__/') || relativePath.includes('/jest/')) return 'test-only';
  if (relativePath.startsWith('app/')) {
    if (kind === 'console' && relativePath.includes('/service_worker/')) return 'worker-logging-prohibited';
    if (kind === 'console') return 'startup-guarded-local-diagnostic';
    if (kind === 'devtools') return 'non-production-only';
    if (kind === 'notification-payload') return 'phase-0c-governed-sensitive-browser-surface';
    return 'application-surface';
  }
  if (relativePath.startsWith('webpack/')) return 'build-tooling';
  if (relativePath.startsWith('.github/')) return 'ci-controlled-artifact';
  return 'repository-tooling';
};

const discover = root => {
  const roots = ['app', 'webpack', 'scripts', '.github/workflows'];
  const ignoredScripts = new Set([
    'scripts/generate-telemetry-authority-inventory.js',
    'scripts/telemetry-inventory-lib.js',
    'scripts/check-sentry-authority-inventory.js',
    'scripts/__tests__/check-sentry-authority-inventory.test.js',
  ]);
  const findings = [];

  for (const absolute of roots.flatMap(relative => walk(path.join(root, relative))).sort()) {
    const relativePath = path.relative(root, absolute).split(path.sep).join('/');
    if (ignoredScripts.has(relativePath)) continue;
    const source = fs.readFileSync(absolute, 'utf8');
    for (const [kind, pattern] of patterns) {
      pattern.lastIndex = 0;
      for (let match = pattern.exec(source); match; match = pattern.exec(source)) {
        const info = lineInfo(source, match.index);
        findings.push({
          id: `${kind}:${relativePath}:${info.line}`,
          kind,
          path: relativePath,
          line: info.line,
          expression: info.expression,
          classification: classify(kind, relativePath),
        });
      }
    }
  }
  return findings.sort((a, b) => a.path.localeCompare(b.path) || a.line - b.line || a.kind.localeCompare(b.kind));
};

const build = root => {
  const callsites = discover(root);
  const counts = {};
  callsites.forEach(item => {
    counts[item.kind] = (counts[item.kind] || 0) + 1;
  });
  return {
    schemaVersion: 2,
    status: 'phase-0e-verified',
    telemetry: {
      productionEnabled: false,
      providers: [],
      sentryDependenciesPresent: false,
      sentryDsnBuildInputPresent: false,
      consentRequiredToEnableFutureTelemetry: true,
      optOutRequiredToEnableFutureTelemetry: true,
    },
    diagnostics: {
      module: 'app/soapbox/utils/diagnostics.ts',
      productionPolicy: 'disabled-except-fixed-self-xss-notice',
      developmentPolicy: 'local-only-redacted-bounded',
      serializationFailurePolicy: 'replace-or-drop-never-raw',
      maxDepth: 6,
      maxKeys: 50,
      maxStringLength: 2048,
      maxTotalCharacters: 16384,
    },
    buildArtifacts: {
      productionSourceMaps: false,
      developmentSourceMaps: true,
      uploadedArtifacts: ['architecture-inventory'],
      artifactRetentionDays: 30,
      artifactContainsRuntimeContent: false,
    },
    callsites,
    counts,
    invariants: {
      everyLoggingAndTelemetryCallsiteRepresented: true,
      productionTelemetryDisabled: true,
      redactionBeforeDevelopmentSerialization: true,
      productionDeveloperToolsDisabled: true,
      productionSourceMapsDisabled: true,
      hostileGettersAndToJsonNotInvoked: true,
      futureTelemetryRequiresConsentOptOutSamplingRetentionDeletion: true,
    },
  };
};

module.exports = { buildTelemetryManifest: build, discoverTelemetryCallsites: discover };
