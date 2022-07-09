import { Map as ImmutableMap, OrderedSet as ImmutableOrderedSet } from 'immutable';
import React from 'react';

import { render, screen } from '../../../../jest/test-helpers';
import { normalizeAccount } from '../../../../normalizers';
import WhoToFollowPanel from '../who-to-follow-panel';

describe('<WhoToFollow />', () => {
  it('renders suggested accounts', () => {
    const store = {
      accounts: ImmutableMap({
        '1': normalizeAccount({
          id: '1',
          acct: 'username',
          display_name: 'My name',
          avatar: 'test.jpg',
        }),
      }),
      suggestions: {
        items: ImmutableOrderedSet([{
          source: 'staff',
          account: '1',
        }]),
      },
    };

    render(<WhoToFollowPanel limit={1} />, undefined, store);
    expect(screen.getByTestId('account')).toHaveTextContent(/my name/i);
  });

  it('renders multiple accounts', () => {
    const store = {
      accounts: ImmutableMap({
        '1': normalizeAccount({
          id: '1',
          acct: 'username',
          display_name: 'My name',
          avatar: 'test.jpg',
        }),
        '2': normalizeAccount({
          id: '1',
          acct: 'username2',
          display_name: 'My other name',
          avatar: 'test.jpg',
        }),
      }),
      suggestions: {
        items: ImmutableOrderedSet([
          {
            source: 'staff',
            account: '1',
          },
          {
            source: 'staff',
            account: '2',
          },
        ]),
      },
    };

    render(<WhoToFollowPanel limit={3} />, undefined, store);
    expect(screen.queryAllByTestId('account')).toHaveLength(2);
  });

  it('respects the limit prop', () => {
    const store = {
      accounts: ImmutableMap({
        '1': normalizeAccount({
          id: '1',
          acct: 'username',
          display_name: 'My name',
          avatar: 'test.jpg',
        }),
        '2': normalizeAccount({
          id: '1',
          acct: 'username2',
          display_name: 'My other name',
          avatar: 'test.jpg',
        }),
      }),
      suggestions: {
        items: ImmutableOrderedSet([
          {
            source: 'staff',
            account: '1',
          },
          {
            source: 'staff',
            account: '2',
          },
        ]),
      },
    };

    render(<WhoToFollowPanel limit={1} />, undefined, store);
    expect(screen.queryAllByTestId('account')).toHaveLength(1);
  });

  it('renders empty', () => {
    const store = {
      accounts: ImmutableMap({
        '1': normalizeAccount({
          id: '1',
          acct: 'username',
          display_name: 'My name',
          avatar: 'test.jpg',
        }),
        '2': normalizeAccount({
          id: '1',
          acct: 'username2',
          display_name: 'My other name',
          avatar: 'test.jpg',
        }),
      }),
      suggestions: {
        items: ImmutableOrderedSet([]),
      },
    };

    render(<WhoToFollowPanel limit={1} />, undefined, store);
    expect(screen.queryAllByTestId('account')).toHaveLength(0);
  });
});
