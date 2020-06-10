import React from 'react';
import CaptchaField, { NativeCaptchaField } from '../captcha';
import renderer from 'react-test-renderer';
import { createComponentWithStore } from 'soapbox/test_helpers';
import { Map as ImmutableMap } from 'immutable';

describe('<CaptchaField />', () => {
  it('renders null by default', () => {
    expect(createComponentWithStore(
      <CaptchaField />
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
      />
    ).toJSON()).toMatchSnapshot();
  });
});
