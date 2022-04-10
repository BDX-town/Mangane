import * as React from 'react';

import { render, screen } from '../../../../jest/test-helpers';
import SvgIcon from '../svg-icon';

describe('<SvgIcon />', () => {
  it('renders loading element with default size', () => {
    render(<SvgIcon className='text-primary-500' src={require('@tabler/icons/icons/code.svg')} />);

    const svg = screen.getByTestId('svg-icon-loader');
    expect(svg.getAttribute('width')).toBe('24');
    expect(svg.getAttribute('height')).toBe('24');
    expect(svg.getAttribute('class')).toBe('text-primary-500');
  });
});
