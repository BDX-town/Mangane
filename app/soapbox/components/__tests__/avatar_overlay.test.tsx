import React from 'react';

import { normalizeAccount } from 'soapbox/normalizers';

import { render, screen } from '../../jest/test-helpers';
import AvatarOverlay from '../avatar_overlay';

import type { ReducerAccount } from 'soapbox/reducers/accounts';

describe('<AvatarOverlay', () => {
  const account = normalizeAccount({
    username: 'alice',
    acct: 'alice',
    display_name: 'Alice',
    avatar: '/animated/alice.gif',
    avatar_static: '/static/alice.jpg',
  }) as ReducerAccount;

  const friend = normalizeAccount({
    username: 'eve',
    acct: 'eve@blackhat.lair',
    display_name: 'Evelyn',
    avatar: '/animated/eve.gif',
    avatar_static: '/static/eve.jpg',
  }) as ReducerAccount;

  it('renders a overlay avatar', () => {
    render(<AvatarOverlay account={account} friend={friend} />);
    expect(screen.queryAllByRole('img')).toHaveLength(2);
  });
});
