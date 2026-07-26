'use strict';

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const testDirectory = path.join(root, 'scripts', '__tests__');
const tests = fs.readdirSync(testDirectory)
  .filter(file => file.endsWith('.test.js'))
  .filter(file => fs.readFileSync(path.join(testDirectory, file), 'utf8').includes('node:test'))
  .map(file => path.join('scripts', '__tests__', file))
  .sort();

if (tests.length === 0) throw new Error('governance-tests: no node:test suites discovered');

const result = spawnSync(process.execPath, ['--test', ...tests], {
  cwd: root,
  encoding: 'utf8',
  stdio: 'inherit',
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
