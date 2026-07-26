'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');

const buildConfigPath = path.resolve(__dirname, '..', '..', 'app', 'soapbox', 'build_config.js');
const originalFeatureFlags = process.env.FEATURE_FLAGS;

const loadFeatureFlags = value => {
  delete require.cache[buildConfigPath];
  if (value === undefined) {
    delete process.env.FEATURE_FLAGS;
  } else {
    process.env.FEATURE_FLAGS = value;
  }
  return require(buildConfigPath).FEATURE_FLAGS;
};

test.after(() => {
  if (originalFeatureFlags === undefined) {
    delete process.env.FEATURE_FLAGS;
  } else {
    process.env.FEATURE_FLAGS = originalFeatureFlags;
  }
  delete require.cache[buildConfigPath];
});

test('accepts only the registered boolean build override', () => {
  assert.deepEqual(loadFeatureFlags(JSON.stringify({
    'architecture.accountLookupAdapter': false,
    'unknown.flag': true,
  })), { 'architecture.accountLookupAdapter': false });
});

for (const [label, value] of [
  ['malformed JSON', '{'],
  ['an array', '[]'],
  ['a non-boolean registered value', '{"architecture.accountLookupAdapter":"false"}'],
]) {
  test(`fails closed for ${label}`, () => {
    assert.deepEqual(loadFeatureFlags(value), {});
  });
}
