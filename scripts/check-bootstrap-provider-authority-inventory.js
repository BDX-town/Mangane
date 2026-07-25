'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(process.env.BOOTSTRAP_PROVIDER_INVENTORY_ROOT || path.join(__dirname, '..'));
const MANIFEST_PATH = 'config/bootstrap-provider-authority-inventory.json';
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
  if (path.isAbsolute(relativePath) || relativePath.split(/[\\/]/).includes('..')) {
    fail(`unsafe path ${relativePath}`);
  }
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function assertIncludes(source, fragment, label) {
  if (!source.includes(fragment)) fail(`missing ${label}: ${fragment}`);
}

function assertOrdered(source, fragments, label) {
  let cursor = -1;
  for (const fragment of fragments) {
    const next = source.indexOf(fragment, cursor + 1);
    if (next === -1) fail(`missing ${label}: ${fragment}`);
    if (next <= cursor) fail(`out-of-order ${label}: ${fragment}`);
    cursor = next;
  }
}

function validateManifest(manifest) {
  if (manifest.schemaVersion !== 1) fail('unsupported schemaVersion');
  if (manifest.entry.path !== 'app/application.ts') fail('entry owner changed');
  if (manifest.mount.path !== 'app/soapbox/main.tsx') fail('mount owner changed');
  if (manifest.rootProviders.path !== 'app/soapbox/containers/soapbox.tsx') fail('provider owner changed');

  const expectedProviders = ['Provider', 'QueryClientProvider', 'SoapboxHead', 'SoapboxLoad', 'SoapboxMount'];
  if (JSON.stringify(manifest.rootProviders.order) !== JSON.stringify(expectedProviders)) {
    fail('root provider order changed');
  }

  const expectedInitialLoad = ['fetchMe', 'loadInstance', 'loadSoapboxConfig'];
  if (JSON.stringify(manifest.initialLoadOrder) !== JSON.stringify(expectedInitialLoad)) {
    fail('initial load order changed');
  }

  for (const unknown of REQUIRED_UNKNOWNS) {
    if (!manifest.unknowns.includes(unknown)) fail(`required unknown removed: ${unknown}`);
  }
}

function validateSources({ application, main, soapbox }, manifest) {
  assertIncludes(application, "import loadPolyfills from './soapbox/load_polyfills';", 'polyfill import');
  assertIncludes(application, "require('manifest.json');", 'manifest load');
  assertIncludes(application, "require('react-datepicker/dist/react-datepicker.css');", 'datepicker stylesheet');
  assertIncludes(application, "require('./styles/application.scss');", 'application stylesheet');
  assertIncludes(application, "loadPolyfills().then(() => {\n  require('./soapbox/main').default();", 'polyfill-before-main chain');
  assertIncludes(application, '.catch(e => {\n  console.error(e);', 'polyfill failure behavior');

  assertIncludes(main, "ready(() => {", 'ready callback');
  assertIncludes(main, "document.getElementById('soapbox') as HTMLElement", 'mount element');
  assertIncludes(main, 'ReactDOM.render(<Soapbox />, mountNode);', 'React mount');

  assertOrdered(soapbox, [
    'createGlobals(store);',
    'store.dispatch(preload() as any);',
    'store.dispatch(checkOnboardingStatus() as any);',
  ], 'module initialization');

  assertOrdered(soapbox, [
    'await dispatch(fetchMe());',
    'await dispatch(loadInstance());',
    'await dispatch(loadSoapboxConfig());',
  ], 'initial data load');
  assertIncludes(soapbox, 'if (pepeEnabled && !state.me) {\n      await dispatch(fetchVerificationConfig());', 'conditional verification load');
  assertIncludes(soapbox, 'dispatch(loadInitial()).then(() => {\n      setIsLoaded(true);\n    }).catch(() => {\n      setIsLoaded(true);', 'initial-load failure release');
  assertIncludes(soapbox, 'MESSAGES[locale]().then(messages => {', 'locale load');
  assertIncludes(soapbox, '}).catch(() => { });', 'locale failure behavior');

  assertOrdered(soapbox, [
    '<Provider store={store}>',
    '<QueryClientProvider client={queryClient}>',
    '<SoapboxHead>',
    '<SoapboxLoad>',
    '<SoapboxMount />',
    '</SoapboxLoad>',
    '</SoapboxHead>',
    '</QueryClientProvider>',
    '</Provider>',
  ], 'root provider hierarchy');

  if (!manifest.failureSemantics.initialLoadFailureStillMarksLoaded) fail('initial-load failure semantic removed');
  if (!manifest.failureSemantics.localeLoadFailureLeavesLoading) fail('locale failure semantic removed');
  if (!manifest.failureSemantics.polyfillFailureLogsToConsole) fail('polyfill failure semantic removed');
}

function run() {
  const manifest = JSON.parse(read(MANIFEST_PATH));
  validateManifest(manifest);
  validateSources({
    application: read(manifest.entry.path),
    main: read(manifest.mount.path),
    soapbox: read(manifest.rootProviders.path),
  }, manifest);
  return 'Bootstrap/provider authority inventory verified';
}

if (require.main === module) {
  try {
    console.log(run());
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { REQUIRED_UNKNOWNS, validateManifest, validateSources, run };
