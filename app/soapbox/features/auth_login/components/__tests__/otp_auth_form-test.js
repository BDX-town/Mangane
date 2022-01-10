import { Map as ImmutableMap } from 'immutable';
import React from 'react';

import { createComponent, mockStore } from 'soapbox/test_helpers';

import OtpAuthForm from '../otp_auth_form';

describe('<OtpAuthForm />', () => {
  it('renders correctly', () => {

    const store = mockStore(ImmutableMap({ mfa_auth_needed: true }));

    const wrapper = createComponent(
      <OtpAuthForm
        mfa_token={'12345'}
      />,
      { store },
    ).toJSON();

    expect(wrapper).toEqual(expect.objectContaining({
      type: 'form',
    }));

    expect(wrapper.children[0].children[0].children[0].children[0]).toEqual(expect.objectContaining({
      type: 'h1',
      props: { className: 'otp-login' },
      children: [ 'OTP Login' ],
    }));

  });
});
