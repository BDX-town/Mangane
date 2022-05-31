import { Map as ImmutableMap } from 'immutable';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { render, screen, waitFor } from '../../../jest/test-helpers';
import { normalizeAccount } from '../../../normalizers';
import UI from '../index';

const TestableComponent = () => (
  <Switch>
    <Route path='/@:username/posts/:statusId' exact><UI /></Route>
    <Route path='/@:username/media' exact><UI /></Route>
    <Route path='/@:username' exact><UI /></Route>
    <Route path='/login' exact><span data-testid='sign-in'>Sign in</span></Route>
  </Switch>
);

describe('<UI />', () => {
  let store;

  beforeEach(() => {
    store = {
      me: false,
      accounts: ImmutableMap({
        '1': normalizeAccount({
          id: '1',
          acct: 'username',
          display_name: 'My name',
          avatar: 'test.jpg',
        }),
      }),
    };
  });

  describe('when logged out', () => {
    describe('with guest experience disabled', () => {
      beforeEach(() => {
        store = { ...store, soapbox: ImmutableMap({ guestExperience: false }) };
      });

      describe('when viewing a Profile Page', () => {
        it('should render the Profile page', async() => {
          render(
            <TestableComponent />,
            {},
            store,
            { initialEntries: ['/@username'] },
          );

          await waitFor(() => {
            expect(screen.getByTestId('cta-banner')).toHaveTextContent('Sign up now to discuss');
          });
        });
      });

      describe('when viewing a Status Page', () => {
        it('should render the Status page', async() => {
          render(
            <TestableComponent />,
            {},
            store,
            { initialEntries: ['/@username/posts/12'] },
          );

          await waitFor(() => {
            expect(screen.getByTestId('cta-banner')).toHaveTextContent('Sign up now to discuss');
          });
        });
      });

      describe('when viewing any other page', () => {
        it('should redirect to the login page', async() => {
          render(
            <TestableComponent />,
            {},
            store,
            { initialEntries: ['/@username/media'] },
          );

          await waitFor(() => {
            expect(screen.getByTestId('sign-in')).toHaveTextContent('Sign in');
          });
        });
      });
    });
  });
});
