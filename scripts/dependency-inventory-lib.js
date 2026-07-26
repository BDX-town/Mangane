'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const YAML = require('yaml');

const SOURCE_EXTENSIONS = new Set([
  '.cjs', '.css', '.html', '.js', '.jsx', '.json', '.mjs', '.scss', '.ts', '.tsx', '.yml', '.yaml',
]);
const SKIPPED_DIRECTORIES = new Set([
  '.coverage', '.git', '.yarn', 'build', 'coverage', 'dist', 'node_modules', 'static', 'tmp',
]);
const TEST_PATH = /(^|\/)(__fixtures__|__mocks__|__tests__|jest|test|tests)(\/|$)|\.(spec|test)\.[^.]+$/;
const WORKER_PATH = /(^|\/)(service_worker|workers?)(\/|\.|$)/;
const BUILD_PATH = /(^|\/)(babel|config|scripts|tailwind|webpack)(\/|\.|$)|(^|\/)(babel|commitlint|dangerfile|jest|postcss|tailwind|webpack)\.config\./;
const PACKAGE_NAME = /^(?:@[^/]+\/[^@/]+|[^@/]+)/;
const MODULE_PATTERNS = [
  /\b(?:from|require\s*\(|import\s*\()\s*['"]([^'"]+)['"]/g,
  /(?:^|[\s("'=])~((?:@[^/\s'")]+\/)?[^/\s'")]+)/g,
];
const LICENSE_OVERRIDES = new Map([
  ['@gamestdio/websocket@0.3.2', {
    expression: 'MIT',
    evidence: 'Installed LICENSE and README; package.json omits license metadata.',
    status: 'verified-from-distribution',
  }],
  ['taffydb@2.6.2', {
    expression: 'LicenseRef-TaffyDB-Ambiguous',
    evidence: 'Installed package.json omits a license; upstream materials conflict between BSD and MIT variants.',
    status: 'conflict-requires-removal-or-counsel',
  }],
]);
const AMBIGUOUS_LICENSE_DECLARATIONS = new Set(['Apache 2', 'BSD', 'MIT/X11', 'Public Domain']);

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const readText = file => fs.readFileSync(file, 'utf8');
const readJson = file => JSON.parse(readText(file));
const uniqueSorted = values => [...new Set(values)].sort();

const packageNameFromLocator = locator => {
  const match = locator.match(PACKAGE_NAME);
  if (!match) throw new Error(`unable to determine package name from locator ${locator}`);
  return match[0];
};

const packageId = (name, version) => `${name}@${version}`;

const parseLockfile = lockfilePath => {
  const parsed = YAML.parse(readText(lockfilePath));
  const entries = [];
  const descriptorIndex = new Map();

  for (const [descriptorList, value] of Object.entries(parsed)) {
    if (descriptorList === '__metadata' || !value?.resolution) continue;
    const descriptors = descriptorList.split(', ');
    const name = packageNameFromLocator(value.resolution);
    const entry = {
      descriptors,
      locator: value.resolution,
      name,
      version: value.version,
      dependencies: { ...(value.dependencies || {}), ...(value.optionalDependencies || {}) },
      peerDependencies: value.peerDependencies || {},
      checksum: value.checksum || null,
      linkType: value.linkType || null,
    };
    entries.push(entry);
    for (const descriptor of descriptors) descriptorIndex.set(descriptor, entry.locator);
  }

  entries.sort((a, b) => a.locator.localeCompare(b.locator));
  const entryByLocator = new Map(entries.map(entry => [entry.locator, entry]));

  const resolveDescriptor = (name, range) => {
    const candidates = [
      `${name}@${range}`,
      `${name}@npm:${range}`,
    ];
    for (const candidate of candidates) {
      if (descriptorIndex.has(candidate)) return descriptorIndex.get(candidate);
    }
    return null;
  };

  const graph = new Map();
  for (const entry of entries) {
    const dependencies = [];
    for (const [name, range] of Object.entries(entry.dependencies)) {
      const locator = resolveDescriptor(name, range);
      if (locator) dependencies.push(locator);
    }
    graph.set(entry.locator, uniqueSorted(dependencies));
  }

  const workspace = entries.find(entry => entry.locator.endsWith('@workspace:.'));
  if (!workspace) throw new Error('yarn.lock does not contain the root workspace');

  const directRoots = {};
  for (const [name, range] of Object.entries(workspace.dependencies)) {
    const locator = resolveDescriptor(name, range);
    if (!locator) throw new Error(`unable to resolve direct dependency ${name}@${range}`);
    directRoots[name] = locator;
  }

  return { directRoots, entries, entryByLocator, graph, workspaceLocator: workspace.locator };
};

const walkFiles = (root, visitor, relative = '') => {
  const absolute = path.join(root, relative);
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue;
    const child = relative ? path.join(relative, entry.name) : entry.name;
    if (entry.isDirectory()) {
      if (!SKIPPED_DIRECTORIES.has(entry.name)) walkFiles(root, visitor, child);
    } else {
      visitor(child);
    }
  }
};

const contextForPath = relativePath => {
  const normalized = relativePath.split(path.sep).join('/');
  if (TEST_PATH.test(normalized)) return 'test';
  if (WORKER_PATH.test(normalized)) return 'worker';
  if (BUILD_PATH.test(normalized) || normalized.startsWith('.github/')) return 'build';
  if (normalized.startsWith('app/')) return 'browser';
  return 'node';
};

const collectUsage = (root, directNames) => {
  const directSet = new Set(directNames);
  const evidence = new Map(directNames.map(name => [name, []]));

  walkFiles(root, relativePath => {
    const extension = path.extname(relativePath);
    if (!SOURCE_EXTENSIONS.has(extension)) return;
    if (relativePath.startsWith('docs/architecture/DEPENDENCY_')
      || relativePath.endsWith('dependency-authority-inventory.json')
      || relativePath.endsWith('dependency-advisory-snapshot.json')) return;

    const source = readText(path.join(root, relativePath));
    const discovered = new Set();
    for (const pattern of MODULE_PATTERNS) {
      pattern.lastIndex = 0;
      for (let match = pattern.exec(source); match; match = pattern.exec(source)) {
        const packageMatch = match[1].match(PACKAGE_NAME);
        if (packageMatch && directSet.has(packageMatch[0])) discovered.add(packageMatch[0]);
      }
    }
    for (const name of discovered) {
      evidence.get(name).push({
        path: relativePath.split(path.sep).join('/'),
        context: contextForPath(relativePath),
      });
    }
  });

  const packageJson = readJson(path.join(root, 'package.json'));
  for (const [scriptName, command] of Object.entries(packageJson.scripts || {})) {
    for (const name of directNames) {
      const executable = name.startsWith('@') ? name.split('/')[1] : name;
      const escaped = executable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (new RegExp(`(^|[\\s/])${escaped}(?=$|[\\s:/])`).test(command)) {
        evidence.get(name).push({ path: `package.json#scripts.${scriptName}`, context: 'build' });
      }
    }
  }

  return Object.fromEntries([...evidence].map(([name, rows]) => [
    name,
    rows.sort((a, b) => `${a.path}:${a.context}`.localeCompare(`${b.path}:${b.context}`)),
  ]));
};

const normalizeLicense = value => {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (value && typeof value.type === 'string') return value.type;
  if (Array.isArray(value)) {
    const values = value.map(normalizeLicense).filter(Boolean);
    if (values.length) return uniqueSorted(values).join(' OR ');
  }
  return null;
};

const licenseObligations = expression => {
  if (expression.startsWith('LicenseRef-')) return ['legal-review-before-distribution'];
  const obligations = [];
  if (/\b(MIT|BSD|ISC|Apache|Python|Zlib|W3C)\b/.test(expression)) {
    obligations.push('retain-applicable-copyright-license-and-notice-text');
  }
  if (/\bCC-BY\b/.test(expression)) obligations.push('provide-required-attribution');
  if (/\b(MPL|GPL|AGPL|LGPL)\b/.test(expression)) obligations.push('copyleft-source-and-license-compliance-review');
  if (/\b(CC0|Unlicense|0BSD|Public Domain)\b/.test(expression)) obligations.push('retain-provenance-and-confirm-jurisdictional-treatment');
  if (!obligations.length) obligations.push('preserve-license-text-and-review-distribution-terms');
  return uniqueSorted(obligations);
};

const collectInstalledMetadata = root => {
  const metadata = new Map();
  const nodeModules = path.join(root, 'node_modules');
  if (!fs.existsSync(nodeModules)) {
    throw new Error('node_modules is required to generate license and install-behavior evidence');
  }

  const visitNodeModules = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
      const candidate = path.join(directory, entry.name);
      if (entry.name.startsWith('@')) {
        visitNodeModules(candidate);
        continue;
      }
      const manifestPath = path.join(candidate, 'package.json');
      if (!fs.existsSync(manifestPath)) continue;
      let manifest;
      try {
        manifest = readJson(manifestPath);
      } catch {
        continue;
      }
      if (manifest.name && manifest.version) {
        const key = packageId(manifest.name, manifest.version);
        if (!metadata.has(key)) {
          const scripts = manifest.scripts || {};
          const installScripts = Object.fromEntries(
            ['preinstall', 'install', 'postinstall'].filter(name => scripts[name]).map(name => [name, scripts[name]]),
          );
          const installCommand = Object.values(installScripts).join(' ');
          const allScriptCommands = Object.values(scripts).join(' ');
          const packageFiles = new Set(fs.readdirSync(candidate));
          metadata.set(key, {
            author: typeof manifest.author === 'string' ? manifest.author : manifest.author?.name || null,
            description: manifest.description || null,
            installScripts,
            hasInstallScript: Object.keys(installScripts).length > 0,
            hasNativeBinding: Boolean(
              manifest.gypfile
              || manifest.binary
              || packageFiles.has('binding.gyp')
              || [...packageFiles].some(filename => filename.endsWith('.node'))
              || /\b(node-gyp|node-pre-gyp|prebuild-install|node-gyp-build)\b/.test(allScriptCommands),
            ),
            hasInstallTimeNetworkIndicator: /\b(curl|wget|download|https?:\/\/)\b/i.test(installCommand),
            hasPackageScriptNetworkIndicator: /\b(curl|wget|download|https?:\/\/)\b/i.test(allScriptCommands),
            hasCodeGenerationIndicator: Object.keys(scripts).some(name => /^(build|compile|generate|prepack|prepare|prepublish)/.test(name)),
            platformConstraints: {
              cpu: manifest.cpu || [],
              os: manifest.os || [],
            },
            repository: typeof manifest.repository === 'string' ? manifest.repository : manifest.repository?.url || null,
            license: normalizeLicense(manifest.license || manifest.licenses),
          });
        }
      }
      const nested = path.join(candidate, 'node_modules');
      if (fs.existsSync(nested)) visitNodeModules(nested);
    }
  };

  visitNodeModules(nodeModules);
  return metadata;
};

const classificationForEvidence = (name, evidence, declaredSection) => {
  const contexts = uniqueSorted(evidence.map(row => row.context));
  if (contexts.includes('browser') || contexts.includes('worker')) return 'runtime';
  if (contexts.includes('build') || contexts.includes('node')) return 'build-only';
  if (contexts.includes('test')) return 'test-only';
  if (name.startsWith('@types/')) return 'build-only';
  if (declaredSection === 'devDependencies') return 'development-unverified';
  return 'unused-or-dynamically-referenced-unverified';
};

const ownerFor = (classification, contexts) => {
  if (contexts.includes('worker')) return 'service-worker-maintainers';
  if (classification === 'runtime') return 'frontend-runtime-maintainers';
  if (classification === 'test-only') return 'test-infrastructure-maintainers';
  if (classification === 'build-only') return 'build-and-release-maintainers';
  return 'dependency-governance-maintainers';
};

const transitiveReachability = (lock, directClassifications) => {
  const rootsByLocator = new Map();
  for (const [name, locator] of Object.entries(lock.directRoots)) {
    const queue = [locator];
    const visited = new Set();
    while (queue.length) {
      const current = queue.shift();
      if (visited.has(current)) continue;
      visited.add(current);
      if (!rootsByLocator.has(current)) rootsByLocator.set(current, new Set());
      rootsByLocator.get(current).add(name);
      for (const child of lock.graph.get(current) || []) queue.push(child);
    }
  }

  const result = new Map();
  for (const entry of lock.entries) {
    let roots = uniqueSorted(rootsByLocator.get(entry.locator) || []);
    if (!roots.length && entry.locator.includes('@patch:')) {
      const unpatched = lock.entries.find(candidate =>
        candidate.locator !== entry.locator
        && candidate.name === entry.name
        && candidate.version === entry.version
        && !candidate.locator.includes('@patch:'));
      if (unpatched) roots = uniqueSorted(rootsByLocator.get(unpatched.locator) || []);
    }
    const classifications = uniqueSorted(roots.map(root => directClassifications[root]?.classification).filter(Boolean));
    const contexts = uniqueSorted(roots.flatMap(root => directClassifications[root]?.contexts || []));
    let classification = 'orphaned-lockfile-entry';
    if (classifications.includes('runtime')) classification = 'runtime-transitive';
    else if (classifications.includes('build-only')) classification = 'build-transitive';
    else if (classifications.includes('test-only')) classification = 'test-transitive';
    else if (classifications.length) classification = 'unverified-transitive';
    result.set(entry.locator, { classification, contexts, roots });
  }
  return result;
};

const collectActionUses = root => {
  const workflows = path.join(root, '.github', 'workflows');
  if (!fs.existsSync(workflows)) return [];
  const rows = [];
  for (const filename of fs.readdirSync(workflows).sort()) {
    if (!/\.ya?ml$/.test(filename)) continue;
    const relativePath = `.github/workflows/${filename}`;
    const lines = readText(path.join(workflows, filename)).split(/\r?\n/);
    lines.forEach((line, index) => {
      const match = line.match(/^\s*(?:-\s+)?uses:\s*['"]?([^'"\s#]+)['"]?/);
      if (!match) return;
      const specifier = match[1];
      const at = specifier.lastIndexOf('@');
      const action = at > 0 ? specifier.slice(0, at) : specifier;
      const ref = at > 0 ? specifier.slice(at + 1) : null;
      const local = action.startsWith('./');
      rows.push({
        action,
        line: index + 1,
        local,
        path: relativePath,
        pinnedToCommit: local || /^[a-f0-9]{40}$/.test(ref || ''),
        ref,
      });
    });
  }
  return rows;
};

const parseAuditJsonLines = file => {
  const text = readText(file).trim();
  if (!text) return [];
  return text.split(/\r?\n/).map((line, index) => {
    let row;
    try {
      row = JSON.parse(line);
    } catch (error) {
      throw new Error(`invalid audit JSON on line ${index + 1}: ${error.message}`);
    }
    const children = row.children || {};
    return {
      advisoryId: String(children.ID),
      dependents: uniqueSorted(children.Dependents || []),
      issue: children.Issue,
      package: row.value,
      severity: String(children.Severity || '').toLowerCase(),
      treeVersions: uniqueSorted(children['Tree Versions'] || []),
      url: children.URL || null,
      vulnerableVersions: children['Vulnerable Versions'] || null,
    };
  }).sort((a, b) => `${a.package}:${a.advisoryId}:${a.treeVersions.join(',')}`
    .localeCompare(`${b.package}:${b.advisoryId}:${b.treeVersions.join(',')}`));
};

const advisoryKey = advisory => [
  advisory.package,
  advisory.advisoryId,
  advisory.severity,
  advisory.treeVersions.join(','),
  advisory.dependents.join(','),
  advisory.vulnerableVersions || '',
  advisory.url || '',
].join('|');

const advisoryDisposition = (advisory, packages) => {
  const affected = packages.filter(pkg => pkg.name === advisory.package && advisory.treeVersions.includes(pkg.version));
  const contexts = uniqueSorted(affected.flatMap(pkg => pkg.executionContexts));
  const roots = uniqueSorted(affected.flatMap(pkg => pkg.rootDependencies));
  const runtimeReachable = affected.some(pkg => pkg.classification.startsWith('runtime'));
  const buildReachable = affected.some(pkg => pkg.classification.includes('build'));
  const testReachable = affected.some(pkg => pkg.classification.includes('test'));
  const installReachable = affected.some(pkg => pkg.installBehavior.hasInstallScript || pkg.installBehavior.hasNativeBinding);
  let reachability = 'lockfile-present-no-execution-path-proven';
  if (runtimeReachable) reachability = 'production-runtime-potentially-reachable';
  else if (installReachable) reachability = 'dependency-install-time-reachable';
  else if (buildReachable) reachability = 'build-or-development-time-reachable';
  else if (testReachable) reachability = 'test-time-reachable';

  let requiredAction = 'upgrade-or-remove-before-phase-0g-baseline';
  if (runtimeReachable) requiredAction = 'upgrade-or-replace-before-phase-1-runtime-work';
  else if (installReachable) requiredAction = 'upgrade-or-remove-before-next-trusted-install-baseline';

  return {
    affectedLocators: affected.map(pkg => pkg.locator),
    executionContexts: contexts,
    owner: runtimeReachable ? 'frontend-runtime-maintainers' : 'build-and-release-maintainers',
    reachability,
    requiredAction,
    rootDependencies: roots,
    status: 'remediation-required',
    transitiveDoesNotImplySafe: true,
  };
};

const buildInventory = ({ root, auditRows }) => {
  const packageJsonPath = path.join(root, 'package.json');
  const lockfilePath = path.join(root, 'yarn.lock');
  const packageJsonText = readText(packageJsonPath);
  const lockfileText = readText(lockfilePath);
  const twemojiDownloaderPath = path.join(root, 'scripts', 'download-twemoji-assets.js');
  const twemojiDownloaderText = readText(twemojiDownloaderPath);
  const packageJson = JSON.parse(packageJsonText);
  const lock = parseLockfile(lockfilePath);
  const directNames = Object.keys(lock.directRoots).sort();
  const usage = collectUsage(root, directNames);
  const installed = collectInstalledMetadata(root);

  const directClassifications = {};
  for (const name of directNames) {
    const declaredSection = Object.hasOwn(packageJson.dependencies || {}, name)
      ? 'dependencies'
      : 'devDependencies';
    const evidence = usage[name] || [];
    const contexts = uniqueSorted(evidence.map(row => row.context));
    const classification = classificationForEvidence(name, evidence, declaredSection);
    directClassifications[name] = {
      classification,
      contexts,
      declaredSection,
      evidence,
      owner: ownerFor(classification, contexts),
    };
  }

  const reachability = transitiveReachability(lock, directClassifications);
  const packages = lock.entries
    .filter(entry => entry.locator !== lock.workspaceLocator)
    .map(entry => {
      const directName = Object.keys(lock.directRoots).find(name => lock.directRoots[name] === entry.locator);
      const direct = directName ? directClassifications[directName] : null;
      const reached = reachability.get(entry.locator);
      const metadataKey = packageId(entry.name, entry.version);
      const metadata = installed.get(metadataKey);
      const override = LICENSE_OVERRIDES.get(metadataKey);
      const licenseExpression = override?.expression || metadata?.license || 'NOASSERTION';
      let licenseStatus = metadata?.license ? 'declared' : 'missing-metadata';
      if (AMBIGUOUS_LICENSE_DECLARATIONS.has(licenseExpression)) {
        licenseStatus = 'non-spdx-or-ambiguous-declaration';
      }
      if (override?.status) licenseStatus = override.status;
      const classification = direct?.classification || reached.classification;
      const executionContexts = uniqueSorted(direct?.contexts || reached.contexts);
      const rootDependencies = reached.roots;
      return {
        classification,
        declaredSection: direct?.declaredSection || null,
        descriptors: entry.descriptors,
        direct: Boolean(direct),
        executionContexts,
        license: {
          evidence: override?.evidence || 'Installed package.json metadata.',
          expression: licenseExpression,
          obligations: licenseObligations(licenseExpression),
          status: licenseStatus,
        },
        locator: entry.locator,
        maintenanceStatus: auditRows.some(row => row.package === entry.name && row.advisoryId.includes('(deprecation)'))
          ? 'deprecated'
          : 'not-declared-deprecated-in-audit-snapshot',
        name: entry.name,
        owner: direct?.owner || ownerFor(classification, executionContexts),
        upstream: {
          author: metadata?.author || null,
          repository: metadata?.repository || null,
        },
        purpose: direct
          ? metadata?.description || `Direct ${classification} dependency used by Mangane.`
          : `Transitive dependency required by: ${rootDependencies.join(', ') || 'unresolved lockfile root'}.`,
        replacementRelevance: direct && (
          classification.includes('unverified')
          || auditRows.some(row => row.package === entry.name && ['high', 'critical'].includes(row.severity))
        ) ? 'review-required' : 'none-recorded',
        rootDependencies,
        installBehavior: {
          hasInstallScript: metadata?.hasInstallScript || false,
          hasInstallTimeNetworkIndicator: metadata?.hasInstallTimeNetworkIndicator || false,
          hasPackageScriptNetworkIndicator: metadata?.hasPackageScriptNetworkIndicator || false,
          hasCodeGenerationIndicator: metadata?.hasCodeGenerationIndicator || false,
          hasNativeBinding: metadata?.hasNativeBinding || false,
          platformConstraints: metadata?.platformConstraints || { cpu: [], os: [] },
          scripts: metadata?.installScripts || {},
        },
        usageEvidence: direct?.evidence || [],
        version: entry.version,
      };
    });

  const advisories = auditRows.map(advisory => ({
    ...advisory,
    disposition: ['high', 'critical'].includes(advisory.severity)
      ? advisoryDisposition(advisory, packages)
      : { status: 'tracked-below-high-threshold' },
    key: advisoryKey(advisory),
  }));
  const actions = collectActionUses(root);
  const packagesByName = new Map();
  for (const pkg of packages) {
    if (!packagesByName.has(pkg.name)) packagesByName.set(pkg.name, []);
    packagesByName.get(pkg.name).push(pkg);
  }
  const duplicatePackages = [...packagesByName]
    .filter(([, rows]) => rows.length > 1)
    .map(([name, rows]) => ({
      locators: rows.map(row => row.locator).sort(),
      name,
      rootDependencies: uniqueSorted(rows.flatMap(row => row.rootDependencies)),
      versions: uniqueSorted(rows.map(row => row.version)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const replacementQueue = packages
    .filter(pkg => pkg.direct && (
      pkg.replacementRelevance === 'review-required'
      || pkg.maintenanceStatus === 'deprecated'
      || pkg.license.status.includes('conflict')
    ))
    .map(pkg => ({
      currentLocator: pkg.locator,
      owner: pkg.owner,
      reason: uniqueSorted([
        pkg.replacementRelevance === 'review-required' ? 'usage-or-security-review' : null,
        pkg.maintenanceStatus === 'deprecated' ? 'deprecated' : null,
        pkg.license.status.includes('conflict') ? 'license-conflict' : null,
      ].filter(Boolean)),
      status: 'queued',
    }));

  return {
    schemaVersion: 1,
    status: 'current-phase-0a-evidence',
    sourceDigests: {
      packageJsonSha256: sha256(packageJsonText),
      twemojiDownloaderSha256: sha256(twemojiDownloaderText),
      yarnLockSha256: sha256(lockfileText),
    },
    repositorySupplyChain: {
      postinstall: {
        command: packageJson.scripts?.postinstall || null,
        downloadsDuringInstall: /https:\/\/github\.com\/twitter\/twemoji/.test(twemojiDownloaderText),
        integrityVerification: false,
        networkTimeout: false,
        path: 'scripts/download-twemoji-assets.js',
        retryPolicy: false,
        shellPipelineToArchiveExtractor: /curl[\s\S]*\|[\s\S]*tar/.test(twemojiDownloaderText),
        status: 'remediation-required',
      },
    },
    summary: {
      actionUses: actions.length,
      advisories: Object.fromEntries(
        ['critical', 'high', 'moderate', 'low'].map(severity => [
          severity,
          advisories.filter(row => row.severity === severity).length,
        ]),
      ),
      directPackages: packages.filter(pkg => pkg.direct).length,
      duplicatePackageNames: duplicatePackages.length,
      installScriptPackages: packages.filter(pkg => pkg.installBehavior.hasInstallScript).length,
      nativeBindingPackages: packages.filter(pkg => pkg.installBehavior.hasNativeBinding).length,
      networkInstallIndicatorPackages: packages.filter(pkg => pkg.installBehavior.hasInstallTimeNetworkIndicator).length,
      packageScriptNetworkIndicatorPackages: packages.filter(pkg => pkg.installBehavior.hasPackageScriptNetworkIndicator).length,
      codeGenerationIndicatorPackages: packages.filter(pkg => pkg.installBehavior.hasCodeGenerationIndicator).length,
      resolvedPackages: packages.length,
      unpinnedActionUses: actions.filter(action => !action.pinnedToCommit).length,
    },
    packages,
    duplicatePackages,
    advisories,
    githubActions: actions,
    replacementQueue,
    invariants: {
      allResolvedPackagesClassified: true,
      everyHighOrCriticalAdvisoryRequiresDisposition: true,
      licenseMetadataCannotSilentlyDisappear: true,
      lockfileAndManifestDriftFailClosed: true,
      transitiveAdvisoriesAreNotAutomaticallyDismissed: true,
      workflowActionDriftFailsClosed: true,
    },
  };
};

const validateInventory = ({ root, inventory, auditSnapshot }) => {
  const errors = [];
  const fail = message => errors.push(message);
  if (inventory.schemaVersion !== 1) fail(`unsupported schemaVersion ${inventory.schemaVersion}`);
  const packageJsonText = readText(path.join(root, 'package.json'));
  const lockfileText = readText(path.join(root, 'yarn.lock'));
  const twemojiDownloaderText = readText(path.join(root, 'scripts', 'download-twemoji-assets.js'));
  if (inventory.sourceDigests?.packageJsonSha256 !== sha256(packageJsonText)) fail('package.json drifted without inventory reconciliation');
  if (inventory.sourceDigests?.yarnLockSha256 !== sha256(lockfileText)) fail('yarn.lock drifted without inventory reconciliation');
  if (inventory.sourceDigests?.twemojiDownloaderSha256 !== sha256(twemojiDownloaderText)) fail('postinstall downloader drifted without supply-chain reconciliation');
  const postinstall = inventory.repositorySupplyChain?.postinstall;
  if (postinstall?.status !== 'remediation-required'
    || postinstall?.integrityVerification !== false
    || postinstall?.networkTimeout !== false
    || postinstall?.retryPolicy !== false
    || postinstall?.shellPipelineToArchiveExtractor !== true) {
    fail('repository postinstall download risk must remain explicit until remediated');
  }

  const lock = parseLockfile(path.join(root, 'yarn.lock'));
  const expectedLocators = lock.entries
    .filter(entry => entry.locator !== lock.workspaceLocator)
    .map(entry => entry.locator)
    .sort();
  const actualLocators = (inventory.packages || []).map(pkg => pkg.locator).sort();
  if (JSON.stringify(actualLocators) !== JSON.stringify(expectedLocators)) fail('resolved package set drifted from yarn.lock');

  const seenLocators = new Set();
  for (const pkg of inventory.packages || []) {
    if (seenLocators.has(pkg.locator)) fail(`duplicate package locator ${pkg.locator}`);
    seenLocators.add(pkg.locator);
    if (!pkg.classification) fail(`${pkg.locator} is unclassified`);
    if (!pkg.owner) fail(`${pkg.locator} has no owner`);
    if (!pkg.upstream || !Object.hasOwn(pkg.upstream, 'author') || !Object.hasOwn(pkg.upstream, 'repository')) {
      fail(`${pkg.locator} has no upstream ownership evidence`);
    }
    if (!pkg.purpose) fail(`${pkg.locator} has no purpose`);
    if (!pkg.maintenanceStatus) fail(`${pkg.locator} has no maintenance status`);
    if (!pkg.license?.expression) fail(`${pkg.locator} has no license expression`);
    if (pkg.license?.expression === 'NOASSERTION') fail(`${pkg.locator} has unresolved license metadata`);
    if (!Array.isArray(pkg.license?.obligations) || !pkg.license.obligations.length) {
      fail(`${pkg.locator} has no license obligation record`);
    }
    if (!pkg.installBehavior) fail(`${pkg.locator} has no install-behavior classification`);
  }
  const duplicateGroups = new Map();
  for (const pkg of inventory.packages || []) {
    if (!duplicateGroups.has(pkg.name)) duplicateGroups.set(pkg.name, []);
    duplicateGroups.get(pkg.name).push(pkg);
  }
  const expectedDuplicates = [...duplicateGroups]
    .filter(([, rows]) => rows.length > 1)
    .map(([name, rows]) => ({
      locators: rows.map(row => row.locator).sort(),
      name,
      rootDependencies: uniqueSorted(rows.flatMap(row => row.rootDependencies)),
      versions: uniqueSorted(rows.map(row => row.version)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  if (JSON.stringify(inventory.duplicatePackages) !== JSON.stringify(expectedDuplicates)) {
    fail('duplicate package register drifted from the resolved inventory');
  }

  const snapshotKeys = auditSnapshot.map(advisoryKey).sort();
  const inventoryKeys = (inventory.advisories || []).map(row => row.key).sort();
  if (JSON.stringify(snapshotKeys) !== JSON.stringify(inventoryKeys)) fail('advisory snapshot drifted without disposition reconciliation');
  for (const advisory of inventory.advisories || []) {
    if (['high', 'critical'].includes(advisory.severity)) {
      const disposition = advisory.disposition;
      if (!disposition?.status || disposition.status === 'tracked-below-high-threshold') {
        fail(`${advisory.key} lacks a high/critical disposition`);
      }
      if (!disposition?.requiredAction || !disposition?.owner || !disposition?.reachability) {
        fail(`${advisory.key} lacks owner, reachability, or required action`);
      }
      if (!Array.isArray(disposition?.affectedLocators) || !disposition.affectedLocators.length
        || !Array.isArray(disposition?.rootDependencies) || !disposition.rootDependencies.length) {
        fail(`${advisory.key} lacks resolved locator or root-dependency reachability`);
      }
      if (disposition?.transitiveDoesNotImplySafe !== true) {
        fail(`${advisory.key} improperly permits transitive dismissal`);
      }
    }
  }

  const expectedActions = collectActionUses(root);
  if (JSON.stringify(inventory.githubActions) !== JSON.stringify(expectedActions)) {
    fail('GitHub Actions use sites drifted without supply-chain reconciliation');
  }
  for (const invariant of [
    'allResolvedPackagesClassified',
    'everyHighOrCriticalAdvisoryRequiresDisposition',
    'licenseMetadataCannotSilentlyDisappear',
    'lockfileAndManifestDriftFailClosed',
    'transitiveAdvisoriesAreNotAutomaticallyDismissed',
    'workflowActionDriftFailsClosed',
  ]) {
    if (inventory.invariants?.[invariant] !== true) fail(`required invariant ${invariant} must remain true`);
  }
  return errors;
};

module.exports = {
  advisoryKey,
  buildInventory,
  collectActionUses,
  parseAuditJsonLines,
  parseLockfile,
  sha256,
  validateInventory,
};
