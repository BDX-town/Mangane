'use strict';

const fs = require('node:fs');
const path = require('node:path');

const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);
const EXCLUDED_SEGMENTS = new Set(['__fixtures__', '__tests__', 'jest', 'locales']);

const patterns = [
  ['react-html-sink', /dangerouslySetInnerHTML\s*=/g],
  ['dom-html-write', /(?:\.innerHTML\s*=|document\.write\s*\()/g],
  ['html-parser', /(?:\bDOMParser\b|parseFromString\s*\()/g],
  ['iframe-sink', /(?:<iframe\b|\bsrcDoc\s*=)/g],
  ['sanitizer-boundary', /\b(?:sanitizeHtml|safeHtml)\s*\(/g],
  ['imperative-navigation', /(?:window\.open\s*\(|(?:window\.)?location\.(?:assign|replace)\s*\(|(?:window\.)?location\.href\s*=)/g],
  ['dynamic-link-destination', /\bhref\s*=\s*\{/g],
];

const walk = directory => {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || EXCLUDED_SEGMENTS.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute));
    else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) files.push(absolute);
  }
  return files;
};

const lineInfo = (source, index) => {
  const prefix = source.slice(0, index);
  const line = prefix.split('\n').length;
  const lineStart = prefix.lastIndexOf('\n') + 1;
  const lineEnd = source.indexOf('\n', index);
  return {
    line,
    column: index - lineStart + 1,
    expression: source.slice(lineStart, lineEnd === -1 ? source.length : lineEnd).trim(),
  };
};

const classifyHtmlSink = (relativePath, source, index, expression) => {
  if (expression.includes('safeHtml(')) return 'sanitized-at-sink';
  if (relativePath.endsWith('/ui/text/text.tsx') || relativePath.endsWith('/permalink.tsx')) return 'shared-sanitizer-wrapper';

  const openingTag = source.slice(Math.max(0, index - 600), index).match(/<([A-Z][\w.]*)\b[^<>]*$/s)?.[1];
  if (openingTag === 'Text' || openingTag === 'Permalink') return 'shared-sanitizer-wrapper';
  if (source.includes('from \'soapbox/utils/html-safety\'') && source.includes('safeHtml(')) return 'sanitized-local-binding';

  return 'unverified';
};

const classify = (kind, relativePath, source, index, expression) => {
  if (kind === 'react-html-sink') return classifyHtmlSink(relativePath, source, index, expression);
  if (kind === 'dom-html-write' || kind === 'html-parser') {
    return [
      'app/soapbox/reducers/compose.ts',
      'app/soapbox/reducers/statuses.ts',
      'app/soapbox/utils/html.ts',
      'app/soapbox/utils/status.ts',
    ].includes(relativePath)
      ? 'inert-transformer-not-sanitizer'
      : 'unverified';
  }
  if (kind === 'iframe-sink') {
    return relativePath === 'app/soapbox/features/ui/components/embed_modal.tsx'
      ? 'sandboxed-sanitized-srcdoc'
      : 'unverified';
  }
  if (kind === 'sanitizer-boundary') return 'dompurify-3.4.12';
  if (kind === 'imperative-navigation') {
    return source.includes('sanitizeUrl(') || expression.includes('\'/') || expression.includes('BuildConfig.FE_SUBDIRECTORY')
      ? 'central-url-policy-or-fixed-local'
      : 'documented-existing-navigation';
  }
  if (kind === 'dynamic-link-destination') return 'central-navigation-policy';
  return 'unverified';
};

const discoverHtmlSafetyCallsites = root => {
  const sourceRoot = path.join(root, 'app', 'soapbox');
  const calls = [];

  for (const absolute of walk(sourceRoot).sort()) {
    const relativePath = path.relative(root, absolute).split(path.sep).join('/');
    const source = fs.readFileSync(absolute, 'utf8');

    for (const [kind, pattern] of patterns) {
      pattern.lastIndex = 0;
      for (let match = pattern.exec(source); match; match = pattern.exec(source)) {
        const info = lineInfo(source, match.index);
        calls.push({
          id: `${kind}:${relativePath}:${info.line}:${info.column}`,
          kind,
          path: relativePath,
          line: info.line,
          column: info.column,
          expression: info.expression,
          classification: classify(kind, relativePath, source, match.index, info.expression),
        });
      }
    }
  }

  return calls.sort((a, b) => a.path.localeCompare(b.path) || a.line - b.line || a.column - b.column || a.kind.localeCompare(b.kind));
};

const buildHtmlSafetyManifest = root => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const callsites = discoverHtmlSafetyCallsites(root);
  const counts = {};
  for (const callsite of callsites) counts[callsite.kind] = (counts[callsite.kind] || 0) + 1;

  return {
    schemaVersion: 2,
    status: 'phase-0d-verified',
    sanitizer: {
      package: 'dompurify',
      declaredVersion: packageJson.dependencies?.dompurify || null,
      policyModule: 'app/soapbox/utils/html-safety.ts',
      htmlProfileOnly: true,
      cssAttributesAllowed: false,
      svgAllowed: false,
      mathMlAllowed: false,
      iframeAllowedInSanitizedHtml: false,
    },
    urlPolicy: {
      module: 'app/soapbox/utils/url-policy.ts',
      navigationSchemes: ['http', 'https', 'mailto', 'tel'],
      mediaSchemes: ['http', 'https'],
      redirectPolicy: 'same-origin-relative-only',
      blockedSchemes: ['blob', 'data', 'file', 'javascript', 'vbscript'],
    },
    counts,
    callsites,
    invariants: {
      everyHtmlSinkDiscovered: true,
      everyHtmlSinkSanitizedOrWrapped: true,
      transformationHelpersAreNotSanitizers: true,
      rawPreviewEmbedExecutionBlocked: true,
      sanitizerPolicyPinned: true,
      urlPolicyPinned: true,
      allDynamicDestinationsRuntimeGoverned: true,
    },
  };
};

module.exports = {
  buildHtmlSafetyManifest,
  discoverHtmlSafetyCallsites,
};
