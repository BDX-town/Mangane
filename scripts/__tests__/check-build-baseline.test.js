'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const repositoryRoot = path.resolve(__dirname, '../..');
const script = path.join(repositoryRoot, 'scripts', 'check-build-baseline.js');
const fixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mangane-build-baseline-'));
  const output = path.join(root, 'static');
  fs.mkdirSync(path.join(root, 'config'), { recursive: true });
  fs.mkdirSync(path.join(output, 'packs/js'), { recursive: true });
  fs.mkdirSync(path.join(output, 'packs/css'), { recursive: true });
  fs.copyFileSync(path.join(repositoryRoot, 'config/build-budget.json'), path.join(root, 'config/build-budget.json'));
  fs.writeFileSync(path.join(output, 'packs/js/common.js'), 'runtime');
  fs.writeFileSync(path.join(output, 'packs/js/application.js'), 'application');
  fs.writeFileSync(path.join(output, 'packs/css/application.css'), 'styles');
  fs.writeFileSync(path.join(output, 'sw.js'), 'worker');
  fs.writeFileSync(path.join(output, 'assets-manifest.json'), JSON.stringify({
    __offline_serviceworker: '/__offline_serviceworker',
    entrypoints: {
      application: {
        assets: {
          css: ['/packs/css/application.css'],
          js: ['/packs/js/common.js', '/packs/js/application.js'],
        },
      },
    },
  }));
  return root;
};
const run = root => execFileSync(process.execPath, [script], {
  cwd: root,
  encoding: 'utf8',
  env: { ...process.env, BUILD_BASELINE_ROOT: root },
  stdio: ['ignore', 'pipe', 'pipe'],
});

test('accepts bounded production entrypoints and worker output', () => {
  const report = JSON.parse(run(fixture()));
  assert.equal(report.secretPatterns, 4);
  assert.equal(report.observed.applicationJavaScriptBytes, 11);
});

test('rejects source maps in production output', () => {
  const root = fixture();
  fs.writeFileSync(path.join(root, 'static/packs/js/application.js.map'), '{}');
  assert.throws(() => run(root), /production output contains source maps/);
});

test('rejects high-confidence secret material in generated output', () => {
  const root = fixture();
  const privateKeyMarker = ['-----BEGIN', 'PRIVATE KEY-----'].join(' ');
  fs.appendFileSync(path.join(root, 'static/packs/js/application.js'), `\n${privateKeyMarker}`);
  assert.throws(() => run(root), /private-key pattern/);
});

test('rejects an application bundle over its byte budget', () => {
  const root = fixture();
  const configPath = path.join(root, 'config/build-budget.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  config.production.applicationJavaScriptBytes = 5;
  fs.writeFileSync(configPath, JSON.stringify(config));
  assert.throws(() => run(root), /over the 5-byte budget/);
});
