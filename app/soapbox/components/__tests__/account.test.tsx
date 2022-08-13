import { Map as ImmutableMap } from 'immutable';
import React from 'react';

import { render, screen } from '../../jest/test-helpers';
import { normalizeAccount } from '../../normalizers';
import Account from '../account';

import type { ReducerAccount } from 'soapbox/reducers/accounts';

describe('<Account />', () => {
  it('renders account name and username', () => {
    const account = normalizeAccount({
      id: '1',
      acct: 'justin-username',
      display_name: 'Justin L',
      avatar: 'test.jpg',
    }) as ReducerAccount;

    const store = {
      accounts: ImmutableMap({
        '1': account,
      }),
    };

    render(<Account account={account} />, undefined, store);
    expect(screen.getByTestId('account')).toHaveTextContent('Justin L');
    expect(screen.getByTestId('account')).toHaveTextContent(/justin-username/i);
  });

  describe('verification badge', () => {
    it('renders verification badge', () => {
      const account = normalizeAccount({
        id: '1',
        acct: 'justin-username',
        display_name: 'Justin L',
        avatar: 'test.jpg',
        verified: true,
      }) as ReducerAccount;

      const store = {
        accounts: ImmutableMap({
          '1': account,
        }),
      };

      render(<Account account={account} />, undefined, store);
      expect(screen.getByTestId('verified-badge')).toBeInTheDocument();
    });

    it('does not render verification badge', () => {
      const account = normalizeAccount({
        id: '1',
        acct: 'justin-username',
        display_name: 'Justin L',
        avatar: 'test.jpg',
        verified: false,
      }) as ReducerAccount;

      const store = {
        accounts: ImmutableMap({
          '1': account,
        }),
      };

      render(<Account account={account} />, undefined, store);
      expect(screen.queryAllByTestId('verified-badge')).toHaveLength(0);
    });
  });
});
