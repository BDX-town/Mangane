import React from 'react';

import {
  coerceSemanticIconName,
  getSemanticIcon,
  semanticIconNames,
} from './semantic-icon-registry';

import type {
  IconProps,
  IconWeight,
  SemanticIconName,
} from './semantic-icon-registry';

interface ISemanticIcon extends Omit<IconProps, 'alt' | 'aria-hidden' | 'aria-label' | 'role' | 'size' | 'weight'> {
  /** Product meaning resolved through the canonical registry. */
  name: SemanticIconName,
  /** Accessible name for a meaningful standalone icon. Unlabelled icons are decorative. */
  label?: string,
  /** Width and height in CSS pixels. Invalid runtime values fail closed to 24. */
  size?: number,
  /** Phosphor optical weight. */
  weight?: IconWeight,
}

const normalizeSize = (size: number): number => (
  Number.isFinite(size) && size >= 8 && size <= 256 ? size : 24
);

const SemanticIcon = React.forwardRef((
  {
    label,
    name,
    size = 24,
    weight = 'regular',
    ...props
  }: ISemanticIcon,
  ref: React.ForwardedRef<SVGSVGElement>,
): JSX.Element => {
  const Icon = getSemanticIcon(name);
  const accessibleLabel = typeof label === 'string' ? label.trim() : '';
  const accessible = accessibleLabel.length > 0;

  return (
    <Icon
      {...props}
      ref={ref}
      size={normalizeSize(size)}
      weight={weight}
      role={accessible ? 'img' : undefined}
      aria-label={accessible ? accessibleLabel : undefined}
      aria-hidden={accessible ? undefined : true}
      focusable='false'
    />
  );
});

SemanticIcon.displayName = 'SemanticIcon';

export {
  coerceSemanticIconName,
  semanticIconNames,
};

export type {
  ISemanticIcon,
  SemanticIconName,
};

export default SemanticIcon;
