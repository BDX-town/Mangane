import React from 'react';
import { act } from 'react-dom/test-utils';
import { Route, Switch } from 'react-router-dom';

import { __stub } from 'soapbox/api';
import rootReducer from 'soapbox/reducers';
import { createShallowComponent, mockStore } from 'soapbox/test_helpers';

import PasswordResetConfirm from '../password_reset_confirm';

const TestableComponent = () => (
  <Switch>
    <Route path='/edit' exact><PasswordResetConfirm /></Route>
    <Route path='/' exact><span>Homepage</span></Route>
  </Switch>
);

describe('<PasswordResetConfirm />', () => {
  it('handles successful responses from the API', async() => {
    __stub(mock => {
      mock.onPost('/api/v1/truth/password_reset/confirm')
        .reply(200, {});
    });

    const state = rootReducer(undefined, {});
    const store = mockStore(state);
    const component = createShallowComponent(
      <TestableComponent />,
      { store },
      { initialEntries: ['/edit'] },
    );

    await component.find('form').at(0).simulate('submit', {
      preventDefault: () => {},
    });
    await act(async() => {
      await new Promise(resolve => setTimeout(resolve, 0));
      component.update();
    });

    expect(component.text()).toContain('Homepage');
    expect(component.text()).not.toContain('Expired token');
  });

  it('handles failed responses from the API', async() => {
    __stub(mock => {
      mock.onPost('/api/v1/truth/password_reset/confirm')
        .reply(403, {});
    });

    const state = rootReducer(undefined, {});
    const store = mockStore(state);
    const component = createShallowComponent(
      <TestableComponent />,
      { store },
      { initialEntries: ['/edit'] },
    );

    await component.find('form').at(0).simulate('submit', {
      preventDefault: () => {},
    });
    await act(async() => {
      await new Promise(resolve => setTimeout(resolve, 0));
      component.update();
    });

    expect(component.text()).toContain('Expired token');
    expect(component.text()).not.toContain('Homepage');
  });
});
