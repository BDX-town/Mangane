import React from 'react';

import { createComponent } from 'soapbox/test_helpers';

import ColumnBackButton from '../column_back_button';

describe('<ColumnBackButton />', () => {
  it('renders correctly', () => {
    const component = createComponent(<ColumnBackButton />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
