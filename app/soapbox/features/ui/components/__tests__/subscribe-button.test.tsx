// import { Map as ImmutableMap } from 'immutable';
import React from 'react';

import { render, screen } from '../../../../jest/test-helpers';
import { normalizeAccount, normalizeRelationship } from '../../../../normalizers';
import SubscribeButton from '../subscription-button';

import type { ReducerAccount } from 'soapbox/reducers/accounts';

const justin = {
  id: '1',
  acct: 'justin-username',
  display_name: 'Justin L',
  avatar: 'test.jpg',
};

describe('<SubscribeButton />', () => {
  let store: any;

  describe('with "accountNotifies" disabled', () => {
    it('renders nothing', () => {
      const account = normalizeAccount({ ...justin, relationship: normalizeRelationship({ following: true }) }) as ReducerAccount;

      render(<SubscribeButton account={account} />, undefined, store);
      expect(screen.queryAllByTestId('icon-button')).toHaveLength(0);
    });
  });

  // describe('with "accountNotifies" enabled', () => {
  //   beforeEach(() => {
  //     store = {
  //       ...store,
  //       instance: normalizeInstance({
  //         version: '3.4.1 (compatible; TruthSocial 1.0.0)',
  //         software: 'TRUTHSOCIAL',
  //         pleroma: ImmutableMap({}),
  //       }),
  //     };
  //   });

  //   describe('when the relationship is requested', () => {
  //     beforeEach(() => {
  //       account = normalizeAccount({ ...account, relationship: normalizeRelationship({ requested: true }) });

  //       store = {
  //         ...store,
  //         accounts: ImmutableMap({
  //           '1': account,
  //         }),
  //       };
  //     });

  //     it('renders the button', () => {
  //       render(<SubscribeButton account={account} />, null, store);
  //       expect(screen.getByTestId('icon-button')).toBeInTheDocument();
  //     });

  //     describe('when the user "isSubscribed"', () => {
  //       beforeEach(() => {
  //         account = normalizeAccount({
  //           ...account,
  //           relationship: normalizeRelationship({ requested: true, notifying: true }),
  //         });

  //         store = {
  //           ...store,
  //           accounts: ImmutableMap({
  //             '1': account,
  //           }),
  //         };
  //       });

  //       it('renders the unsubscribe button', () => {
  //         render(<SubscribeButton account={account} />, null, store);
  //         expect(screen.getByTestId('icon-button').title).toEqual(`Unsubscribe to notifications from @${account.acct}`);
  //       });
  //     });

  //     describe('when the user is not "isSubscribed"', () => {
  //       beforeEach(() => {
  //         account = normalizeAccount({
  //           ...account,
  //           relationship: normalizeRelationship({ requested: true, notifying: false }),
  //         });

  //         store = {
  //           ...store,
  //           accounts: ImmutableMap({
  //             '1': account,
  //           }),
  //         };
  //       });

  //       it('renders the unsubscribe button', () => {
  //         render(<SubscribeButton account={account} />, null, store);
  //         expect(screen.getByTestId('icon-button').title).toEqual(`Subscribe to notifications from @${account.acct}`);
  //       });
  //     });
  //   });

  //   describe('when the user is not following the account', () => {
  //     beforeEach(() => {
  //       account = normalizeAccount({ ...account, relationship: normalizeRelationship({ following: false }) });

  //       store = {
  //         ...store,
  //         accounts: ImmutableMap({
  //           '1': account,
  //         }),
  //       };
  //     });

  //     it('renders nothing', () => {
  //       render(<SubscribeButton account={account} />, null, store);
  //       expect(screen.queryAllByTestId('icon-button')).toHaveLength(0);
  //     });
  //   });

  //   describe('when the user is following the account', () => {
  //     beforeEach(() => {
  //       account = normalizeAccount({ ...account, relationship: normalizeRelationship({ following: true }) });

  //       store = {
  //         ...store,
  //         accounts: ImmutableMap({
  //           '1': account,
  //         }),
  //       };
  //     });

  //     it('renders the button', () => {
  //       render(<SubscribeButton account={account} />, null, store);
  //       expect(screen.getByTestId('icon-button')).toBeInTheDocument();
  //     });

  //     describe('when the user "isSubscribed"', () => {
  //       beforeEach(() => {
  //         account = normalizeAccount({
  //           ...account,
  //           relationship: normalizeRelationship({ requested: true, notifying: true }),
  //         });

  //         store = {
  //           ...store,
  //           accounts: ImmutableMap({
  //             '1': account,
  //           }),
  //         };
  //       });

  //       it('renders the unsubscribe button', () => {
  //         render(<SubscribeButton account={account} />, null, store);
  //         expect(screen.getByTestId('icon-button').title).toEqual(`Unsubscribe to notifications from @${account.acct}`);
  //       });
  //     });

  //     describe('when the user is not "isSubscribed"', () => {
  //       beforeEach(() => {
  //         account = normalizeAccount({
  //           ...account,
  //           relationship: normalizeRelationship({ requested: true, notifying: false }),
  //         });

  //         store = {
  //           ...store,
  //           accounts: ImmutableMap({
  //             '1': account,
  //           }),
  //         };
  //       });

  //       it('renders the unsubscribe button', () => {
  //         render(<SubscribeButton account={account} />, null, store);
  //         expect(screen.getByTestId('icon-button').title).toEqual(`Subscribe to notifications from @${account.acct}`);
  //       });
  //     });
  //   });
  // });

});
