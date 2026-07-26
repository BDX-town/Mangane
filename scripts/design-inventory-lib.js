'use strict';

const fs = require('node:fs');
const path = require('node:path');

const slash = value => value.split(path.sep).join('/');
const sourceExtensions = new Set(['.js', '.jsx', '.ts', '.tsx']);
const styleExtensions = new Set(['.css', '.sass', '.scss']);
const excludedDirectories = new Set(['__fixtures__', '__tests__', 'coverage', 'dist', 'jest', 'node_modules']);

const walk = (directory, extensions) => {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (excludedDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute, extensions));
    else if (extensions.has(path.extname(entry.name))) files.push(absolute);
  }
  return files;
};

const lineNumber = (source, index) => source.slice(0, index).split('\n').length;

const ownerFor = relative => {
  if (relative.startsWith('app/soapbox/components/ui/')) return 'design-system';
  if (relative.startsWith('app/soapbox/components/')) return 'shared-components';
  if (relative.startsWith('app/soapbox/containers/')) return 'shared-containers';
  const feature = relative.match(/^app\/soapbox\/features\/([^/]+)/);
  if (feature) return `feature:${feature[1]}`;
  if (relative.startsWith('app/soapbox/pages/')) return 'application-shell';
  return 'application';
};

const componentClassifications = (relative, source) => {
  const values = [];
  if (relative.startsWith('app/soapbox/components/ui/')) values.push('reusable');
  else if (relative.startsWith('app/soapbox/components/') || relative.startsWith('app/soapbox/containers/')) values.push('compatibility-critical');
  else values.push('feature-specific');
  if (/\b(?:aria-|role=|tabIndex|autoFocus|focus\(|HotKeys|onKey(?:Down|Press|Up))/.test(source)) values.push('accessibility-critical');
  if (/modal|sheet|navigation|router|dropdown|menu|column|layout/i.test(relative)) {
    values.push('migration-adapter-required');
    values.push('framework7-replacement-candidate');
  }
  if (/\b(?:Icon|SvgIcon|IconButton)\b|@tabler\/icons/.test(source)) values.push('phosphor-migration-candidate');
  return [...new Set(values)];
};

const isComponent = (relative, source) => {
  if (/\.d\.ts$/.test(relative)) return false;
  return /(?:<[A-Z][A-Za-z0-9.]*|<[a-z][a-z0-9-]*(?:\s|>)|<>|React\.(?:createElement|FC|Fragment)|extends\s+(?:React\.)?(?:Component|PureComponent)|\breturn\s*\(\s*<)/m.test(source);
};

const buildComponents = root => {
  const roots = ['app/soapbox/components', 'app/soapbox/containers', 'app/soapbox/features', 'app/soapbox/pages'];
  return roots
    .flatMap(relative => walk(path.join(root, relative), sourceExtensions))
    .sort()
    .map(absolute => {
      const relative = slash(path.relative(root, absolute));
      const source = fs.readFileSync(absolute, 'utf8');
      return {
        path: relative,
        kind: isComponent(relative, source) ? 'component' : 'supporting-ui-module',
        owner: ownerFor(relative),
        scope: relative.startsWith('app/soapbox/components/') || relative.startsWith('app/soapbox/containers/') ? 'shared' : 'feature',
        classifications: componentClassifications(relative, source),
      };
    })
    .filter(Boolean);
};

const styleClassification = relative => {
  if (relative === 'app/styles/application.scss') return 'global-entry-authority';
  if (/\/(?:design-tokens\.generated|themes|variables|mixins)\.(?:s?css|sass)$/.test(relative)) return 'token-authority';
  if (relative.includes('/components/')) return 'shared-component-style';
  if (relative.includes('/features/')) return 'feature-style';
  if (relative.includes('/rtl.')) return 'rtl-compatibility';
  if (relative.includes('/accessibility.')) return 'accessibility-critical';
  return 'shared-global-style';
};

const buildStyles = root => {
  const roots = ['app/styles', 'app/soapbox'];
  const seen = new Set();
  return roots
    .flatMap(relative => walk(path.join(root, relative), styleExtensions))
    .sort()
    .map(absolute => slash(path.relative(root, absolute)))
    .filter(relative => !seen.has(relative) && seen.add(relative))
    .map(relative => ({
      path: relative,
      authority: styleClassification(relative),
      disposition: relative.startsWith('app/styles/') ? 'retain-and-tokenize' : 'co-located-review',
    }));
};

const addMatches = (target, source, relative, kind, provider, pattern, disposition) => {
  pattern.lastIndex = 0;
  for (let match = pattern.exec(source); match; match = pattern.exec(source)) {
    target.push({
      id: `${kind}:${relative}:${lineNumber(source, match.index)}:${match[1] || match[0]}`,
      path: relative,
      line: lineNumber(source, match.index),
      kind,
      provider,
      symbol: (match[1] || match[0]).trim(),
      disposition,
    });
  }
};

const buildIcons = (root, sourceFiles) => {
  const icons = [];
  for (const absolute of sourceFiles) {
    const relative = slash(path.relative(root, absolute));
    const source = fs.readFileSync(absolute, 'utf8');
    const phosphorImport = /from\s*['"]@phosphor-icons\/react(?:\/[^'"]*)?['"]/.exec(source);
    if (phosphorImport) {
      icons.push({
        id: `semantic-module:${relative}:${lineNumber(source, phosphorImport.index)}:semantic-registry`,
        path: relative,
        line: lineNumber(source, phosphorImport.index),
        kind: 'semantic-module',
        provider: 'phosphor',
        symbol: 'semantic-registry',
        disposition: 'canonical-semantic-registry',
      });
    }
    addMatches(icons, source, relative, 'svg-module', 'tabler', /@tabler\/icons\/([^'")\s]+\.svg)/g, 'phosphor-migration-candidate');
    addMatches(icons, source, relative, 'named-module', 'tabler', /import\s*\{([^}]+)\}\s*from\s*['"]@tabler\/icons['"]/g, 'phosphor-migration-candidate');
    addMatches(icons, source, relative, 'custom-svg', 'repository-asset', /(?:require\(|from\s*)['"]((?!@tabler\/icons\/)[^'"]+\.svg)['"]/g, 'retain-custom-asset-review');
    addMatches(icons, source, relative, 'legacy-font-prop', 'line-awesome', /<(?:Column|Icon)\b[^>\n]*(?:icon|id)=['"]([^'"]+)['"]/g, 'phosphor-migration-candidate');
  }
  return [...new Map(icons.map(item => [item.id, item])).values()]
    .sort((a, b) => a.path.localeCompare(b.path) || a.line - b.line || a.id.localeCompare(b.id));
};

const behaviorPatterns = [
  ['keyboard', /\b(?:onKeyDown|onKeyPress|onKeyUp|HotKeys|keyCode)\b/g],
  ['focus', /\b(?:autoFocus|tabIndex|activeElement)\b|\bfocus\s*\(/g],
  ['gesture', /\b(?:onTouchStart|onTouchMove|onTouchEnd|onSwipe|ReactSwipeableViews|PullToRefresh)\b/g],
  ['motion', /\b(?:Motion|spring\(|TransitionMotion|animation|transition)\b/g],
  ['label', /\b(?:aria-label|aria-labelledby|htmlFor)\b/g],
  ['live-region', /\b(?:aria-live|role=['"](?:alert|status|log)['"])\b/g],
  ['rtl', /\b(?:dir=|direction:|isRtl|rtl)\b/gi],
  ['localization', /\b(?:FormattedMessage|formatMessage|defineMessages|useIntl)\b/g],
  ['inline-style', /\bstyle=\{\{/g],
];

const buildBehaviors = (root, sourceFiles) => {
  const behaviors = [];
  for (const absolute of sourceFiles) {
    const relative = slash(path.relative(root, absolute));
    const source = fs.readFileSync(absolute, 'utf8');
    for (const [kind, pattern] of behaviorPatterns) {
      pattern.lastIndex = 0;
      for (let match = pattern.exec(source); match; match = pattern.exec(source)) {
        behaviors.push({
          id: `${kind}:${relative}:${lineNumber(source, match.index)}`,
          kind,
          path: relative,
          line: lineNumber(source, match.index),
          classification: kind === 'localization' ? 'compatibility-critical' : 'accessibility-critical',
        });
      }
    }
  }
  return [...new Map(behaviors.map(item => [item.id, item])).values()]
    .sort((a, b) => a.path.localeCompare(b.path) || a.line - b.line || a.kind.localeCompare(b.kind));
};

const countsBy = (items, key) => items.reduce((counts, item) => {
  counts[item[key]] = (counts[item[key]] || 0) + 1;
  return counts;
}, {});

const buildDesignInventory = root => {
  const sourceFiles = walk(path.join(root, 'app/soapbox'), sourceExtensions).sort();
  const components = buildComponents(root);
  const styles = buildStyles(root);
  const icons = buildIcons(root, sourceFiles);
  const behaviors = buildBehaviors(root, sourceFiles);
  const framework7 = sourceFiles.flatMap(absolute => {
    const source = fs.readFileSync(absolute, 'utf8');
    return source.includes('framework7') ? [slash(path.relative(root, absolute))] : [];
  });

  return {
    schemaVersion: 1,
    status: 'phase-2-foundation-in-progress',
    generatedFrom: ['app/soapbox/components', 'app/soapbox/containers', 'app/soapbox/features', 'app/soapbox/pages', 'app/styles', 'all app/soapbox icon and interaction callsites'],
    authorities: {
      componentOwnership: 'components[].owner',
      globalStyleEntry: 'app/styles/application.scss',
      tokens: ['config/design-tokens.json', 'app/styles/design-tokens.generated.scss'],
      legacyTokenBridges: ['app/styles/variables.scss', 'app/styles/themes.scss', 'tailwind.config.js', 'tailwind/colors.js'],
      iconRegistry: 'app/soapbox/components/ui/icon/semantic-icon-registry.ts',
      iconMigrationBaseline: 'config/icon-migration-baseline.json',
      iconMigrationTarget: 'Typed Phosphor semantic registry with a shrinking reviewed legacy-import baseline',
      motionPolicy: 'app/styles/accessibility.scss',
    },
    components,
    styles,
    icons,
    behaviors,
    duplicateAuthorities: [
      {
        concern: 'icons',
        sources: ['app/soapbox/components/icon.tsx', 'app/soapbox/components/svg_icon.tsx', 'app/soapbox/components/icon_button.js', 'app/soapbox/components/ui/icon'],
        disposition: 'migration-adapter-required',
      },
      {
        concern: 'button-styling',
        sources: ['app/soapbox/components/ui/button', 'app/soapbox/components/icon_button.js', 'app/soapbox/components/ui/icon-button', 'app/styles/components/buttons.scss'],
        disposition: 'consolidate-behind-design-system',
      },
      {
        concern: 'tokens',
        sources: ['config/design-tokens.json', 'app/styles/design-tokens.generated.scss'],
        compatibilitySources: ['app/styles/variables.scss', 'app/styles/themes.scss', 'tailwind.config.js', 'tailwind/colors.js'],
        disposition: 'canonical-source-with-generated-runtime-and-legacy-bridges',
      },
    ],
    framework7: {
      currentImports: framework7,
      compatibilityContract: 'config/design-tokens.json#framework7Aliases',
      replacementRule: 'A replacement must preserve routes, labels, keyboard behavior, focus restoration, reduced motion, gestures, and target sizes.',
    },
    baselines: {
      minimumPointerTargetCssPixels: 44,
      reducedMotionImplemented: true,
      focusRestorationRequiredForOverlays: true,
      automatedContrastTarget: 'WCAG 2.2 AA',
      breakpoints: { sm: '581px', md: '768px', lg: '976px', xl: '1280px' },
      screenshotPlan: 'docs/architecture/SCREENSHOT_AND_INTERACTION_BASELINE_PLAN.md',
    },
    counts: {
      components: components.length,
      styles: styles.length,
      icons: icons.length,
      behaviors: countsBy(behaviors, 'kind'),
      iconProviders: countsBy(icons, 'provider'),
      owners: countsBy(components, 'owner'),
    },
    invariants: {
      everyComponentClassifiedAndOwned: true,
      everyStyleEntryClassified: true,
      everyIconImportHasDisposition: true,
      keyboardGestureAndFocusSurfacesCaptured: true,
      compatibilityAndAccessibilityMayNotBeSilentlyRemoved: true,
    },
  };
};

module.exports = { buildDesignInventory };
