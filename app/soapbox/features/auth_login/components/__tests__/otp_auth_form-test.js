import { Map as ImmutableMap } from 'immutable';
import React from 'react';

import { createShallowComponent, mockStore } from 'soapbox/test_helpers';

import OtpAuthForm from '../otp_auth_form';

describe('<OtpAuthForm />', () => {
  it('renders correctly', () => {
    const store = mockStore(ImmutableMap({ mfa_auth_needed: true }));
    const component = createShallowComponent(
      <OtpAuthForm mfa_token={'12345'} />,
      { store },
    );

    expect(component.text()).toContain('OTP Login');
    expect(component.exists('form')).toBe(true);
  });
});
