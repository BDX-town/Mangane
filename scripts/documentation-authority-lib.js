'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const CLASSIFICATIONS = new Set([
  'canonical',
  'current-supporting-evidence',
  'accepted-target',
  'historical',
  'superseded',
]);
const DISPOSITIONS = new Set(['preserved', 'modified', 'replaced', 'deferred', 'rejected']);
const EXCLUDED_DIRECTORIES = new Set([
  '.git',
  '.yarn',
  'coverage',
  'dist',
  'node_modules',
  'static',
  'tmp',
  'vendor',
]);
const CANONICAL_DOCUMENTS = new Set([
  'ARCHITECTURE.md',
  'README.md',
  'docs/architecture/ARCHITECTURAL_DECISIONS.md',
  'docs/architecture/DOCUMENTATION_AUTHORITY_REGISTRY.md',
  'docs/architecture/IMPLEMENTATION_ROADMAP_V2.md',
  'docs/architecture/PHASE_0_CLOSURE_REPORT.md',
  'docs/architecture/PHASE_0_EVIDENCE_AND_GATES.md',
  'docs/architecture/README.md',
]);
const ACCEPTED_TARGETS = new Set([
  'docs/architecture/DATA_PRIVACY_AND_RESILIENCE.md',
  'docs/architecture/DESIGN_SYSTEM.md',
  'docs/architecture/PHASE_23A_CUSTOM_FEEDS.md',
  'docs/architecture/PHASE_8_HOME_AND_BUILT_IN_FEEDS.md',
  'docs/architecture/PRODUCT_VISION.md',
  'docs/architecture/SEARCH_AND_INTELLIGENCE.md',
  'docs/architecture/TECHNICAL_ARCHITECTURE.md',
]);
const HISTORICAL_DOCUMENTS = new Set([
  'CHANGELOG.md',
  'docs/history.md',
]);
const SUPERSEDED_DOCUMENTS = new Map([
  ['docs/administration/deploy-at-scale.md', 'README.md'],
  ['docs/administration/install-subdomain.md', 'README.md'],
  ['docs/administration/mastodon.md', 'README.md'],
  ['docs/administration/removing.md', 'README.md'],
  ['docs/development/build-config.md', 'docs/architecture/CURRENT_STATE.md'],
  ['docs/development/developing-backend.md', 'docs/architecture/BACKEND_CAPABILITY_MATRIX.md'],
  ['docs/development/how-it-works.md', 'docs/architecture/CURRENT_STATE.md'],
  ['docs/development/running-locally.md', 'README.md'],
]);
const STALE_AUTHORITY_PATTERNS = [
  /Status:\s*\*\*Current\s*\/\s*Phase 0 in progress\*\*/i,
  /Phase 0G CI baseline remains separate/i,
  /Phase 0G complete when the canonical workflow is green/i,
  /capture execution belongs to Phase 0G and Phase 2/i,
];

const normalizePath = value => value.split(path.sep).join('/');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const titleOf = source => source.match(/^#\s+(.+)$/m)?.[1]?.trim() || null;
const authorityIdOf = title => title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || null;

const walkMarkdown = root => {
  const files = [];
  const visit = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) continue;
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (!EXCLUDED_DIRECTORIES.has(entry.name)) visit(absolute);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
        files.push(normalizePath(path.relative(root, absolute)));
      }
    }
  };
  visit(root);
  return files.sort();
};

const classificationFor = relativePath => {
  if (CANONICAL_DOCUMENTS.has(relativePath)) return 'canonical';
  if (ACCEPTED_TARGETS.has(relativePath)) return 'accepted-target';
  if (HISTORICAL_DOCUMENTS.has(relativePath)) return 'historical';
  if (SUPERSEDED_DOCUMENTS.has(relativePath)) return 'superseded';
  return 'current-supporting-evidence';
};

const recordFor = (root, relativePath) => {
  const absolute = path.resolve(root, relativePath);
  const source = fs.readFileSync(absolute, 'utf8');
  const classification = classificationFor(relativePath);
  return {
    path: relativePath,
    title: titleOf(source),
    authorityId: authorityIdOf(titleOf(source)),
    classification,
    replacement: SUPERSEDED_DOCUMENTS.get(relativePath) || null,
    inheritedBrandingReferences: (source.match(/\bSoapbox(?:\s+FE)?\b/gi) || []).length,
    statusHeader: source.slice(0, 600).match(/^Status:\s*\*\*(.+)\*\*$/m)?.[1] || null,
    contentSha256: sha256(source),
  };
};

const buildRegistry = root => ({
  schemaVersion: 1,
  status: 'phase-0h-canonical',
  scope: {
    extensions: ['.md'],
    excludedDirectories: [...EXCLUDED_DIRECTORIES].sort(),
  },
  classifications: [...CLASSIFICATIONS].sort(),
  documents: walkMarkdown(root).map(relativePath => recordFor(root, relativePath)),
});

const maskInlineCode = line => {
  const runs = [...line.matchAll(/`+/g)];
  if (runs.length < 2) return line;
  const characters = line.split('');
  for (let opener = 0; opener < runs.length - 1; opener += 1) {
    const opening = runs[opener];
    const closingIndex = runs.findIndex((candidate, index) => (
      index > opener && candidate[0].length === opening[0].length
    ));
    if (closingIndex === -1) continue;
    const closing = runs[closingIndex];
    characters.fill(' ', opening.index, closing.index + closing[0].length);
    opener = closingIndex;
  }
  return characters.join('');
};

const maskMarkdownCode = source => {
  let fence = null;
  return source.split(/(\r?\n)/).map(part => {
    if (/^\r?\n$/.test(part)) return part;
    const candidate = part.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (fence) {
      const isClosingFence = candidate
        && candidate[1][0] === fence.character
        && candidate[1].length >= fence.length
        && candidate[2].trim() === '';
      if (isClosingFence) fence = null;
      return ' '.repeat(part.length);
    }
    if (candidate) {
      fence = { character: candidate[1][0], length: candidate[1].length };
      return ' '.repeat(part.length);
    }
    return maskInlineCode(part);
  }).join('');
};

const localLinks = (source, sourcePath) => {
  const links = [];
  const markdown = maskMarkdownCode(source);
  const targets = [
    ...[...markdown.matchAll(/!?\[[^\]]*]\(([^)]+)\)/g)].map(match => match[1]),
    ...[...markdown.matchAll(/^\s*\[[^\]]+]:\s*(\S+)/gm)].map(match => match[1]),
    ...[...markdown.matchAll(/<(?:a|img)\b[^>]*\b(?:href|src)=["']([^"']+)["'][^>]*>/gi)].map(match => match[1]),
  ];
  for (const rawTarget of targets) {
    let target = rawTarget.trim();
    if (target.startsWith('<') && target.endsWith('>')) target = target.slice(1, -1);
    target = target.split(/\s+["']/)[0];
    if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(target)) continue;
    const withoutFragment = target.split('#')[0].split('?')[0];
    if (!withoutFragment) continue;
    let decoded;
    try {
      decoded = decodeURIComponent(withoutFragment);
    } catch {
      links.push({ sourcePath, target, error: 'invalid URL encoding' });
      continue;
    }
    links.push({ sourcePath, target: decoded });
  }
  return links;
};

const resolveInsideRoot = (root, sourcePath, target) => {
  if (path.isAbsolute(target) || target.includes('\\')) return null;
  const lexicalRoot = path.resolve(root);
  const absolute = path.resolve(lexicalRoot, path.dirname(sourcePath), target);
  const relative = path.relative(lexicalRoot, absolute);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;

  let current = lexicalRoot;
  for (const segment of relative.split(path.sep).filter(Boolean)) {
    current = path.join(current, segment);
    let metadata;
    try {
      metadata = fs.lstatSync(current);
    } catch (error) {
      if (error.code === 'ENOENT') break;
      throw error;
    }
    if (metadata.isSymbolicLink()) return null;
  }
  return absolute;
};

const validateRequirements = (requirements, root = null) => {
  const errors = [];
  if (requirements.schemaVersion !== 1 || requirements.status !== 'phase-0h-canonical') {
    errors.push('historical requirement registry schema or status is invalid');
    return errors;
  }
  if (!Array.isArray(requirements.requirements) || requirements.requirements.length === 0) {
    errors.push('historical requirement registry must not be empty');
    return errors;
  }
  const ids = new Set();
  for (const requirement of requirements.requirements) {
    if (!requirement.id || ids.has(requirement.id)) errors.push(`duplicate or missing requirement id: ${requirement.id || '<missing>'}`);
    ids.add(requirement.id);
    if (!DISPOSITIONS.has(requirement.disposition)) errors.push(`${requirement.id} has invalid disposition`);
    for (const field of ['source', 'requirement', 'canonicalDestination', 'rationale', 'targetPhase', 'evidence']) {
      if (!requirement[field]) errors.push(`${requirement.id} is missing ${field}`);
    }
    if (root) {
      for (const field of ['canonicalDestination', 'evidence']) {
        const target = requirement[field];
        if (!target) continue;
        const resolved = resolveInsideRoot(root, '.', target);
        if (!resolved) errors.push(`${requirement.id} has an unsafe ${field} path`);
        else if (!fs.existsSync(resolved)) errors.push(`${requirement.id} references missing ${field}: ${target}`);
      }
    }
  }
  return errors;
};

const validateDocumentation = ({ root, registry, requirements }) => {
  const errors = [];
  const actual = buildRegistry(root);
  const files = actual.documents.map(record => record.path);

  for (const record of actual.documents) {
    if (!record.title) errors.push(`${record.path} has no H1 title`);
    if (!CLASSIFICATIONS.has(record.classification)) errors.push(`${record.path} has an invalid classification`);
    const source = fs.readFileSync(path.join(root, record.path), 'utf8');
    for (const link of localLinks(source, record.path)) {
      if (link.error) {
        errors.push(`${record.path} contains ${link.error}: ${link.target}`);
        continue;
      }
      const resolved = resolveInsideRoot(root, record.path, link.target);
      if (!resolved) errors.push(`${record.path} contains an unsafe local link: ${link.target}`);
      else if (!fs.existsSync(resolved)) errors.push(`${record.path} contains a broken local link: ${link.target}`);
    }
    if ((record.classification === 'canonical' || record.classification === 'accepted-target') && !record.statusHeader) {
      errors.push(`${record.path} must declare an authority Status header`);
    }
    if (record.classification === 'superseded') {
      if (!source.slice(0, 600).includes('> **Superseded documentation.**')) {
        errors.push(`${record.path} must display the superseded-document banner`);
      }
      if (!record.replacement || !files.includes(record.replacement)) {
        errors.push(`${record.path} must identify an existing replacement`);
      }
    }
    if (record.classification === 'historical' && !source.slice(0, 600).includes('> **Historical record.**')) {
      errors.push(`${record.path} must display the historical-record banner`);
    }
    for (const pattern of STALE_AUTHORITY_PATTERNS) {
      if (pattern.test(source)) errors.push(`${record.path} contains stale Phase 0 authority language: ${pattern.source}`);
    }
  }

  const activeTitles = new Map();
  for (const record of actual.documents.filter(row => ['canonical', 'accepted-target'].includes(row.classification))) {
    const prior = activeTitles.get(record.authorityId);
    if (prior) errors.push(`duplicate active authority title: ${prior} and ${record.path}`);
    activeTitles.set(record.authorityId, record.path);
  }

  if (JSON.stringify(registry) !== JSON.stringify(actual)) {
    errors.push('documentation authority registry drift detected; regenerate and reconcile classifications');
  }
  errors.push(...validateRequirements(requirements, root));
  for (const relativePath of [
    'docs/architecture/DOCUMENTATION_AUTHORITY_REGISTRY.md',
    'docs/architecture/HISTORICAL_REQUIREMENT_TRACEABILITY.md',
    'docs/architecture/DOCUMENTATION_SUPERSESSION_AND_ARCHIVE_MAP.md',
    'docs/architecture/PHASE_0_CLOSURE_REPORT.md',
  ]) {
    if (!files.includes(relativePath)) errors.push(`required Phase 0H artifact is missing: ${relativePath}`);
  }
  return { errors, actual };
};

module.exports = {
  ACCEPTED_TARGETS,
  CANONICAL_DOCUMENTS,
  CLASSIFICATIONS,
  DISPOSITIONS,
  HISTORICAL_DOCUMENTS,
  SUPERSEDED_DOCUMENTS,
  buildRegistry,
  localLinks,
  resolveInsideRoot,
  validateDocumentation,
  validateRequirements,
  walkMarkdown,
};
