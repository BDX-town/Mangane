'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(process.env.BOOTSTRAP_PROVIDER_INVENTORY_ROOT || path.join(__dirname, '..'));
const MANIFEST_PATH = 'config/bootstrap-provider-authority-inventory.json';
const REQUIRED_INVARIANTS = [
  'polyfills complete before the application main module is required',
  'the mount waits for ready and targets the soapbox element',
  'Redux remains outside React Query in the root provider hierarchy',
  'module initialization side effects remain explicit and ordered',
  'authenticated identity loads before instance capabilities and configuration',
  'initial backend load rejection still releases the loading gate',
];
const REQUIRED_UNKNOWNS = [
  'mount element absence behavior is not fail-closed or user-visible',
  'module initialization side effects do not expose teardown contracts',
  'initial requests do not expose cancellation or stale-response protection',
  'account switching does not prove provider or initialization re-entry safety',
  'locale import failure can leave the application permanently loading',
  'polyfill failure has no recovery UI or structured error contract',
  'React 18 concurrent rendering compatibility is unverified',
  'root error-boundary coverage does not include bootstrap failures before mount',
];

function fail(message) {
  throw new Error(`Bootstrap/provider authority drift: ${message}`);
}

function read(relativePath) {
  if (path.isAbsolute(relativePath) || relativePath.split(/[\\/]/).includes('..')) fail(`unsafe path ${relativePath}`);
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function exact(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) fail(`${label} changed without reconciliation`);
}

function compactExecutable(source) {
  let output = '';
  let i = 0;
  while (i < source.length) {
    const char = source[i];
    const next = source[i + 1];
    if (char === '/' && next === '/') {
      i += 2;
      while (i < source.length && source[i] !== '\n') i += 1;
      continue;
    }
    if (char === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2);
      if (end < 0) fail('unterminated block comment');
      i = end + 2;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      const quote = char;
      output += char;
      i += 1;
      let closed = false;
      while (i < source.length) {
        output += source[i];
        if (source[i] === '\\') {
          i += 1;
          if (i < source.length) output += source[i];
        } else if (source[i] === quote) {
          closed = true;
          i += 1;
          break;
        }
        i += 1;
      }
      if (!closed) fail('unterminated string literal');
      continue;
    }
    if (!/\s/.test(char)) output += char;
    i += 1;
  }
  return output;
}

function assertIncludes(source, fragment, label) {
  const normalized = compactExecutable(fragment);
  if (!source.includes(normalized)) fail(`missing executable ${label}: ${fragment}`);
}

function assertOrdered(source, fragments, label) {
  let cursor = -1;
  for (const fragment of fragments) {
    const normalized = compactExecutable(fragment);
    const next = source.indexOf(normalized, cursor + 1);
    if (next === -1) fail(`missing executable ${label}: ${fragment}`);
    cursor = next;
  }
}

function validateManifest(manifest) {
  exact(manifest.schemaVersion, 1, 'schemaVersion');
  exact(manifest.entry, {
    path: 'app/application.ts',
    polyfillLoader: './soapbox/load_polyfills',
    mainModule: './soapbox/main',
    manifest: 'manifest.json',
    styles: ['react-datepicker/dist/react-datepicker.css', './styles/application.scss'],
  }, 'entry contract');
  exact(manifest.mount, {
    path: 'app/soapbox/main.tsx',
    readyCallback: true,
    mountElementId: 'soapbox',
    renderer: 'ReactDOM.render',
    rootComponent: 'Soapbox',
  }, 'mount contract');
  exact(manifest.rootProviders, {
    path: 'app/soapbox/containers/soapbox.tsx',
    order: ['Provider', 'QueryClientProvider', 'SoapboxHead', 'SoapboxLoad', 'SoapboxMount'],
    reduxStore: 'store',
    queryClient: 'queryClient',
  }, 'root provider contract');
  exact(manifest.moduleInitialization, [
    'createGlobals(store)',
    'store.dispatch(preload() as any)',
    'store.dispatch(checkOnboardingStatus() as any)',
  ], 'module initialization contract');
  exact(manifest.initialLoadOrder, ['fetchMe', 'loadInstance', 'loadSoapboxConfig'], 'initial load contract');
  exact(manifest.conditionalInitialLoad, {
    action: 'fetchVerificationConfig',
    condition: 'pepeEnabled && !state.me',
  }, 'conditional initial load contract');
  exact(manifest.failureSemantics, {
    initialLoadFailureStillMarksLoaded: true,
    localeLoadFailureLeavesLoading: true,
    polyfillFailureLogsToConsole: true,
  }, 'failure semantics');
  exact(manifest.invariants, REQUIRED_INVARIANTS, 'invariants');
  exact(manifest.unknowns, REQUIRED_UNKNOWNS, 'unknowns');
}

function validateSources(raw, manifest) {
  const application = compactExecutable(raw.application);
  const main = compactExecutable(raw.main);
  const soapbox = compactExecutable(raw.soapbox);

  assertIncludes(application, "import loadPolyfills from './soapbox/load_polyfills';", 'polyfill import');
  assertIncludes(application, "require('manifest.json');", 'manifest load');
  assertIncludes(application, "require('react-datepicker/dist/react-datepicker.css');", 'datepicker stylesheet');
  assertIncludes(application, "require('./styles/application.scss');", 'application stylesheet');
  assertIncludes(application, "loadPolyfills().then(()=>{require('./soapbox/main').default();", 'polyfill-before-main chain');
  assertIncludes(application, '.catch(e=>{console.error(e);', 'polyfill failure behavior');

  assertIncludes(main, 'ready(()=>{', 'ready callback');
  assertIncludes(main, "document.getElementById('soapbox')as HTMLElement", 'mount element');
  assertIncludes(main, 'ReactDOM.render(<Soapbox/>,mountNode);', 'React mount');

  assertOrdered(soapbox, ['createGlobals(store);', 'store.dispatch(preload()as any);', 'store.dispatch(checkOnboardingStatus()as any);'], 'module initialization');
  assertOrdered(soapbox, ['await dispatch(fetchMe());', 'await dispatch(loadInstance());', 'await dispatch(loadSoapboxConfig());'], 'initial data load');
  assertIncludes(soapbox, 'if(pepeEnabled&&!state.me){await dispatch(fetchVerificationConfig());', 'conditional verification load');
  assertIncludes(soapbox, 'dispatch(loadInitial()).then(()=>{setIsLoaded(true);}).catch(()=>{setIsLoaded(true);', 'initial-load failure release');
  assertIncludes(soapbox, 'MESSAGES[locale]().then(messages=>{', 'locale load');
  assertIncludes(soapbox, '}).catch(()=>{});', 'locale failure behavior');
  assertOrdered(soapbox, ['<Provider store={store}>', '<QueryClientProvider client={queryClient}>', '<SoapboxHead>', '<SoapboxLoad>', '<SoapboxMount/>', '</SoapboxLoad>', '</SoapboxHead>', '</QueryClientProvider>', '</Provider>'], 'root provider hierarchy');

  validateManifest(manifest);
}

function run() {
  const manifest = JSON.parse(read(MANIFEST_PATH));
  validateManifest(manifest);
  validateSources({ application: read(manifest.entry.path), main: read(manifest.mount.path), soapbox: read(manifest.rootProviders.path) }, manifest);
  return 'Bootstrap/provider authority inventory verified';
}

if (require.main === module) {
  try { console.log(run()); } catch (error) { console.error(error.message); process.exitCode = 1; }
}

module.exports = { REQUIRED_INVARIANTS, REQUIRED_UNKNOWNS, compactExecutable, validateManifest, validateSources, run };
