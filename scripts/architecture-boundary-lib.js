'use strict';

const fs = require('node:fs');
const path = require('node:path');

const PRESENTATION_ROOTS = [
  'app/soapbox/components',
  'app/soapbox/containers',
  'app/soapbox/features',
  'app/soapbox/pages',
];

const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);

const RULES = [
  {
    id: 'direct-api-import',
    pattern: /(?:from\s+|require\()['"](?:soapbox\/api|(?:\.\.?\/)+(?:[^'"]+\/)?api)(?:['"/)])/g,
  },
  {
    id: 'backend-feature-import',
    pattern: /(?:from\s+|require\()['"]soapbox\/utils\/features(?:['")])/g,
  },
  {
    id: 'backend-endpoint-literal',
    pattern: /['"`]\/api\//g,
  },
];

const assertInside = (root, target) => {
  const relative = path.relative(root, target);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`architecture-boundary: unsafe path ${target}`);
  }
};

const walk = (root, directory, files = []) => {
  assertInside(root, directory);
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    assertInside(root, target);
    if (entry.isSymbolicLink()) {
      throw new Error(`architecture-boundary: symlinked source is not allowed: ${path.relative(root, target)}`);
    }
    if (entry.isDirectory()) {
      if (entry.name !== '__tests__' && entry.name !== '__fixtures__') walk(root, target, files);
    } else if (entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(target);
    }
  }
  return files;
};

const normalizedSnippet = (source, index) => (
  source.slice(source.lastIndexOf('\n', index) + 1, source.indexOf('\n', index) === -1 ? source.length : source.indexOf('\n', index))
    .trim()
    .replace(/\s+/g, ' ')
);

const scanPresentationBoundaries = (root) => {
  const findings = [];
  for (const relativeRoot of PRESENTATION_ROOTS) {
    const absoluteRoot = path.join(root, relativeRoot);
    if (!fs.existsSync(absoluteRoot)) continue;
    for (const file of walk(root, absoluteRoot)) {
      const source = fs.readFileSync(file, 'utf8');
      for (const rule of RULES) {
        for (const match of source.matchAll(rule.pattern)) {
          findings.push({
            file: path.relative(root, file).split(path.sep).join('/'),
            rule: rule.id,
            snippet: normalizedSnippet(source, match.index),
          });
        }
      }
    }
  }
  return findings.sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)));
};

module.exports = {
  PRESENTATION_ROOTS,
  RULES,
  scanPresentationBoundaries,
};
