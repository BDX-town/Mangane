#!/usr/bin/env node

const { execSync } = require('child_process');
const { existsSync, mkdirSync } = require('fs');
const path = require('path');

const TWEMOJI_TAG = 'v14.0.2';
const twemojiDir = path.join(__dirname, '..', 'node_modules', 'twemoji');
const assetsDir = path.join(twemojiDir, 'assets', 'svg');

if (existsSync(assetsDir)) process.exit(0);

console.log(`Downloading twemoji ${TWEMOJI_TAG} SVG assets...`);
mkdirSync(path.join(twemojiDir, 'assets'), { recursive: true });

const url = `https://github.com/twitter/twemoji/archive/refs/tags/${TWEMOJI_TAG}.tar.gz`;
const tagDir = `twemoji-${TWEMOJI_TAG.replace(/^v/, '')}/assets/svg`;

execSync(
  `curl -sL "${url}" | tar -xz --strip-components=3 -C "${path.join(twemojiDir, 'assets')}" "${tagDir}"`,
  { stdio: 'inherit' }
);

console.log('twemoji assets ready.');
