import React from 'react';

import { createComponent } from 'soapbox/test_helpers';

import Column from '../column';

describe('<Column />', () => {
  it('renders correctly with minimal props', () => {
    const component = createComponent(<Column />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
