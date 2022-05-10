import { Map as ImmutableMap } from 'immutable';
import React from 'react';

import { render, screen } from '../../../../jest/test-helpers';
import CtaBanner from '../cta-banner';

describe('<CtaBanner />', () => {
  it('renders the banner', () => {
    render(<CtaBanner />);
    expect(screen.getByTestId('cta-banner')).toHaveTextContent(/sign up/i);
  });

  describe('with a logged in user', () => {
    it('renders empty', () => {
      const store = { me: true };

      render(<CtaBanner />, null, store);
      expect(screen.queryAllByTestId('cta-banner')).toHaveLength(0);
    });
  });

  describe('with singleUserMode enabled', () => {
    it('renders empty', () => {
      const store = { soapbox: ImmutableMap({ singleUserMode: true }) };

      render(<CtaBanner />, null, store);
      expect(screen.queryAllByTestId('cta-banner')).toHaveLength(0);
    });
  });
});
