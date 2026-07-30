'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..', '..');
const read = relativePath => fs.readFileSync(path.join(root, relativePath), 'utf8');

// Framework7 import ownership is enforced by the canonical architecture checker and generated inventory.
const shellFiles = [
  'app/soapbox/features/f7-shell/components/bottom-tabs.tsx',
  'app/soapbox/features/f7-shell/components/sidebar-navigation.tsx',
];

test('Framework7 shell navigation uses the canonical semantic icon authority', () => {
  for (const relativePath of shellFiles) {
    const source = read(relativePath);
    assert.match(source, /SemanticIcon/);
    assert.doesNotMatch(source, /\biconF7\s*=/);
    assert.doesNotMatch(source, /@phosphor-icons\/react/);
    assert.doesNotMatch(source, /@tabler\/icons/);
  }
});

test('shell navigation semantics are present in the static registry', () => {
  const registry = read('app/soapbox/components/ui/icon/semantic-icon-registry.ts');
  for (const name of ['home', 'search', 'notifications', 'settings', 'local', 'explore', 'bookmark', 'lists']) {
    assert.match(registry, new RegExp(`['\"]?${name}['\"]?`));
  }
});
