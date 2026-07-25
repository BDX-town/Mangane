'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(process.env.SERVICE_WORKER_CACHE_INVENTORY_ROOT || path.resolve(__dirname, '..'));
const manifestPath = path.join(root, 'config', 'service-worker-cache-authority-inventory.json');
const fail = message => { throw new Error(`service-worker-cache-authority: ${message}`); };

const expectedUnknowns = [
  'The inherited global cache name is deployment-origin scoped rather than build-version scoped; account purge treats its contents as disposable public shell assets.',
  'Generated OfflinePlugin cache suffixes are library-owned, so normal purge matches reviewed prefixes instead of hard-coding generated names.',
  'Cache rollback, corruption and quota dispositions are documented; OfflinePlugin internal upgrade mechanics remain library-owned.',
  'Backend-route prefix completeness and production edge rewrite precedence require end-to-end verification.',
  'Cross-origin asset redirect, credential mode and response content-type behavior remain transport and deployment concerns.',
];
const expectedDocumentationFragments = [
  'Phase 0C classifies the configured cache inputs as public application shell and build assets.',
  'normal account purge deletes application-owned cache prefixes',
  'restart-durable worker revocation cache is explicitly protected',
  'backend route prefixes are compatibility evidence, not a complete security allowlist',
  'Cache migration, rollback, corruption and quota behavior is recorded',
];

const readInsideRoot = (relativePath, label) => {
  const absolute = path.resolve(root, relativePath);
  const relative = path.relative(root, absolute);
  if (relative.startsWith('..') || path.isAbsolute(relative)) fail(`unsafe ${label} path ${relativePath}`);
  return fs.readFileSync(absolute, 'utf8');
};
const validateExactList = (actual, expected, label) => {
  if (!Array.isArray(actual) || actual.length !== expected.length || new Set(actual).size !== expected.length) {
    fail(`${label} changed without checker reconciliation`);
  }
  expected.forEach((item, index) => {
    if (actual[index] !== item) fail(`${label} changed at index ${index}: expected ${item}`);
  });
};
const compactExecutable = source => {
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
      if (end < 0) fail('unterminated block comment while scanning production service worker configuration');
      i = end + 2;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      const quote = char;
      output += char;
      i += 1;
      while (i < source.length) {
        output += source[i];
        if (source[i] === '\\') {
          i += 1;
          if (i < source.length) output += source[i];
        } else if (source[i] === quote) {
          i += 1;
          break;
        }
        i += 1;
      }
      continue;
    }
    if (!/\s/.test(char)) output += char;
    i += 1;
  }
  return output;
};
const requireExecutable = (source, fragment, label) => {
  const normalized = compactExecutable(fragment);
  if (!source.includes(normalized)) fail(`${label} no longer contains executable evidence: ${fragment}`);
};

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (manifest.schemaVersion !== 1) fail(`unsupported schemaVersion ${manifest.schemaVersion}`);
if (manifest.status !== 'verified-current-bounded') fail('status changed without reconciliation');

const production = manifest.productionConfig;
if (!production || production.path !== 'webpack/production.js') fail('production service-worker configuration path changed without reconciliation');
if (production.cacheName !== 'soapbox') fail('cache name changed without reconciliation');
if (production.serviceWorkerEntry !== 'app/soapbox/service_worker/entry.ts') fail('service-worker entry changed without reconciliation');
if (production.appShellUsesFrontendSubdirectory !== true || production.autoUpdate !== true || production.events !== true || production.minify !== true || production.safeToUseOptionalCaches !== true) {
  fail('required production service-worker invariant changed without reconciliation');
}
validateExactList(production.navigationRequestTypes, ['navigate'], 'navigation request type');
validateExactList(production.mainCaches, [':rest:'], 'main cache');
validateExactList(production.additionalCaches, [':externals:', 'packs/images/32-*.png', 'packs/icons/*.svg'], 'additional cache');
validateExactList(production.optionalCaches, ['**/locale_*.js', '**/*_polyfills-*.js', '**/*.chunk.js', '**/*.chunk.css', '**/*.woff2', '**/*.png', '**/*.svg'], 'optional cache');
validateExactList(production.backendRoutePrefixes, ['/.well-known', '/activities', '/admin', '/api', '/auth', '/inbox', '/instance', '/internal', '/main/ostatus', '/manifest.json', '/media', '/nodeinfo', '/oauth', '/objects', '/ostatus_subscribe', '/pghero', '/pleroma', '/proxy', '/relay', '/sidekiq', '/socket', '/static', '/unsubscribe'], 'backend route prefix');
if (production.backendEmbedSuffix !== '/embed') fail('backend embed suffix changed without reconciliation');

const productionSource = compactExecutable(readInsideRoot(production.path, 'production configuration'));
for (const fragment of [
  "const OfflinePlugin=require('@lcdp/offline-plugin');",
  'new OfflinePlugin({',
  'autoUpdate:true,',
  "main:[':rest:'],",
  "additional:[':externals:','packs/images/32-*.png','packs/icons/*.svg',],",
  "optional:['**/locale_*.js','**/*_polyfills-*.js','**/*.chunk.js','**/*.chunk.css','**/*.woff2','**/*.png','**/*.svg',],",
  "cacheName:'soapbox',",
  "entry:join(__dirname,'../app/soapbox/service_worker/entry.ts'),",
  'events:true,',
  'minify:true,',
  "requestTypes:['navigate'],",
  'safeToUseOptionalCaches:true,',
  "appShell:join(FE_SUBDIRECTORY,'/'),",
  "backendRoutes.some(path=>pathname.startsWith(path))||pathname.endsWith('/embed')",
]) requireExecutable(productionSource, fragment, production.path);
for (const route of production.backendRoutePrefixes) requireExecutable(productionSource, `'${route}'`, production.path);

const entry = manifest.entry;
if (!entry || entry.path !== 'app/soapbox/service_worker/entry.ts') fail('service-worker entry path changed without reconciliation');
validateExactList(entry.imports, ['./web_push_notifications', './share_target'], 'service-worker entry import');
const entrySource = compactExecutable(readInsideRoot(entry.path, 'service-worker entry'));
for (const imported of entry.imports) requireExecutable(entrySource, `import '${imported}';`, entry.path);

const purge = manifest.purge;
if (!purge || purge.path !== 'app/soapbox/persistence/cache-storage.ts') fail('cache purge path changed without reconciliation');
validateExactList(purge.ownedPrefixes, ['soapbox', 'webpack-offline'], 'owned cache prefix');
validateExactList(purge.protectedCaches, ['soapbox-private-revocations-v1'], 'protected cache');
const purgeSource = compactExecutable(readInsideRoot(purge.path, 'cache purge'));
for (const fragment of [
  "const OFFLINE_CACHE_PREFIXES=['soapbox','webpack-offline'];",
  "const PROTECTED_CACHE_NAMES=new Set(['soapbox-private-revocations-v1']);",
  'await caches.keys()',
  'caches.delete(key)',
]) requireExecutable(purgeSource, fragment, purge.path);

const documentation = manifest.canonicalDocumentation;
if (!documentation || documentation.path !== 'docs/architecture/SERVICE_WORKER_CACHE_AUTHORITY_DRIFT_GATE.md') fail('canonical documentation path changed without reconciliation');
const documentationSource = readInsideRoot(documentation.path, 'documentation');
for (const fragment of expectedDocumentationFragments) {
  if (!documentationSource.includes(fragment)) fail(`${documentation.path} no longer contains required security evidence: ${fragment}`);
}

validateExactList(manifest.explicitUnknowns, expectedUnknowns, 'explicit unknown');
for (const invariant of [
  'productionNavigationUsesAppShellFallback',
  'backendRoutesBypassAppShellRewrite',
  'cacheInputsAreBuildAssetsAndAppShell',
  'backendNavigationRoutesBypassAppShell',
  'accountPurgeDeletesOwnedCachePrefixes',
  'workerRevocationCacheIsProtectedFromNormalPurge',
]) {
  if (manifest.invariants?.[invariant] !== true) fail(`required invariant ${invariant} must remain true`);
}

process.stdout.write(`${JSON.stringify({
  schemaVersion: manifest.schemaVersion,
  status: manifest.status,
  checkedProductionConfig: production.path,
  checkedCacheName: production.cacheName,
  checkedBackendRoutePrefixes: production.backendRoutePrefixes.length,
  checkedEntryImports: entry.imports.length,
  checkedDocumentationFragments: expectedDocumentationFragments.length,
  explicitUnknowns: manifest.explicitUnknowns.length,
}, null, 2)}\n`);
