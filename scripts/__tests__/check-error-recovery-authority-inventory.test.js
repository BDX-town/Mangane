'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const {
  EXPECTED_UNKNOWS,
  run,
  validateManifest,
  validateSources,
} = require('../check-error-recovery-authority-inventory');

const rootDir = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(rootDir, file), 'utf8');
const manifest = JSON.parse(read('config/error-recovery-authority-inventory.json'));
const sources = {
  boundary: read(manifest.boundary.path),
  kvStore: read(manifest.kvStore.path),
  root: read('app/soapbox/containers/soapbox.tsx'),
};

test('verifies repository evidence', () => {
  assert.equal(run(), 'Error recovery authority inventory verified');
});

test('accepts the exact manifest and production sources', () => {
  assert.doesNotThrow(() => validateManifest(manifest));
  assert.doesNotThrow(() => validateSources(sources));
});

test('rejects evidence retained only in comments', () => {
  assert.throws(
    () => validateSources({ ...sources, boundary: `/*${sources.boundary}*/` }),
    /missing executable/,
  );
});

test('rejects incomplete emergency purge drift', () => {
  const boundary = sources.boundary.replace('sessionStorage.clear();', '');
  assert.throws(() => validateSources({ ...sources, boundary }), /sessionStorage/);
});

test('rejects recovery navigation changes without reconciliation', () => {
  const drifted = { ...manifest, recovery: { ...manifest.recovery, navigation: "location.href = '/app'" } };
  assert.throws(() => validateManifest(drifted), /recovery changed/);
});

test('rejects silently removed blockers', () => {
  assert.throws(
    () => validateManifest({ ...manifest, unknowns: EXPECTED_UNKNOWS.slice(1) }),
    /unknowns changed/,
  );
});

test('rejects a missing root error boundary', () => {
  const root = sources.root.replace('<ErrorBoundary>', '<>');
  assert.throws(() => validateSources({ ...sources, root }), /root provider/);
});
