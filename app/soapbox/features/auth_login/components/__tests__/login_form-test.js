import React from 'react';
import LoginForm from '../login_form';
import { createComponent, mockStore } from 'soapbox/test_helpers';
import rootReducer from 'soapbox/reducers';

describe('<LoginForm />', () => {

  it('renders for Pleroma', () => {
    const state = rootReducer(undefined, {})
      .update('instance', instance => instance.set('version', '2.7.2 (compatible; Pleroma 2.3.0)'));
    const store = mockStore(state);

    expect(createComponent(
      <LoginForm />,
      { store },
    ).toJSON()).toMatchSnapshot();
  });

  it('renders for Mastodon', () => {
    const state = rootReducer(undefined, {})
      .update('instance', instance => instance.set('version', '3.0.0'));
    const store = mockStore(state);

    expect(createComponent(
      <LoginForm />,
      { store },
    ).toJSON()).toMatchSnapshot();
  });
});
