import { Map as ImmutableMap } from 'immutable';
import React from 'react';

import { render, screen } from '../../../../jest/test-helpers';
import CaptchaField, { NativeCaptchaField } from '../captcha';

describe('<CaptchaField />', () => {
  it('renders null by default', () => {
    render(<CaptchaField idempotencyKey='' value='' />);

    expect(screen.queryAllByRole('textbox')).toHaveLength(0);
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

    render(
      <NativeCaptchaField
        captcha={captcha}
        onChange={() => {}}
        onClick={() => {}}
        value=''
      />,
    );

    expect(screen.queryAllByRole('textbox')).toHaveLength(1);
  });
});
