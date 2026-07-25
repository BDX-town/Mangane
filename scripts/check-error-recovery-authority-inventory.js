'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(process.env.ERROR_RECOVERY_INVENTORY_ROOT || path.join(__dirname, '..'));
const MANIFEST = 'config/error-recovery-authority-inventory.json';
const fail = message => {
  throw new Error(`error-recovery-authority: ${message}`);
};

const EXPECTED_INVARIANTS = [
  'the root mounted application is wrapped by ErrorBoundary',
  'render failures switch the boundary into an explicit error state',
  'production hides error and browser details',
  'emergency recovery clears query localStorage sessionStorage IndexedDB Cache Storage notification worker and tracked object URL state',
  'every asynchronous recovery stage is bounded awaited and failure isolated',
  'authoritative browser stores receive a final clearing pass before navigation',
  'recovery navigation honors the configured frontend basename',
];
const EXPECTED_UNKNOWNS = [
  'bootstrap failures before React mount are outside the root error boundary',
  'cookies are not explicitly cleared despite the clear-cookies label',
  'recovery does not prove account instance or deployment scoped purge completeness',
  'timed-out browser operations may continue after recovery navigation',
  'object URLs created outside the tracked registry cannot be enumerated by browser APIs',
  'browser termination can interrupt recovery before the final clearing pass',
  'copy uses deprecated document.execCommand without an explicit failure result',
  'error and component-stack data may contain sensitive content in non-production builds',
  'dynamic browser-parser failure is silently ignored',
];

const read = relativePath => {
  if (path.isAbsolute(relativePath) || relativePath.split(/[\\/]/).includes('..')) fail(`unsafe path ${relativePath}`);
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
};
const exact = (actual, expected, label) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) fail(`${label} changed without reconciliation`);
};

const scan = (source, preserveLiterals) => {
  let out = '', i = 0;
  while (i < source.length) {
    const c = source[i], n = source[i + 1];
    if (c === '/' && n === '/') {
      i += 2;
      while (i < source.length && source[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && n === '*') {
      const end = source.indexOf('*/', i + 2);
      if (end < 0) fail('unterminated block comment');
      i = end + 2;
      continue;
    }
    if (c === '"' || c === '\'' || c === '`') {
      const q = c;
      if (preserveLiterals) out += c;
      i++;
      while (i < source.length) {
        if (preserveLiterals) out += source[i];
        if (source[i] === '\\') {
          i++;
          if (i < source.length && preserveLiterals) out += source[i];
        } else if (source[i] === q) {
          i++;
          break;
        }
        i++;
      }
      if (!preserveLiterals) out += 'LITERAL';
      continue;
    }
    if (!/\s/.test(c)) out += c;
    i++;
  }
  return out;
};
const executable = source => scan(source, true);
const codeOnly = source => scan(source, false);
const requireExec = (source, fragment, label) => {
  const normalized = executable(fragment);
  if (!source.includes(normalized)) fail(`${label} missing executable evidence: ${fragment}`);
};
const requireCode = (source, fragment, label) => {
  if (!source.includes(fragment.replace(/\s+/g, ''))) fail(`${label} missing executable code evidence: ${fragment}`);
};

function validateManifest(manifest) {
  if (manifest.schemaVersion !== 1 || manifest.status !== 'verified-current-bounded') fail('schema or status changed');
  exact(manifest.boundary, {
    path: 'app/soapbox/components/error_boundary.tsx', component: 'ErrorBoundary', captureMethod: 'componentDidCatch', productionDetailsHidden: true, developmentCopyUsesExecCommand: true,
  }, 'boundary');
  exact(manifest.recovery, {
    handler: 'clearCookies',
    coordinatorPath: 'app/soapbox/persistence/emergency-reset.ts',
    clears: ['ReactQuery', 'localStorage', 'sessionStorage', 'KVStore', 'CacheStorage', 'nativeNotifications', 'trackedObjectURLs'],
    serviceWorkerAction: 'close-notifications-unsubscribe-and-unregister-all',
    navigation: 'window.location.assign(BuildConfig.FE_SUBDIRECTORY || \'/\')',
    preventsDefaultAlways: true,
    awaitsKvStoreClear: true,
    boundedAndFailureIsolated: true,
    repeatsAuthoritativeStoresBeforeNavigation: true,
  }, 'recovery');
  exact(manifest.boundedStep, {
    path: 'app/soapbox/persistence/bounded-step.ts',
    statuses: ['completed', 'failed', 'timed-out'],
  }, 'boundedStep');
  exact(manifest.kvStore, {
    path: 'app/soapbox/storage/kv_store.ts', technology: 'localforage-indexeddb', name: 'soapbox', storeName: 'keyvaluepairs',
  }, 'kvStore');
  exact(manifest.invariants, EXPECTED_INVARIANTS, 'invariants');
  exact(manifest.unknowns, EXPECTED_UNKNOWNS, 'unknowns');
}

function validateSources({ boundary, boundedStep, emergencyReset, kvStore, root }) {
  const b = executable(boundary);
  const e = executable(emergencyReset);
  const eCode = codeOnly(emergencyReset);
  const bounded = executable(boundedStep);
  const k = executable(kvStore);
  const r = executable(root);
  for (const fragment of [
    'class ErrorBoundary extends React.PureComponent<Props, State>',
    'componentDidCatch(error: any, info: any): void',
    'this.setState({ hasError: true, error, componentStack: info && info.componentStack, });',
    'const isProduction = BuildConfig.NODE_ENV === \'production\';',
    '{!isProduction && (',
    'document.execCommand(\'copy\');',
    'import { emergencyReset } from \'soapbox/persistence/emergency-reset\';',
    'e.preventDefault(); void emergencyReset();',
  ]) requireExec(b, fragment, 'error boundary');

  for (const fragment of [
    'await queryClient.cancelQueries();',
    'queryClient.clear();',
    'clearLocalStorage: () => localStorage.clear()',
    'clearSessionStorage: () => sessionStorage.clear()',
    'clearKVStore: () => KVStore.clear()',
    'const keys = await caches.keys();',
    'await Promise.all(keys.map(key => caches.delete(key)));',
    'const registrations = await navigator.serviceWorker.getRegistrations();',
    'registration.getNotifications()',
    'registration.pushManager.getSubscription()',
    'registration.unregister()',
    'revokeTemporaryResources: revokeAllTrackedObjectURLs',
    'await runBoundedStep(results, \'revoke-object-urls-and-temporary-resources\', deps.revokeTemporaryResources, timeout);',
    'await runBoundedStep(results, \'clear-indexeddb-kv-store\', deps.clearKVStore, timeout);',
    'await runBoundedStep(results, \'final-clear-indexeddb-kv-store\', deps.clearKVStore, timeout);',
    'await runBoundedStep(results, \'navigate-to-application-root\', deps.navigate, timeout);',
    'navigate: () => window.location.assign(BuildConfig.FE_SUBDIRECTORY || \'/\')',
  ]) requireExec(e, fragment, 'emergency reset');

  for (const call of ['localStorage.clear()', 'sessionStorage.clear()', 'KVStore.clear()']) {
    requireCode(eCode, call, 'emergency reset');
  }
  for (const fragment of [
    'type BoundedStepStatus = \'completed\' | \'failed\' | \'timed-out\';',
    'return await Promise.race([operation, timeoutPromise]);',
    'status: error === TIMEOUT ? \'timed-out\' : \'failed\'',
  ]) requireExec(bounded, fragment, 'bounded step');

  requireExec(r, '<ErrorBoundary><BrowserRouter', 'root provider');
  requireExec(k, 'localforage.createInstance({ name: \'soapbox\', description: \'Soapbox offline data store\', driver: localforage.INDEXEDDB, storeName: \'keyvaluepairs\', })', 'KVStore');
}

function run() {
  const manifest = JSON.parse(read(MANIFEST));
  validateManifest(manifest);
  validateSources({
    boundary: read(manifest.boundary.path),
    boundedStep: read(manifest.boundedStep.path),
    emergencyReset: read(manifest.recovery.coordinatorPath),
    kvStore: read(manifest.kvStore.path),
    root: read('app/soapbox/containers/soapbox.tsx'),
  });
  return 'Error recovery authority inventory verified';
}

if (require.main === module) {
  try {
    console.log(run());
  } catch (error) {
    console.error(error.message); process.exitCode = 1;
  }
}
module.exports = { EXPECTED_INVARIANTS, EXPECTED_UNKNOWNS, codeOnly, executable, run, validateManifest, validateSources };
