'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const {
  EXPECTED_INVARIANTS,
  EXPECTED_UNKNOWNS,
  run,
  validateManifest,
  validateSources,
} = require('../check-error-recovery-authority-inventory');

const manifest = {
  schemaVersion: 1,
  status: 'verified-current-bounded',
  boundary: { path: 'app/soapbox/components/error_boundary.tsx', component: 'ErrorBoundary', captureMethod: 'componentDidCatch', productionDetailsHidden: true, developmentCopyUsesExecCommand: true },
  recovery: { handler: 'clearCookies', clears: ['localStorage', 'sessionStorage', 'KVStore'], serviceWorkerAction: 'unregister-all', navigation: "location.href = '/'", preventsDefaultOnlyWhenServiceWorkerSupported: true, awaitsKvStoreClear: false },
  kvStore: { path: 'app/soapbox/storage/kv_store.ts', technology: 'localforage-indexeddb', name: 'soapbox', storeName: 'keyvaluepairs' },
  invariants: [...EXPECTED_INVARIANTS],
  unknowns: [...EXPECTED_UNKNOWNS],
};
const boundary = `
class ErrorBoundary extends React.PureComponent<Props, State> {
componentDidCatch(error: any, info: any): void {
this.setState({ hasError: true, error, componentStack: info && info.componentStack, });
}
const isProduction = BuildConfig.NODE_ENV === 'production';
{!isProduction && (
document.execCommand('copy');
localStorage.clear();
sessionStorage.clear();
KVStore.clear();
if ('serviceWorker' in navigator) { e.preventDefault(); unregisterSw().then(goHome).catch(goHome); }
const goHome = () => location.href = '/';
const registrations = await navigator.serviceWorker.getRegistrations();
const unregisterAll = registrations.map(r => r.unregister());
await Promise.all(unregisterAll);
`;
const kvStore = `localforage.createInstance({ name: 'soapbox', description: 'Soapbox offline data store', driver: localforage.INDEXEDDB, storeName: 'keyvaluepairs', })`;
const root = '<ErrorBoundary><BrowserRouter';

test('verifies repository evidence', () => {
  assert.equal(run(), 'Error recovery authority inventory verified');
});

test('accepts the exact manifest and executable boundary', () => {
  assert.doesNotThrow(() => validateManifest(manifest));
  assert.doesNotThrow(() => validateSources({ boundary, kvStore, root }));
});

test('rejects evidence retained only in comments', () => {
  assert.throws(() => validateSources({ boundary: `/*${boundary}*/`, kvStore, root }), /missing executable/);
});

test('rejects incomplete emergency purge drift', () => {
  assert.throws(() => validateSources({ boundary: boundary.replace('sessionStorage.clear();', ''), kvStore, root }), /sessionStorage/);
});

test('rejects recovery navigation changes without reconciliation', () => {
  const drifted = { ...manifest, recovery: { ...manifest.recovery, navigation: "location.href = '/app'" } };
  assert.throws(() => validateManifest(drifted), /recovery changed/);
});

test('rejects silently removed blockers', () => {
  assert.throws(() => validateManifest({ ...manifest, unknowns: EXPECTED_UNKNOWS.slice(1) }), /unknowns changed/);
});

test('rejects a missing root error boundary', () => {
  assert.throws(() => validateSources({ boundary, kvStore, root: '<BrowserRouter' }), /root provider/);
});
