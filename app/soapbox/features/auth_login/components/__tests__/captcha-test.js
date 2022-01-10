import { Map as ImmutableMap } from 'immutable';
import React from 'react';
import renderer from 'react-test-renderer';

import { createComponent } from 'soapbox/test_helpers';

import CaptchaField, { NativeCaptchaField } from '../captcha';

describe('<CaptchaField />', () => {
  it('renders null by default', () => {
    expect(createComponent(
      <CaptchaField />,
    ).toJSON()).toMatchSnapshot();
  });
});

describe('<NativeCaptchaField />', () => {
  it('renders correctly', () => {
    const captcha = ImmutableMap({
      answer_data: 'QTEyOEdDTQ...',
      token: 'CcDExJcv6qqOVw',
      type: 'native',
      url: 'data:image/png;base64,...',
    });

    expect(renderer.create(
      <NativeCaptchaField
        captcha={captcha}
        onChange={() => {}} // eslint-disable-line react/jsx-no-bind
      />,
    ).toJSON()).toMatchSnapshot();
  });
});
