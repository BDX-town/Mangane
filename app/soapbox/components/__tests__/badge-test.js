import React from 'react';
import renderer from 'react-test-renderer';

import Badge from '../badge';

describe('<Badge />', () => {
  it('renders correctly', () => {
    const component = renderer.create(<Badge slug='patron' title='Patron' />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
