'use strict';

const React = require('react');

const MockIcon = React.forwardRef(({
  alt,
  children,
  color = 'currentColor',
  mirrored = false,
  size = '1em',
  weight = 'regular',
  ...props
}, ref) => React.createElement('svg', {
  ...props,
  ref,
  width: size,
  height: size,
  fill: color,
  transform: mirrored ? 'scale(-1, 1)' : undefined,
  'data-icon-weight': weight,
}, alt ? React.createElement('title', null, alt) : children));

MockIcon.displayName = 'MockPhosphorIcon';

module.exports = new Proxy({ IconContext: React.createContext({}) }, {
  get(target, property) {
    if (property in target) return target[property];
    if (typeof property === 'string' && property.endsWith('Icon')) return MockIcon;
    return undefined;
  },
});
