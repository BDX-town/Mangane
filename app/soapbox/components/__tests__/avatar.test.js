import React from 'react';

import { normalizeAccount } from 'soapbox/normalizers';

import { render, screen } from '../../jest/test-helpers';
import Avatar from '../avatar';

describe('<Avatar />', () => {
  const account = normalizeAccount({
    username: 'alice',
    acct: 'alice',
    display_name: 'Alice',
    avatar: '/animated/alice.gif',
    avatar_static: '/static/alice.jpg',
  });

  const size = 100;

  // describe('Autoplay', () => {
  //   it('renders an animated avatar', () => {
  //     render(<Avatar account={account} animate size={size} />);

  //     expect(screen.getByRole('img').getAttribute('src')).toBe(account.get('avatar'));
  //   });
  // });

  describe('Still', () => {
    it('renders a still avatar', () => {
      render(<Avatar account={account} size={size} />);

      expect(screen.getByRole('img').getAttribute('src')).toBe(account.get('avatar'));
    });
  });

  // TODO add autoplay test if possible
});
