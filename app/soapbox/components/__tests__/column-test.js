import React from 'react';
import renderer from 'react-test-renderer';

import Column from '../column';

describe('<Column />', () => {
  it('renders correctly with minimal props', () => {
    const component = renderer.create(<Column />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
