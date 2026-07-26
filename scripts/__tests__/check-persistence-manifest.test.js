'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { discover } = require('../persistence-inventory-lib');

test('discovers persistence and temporary-resource callsites deterministically', () => {
  const root = path.resolve(__dirname, '..', '..');
  const manifest = discover(root);
  assert.deepEqual(discover(root), manifest);
  assert.ok(manifest.calls.some(call => call.engine === 'localStorage'));
  assert.ok(manifest.calls.some(call => call.engine === 'localForage/IndexedDB'));
  assert.ok(manifest.calls.some(call => call.engine === 'object-url'));
  assert.equal(new Set(manifest.calls.map(call => call.id)).size, manifest.calls.length);
});

test('classifies a newly introduced credential store as sensitive', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'persistence-manifest-'));
  const target = path.join(root, 'app', 'auth.ts');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, 'localStorage.setItem(\'auth:token\', token);\n');
  const [call] = discover(root).calls;
  assert.equal(call.authority, 'sensitive-state-or-credential-copy');
  assert.equal(call.encryption, 'plaintext-browser-readable');
  assert.equal(call.logoutBehavior, 'must-delete-or-invalidate');
});

test('discovers a locally captured Cache Storage authority', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'persistence-manifest-'));
  const target = path.join(root, 'app', 'cache.ts');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, [
    'const cacheStorage = window.caches;',
    'await cacheStorage.keys();',
    'await cacheStorage.delete(cacheName);',
    '',
  ].join('\n'));
  const calls = discover(root).calls;
  assert.deepEqual(calls.map(call => [call.engine, call.operation]), [
    ['cache-storage', 'keys'],
    ['cache-storage', 'delete'],
  ]);
});

test('pins local cleanup after bounded remote revocation', () => {
  const root = path.resolve(__dirname, '..', '..');
  const { purgeOrder } = discover(root);
  assert.ok(purgeOrder.indexOf('attempt-bounded-remote-revocation') < purgeOrder.indexOf('remove-serialized-account-credentials-and-selection'));
  assert.equal(purgeOrder.at(-1), 'complete-lifecycle-and-tombstone-only-after-local-success');
});
