'use strict';

const assert = require('node:assert/strict');

const semanticColorNames = [
  'canvas',
  'canvas-elevated',
  'surface-primary',
  'surface-secondary',
  'text-primary',
  'text-secondary',
  'text-tertiary',
  'separator',
  'accent',
  'on-accent',
  'selected',
  'positive',
  'caution',
  'destructive',
  'on-destructive',
  'information',
  'focus-ring',
  'overlay',
];

const primitiveGroups = ['typography', 'space', 'radius', 'elevation', 'motion', 'breakpoint'];
const modeNames = ['light', 'dark', 'increasedContrast', 'forcedColors'];
const safeTokenName = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const unsafeValue = /[;:{}\\\r\n]|@|\/\*|\*\/|!important|url\s*\(|expression\s*\(|javascript|data\s*:/i;
const contrastRequirements = [
  ['text-primary', 'canvas', 4.5],
  ['text-secondary', 'canvas', 4.5],
  ['text-tertiary', 'canvas', 4.5],
  ['text-primary', 'surface-primary', 4.5],
  ['text-secondary', 'surface-primary', 4.5],
  ['text-tertiary', 'surface-primary', 4.5],
  ['text-primary', 'surface-secondary', 4.5],
  ['text-secondary', 'surface-secondary', 4.5],
  ['text-tertiary', 'surface-secondary', 4.5],
  ['text-primary', 'selected', 4.5],
  ['on-accent', 'accent', 4.5],
  ['on-destructive', 'destructive', 4.5],
  ['positive', 'canvas', 4.5],
  ['caution', 'canvas', 4.5],
  ['destructive', 'canvas', 4.5],
  ['information', 'canvas', 4.5],
  ['focus-ring', 'canvas', 3],
];

const assertPlainObject = (value, label) => {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value), `${label} must be an object`);
  assert.equal(Object.getPrototypeOf(value), Object.prototype, `${label} must be a plain object`);
};

const assertExactKeys = (value, expected, label) => {
  assert.deepStrictEqual(Object.keys(value).sort(), [...expected].sort(), `${label} keys must match the canonical set`);
};

const validateTokenMap = (value, label) => {
  assertPlainObject(value, label);
  assert.ok(Object.keys(value).length > 0, `${label} must not be empty`);
  for (const [name, tokenValue] of Object.entries(value)) {
    assert.match(name, safeTokenName, `${label} contains an invalid token name`);
    assert.equal(typeof tokenValue, 'string', `${label}.${name} must be a string`);
    assert.ok(tokenValue.length > 0 && tokenValue.length <= 200, `${label}.${name} has an invalid length`);
    assert.ok(!unsafeValue.test(tokenValue), `${label}.${name} has an unsafe token value`);
  }
};

const parseHex = value => {
  assert.match(value, /^#[0-9a-f]{6}$/i, `Expected a six-digit hex color, received ${value}`);
  return [1, 3, 5].map(index => Number.parseInt(value.slice(index, index + 2), 16));
};

const relativeLuminance = value => {
  const channels = parseHex(value).map(channel => {
    const normalized = channel / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
};

const contrastRatio = (foreground, background) => {
  const values = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
};

const validateDesignTokens = tokens => {
  assertPlainObject(tokens, 'Design tokens');
  assertExactKeys(
    tokens,
    ['schemaVersion', 'status', 'primitives', 'modes', 'reducedMotion', 'framework7Aliases'],
    'Design token root',
  );
  assert.equal(tokens.schemaVersion, 1, 'Unsupported design token schema version');
  assert.equal(tokens.status, 'phase-2-foundation', 'Design token status must identify its authority');

  assertPlainObject(tokens.primitives, 'primitives');
  assertExactKeys(tokens.primitives, primitiveGroups, 'Primitive group');
  for (const group of primitiveGroups) validateTokenMap(tokens.primitives[group], `primitives.${group}`);

  const breakpoints = Object.values(tokens.primitives.breakpoint).map(value => {
    assert.match(value, /^\d+px$/, 'Breakpoints must use integer CSS pixels');
    return Number.parseInt(value, 10);
  });
  assert.ok(breakpoints.every((value, index) => index === 0 || value > breakpoints[index - 1]), 'Breakpoints must be strictly ascending');

  assertPlainObject(tokens.modes, 'modes');
  assertExactKeys(tokens.modes, modeNames, 'Mode');
  for (const mode of ['light', 'dark']) {
    assertPlainObject(tokens.modes[mode], `modes.${mode}`);
    assertExactKeys(tokens.modes[mode], ['color'], `${mode} mode`);
    validateTokenMap(tokens.modes[mode].color, `modes.${mode}.color`);
    assertExactKeys(tokens.modes[mode].color, semanticColorNames, `${mode} mode color`);
    for (const value of Object.values(tokens.modes[mode].color)) parseHex(value);
  }

  assertPlainObject(tokens.modes.increasedContrast, 'modes.increasedContrast');
  assertExactKeys(tokens.modes.increasedContrast, ['light', 'dark'], 'Increased contrast mode');
  for (const mode of ['light', 'dark']) {
    validateTokenMap(tokens.modes.increasedContrast[mode], `modes.increasedContrast.${mode}`);
    for (const name of Object.keys(tokens.modes.increasedContrast[mode])) {
      assert.ok(semanticColorNames.includes(name), `Increased contrast references unknown semantic token: ${name}`);
    }
    for (const value of Object.values(tokens.modes.increasedContrast[mode])) parseHex(value);
  }

  assertPlainObject(tokens.modes.forcedColors, 'modes.forcedColors');
  assertExactKeys(tokens.modes.forcedColors, ['color'], 'Forced-colors mode');
  validateTokenMap(tokens.modes.forcedColors.color, 'modes.forcedColors.color');
  assertExactKeys(tokens.modes.forcedColors.color, semanticColorNames, 'Forced-colors mode color');

  for (const mode of ['light', 'dark']) {
    const colors = tokens.modes[mode].color;
    for (const [foreground, background, minimum] of contrastRequirements) {
      assert.ok(
        contrastRatio(colors[foreground], colors[background]) >= minimum,
        `${mode} ${foreground} on ${background} must meet ${minimum}:1 contrast`,
      );
    }
  }

  validateTokenMap(tokens.reducedMotion, 'reducedMotion');
  for (const name of Object.keys(tokens.reducedMotion)) {
    assert.ok(Object.hasOwn(tokens.primitives.motion, name), `Reduced motion references unknown motion token: ${name}`);
  }

  assertPlainObject(tokens.framework7Aliases, 'framework7Aliases');
  for (const [alias, target] of Object.entries(tokens.framework7Aliases)) {
    assert.match(alias, /^--f7-[a-z0-9-]+$/, `Invalid Framework7 alias: ${alias}`);
    assert.match(target, /^--ds-color-[a-z0-9-]+$/, `Invalid Mangane semantic alias target: ${target}`);
    assert.ok(
      semanticColorNames.includes(target.replace('--ds-color-', '')),
      `Framework7 alias references unknown semantic token: ${target}`,
    );
  }
};

const formatDeclarations = (values, prefix, indent = '  ') => Object.keys(values)
  .sort()
  .map(name => `${indent}${prefix}${name}: ${values[name]};`)
  .join('\n');

const formatAliases = (aliases, indent = '  ') => Object.keys(aliases)
  .sort()
  .map(alias => `${indent}${alias}: var(${aliases[alias]});`)
  .join('\n');

const formatColorMode = (selector, colors, aliases, colorScheme, indent = '') => [
  `${indent}${selector} {`,
  formatDeclarations(colors, '--ds-color-', `${indent}  `),
  formatAliases(aliases, `${indent}  `),
  `${indent}  color-scheme: ${colorScheme};`,
  `${indent}}`,
].join('\n');

const buildDesignTokenCss = tokens => {
  validateDesignTokens(tokens);
  const primitiveDeclarations = primitiveGroups.flatMap(group => {
    const prefix = group === 'typography' ? '--ds-font-' : `--ds-${group}-`;
    return formatDeclarations(tokens.primitives[group], prefix).split('\n');
  });
  const aliases = formatAliases(tokens.framework7Aliases).split('\n');
  const light = formatDeclarations(tokens.modes.light.color, '--ds-color-');
  const highContrastLight = formatDeclarations(tokens.modes.increasedContrast.light, '--ds-color-', '    ');
  const highContrastDark = formatDeclarations(tokens.modes.increasedContrast.dark, '--ds-color-', '    ');
  const forcedColors = formatDeclarations(tokens.modes.forcedColors.color, '--ds-color-', '    ');
  const reducedMotion = formatDeclarations(tokens.reducedMotion, '--ds-motion-', '    ');

  return [
    '// Generated by scripts/generate-design-tokens.js. Do not edit by hand.',
    '// Source: config/design-tokens.json',
    '/* stylelint-disable color-hex-length, length-zero-no-unit, media-feature-name-no-unknown, value-keyword-case -- canonical generated values, modern preference queries, and forced-color system keywords */',
    '',
    ':root {',
    ...primitiveDeclarations,
    ...light.split('\n'),
    ...aliases,
    '  color-scheme: light;',
    '}',
    '',
    formatColorMode(
      'body.theme-mode-light,\n.site-preview.theme-mode-light',
      tokens.modes.light.color,
      tokens.framework7Aliases,
      'light',
    ),
    '',
    formatColorMode(
      'html.dark,\nbody.theme-mode-dark,\n.site-preview.theme-mode-dark',
      tokens.modes.dark.color,
      tokens.framework7Aliases,
      'dark',
    ),
    '',
    '@media (prefers-contrast: more) {',
    '  body.theme-mode-light,',
    '  .site-preview.theme-mode-light {',
    highContrastLight,
    '  }',
    '',
    '  html.dark,',
    '  body.theme-mode-dark,',
    '  .site-preview.theme-mode-dark {',
    highContrastDark,
    '  }',
    '}',
    '',
    '@media (forced-colors: active) {',
    '  :root,',
    '  body.theme-mode-light,',
    '  body.theme-mode-dark,',
    '  .site-preview {',
    forcedColors,
    '  }',
    '}',
    '',
    'body:not(.no-reduce-motion) {',
    formatDeclarations(tokens.reducedMotion, '--ds-motion-'),
    '}',
    '',
    '@media (prefers-reduced-motion: reduce) {',
    '  :root {',
    reducedMotion,
    '  }',
    '}',
    '',
    '/* stylelint-enable color-hex-length, length-zero-no-unit, media-feature-name-no-unknown, value-keyword-case */',
    '',
  ].join('\n');
};

module.exports = {
  buildDesignTokenCss,
  contrastRatio,
  validateDesignTokens,
};
