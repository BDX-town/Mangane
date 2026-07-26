'use strict';

const fs = require('node:fs');
const path = require('node:path');

const canonicalRegistryPath = 'app/soapbox/components/ui/icon/semantic-icon-registry.ts';
const sourceExtensions = new Set(['.css', '.js', '.jsx', '.sass', '.scss', '.ts', '.tsx']);
const excludedDirectories = new Set(['coverage', 'dist', 'node_modules', 'packs', 'public']);
const providerPatterns = [
  ['phosphor', /^@phosphor-icons\/react(?:\/.*)?$/],
  ['tabler', /^@tabler\/icons(?:\/.*)?$/],
  ['bootstrap-icons', /^bootstrap-icons(?:\/.*)?$/],
  ['cryptocurrency-icons', /^cryptocurrency-icons(?:\/.*)?$/],
  ['feather-icons', /^feather-icons(?:\/.*)?$/],
  ['fork-awesome', /^fork-awesome(?:\/.*)?$/],
  ['iconoir', /^(?:iconoir|iconoir-react)(?:\/.*)?$/],
  ['line-awesome', /^line-awesome(?:\/.*)?$/],
];

const slash = value => value.split(path.sep).join('/');

const walk = directory => {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (excludedDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute));
    else if (sourceExtensions.has(path.extname(entry.name))) files.push(absolute);
  }
  return files;
};

const providerFor = request => {
  for (const [provider, pattern] of providerPatterns) {
    if (pattern.test(request)) return provider;
  }
  return undefined;
};

const buildIconImportSnapshot = root => {
  const imports = new Map();
  const files = walk(path.join(root, 'app')).sort();

  for (const absolute of files) {
    const source = fs.readFileSync(absolute, 'utf8');
    const relative = slash(path.relative(root, absolute));
    const quotedValue = /(['"])(~?(?:@phosphor-icons\/react|@tabler\/icons|bootstrap-icons|cryptocurrency-icons|feather-icons|fork-awesome|iconoir|iconoir-react|line-awesome)(?:\/[^'"]*)?)\1/g;

    for (let match = quotedValue.exec(source); match; match = quotedValue.exec(source)) {
      const request = match[2].replace(/^~/, '');
      const provider = providerFor(request);
      if (!provider) continue;
      const key = `${provider}\0${relative}\0${request}`;
      const existing = imports.get(key);
      if (existing) existing.count += 1;
      else imports.set(key, { provider, path: relative, request, count: 1 });
    }
  }

  return [...imports.values()].sort((a, b) => (
    a.provider.localeCompare(b.provider)
    || a.path.localeCompare(b.path)
    || a.request.localeCompare(b.request)
  ));
};

const summarizeProviders = imports => {
  const counts = Object.fromEntries(providerPatterns.map(([provider]) => [provider, 0]));
  for (const item of imports) counts[item.provider] += item.count;
  return counts;
};

module.exports = {
  buildIconImportSnapshot,
  canonicalRegistryPath,
  summarizeProviders,
};
