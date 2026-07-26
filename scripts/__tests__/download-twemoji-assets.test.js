'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  EXPECTED_SVG_FILES,
  MAX_ARCHIVE_BYTES,
  MAX_ATTEMPTS,
  REQUEST_TIMEOUT_MS,
  TWEMOJI_SHA256,
  isAllowedDownloadUrl,
  retryDelayMs,
  validateArchiveEntries,
  validateExtractedAssets,
} = require('../download-twemoji-assets');

const safeNames = () => Array.from(
  { length: EXPECTED_SVG_FILES },
  (_, index) => `twemoji-14.0.2/assets/svg/${index.toString(16)}.svg`,
);
const safeVerbose = names => names.map(name => `-rw-r--r-- 0 root root 1 Jan 1 00:00 ${name}`);

test('pins the archive identity and bounded network policy', () => {
  assert.equal(TWEMOJI_SHA256, '27dc3087fd067d321aff3e859056773aca748510b18b8b058276f6fa57e7f16c');
  assert.equal(MAX_ARCHIVE_BYTES, 8 * 1024 * 1024);
  assert.equal(MAX_ATTEMPTS, 4);
  assert.equal(REQUEST_TIMEOUT_MS, 30_000);
});

test('allows only the expected HTTPS download and redirect hosts', () => {
  assert.equal(isAllowedDownloadUrl('https://github.com/twitter/twemoji/archive.tar.gz'), true);
  assert.equal(isAllowedDownloadUrl('https://codeload.github.com/twitter/twemoji/tar.gz/v14.0.2'), true);
  assert.equal(isAllowedDownloadUrl('http://github.com/twitter/twemoji/archive.tar.gz'), false);
  assert.equal(isAllowedDownloadUrl('https://github.com.attacker.example/archive.tar.gz'), false);
  assert.equal(isAllowedDownloadUrl('https://user@github.com/archive.tar.gz'), false);
  assert.equal(isAllowedDownloadUrl('https://github.com:444/archive.tar.gz'), false);
});

test('uses exponential backoff with bounded jitter', () => {
  assert.deepEqual(
    Array.from({ length: MAX_ATTEMPTS - 1 }, (_, attempt) => retryDelayMs(attempt, () => 0)),
    [500, 1000, 2000],
  );
  assert.equal(retryDelayMs(2, () => 0.999), 2249);
});

test('accepts only the exact regular-file SVG archive shape', () => {
  const names = safeNames();
  assert.doesNotThrow(() => validateArchiveEntries(names, safeVerbose(names)));

  const traversal = [...names];
  traversal[0] = 'twemoji-14.0.2/assets/svg/../escape.svg';
  assert.throws(() => validateArchiveEntries(traversal, safeVerbose(traversal)), /Unsafe Twemoji archive entry/);

  const linked = safeVerbose(names);
  linked[0] = linked[0].replace(/^-/, 'l');
  assert.throws(() => validateArchiveEntries(names, linked), /unexpected link/);
});

test('accepts a complete regular-file extraction and rejects symlinks', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mangane-twemoji-test-'));
  const svg = path.join(root, 'svg');
  fs.mkdirSync(svg);
  try {
    for (let index = 0; index < EXPECTED_SVG_FILES; index += 1) {
      fs.writeFileSync(path.join(svg, `${index.toString(16)}.svg`), '<svg/>');
    }
    assert.equal(validateExtractedAssets(svg), true);
    fs.rmSync(path.join(svg, '0.svg'));
    fs.symlinkSync(path.join(svg, '1.svg'), path.join(svg, '0.svg'));
    assert.equal(validateExtractedAssets(svg), false);
  } finally {
    fs.rmSync(root, { force: true, recursive: true });
  }
});
