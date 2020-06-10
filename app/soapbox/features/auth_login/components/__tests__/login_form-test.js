import React from 'react';
import LoginForm from '../login_form';
import { createComponent } from 'soapbox/test_helpers';

describe('<LoginForm />', () => {
  it('renders correctly', () => {
    expect(createComponent(
      <LoginForm />
    ).toJSON()).toMatchSnapshot();
  });
});
