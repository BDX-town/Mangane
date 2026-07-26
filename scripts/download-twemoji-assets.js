#!/usr/bin/env node
'use strict';

const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const https = require('node:https');
const path = require('node:path');
const { Transform } = require('node:stream');
const { pipeline } = require('node:stream/promises');

const TWEMOJI_TAG = 'v14.0.2';
const TWEMOJI_SHA256 = '27dc3087fd067d321aff3e859056773aca748510b18b8b058276f6fa57e7f16c';
const EXPECTED_SVG_FILES = 3689;
const MAX_ARCHIVE_BYTES = 8 * 1024 * 1024;
const MAX_ATTEMPTS = 4;
const MAX_REDIRECTS = 3;
const REQUEST_TIMEOUT_MS = 30_000;
const ALLOWED_DOWNLOAD_HOSTS = new Set(['github.com', 'codeload.github.com']);
const archiveUrl = new URL(`https://github.com/twitter/twemoji/archive/refs/tags/${TWEMOJI_TAG}.tar.gz`);
const tagDirectory = `twemoji-${TWEMOJI_TAG.replace(/^v/, '')}/assets/svg`;
const twemojiDirectory = path.join(__dirname, '..', 'node_modules', 'twemoji');
const assetsDirectory = path.join(twemojiDirectory, 'assets');

const isAllowedDownloadUrl = value => {
  const url = value instanceof URL ? value : new URL(value);
  return url.protocol === 'https:'
    && !url.username
    && !url.password
    && ALLOWED_DOWNLOAD_HOSTS.has(url.hostname)
    && (url.port === '' || url.port === '443');
};

const retryDelayMs = (attempt, random = Math.random) => {
  const exponential = 500 * (2 ** attempt);
  return exponential + Math.floor(random() * 250);
};

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

const downloadOnce = (url, destination, redirectsRemaining = MAX_REDIRECTS) => new Promise((resolve, reject) => {
  if (!isAllowedDownloadUrl(url)) {
    reject(new Error(`Refusing untrusted Twemoji download URL: ${url.origin}`));
    return;
  }

  const request = https.get(url, {
    headers: {
      Accept: 'application/gzip, application/octet-stream',
      'User-Agent': 'Mangane-build/phase-0g',
    },
    timeout: REQUEST_TIMEOUT_MS,
  }, async(response) => {
    const location = response.headers.location;
    if (response.statusCode >= 300 && response.statusCode < 400 && location) {
      response.resume();
      if (redirectsRemaining === 0) {
        reject(new Error('Twemoji download exceeded the redirect limit'));
        return;
      }
      try {
        const redirectUrl = new URL(location, url);
        resolve(await downloadOnce(redirectUrl, destination, redirectsRemaining - 1));
      } catch (error) {
        reject(error);
      }
      return;
    }

    if (response.statusCode !== 200) {
      response.resume();
      reject(new Error(`Twemoji download returned HTTP ${response.statusCode}`));
      return;
    }

    const declaredLength = Number(response.headers['content-length']);
    if (Number.isFinite(declaredLength) && declaredLength > MAX_ARCHIVE_BYTES) {
      response.resume();
      reject(new Error(`Twemoji archive exceeds ${MAX_ARCHIVE_BYTES} bytes`));
      return;
    }

    let receivedBytes = 0;
    const hash = createHash('sha256');
    const limiter = new Transform({
      transform(chunk, _encoding, callback) {
        receivedBytes += chunk.length;
        if (receivedBytes > MAX_ARCHIVE_BYTES) {
          callback(new Error(`Twemoji archive exceeds ${MAX_ARCHIVE_BYTES} bytes`));
          return;
        }
        hash.update(chunk);
        callback(null, chunk);
      },
    });

    try {
      await pipeline(response, limiter, fs.createWriteStream(destination, { flags: 'w', mode: 0o600 }));
      const digest = hash.digest('hex');
      if (digest !== TWEMOJI_SHA256) {
        throw new Error(`Twemoji archive checksum mismatch: received ${digest}`);
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });

  request.on('timeout', () => request.destroy(new Error(`Twemoji download timed out after ${REQUEST_TIMEOUT_MS}ms`)));
  request.on('error', reject);
});

const downloadWithRetry = async(destination) => {
  let lastError;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      await downloadOnce(archiveUrl, destination);
      return;
    } catch (error) {
      lastError = error;
      fs.rmSync(destination, { force: true });
      if (attempt + 1 < MAX_ATTEMPTS) await wait(retryDelayMs(attempt));
    }
  }
  throw new Error(`Twemoji download failed after ${MAX_ATTEMPTS} attempts: ${lastError.message}`);
};

const validateArchiveEntries = (names, verboseLines) => {
  const prefix = `${tagDirectory}/`;
  const svgNames = names.filter(name => name.startsWith(prefix) && name !== prefix);
  if (svgNames.length !== EXPECTED_SVG_FILES) {
    throw new Error(`Twemoji archive contains ${svgNames.length} SVG assets; expected ${EXPECTED_SVG_FILES}`);
  }
  for (const name of svgNames) {
    const relative = name.slice(prefix.length);
    if (!/^[0-9a-f-]+\.svg$/.test(relative) || relative.includes('..') || path.isAbsolute(relative)) {
      throw new Error(`Unsafe Twemoji archive entry: ${name}`);
    }
  }
  const relevantTypes = verboseLines
    .filter(line => line.includes(prefix) && !line.endsWith(prefix))
    .map(line => line[0]);
  if (relevantTypes.length !== EXPECTED_SVG_FILES || relevantTypes.some(type => type !== '-')) {
    throw new Error('Twemoji archive contains an unexpected link or non-file SVG entry');
  }
};

const validateArchive = archivePath => {
  const options = { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] };
  const names = execFileSync('tar', ['-tzf', archivePath], options).trim().split('\n');
  const verboseLines = execFileSync('tar', ['-tvzf', archivePath], options).trim().split('\n');
  validateArchiveEntries(names, verboseLines);
};

const validateExtractedAssets = directory => {
  if (!fs.existsSync(directory) || fs.lstatSync(directory).isSymbolicLink()) return false;
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries.length === EXPECTED_SVG_FILES
    && entries.every(entry => entry.isFile() && /^[0-9a-f-]+\.svg$/.test(entry.name));
};

const installAssets = async() => {
  const svgDirectory = path.join(assetsDirectory, 'svg');
  if (validateExtractedAssets(svgDirectory)) {
    process.stdout.write(`Twemoji ${TWEMOJI_TAG} assets already verified.\n`);
    return;
  }

  fs.mkdirSync(twemojiDirectory, { recursive: true });
  const temporaryDirectory = fs.mkdtempSync(path.join(twemojiDirectory, '.mangane-twemoji-'));
  const archivePath = path.join(temporaryDirectory, 'twemoji.tar.gz');
  const extractionDirectory = path.join(temporaryDirectory, 'extracted');
  const previousAssetsDirectory = path.join(temporaryDirectory, 'previous-assets');
  try {
    process.stdout.write(`Downloading checksum-pinned Twemoji ${TWEMOJI_TAG} SVG assets...\n`);
    await downloadWithRetry(archivePath);
    validateArchive(archivePath);
    fs.mkdirSync(extractionDirectory, { recursive: true });
    execFileSync('tar', [
      '-xzf',
      archivePath,
      '--strip-components=2',
      '-C',
      extractionDirectory,
      tagDirectory,
    ], { stdio: ['ignore', 'ignore', 'inherit'] });
    const extractedSvgDirectory = path.join(extractionDirectory, 'svg');
    if (!validateExtractedAssets(extractedSvgDirectory)) {
      throw new Error('Extracted Twemoji asset set failed validation');
    }
    if (fs.existsSync(assetsDirectory)) fs.renameSync(assetsDirectory, previousAssetsDirectory);
    try {
      fs.renameSync(extractionDirectory, assetsDirectory);
    } catch (error) {
      if (fs.existsSync(previousAssetsDirectory)) fs.renameSync(previousAssetsDirectory, assetsDirectory);
      throw error;
    }
    process.stdout.write(`Twemoji ${TWEMOJI_TAG} assets installed and verified.\n`);
  } finally {
    fs.rmSync(temporaryDirectory, { force: true, recursive: true });
  }
};

if (require.main === module) {
  installAssets().catch(error => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}

module.exports = {
  EXPECTED_SVG_FILES,
  MAX_ARCHIVE_BYTES,
  MAX_ATTEMPTS,
  REQUEST_TIMEOUT_MS,
  TWEMOJI_SHA256,
  isAllowedDownloadUrl,
  retryDelayMs,
  validateArchiveEntries,
  validateExtractedAssets,
};
