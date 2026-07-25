'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_ROOTS = ['app', 'webpack', 'scripts'];
const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']);
const IGNORED_DIRECTORIES = new Set(['node_modules', 'coverage', 'dist']);

function collectTypedCallMatches(content, functionName) {
  const matches = [];
  const candidates = new RegExp(String.raw`\b${functionName}\b`, 'g');
  let candidate;
  while ((candidate = candidates.exec(content)) !== null) {
    let cursor = candidate.index + candidate[0].length;
    while (/\s/.test(content[cursor] || '')) cursor += 1;

    if (content[cursor] === '<') {
      let depth = 0;
      let quote = null;
      for (; cursor < content.length; cursor += 1) {
        const character = content[cursor];
        if (quote) {
          if (character === '\\') cursor += 1;
          else if (character === quote) quote = null;
          continue;
        }
        if (character === '\'' || character === '"' || character === '`') {
          quote = character;
          continue;
        }
        if (character === '<') depth += 1;
        else if (character === '>' && content[cursor - 1] !== '=') {
          depth -= 1;
          if (depth === 0) {
            cursor += 1;
            break;
          }
        }
      }
      if (depth !== 0) continue;
      while (/\s/.test(content[cursor] || '')) cursor += 1;
    }

    if (content[cursor] === '(') {
      matches.push({
        line: lineForOffset(content, candidate.index),
        text: content.slice(candidate.index, cursor + 1),
      });
    }
  }
  return matches;
}

const typedCallMatcher = functionName => content => collectTypedCallMatches(content, functionName);

const RULES = [
  ['reactQuery.useQuery', typedCallMatcher('useQuery')],
  ['reactQuery.useInfiniteQuery', typedCallMatcher('useInfiniteQuery')],
  ['reactQuery.useQueries', typedCallMatcher('useQueries')],
  ['reactQuery.useMutation', typedCallMatcher('useMutation')],
  ['reactQuery.fetchQuery', /\bfetchQuery\s*\(/g],
  ['reactQuery.prefetchQuery', /\bprefetchQuery\s*\(/g],
  ['reactQuery.getQueryData', /\bgetQueryData\s*\(/g],
  ['reactQuery.setQueryData', /\bsetQueryData\s*\(/g],
  ['reactQuery.setQueriesData', /\bsetQueriesData\s*\(/g],
  ['reactQuery.invalidateQueries', /\binvalidateQueries\s*\(/g],
  ['reactQuery.removeQueries', /\bremoveQueries\s*\(/g],
  ['reactQuery.resetQueries', /\bresetQueries\s*\(/g],
  ['reactQuery.cancelQueries', /\bcancelQueries\s*\(/g],
  ['reactQuery.clear', /\bqueryClient\.clear\s*\(/g],
  ['storage.localStorage', /\blocalStorage\b/g],
  ['storage.sessionStorage', /\bsessionStorage\b/g],
  ['storage.indexedDB', /\bindexedDB\b/g],
  ['storage.localForage', /\blocalforage\b/gi],
  ['network.axios', /\baxios\b/g],
  ['network.fetch', /\bfetch\s*\(/g],
  ['html.innerHTML', /\.innerHTML\b/g],
  ['html.dangerouslySetInnerHTML', /\bdangerouslySetInnerHTML\b/g],
  ['observability.sentry', /\bSentry\b|@sentry\//g],
  ['worker.serviceWorker', /\bserviceWorker\b/g],
  ['worker.caches', /\bcaches\.(?:open|delete|keys|match)\s*\(/g],
  ['worker.notification', /\bNotification\b|showNotification\s*\(/g],
  ['stream.websocket', /\bWebSocket\b/g],
  ['stream.eventSource', /\bEventSource\b/g],
];

function normalizePath(value) {
  return value.split(path.sep).join('/');
}

function walk(root) {
  const files = [];
  if (!fs.existsSync(root) || IGNORED_DIRECTORIES.has(path.basename(root))) return files;

  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (IGNORED_DIRECTORIES.has(entry.name)) continue;
    const fullPath = path.join(root, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) files.push(...walk(fullPath));
    else if (entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name))) files.push(fullPath);
  }
  return files;
}

function lineForOffset(content, offset) {
  let line = 1;
  for (let i = 0; i < offset; i += 1) if (content.charCodeAt(i) === 10) line += 1;
  return line;
}

function collectMatches(content, regex) {
  if (typeof regex === 'function') return regex(content);
  const matches = [];
  regex.lastIndex = 0;
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push({ line: lineForOffset(content, match.index), text: match[0] });
    if (match[0].length === 0) regex.lastIndex += 1;
  }
  return matches;
}

function inventoryRepository(repositoryRoot, roots = DEFAULT_ROOTS) {
  const absoluteRoot = path.resolve(repositoryRoot);
  const files = roots
    .flatMap((root) => walk(path.join(absoluteRoot, root)))
    .sort((a, b) => normalizePath(a).localeCompare(normalizePath(b)));

  const findings = [];
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    for (const [category, regex] of RULES) {
      const matches = collectMatches(content, regex);
      if (matches.length === 0) continue;
      findings.push({
        category,
        file: normalizePath(path.relative(absoluteRoot, file)),
        count: matches.length,
        lines: [...new Set(matches.map((item) => item.line))],
      });
    }
  }

  findings.sort((a, b) =>
    a.category.localeCompare(b.category) || a.file.localeCompare(b.file),
  );

  const totals = findings.reduce((result, item) => {
    result[item.category] = (result[item.category] || 0) + item.count;
    return result;
  }, {});

  return {
    schemaVersion: 1,
    generatedAt: null,
    roots: [...roots],
    scannedFiles: files.length,
    totals: Object.fromEntries(Object.entries(totals).sort(([a], [b]) => a.localeCompare(b))),
    findings,
  };
}

function toMarkdown(inventory) {
  const rows = inventory.findings.map((item) =>
    `| ${item.category} | \`${item.file}\` | ${item.count} | ${item.lines.join(', ')} |`,
  );
  return [
    '# Generated Architecture Inventory',
    '',
    '> Generated by `node scripts/architecture-inventory.js`. Do not hand-edit.',
    '',
    `Scanned source files: **${inventory.scannedFiles}**`,
    '',
    '| Category | File | Matches | Lines |',
    '|---|---|---:|---|',
    ...(rows.length ? rows : ['| none | — | 0 | — |']),
    '',
  ].join('\n');
}

function main(argv) {
  const args = new Set(argv.slice(2));
  const repositoryRoot = process.cwd();
  const inventory = inventoryRepository(repositoryRoot);
  const output = args.has('--markdown') ? toMarkdown(inventory) : `${JSON.stringify(inventory, null, 2)}\n`;
  process.stdout.write(output);
}

if (require.main === module) main(process.argv);

module.exports = { inventoryRepository, toMarkdown };
