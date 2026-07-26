'use strict';

const cssVariableMap = (tokens, prefix) => Object.fromEntries(
  Object.keys(tokens).map(name => [`design-${name}`, `var(${prefix}${name})`]),
);

const buildDesignTokenExtension = designTokens => ({
  backgroundColor: {
    'design-canvas': 'var(--ds-color-canvas)',
    'design-canvas-elevated': 'var(--ds-color-canvas-elevated)',
    'design-surface-primary': 'var(--ds-color-surface-primary)',
    'design-surface-secondary': 'var(--ds-color-surface-secondary)',
    'design-selected': 'var(--ds-color-selected)',
  },
  borderColor: {
    'design-separator': 'var(--ds-color-separator)',
    'design-focus': 'var(--ds-color-focus-ring)',
  },
  borderRadius: cssVariableMap(designTokens.primitives.radius, '--ds-radius-'),
  boxShadow: {
    'design-1': 'var(--ds-elevation-1)',
    'design-2': 'var(--ds-elevation-2)',
    'design-3': 'var(--ds-elevation-3)',
  },
  fontFamily: {
    editorial: ['var(--ds-font-family-editorial)'],
    mono: ['var(--ds-font-family-mono)'],
    ui: ['var(--ds-font-family-ui)'],
  },
  fontSize: {
    'design-xs': ['var(--ds-font-size-xs)', 'var(--ds-font-line-body)'],
    'design-sm': ['var(--ds-font-size-sm)', 'var(--ds-font-line-body)'],
    'design-base': ['var(--ds-font-size-base)', 'var(--ds-font-line-body)'],
    'design-lg': ['var(--ds-font-size-lg)', 'var(--ds-font-line-body)'],
    'design-xl': ['var(--ds-font-size-xl)', 'var(--ds-font-line-tight)'],
    'design-2xl': ['var(--ds-font-size-2xl)', 'var(--ds-font-line-tight)'],
    'design-3xl': ['var(--ds-font-size-3xl)', 'var(--ds-font-line-tight)'],
  },
  spacing: cssVariableMap(designTokens.primitives.space, '--ds-space-'),
  textColor: {
    'design-primary': 'var(--ds-color-text-primary)',
    'design-secondary': 'var(--ds-color-text-secondary)',
    'design-tertiary': 'var(--ds-color-text-tertiary)',
    'design-accent': 'var(--ds-color-accent)',
    'design-positive': 'var(--ds-color-positive)',
    'design-caution': 'var(--ds-color-caution)',
    'design-destructive': 'var(--ds-color-destructive)',
    'design-information': 'var(--ds-color-information)',
  },
  transitionDuration: {
    fast: 'var(--ds-motion-duration-fast)',
    standard: 'var(--ds-motion-duration-standard)',
    slow: 'var(--ds-motion-duration-slow)',
  },
  transitionTimingFunction: {
    standard: 'var(--ds-motion-easing-standard)',
    emphasized: 'var(--ds-motion-easing-emphasized)',
  },
});

module.exports = { buildDesignTokenExtension };
