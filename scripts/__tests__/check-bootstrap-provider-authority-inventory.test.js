'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const {
  REQUIRED_INVARIANTS,
  REQUIRED_UNKNOWNS,
  run,
  validateManifest,
  validateSources,
} = require('../check-bootstrap-provider-authority-inventory');

const application = `import loadPolyfills from './soapbox/load_polyfills';
require('manifest.json');
require('react-datepicker/dist/react-datepicker.css');
require('./styles/application.scss');
loadPolyfills().then(() => {
  require('./soapbox/main').default();
}).catch(e => {
  console.error(e);
});`;

const main = `ready(() => {
  const mountNode = document.getElementById('soapbox') as HTMLElement;
  ReactDOM.render(<Soapbox />, mountNode);
});`;

const soapbox = `createGlobals(store);
store.dispatch(preload() as any);
store.dispatch(checkOnboardingStatus() as any);
await dispatch(fetchMe());
await dispatch(loadInstance());
await dispatch(loadSoapboxConfig());
if (pepeEnabled && !state.me) {
  await dispatch(fetchVerificationConfig());
}
dispatch(loadInitial()).then(() => {
  setIsLoaded(true);
}).catch(() => {
  setIsLoaded(true);
});
MESSAGES[locale]().then(messages => {
}).catch(() => { });
<Provider store={store}>
<QueryClientProvider client={queryClient}>
<SoapboxHead>
<SoapboxLoad>
<SoapboxMount />
</SoapboxLoad>
</SoapboxHead>
</QueryClientProvider>
</Provider>`;

const manifest = {
  schemaVersion: 1,
  entry: {
    path: 'app/application.ts',
    polyfillLoader: './soapbox/load_polyfills',
    mainModule: './soapbox/main',
    manifest: 'manifest.json',
    styles: ['react-datepicker/dist/react-datepicker.css', './styles/application.scss'],
  },
  mount: {
    path: 'app/soapbox/main.tsx',
    readyCallback: true,
    mountElementId: 'soapbox',
    renderer: 'ReactDOM.render',
    rootComponent: 'Soapbox',
  },
  rootProviders: {
    path: 'app/soapbox/containers/soapbox.tsx',
    order: ['Provider', 'QueryClientProvider', 'SoapboxHead', 'SoapboxLoad', 'SoapboxMount'],
    reduxStore: 'store',
    queryClient: 'queryClient',
  },
  moduleInitialization: [
    'createGlobals(store)',
    'store.dispatch(preload() as any)',
    'store.dispatch(checkOnboardingStatus() as any)',
  ],
  initialLoadOrder: ['fetchMe', 'loadInstance', 'loadSoapboxConfig'],
  conditionalInitialLoad: {
    action: 'fetchVerificationConfig',
    condition: 'pepeEnabled && !state.me',
  },
  failureSemantics: {
    initialLoadFailureStillMarksLoaded: true,
    localeLoadFailureLeavesLoading: true,
    polyfillFailureLogsToConsole: true,
  },
  invariants: [...REQUIRED_INVARIANTS],
  unknowns: [...REQUIRED_UNKNOWNS],
};

test('verifies the repository sources', () => {
  assert.equal(run(), 'Bootstrap/provider authority inventory verified');
});

test('accepts the pinned provider and initialization contracts', () => {
  assert.doesNotThrow(() => validateManifest(manifest));
  assert.doesNotThrow(() => validateSources({ application, main, soapbox }, manifest));
});

test('fails when executable evidence is retained only in block comments', () => {
  assert.throws(
    () => validateSources({
      application: `/*${application}*/`,
      main: `/*${main}*/`,
      soapbox: `/*${soapbox}*/`,
    }, manifest),
    /missing executable/,
  );
});

test('fails when the provider hierarchy is reordered', () => {
  const drifted = soapbox.replace(
    '<Provider store={store}>\n<QueryClientProvider client={queryClient}>',
    '<QueryClientProvider client={queryClient}>\n<Provider store={store}>',
  );
  assert.throws(() => validateSources({ application, main, soapbox: drifted }, manifest), /root provider hierarchy/);
});

test('fails when authenticated identity no longer loads first', () => {
  const drifted = soapbox.replace(
    'await dispatch(fetchMe());\nawait dispatch(loadInstance());',
    'await dispatch(loadInstance());\nawait dispatch(fetchMe());',
  );
  assert.throws(() => validateSources({ application, main, soapbox: drifted }, manifest), /initial data load/);
});

test('fails when any descriptive manifest field drifts', () => {
  const drifted = { ...manifest, mount: { ...manifest.mount, mountElementId: 'root' } };
  assert.throws(() => validateManifest(drifted), /mount contract changed/);
});

test('fails when an explicit blocker is silently removed', () => {
  const drifted = { ...manifest, unknowns: REQUIRED_UNKNOWNS.slice(1) };
  assert.throws(() => validateManifest(drifted), /unknowns changed/);
});

test('fails when initial-load rejection no longer releases the loading gate', () => {
  const drifted = soapbox.replace(
    '}).catch(() => {\n  setIsLoaded(true);',
    '}).catch(() => {\n  reportFailure();',
  );
  assert.throws(() => validateSources({ application, main, soapbox: drifted }, manifest), /initial-load failure release/);
});

test('fails when polyfills no longer gate application startup', () => {
  const drifted = application.replace(
    "loadPolyfills().then(() => {\n  require('./soapbox/main').default();",
    "require('./soapbox/main').default();\nloadPolyfills().then(() => {",
  );
  assert.throws(() => validateSources({ application: drifted, main, soapbox }, manifest), /polyfill-before-main chain/);
});
