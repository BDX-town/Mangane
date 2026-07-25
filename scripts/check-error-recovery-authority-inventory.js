'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(process.env.ERROR_RECOVERY_INVENTORY_ROOT || path.join(__dirname, '..'));
const MANIFEST = 'config/error-recovery-authority-inventory.json';
const fail = message => { throw new Error(`error-recovery-authority: ${message}`); };

const EXPECTED_INVARIANTS = [
  'the root mounted application is wrapped by ErrorBoundary',
  'render failures switch the boundary into an explicit error state',
  'production hides error and browser details',
  'emergency recovery clears localStorage sessionStorage and the configured KVStore',
  'emergency recovery attempts to unregister every service worker registration',
  'recovery navigates to the origin root rather than the configured frontend basename',
];
const EXPECTED_UNKNOWNS = [
  'bootstrap failures before React mount are outside the root error boundary',
  'KVStore.clear is not awaited before navigation or service-worker unregistration',
  'Cache Storage is not explicitly cleared by emergency recovery',
  'cookies are not explicitly cleared despite the clear-cookies label',
  'service-worker unregister failure is swallowed by unconditional navigation',
  'recovery does not prove account instance or deployment scoped purge completeness',
  'configured frontend subdirectory deployments may navigate to the wrong recovery root',
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
    if (c === '"' || c === "'" || c === '`') {
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
    handler: 'clearCookies', clears: ['localStorage', 'sessionStorage', 'KVStore'], serviceWorkerAction: 'unregister-all', navigation: "location.href = '/'", preventsDefaultOnlyWhenServiceWorkerSupported: true, awaitsKvStoreClear: false,
  }, 'recovery');
  exact(manifest.kvStore, {
    path: 'app/soapbox/storage/kv_store.ts', technology: 'localforage-indexeddb', name: 'soapbox', storeName: 'keyvaluepairs',
  }, 'kvStore');
  exact(manifest.invariants, EXPECTED_INVARIANTS, 'invariants');
  exact(manifest.unknowns, EXPECTED_UNKNOWNS, 'unknowns');
}

function validateSources({ boundary, kvStore, root }) {
  const b = executable(boundary), bCode = codeOnly(boundary), k = executable(kvStore), r = executable(root);
  for (const fragment of [
    'class ErrorBoundary extends React.PureComponent<Props, State>',
    'componentDidCatch(error: any, info: any): void',
    'this.setState({ hasError: true, error, componentStack: info && info.componentStack, });',
    "const isProduction = BuildConfig.NODE_ENV === 'production';",
    '{!isProduction && (',
    "document.execCommand('copy');",
    "if ('serviceWorker' in navigator) { e.preventDefault(); unregisterSw().then(goHome).catch(goHome); }",
    "const goHome = () => location.href = '/';",
    'const registrations = await navigator.serviceWorker.getRegistrations();',
    'const unregisterAll = registrations.map(r => r.unregister());',
    'await Promise.all(unregisterAll);',
  ]) requireExec(b, fragment, 'error boundary');

  for (const call of ['localStorage.clear();', 'sessionStorage.clear();', 'KVStore.clear();']) {
    requireCode(bCode, call, 'error boundary');
  }
  if (bCode.includes('awaitKVStore.clear();')) fail('KVStore.clear await behavior changed without manifest reconciliation');

  requireExec(r, '<ErrorBoundary><BrowserRouter', 'root provider');
  requireExec(k, "localforage.createInstance({ name: 'soapbox', description: 'Soapbox offline data store', driver: localforage.INDEXEDDB, storeName: 'keyvaluepairs', })", 'KVStore');
}

function run() {
  const manifest = JSON.parse(read(MANIFEST));
  validateManifest(manifest);
  validateSources({
    boundary: read(manifest.boundary.path),
    kvStore: read(manifest.kvStore.path),
    root: read('app/soapbox/containers/soapbox.tsx'),
  });
  return 'Error recovery authority inventory verified';
}

if (require.main === module) {
  try { console.log(run()); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { EXPECTED_INVARIANTS, EXPECTED_UNKNOWNS, codeOnly, executable, run, validateManifest, validateSources };
