import React from 'react';
import LoginPage from '../login_page';
import { createComponent, mockStore } from 'soapbox/test_helpers';
import { Map as ImmutableMap } from 'immutable';

describe('<LoginPage />', () => {
  it('renders correctly', () => {
    expect(createComponent(
      <LoginPage />
    ).toJSON()).toMatchSnapshot();

    const store = mockStore(ImmutableMap({ me: '1234' }));
    expect(createComponent(
      <LoginPage />,
      { store },
    ).toJSON()).toMatchSnapshot();
  });
});
