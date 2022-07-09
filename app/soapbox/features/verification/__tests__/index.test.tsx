import { Map as ImmutableMap, Record as ImmutableRecord } from 'immutable';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { __stub } from 'soapbox/api';

import { render, screen } from '../../../jest/test-helpers';
import Verification from '../index';

const TestableComponent = () => (
  <Switch>
    <Route path='/verify' exact><Verification /></Route>
    <Route path='/' exact><span data-testid='home'>Homepage</span></Route>
  </Switch>
);

const renderComponent = (store: any) => render(
  <TestableComponent />,
  {},
  store,
  { initialEntries: ['/verify'] },
);

describe('<Verification />', () => {
  let store: any;

  beforeEach(() => {
    store = {
      verification: ImmutableRecord({
        instance: ImmutableMap({
          isReady: true,
          registrations: true,
        }),
        ageMinimum: null,
        currentChallenge: null,
        isLoading: false,
        isComplete: false,
        token: null,
      })(),
    };

    __stub(mock => {
      mock.onGet('/api/v1/pepe/instance')
        .reply(200, {
          age_minimum: 18,
          approval_required: true,
          challenges: ['age', 'email', 'sms'],
        });

      mock.onPost('/api/v1/pepe/registrations')
        .reply(200, {
          access_token: 'N-dZmNqNSmTutJLsGjZ5AnJL4sLw_y-N3pn2acSqJY8',
        });
    });
  });

  describe('When registration is closed', () => {
    it('successfully redirects to the homepage', () => {
      const verification = store.verification.setIn(['instance', 'registrations'], false);
      store.verification = verification;

      renderComponent(store);
      expect(screen.getByTestId('home')).toHaveTextContent('Homepage');
    });
  });

  describe('When verification is complete', () => {
    it('successfully renders the Registration component', () => {
      const verification = store.verification.set('isComplete', true);
      store.verification = verification;

      renderComponent(store);
      expect(screen.getByRole('heading')).toHaveTextContent('Register your account');
    });
  });

  describe('Switching verification steps', () => {
    it('successfully renders the Birthday step', () => {
      const verification = store.verification.set('currentChallenge', 'age');
      store.verification = verification;

      renderComponent(store);

      expect(screen.getByRole('heading')).toHaveTextContent('Enter your birth date');
    });

    it('successfully renders the Email step', () => {
      const verification = store.verification.set('currentChallenge', 'email');
      store.verification = verification;

      renderComponent(store);

      expect(screen.getByRole('heading')).toHaveTextContent('Enter your email address');
    });

    it('successfully renders the SMS step', () => {
      const verification = store.verification.set('currentChallenge', 'sms');
      store.verification = verification;

      renderComponent(store);

      expect(screen.getByRole('heading')).toHaveTextContent('Enter your phone number');
    });
  });
});
