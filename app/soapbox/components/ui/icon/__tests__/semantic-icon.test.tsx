import React from 'react';

import { render, screen } from '../../../../jest/test-helpers';
import SemanticIcon, {
  coerceSemanticIconName,
  semanticIconNames,
} from '../semantic-icon';

describe('<SemanticIcon />', () => {
  it('exposes the canonical product semantics without duplicates', () => {
    expect(new Set(semanticIconNames).size).toBe(semanticIconNames.length);
    expect(semanticIconNames).toEqual(expect.arrayContaining([
      'home',
      'explore',
      'compose',
      'notifications',
      'profile',
      'search',
      'reply',
      'repost',
      'like',
      'bookmark',
      'share',
    ]));
  });

  it('renders decorative icons hidden from assistive technology', () => {
    render(<SemanticIcon name='home' data-testid='semantic-icon' />);

    const icon = screen.getByTestId('semantic-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveAttribute('width', '24');
    expect(icon).toHaveAttribute('height', '24');
    expect(icon).not.toHaveAttribute('role');
  });

  it('requires an explicit label for a meaningful standalone icon', () => {
    render(<SemanticIcon name='notifications' label='  Notifications  ' data-testid='semantic-icon' />);

    expect(screen.getByRole('img', { name: 'Notifications' })).toBe(screen.getByTestId('semantic-icon'));
    expect(screen.getByTestId('semantic-icon')).not.toHaveAttribute('aria-hidden');
  });

  it('normalizes unsafe runtime sizes without producing invalid geometry', () => {
    render(<SemanticIcon name='home' size={Number.POSITIVE_INFINITY} data-testid='semantic-icon' />);

    expect(screen.getByTestId('semantic-icon')).toHaveAttribute('width', '24');
    expect(screen.getByTestId('semantic-icon')).toHaveAttribute('height', '24');
  });

  it('fails closed to an allowlisted fallback for dynamic configuration', () => {
    expect(coerceSemanticIconName('search')).toBe('search');
    expect(coerceSemanticIconName('not-a-real-icon', 'question')).toBe('question');
    expect(coerceSemanticIconName('__proto__', 'question')).toBe('question');
    expect(coerceSemanticIconName({ name: 'search' }, 'question')).toBe('question');
    expect(coerceSemanticIconName('not-a-real-icon', '__proto__' as never)).toBe('question');
  });
});
