'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  buildDesignTokenCss,
  contrastRatio,
  validateDesignTokens,
} = require('../design-token-lib');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const tokenPath = path.join(repositoryRoot, 'config', 'design-tokens.json');
const generatedPath = path.join(repositoryRoot, 'app', 'styles', 'design-tokens.generated.scss');
const checker = path.join(repositoryRoot, 'scripts', 'check-design-tokens.js');
const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));

const fixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'design-tokens-'));
  for (const relative of [
    'app/styles/application.scss',
    'app/styles/design-tokens.generated.scss',
    'config/design-tokens.json',
    'tailwind.config.js',
  ]) {
    const source = path.join(repositoryRoot, relative);
    const destination = path.join(root, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
  }
  return root;
};

const runChecker = root => spawnSync(process.execPath, [checker], {
  cwd: repositoryRoot,
  env: { ...process.env, DESIGN_TOKEN_ROOT: root },
  encoding: 'utf8',
});

test('validates the canonical Phase 2 token schema', () => {
  assert.doesNotThrow(() => validateDesignTokens(tokens));
  assert.equal(tokens.schemaVersion, 1);
  assert.deepEqual(Object.keys(tokens.modes).sort(), ['dark', 'forcedColors', 'increasedContrast', 'light']);
  assert.deepEqual(tokens.primitives.breakpoint, {
    sm: '581px',
    md: '768px',
    lg: '976px',
    xl: '1280px',
  });
});

test('generates deterministic checked-in CSS for every supported mode', () => {
  const css = buildDesignTokenCss(tokens);

  assert.equal(css, buildDesignTokenCss(structuredClone(tokens)));
  assert.equal(fs.readFileSync(generatedPath, 'utf8'), css);
  for (const selector of [
    ':root',
    'body.theme-mode-light',
    'body.theme-mode-dark',
    '@media (prefers-contrast: more)',
    '@media (forced-colors: active)',
    '@media (prefers-reduced-motion: reduce)',
  ]) assert.ok(css.includes(selector), `Missing generated selector: ${selector}`);
});

test('keeps core semantic text and action pairs at WCAG AA contrast', () => {
  assert.equal(contrastRatio('#000000', '#ffffff'), 21);

  const lowContrast = structuredClone(tokens);
  lowContrast.modes.light.color['text-secondary'] = '#f6f7f9';
  assert.throws(() => validateDesignTokens(lowContrast), /must meet 4.5:1 contrast/);
});

test('maps Framework7 compatibility variables only to canonical semantic tokens', () => {
  const semanticNames = new Set(Object.keys(tokens.modes.light.color));

  for (const [framework7Name, manganeName] of Object.entries(tokens.framework7Aliases)) {
    assert.match(framework7Name, /^--f7-[a-z0-9-]+$/);
    assert.match(manganeName, /^--ds-color-[a-z0-9-]+$/);
    assert.ok(semanticNames.has(manganeName.replace('--ds-color-', '')));
  }

  const css = buildDesignTokenCss(tokens);
  assert.ok(css.includes('--f7-page-bg-color: var(--ds-color-canvas);'));
  assert.ok(css.includes('--f7-theme-color: var(--ds-color-accent);'));
  assert.equal(
    css.match(/--f7-page-bg-color: var\(--ds-color-canvas\);/g).length,
    3,
    'Framework7 aliases must resolve in root, light, and dark cascade contexts',
  );
});

test('provides instant reduced-motion tokens without removing state changes', () => {
  assert.deepEqual(tokens.reducedMotion, {
    'duration-fast': '0.01ms',
    'duration-standard': '0.01ms',
    'duration-slow': '0.01ms',
    'distance-small': '0px',
    'distance-medium': '0px',
  });

  const css = buildDesignTokenCss(tokens);
  assert.ok(css.includes('--ds-motion-duration-standard: 0.01ms;'));
  assert.ok(css.includes('--ds-motion-distance-medium: 0px;'));
});

test('extends Tailwind through collision-resistant design utility names', () => {
  const tailwind = require('../../tailwind.config');

  assert.deepEqual(tailwind.theme.screens, tokens.primitives.breakpoint);
  assert.equal(typeof tailwind.theme.extend.colors.primary[600], 'function');
  assert.equal(tailwind.theme.extend.textColor.primary, undefined);
  assert.equal(tailwind.theme.extend.textColor.accent, undefined);
  assert.equal(tailwind.theme.extend.textColor['design-primary'], 'var(--ds-color-text-primary)');
  assert.equal(tailwind.theme.extend.backgroundColor['design-canvas'], 'var(--ds-color-canvas)');
});

test('rejects unsafe, ambiguous, and incomplete token input', () => {
  const unsafe = structuredClone(tokens);
  unsafe.primitives.radius.control = '4px; background: url(https://attacker.invalid)';
  assert.throws(() => validateDesignTokens(unsafe), /unsafe token value/i);

  const unknown = structuredClone(tokens);
  unknown.modes.light.color['surprise-provider-color'] = '#ffffff';
  assert.throws(() => validateDesignTokens(unknown), /mode color keys/i);

  const missingAliasTarget = structuredClone(tokens);
  missingAliasTarget.framework7Aliases['--f7-page-bg-color'] = '--ds-color-not-real';
  assert.throws(() => validateDesignTokens(missingAliasTarget), /unknown semantic token/i);
});

test('fails closed when generated CSS or a consumer drifts from token authority', () => {
  const staleGenerated = fixture();
  fs.appendFileSync(path.join(staleGenerated, 'app/styles/design-tokens.generated.scss'), '\n/* stale */\n');
  const staleResult = runChecker(staleGenerated);
  assert.notEqual(staleResult.status, 0);
  assert.match(`${staleResult.stderr}\n${staleResult.stdout}`, /Generated design tokens drifted/);

  const detachedTailwind = fixture();
  const tailwindPath = path.join(detachedTailwind, 'tailwind.config.js');
  fs.writeFileSync(
    tailwindPath,
    fs.readFileSync(tailwindPath, 'utf8').replace('require(\'./config/design-tokens.json\')', '{}'),
  );
  const detachedResult = runChecker(detachedTailwind);
  assert.notEqual(detachedResult.status, 0);
  assert.match(`${detachedResult.stderr}\n${detachedResult.stdout}`, /Tailwind must consume/);
});
