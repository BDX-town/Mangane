import React from 'react';

import { render, screen } from '../../../../jest/test-helpers';
import Divider from '../divider';

describe('<Divider />', () => {
  it('renders without text', () => {
    render(<Divider />);

    expect(screen.queryAllByTestId('divider-text')).toHaveLength(0);
  });

  it('renders text', () => {
    const text = 'Hello';
    render(<Divider text={text} />);

    expect(screen.getByTestId('divider-text')).toHaveTextContent(text);
  });
});
