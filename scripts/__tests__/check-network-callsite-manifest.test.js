'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { discover } = require('../network-callsite-lib');

test('discovers HTTP and streaming boundaries and remains deterministic', () => {
  const root = path.resolve(__dirname, '..', '..');
  const first = discover(root);
  assert.deepEqual(discover(root), first);
  assert.ok(first.calls.some(call => call.kind === 'axios'));
  assert.ok(first.calls.some(call => call.kind === 'fetch'));
  assert.ok(first.calls.every(call => call.retrySafety));
});

test('detects newly introduced network calls', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'network-callsite-'));
  const target = path.join(root, 'app', 'feature.ts');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, 'fetch(\'/api/v1/one\');\n');
  const before = discover(root);
  fs.appendFileSync(target, 'api().post(\'/api/v1/two\', {});\n');
  const after = discover(root);
  assert.equal(after.calls.length, before.calls.length + 1);
  assert.equal(after.calls.find(call => call.method === 'POST').retrySafety, 'unsafe-unless-idempotency-proven');
});
